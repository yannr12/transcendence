import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { request } from 'undici';
import { join } from 'path';
import fetch from 'node-fetch';
import * as bcrypt from 'bcrypt';
// import bcrypt from 'bcrypt';
import db from './db';
import jwt from 'jsonwebtoken';
import fastifyCors from '@fastify/cors';
import speakeasy from 'speakeasy';
import { generateVerificationCode, sendVerificationEmail } from './email_sender';


const server_authentification: FastifyInstance = Fastify({ logger: true });

server_authentification.register(fastifyCors, {
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

server_authentification.post('/register', async (request: FastifyRequest, reply: FastifyReply) =>
{
  try
  {
    server_authentification.log.info('Register attempt:', request.body);
    let { username, email, password } = request.body as { username: string; email: string; password: string };

    username = typeof username === 'string' ? username.trim() : '';
    email = typeof email === 'string' ? email.trim() : '';
    password = typeof password === 'string' ? password.trim() : '';

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!username || !email || !password)
      return reply.status(400).send({ error: 'Username, email, and password are required.' });

    if (!usernameRegex.test(username))
      return reply.status(400).send({ error: 'Username must be 3-20 characters, letters/numbers/underscores only.' });
    if (!emailRegex.test(email))
      return reply.status(400).send({ error: 'Invalid email address.' });
    if (!passwordRegex.test(password))
      return reply.status(400).send({ error: 'Password must contain uppercase, lowercase and numbers.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);

    const user = db.prepare('SELECT id, username FROM users WHERE username = ?').get(username) as { id: number; username: string } | undefined;

    if (!user)
      return reply.status(500).send({ error: 'User creation failed.' });

    if (!process.env.JWT_SECRET)
      throw new Error('JWT_SECRET is not set!');
    const secret = process.env.JWT_SECRET;
    const payload = { userId: user.id, username: user.username };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    return reply.status(201).send({
      message: 'User registered successfully.',
      userId: user.id,
      username: user.username,
      token
    });
  }
  catch (err: any)
  {
    server_authentification.log.error('Register error:', err);
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE')
      return reply.status(409).send({ error: 'Username or email already exists.' });
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

server_authentification.post('/login', async (request: FastifyRequest, reply: FastifyReply) =>
{
  try
  {
    server_authentification.log.info('Login attempt:', request.body);
    let { identifier, password } = request.body as { identifier: string; password: string };

    identifier = typeof identifier === 'string' ? identifier.trim() : '';
    password = typeof password === 'string' ? password.trim() : '';

    if (!identifier || !password)
      return reply.status(400).send({ error: 'Username/email and password are required.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    type UserRow = { id: number; username: string; email: string; password: string };
    let user: UserRow | undefined;
    if (emailRegex.test(identifier))
    {
      user = db.prepare('SELECT id, username, email, password, two_fa_enabled FROM users WHERE email = ?').get(identifier);
    }
    else
    {
      user = db.prepare('SELECT id, username, email, password, two_fa_enabled FROM users WHERE username = ?').get(identifier);
    }

    if (!user)
      return reply.status(401).send({ error: 'Invalid username/email or password.' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return reply.status(401).send({ error: 'Invalid username/email or password.' });

    if (user.two_fa_enabled) {
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10mn

      const stmt = db.prepare(`
        UPDATE users 
        SET email_2fa_code = ?, email_2fa_code_expires = ?, email_2fa_attempts = 0 
        WHERE id = ?
      `);
      stmt.run(code, expiresAt.toISOString(), user.id);

      try {
        const emailSent = await sendVerificationEmail(user.email, code);
        server_authentification.log.info('Email sent status:', emailSent);
        if (!emailSent)
          return reply.status(500).send({ error: 'Failed to send verification email.' });
      } catch (emailErr) {
        server_authentification.log.error('Email sending error:', emailErr);
        return reply.status(500).send({ error: 'Failed to send verification email.' });
      }

      const partialPayload = { userId: user.id, username: user.username, requires2FA: true };
      if (!process.env.JWT_SECRET)
        throw new Error('JWT_SECRET is not set!');
      const secret = process.env.JWT_SECRET;
      const partialToken = jwt.sign(partialPayload, secret, { expiresIn: '15m' });
      
      return reply.status(200).send({
        message: 'Verification code sent to your email.',
        partialToken,
        requires2FA: true,
        userId: user.id,
        username: user.username
      });
    }

    const payload = { userId: user.id, username: user.username };
    if (!process.env.JWT_SECRET)
      throw new Error('JWT_SECRET is not set!');
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    console.log(user);

    return reply.status(200).send({
      message: 'Login successful.',
      token,
      userId: user.id,
      username: user.username,
      email: user.email
    });
  }
  catch (err: any)
  {
    server_authentification.log.error('Login error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

server_authentification.post('/update', async (request: FastifyRequest, reply: FastifyReply) =>
{
  let { username, newusername, email, password} = request.body as {
    username: string;
    newusername: string;
    email: string;
    password: string;
  };

  // Sanitize and validate inputs
  username = typeof username === 'string' ? username.trim() : '';
  newusername = typeof newusername === 'string' ? newusername.trim() : '';
  email = typeof email === 'string' ? email.trim() : '';
  password = typeof password === 'string' ? password.trim() : '';

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  // Username restrictions
  if (newusername && !usernameRegex.test(newusername)) {
    return reply.send({ succes: false, message: 'Username must be 3-20 characters, letters/numbers/underscores only.' });
  }
  // Email restrictions
  if (email && !emailRegex.test(email)) {
    return reply.send({ succes: false, message: 'Invalid email address.' });
  }
  // Password restrictions
  if (password && !passwordRegex.test(password)) {
    return reply.send({ succes: false, message: 'Password must contain uppercase, lowercase and numbers.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return reply.send({ succes: false, message: 'Utilisateur non trouvé, mise à jour impossible.' });
  }
  if (email) {
    const emailExists = db.prepare('SELECT * FROM users WHERE email = ? AND username != ?').get(email, username);
    if (emailExists) {
        return reply.send({ succes: false, message: 'Cet email est déjà utilisé par un autre utilisateur.' }); }
    const updateStmt = db.prepare('UPDATE users SET email = ? WHERE username = ?');
    updateStmt.run(email, username);
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const passExists = db.prepare('SELECT * FROM users WHERE password = ? AND username != ?').get(hashedPassword, username);
    if (passExists) {
        return reply.send({ succes: false, message: 'Cet mot de passe est déjà utilisé par un autre utilisateur.' });
    }
    const updatePasswordStmt = db.prepare('UPDATE users SET password = ? WHERE username = ?');
    updatePasswordStmt.run(hashedPassword, username);
  }
  if (username && newusername && username !== newusername) {
    const usernameExists = db.prepare('SELECT * FROM users WHERE username = ?').get(newusername);
    if (usernameExists) {
        return reply.send({ succes: false, message: 'This username is already used by another user.' }); }
    const updateusername = db.prepare('UPDATE users SET username = ? WHERE username = ?');
    updateusername.run(newusername, username);
  }
  return reply.send({ succes: true, message: ''})
})

server_authentification.post('/verify-login-2fa', async (request, reply) => {
  try {
    const { partialToken, code } = request.body as { partialToken: string; code: string };
    
    if (!partialToken || !code)
      return reply.status(400).send({ error: 'Partial token and verification code are required.' });
    
    let decoded;
    try {
      if (!process.env.JWT_SECRET)
        throw new Error('JWT_SECRET is not set!');
      decoded = jwt.verify(partialToken, process.env.JWT_SECRET) as any;
    }
    catch (err){
      return reply.status(401).send({ error: 'Invalid or expired verification session.' });}
    
    if (!decoded.requires2FA)
      return reply.status(400).send({ error: 'This token does not require 2FA verification.' });
    
    const dbUser = db.prepare(`
      SELECT id, username, email_2fa_code, email_2fa_code_expires 
      FROM users 
      WHERE id = ?
    `).get(decoded.userId);
    
    if (!dbUser)
      return reply.status(404).send({ error: 'User not found.' });
    
    if (!dbUser.email_2fa_code || !dbUser.email_2fa_code_expires)
      return reply.status(400).send({ error: 'No verification code found. Please login again.' });
    
    if (new Date() > new Date(dbUser.email_2fa_code_expires))
      return reply.status(400).send({ error: 'Verification code has expired. Please login again' });
    
    if (dbUser.email_2fa_code !== code)
      return reply.status(400).send({ error: 'Invalid verification code.' });
    
    const clearStmt = db.prepare(`
      UPDATE users 
      SET email_2fa_code = NULL, email_2fa_code_expires = NULL, email_2fa_attempts = 0 
      WHERE id = ?
    `);
    clearStmt.run(decoded.userId);
    
    const payload = { userId: decoded.userId, username: decoded.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    return reply.send({
      message: 'Login successful.',
      token,
      userId: decoded.userId,
      username: decoded.username
    });
  } catch (err) {
    server_authentification.log.error('Verify login 2FA error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

async function authenticateJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    if (!process.env.JWT_SECRET)
      throw new Error('JWT_SECRET is not set!');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    (request as any).user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

//route protegee pour le profil des users - a rajouter dans le front
server_authentification.get('/user/profile', { preHandler: authenticateJWT }, async (request, reply) => {
  const user = (request as any).user;
  const dbUser = db.prepare('SELECT id, username, email, password, two_fa_enabled FROM users WHERE id = ?').get(user.userId);
  if (!dbUser) {
    return reply.status(404).send({ error: 'User not found.' });
  }
  return reply.send({ user: dbUser });
});


server_authentification.post('/verify-email-2fa', { preHandler: authenticateJWT }, async (request, reply) => {
  try {
    const user = (request as any).user;
    const { email } = request.body as { email: string };
    
    if (!email)
      return reply.status(400).send({ error: 'Email is required.' });

    const dbUser = db.prepare('SELECT email FROM users WHERE id = ?').get(user.userId);
    if (!dbUser) {
      return reply.status(404).send({ error: 'User not found.' });
    }
    
    if (dbUser.email !== email.trim())
      return reply.status(400).send({ error: 'Email does not match your registered email.' });
    
    return reply.send({ message: 'Email verified successfully.' });
  } catch (err) {
    server_authentification.log.error('Email verification error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});


server_authentification.post('/toggle-2fa', { preHandler: authenticateJWT }, async (request, reply) => {
  try {
    const user = (request as any).user;
    const { enabled } = request.body as { enabled: boolean };
    
    const stmt = db.prepare('UPDATE users SET two_fa_enabled = ? WHERE id = ?');
    stmt.run(enabled ? 1 : 0, user.userId);
    
    return reply.send({ 
      message: `2FA ${enabled ? 'enabled' : 'disabled'} successfully.`,
      two_fa_enabled: enabled 
    });
  } catch (err) {
    server_authentification.log.error('Toggle 2FA error:', err);
    return reply.status(500).send({ error: 'Internal server errorrr.' });
  }
});

server_authentification.post('/send-2fa-code', { preHandler: authenticateJWT }, async (request, reply) => {
  try {
    const user = (request as any).user;
    
    const dbUser = db.prepare('SELECT id, email, two_fa_enabled, email_2fa_attempts FROM users WHERE id = ?').get(user.userId);
    if (!dbUser) {
      return reply.status(404).send({ error: 'User not found.' });
    }
    
    
    if (dbUser.email_2fa_attempts >= 5) {
      return reply.status(429).send({ error: 'Too many attempts. Please try again later.' });
    }
    
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const stmt = db.prepare(`
      UPDATE users 
      SET email_2fa_code = ?, email_2fa_code_expires = ?, email_2fa_attempts = email_2fa_attempts + 1 
      WHERE id = ?
    `);
    stmt.run(code, expiresAt.toISOString(), user.userId);
    
    const emailSent = await sendVerificationEmail(dbUser.email, code);
    
    if (!emailSent) {
      return reply.status(500).send({ error: 'Failed to send verification email.' });
    }
    
    return reply.send({ message: 'Verification code sent to your email.' });
  } catch (err) {
    server_authentification.log.error('Send 2FA code error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

server_authentification.post('/verify-2fa-code', { preHandler: authenticateJWT }, async (request, reply) => {
  try {
    const user = (request as any).user;
    const { code } = request.body as { code: string };
    
    if (!code || code.length !== 6) {
      return reply.status(400).send({ error: 'Invalid verification code format.' });
    }
    
    const dbUser = db.prepare(`
      SELECT id, email_2fa_code, email_2fa_code_expires 
      FROM users 
      WHERE id = ?
    `).get(user.userId);
    
    if (!dbUser) {
      return reply.status(404).send({ error: 'User not found.' });
    }
    
    if (!dbUser.email_2fa_code || !dbUser.email_2fa_code_expires) {
      return reply.status(400).send({ error: 'No verification code found. Please request a new one.' });
    }
    
    if (new Date() > new Date(dbUser.email_2fa_code_expires)) {
      return reply.status(400).send({ error: 'Verification code has expired. Please request a new one.' });
    }
    
    if (dbUser.email_2fa_code !== code) {
      return reply.status(400).send({ error: 'Invalid verification code.' });
    }
    
    const clearStmt = db.prepare(`
      UPDATE users 
      SET email_2fa_code = NULL, email_2fa_code_expires = NULL, email_2fa_attempts = 0 
      WHERE id = ?
    `);
    clearStmt.run(user.userId);
    
    return reply.send({ message: 'Verification successful!' });
  } catch (err) {
    server_authentification.log.error('Verify 2FA code error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

server_authentification.post('/reset-2fa-attempts', { preHandler: authenticateJWT }, async (request, reply) => {
  try {
    const user = (request as any).user;
    
    const stmt = db.prepare('UPDATE users SET email_2fa_attempts = 0 WHERE id = ?');
    stmt.run(user.userId);
    
    return reply.send({ message: 'Attempts reset successfully.' });
  } catch (err) {
    server_authentification.log.error('Reset 2FA attempts error:', err);
    return reply.status(500).send({ error: 'Internal server error.' });
  }
});

server_authentification.get('/friends/search/:query', async (request, reply) => {
    const { query } = request.params as { query: string };

    const user = db.prepare(`
        SELECT username FROM users WHERE username = ?
    `).get(query);
    if (user) {
      return reply.send({ succes: true, users: [user] });
    } else {
      return reply.send({ succes: true, users: []});
    }
});

const start = async () =>
{
  try
  {
    await server_authentification.listen({ port: 8001, host: '0.0.0.0' });
    console.log('Serveur Authentification lancé');

    const address = server_authentification.server.address();
    const port = typeof address === 'string' ? address : address?.port;

    console.log(port);
  }
  catch (err)
  {
    server_authentification.log.error(err);
    process.exit(1);
  }
};

start();
