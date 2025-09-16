import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import fastifyMultipart from '@fastify/multipart';
import { join, extname } from 'path';
import fastifyStatic from '@fastify/static';
import fastifyHttpProxy from '@fastify/http-proxy';
import view from '@fastify/view';
import Database = require('better-sqlite3');
import * as bcrypt from 'bcrypt';
import path from 'path'

const dbPath = join(__dirname, '..', 'data', 'account.db');

const db = new Database(dbPath);

db.prepare(`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT UNIQUE,
    age INTEGER
    avatarUrl TEXT
	)
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS friends (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
    friendusername TEXT,
    UNIQUE(username, friendusername)
	)
`).run();

db.prepare(`
	CREATE TABLE IF NOT EXISTS game (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT,
    mode TEXT,
    leftscore INTEGER,
    rightscore INTEGER,
    date TEXT DEFAULT (datetime('now', 'localtime'))
	)
`).run();

try { // Ajouter la colonne avatarUrl si elle n'existe pas déjà
  db.prepare('ALTER TABLE users ADD COLUMN avatarUrl TEXT').run();
} catch (e) {}

export default db;

const server_account: FastifyInstance = Fastify({ logger: true });

server_account.get('/favicon.ico', async (request, reply) => {
  return reply.code(204).send();
});

function sanitizeUsername(username: string): string {
  return typeof username === 'string' ? username.trim().replace(/[^\w]/g, '').slice(0, 20) : '';
}

function sanitizeAge(age: any): number {
  const n = Number(age);
  return Number.isInteger(n) && n >= 0 && n <= 120 ? n : 0;
}

// // Debug endpoint to list all users
// server_account.get('/debug/users', async (request, reply) => {
//   try {
//     const users = db.prepare('SELECT id, username, age, avatarUrl FROM users').all();
//     return reply.send({ success: true, users });
//   } catch (error) {
//     return reply.status(500).send({ success: false, message: 'Failed to fetch users.' });
//   }
// });

server_account.post('/check', async (request, reply) => {
  let { username } = request.body as { username: string };
  username = sanitizeUsername(username);
  if (!username) {
    return reply.send({ succes: false });
  }
  const user = db.prepare('SELECT id, username, age FROM users WHERE username = ?').get(username) as { id: number; username: string; age: number } | undefined;

  if (!user)
  {  
    const stmt = db.prepare('INSERT INTO users (username, age) VALUES (?, ?)');
    stmt.run(username, 0);
    const user = db.prepare('SELECT id, username, age FROM users WHERE username = ?').get(username) as { id: number; username: string; age: number} | undefined;
    if (!user)
      return reply.send({ succes: false, message: 'User creation failed.' });
    else
      return reply.send({ succes: false, message: 'Utilisateur creé' });
  }
  else
    return reply.send({ succes: true, age: user.age });
});

server_account.post('/update', async (request, reply) => {
  let { username, newusername, age } = request.body as {
    username: string;
    newusername: string;
    age: number;
  };
  username = sanitizeUsername(username);
  newusername = sanitizeUsername(newusername);
  age = sanitizeAge(age);

  if (username && age && age >= 0) {
    const updateStmt = db.prepare('UPDATE users SET age = ? WHERE username = ?');
    updateStmt.run(age, username); }
  if (newusername && newusername != username) {
    const usernameExists = db.prepare('SELECT * FROM users WHERE username = ?').get(newusername);
    if (usernameExists) {
        return reply.send({ succes: false, message: 'This username is already used by another user.' }); }
    db.prepare('UPDATE users SET username = ? WHERE username = ?').run(newusername, username);
    db.prepare('UPDATE friends SET username = ? WHERE username = ?').run(newusername, username);
    db.prepare('UPDATE game SET username = ? WHERE username = ?').run(newusername, username);
  }
  return reply.send({ succes: true, message: ''})
});

server_account.register(require('@fastify/multipart'));

server_account.post('/upload-avatar', async (request: FastifyRequest, reply: FastifyReply) => {
  const data = await request.file();
  if (!data) {
    return reply.status(400).send({ succes: false, message: 'No file uploaded.' });
  }

  const usernameField = data.fields.username;
  const newUsernameField = data.fields.newusername;

  let username = usernameField && typeof usernameField.value === 'string' ? sanitizeUsername(usernameField.value) : '';
  let newusername = newUsernameField && typeof newUsernameField.value === 'string' && newUsernameField.value.trim() !== '' ? sanitizeUsername(newUsernameField.value) : '';

  if (!username || username.trim() === '') {
    return reply.status(400).send({ succes: false, message: 'Username is required and must be a non-empty string.' });
  }

  const effectiveUsername = newusername || username;

  const allowedExts = ['.png', '.jpg', '.jpeg'];
  const ext = path.extname(data.filename).toLowerCase();
  if (!allowedExts.includes(ext)) {
    return reply.status(400).send({ succes: false, message: 'Invalid file type.' });
  }

  const filename = `${effectiveUsername}-${Date.now()}${ext}`;
  const uploadPath = join(__dirname, '..', 'uploads', 'avatars', filename);

  try {
    await fs.promises.mkdir(join(__dirname, '..', 'uploads', 'avatars'), { recursive: true });
    await fs.promises.writeFile(uploadPath, await data.toBuffer());

    const avatarUrl = `/uploads/avatars/${filename}`;

    const updateAvatarStmt = db.prepare('UPDATE users SET avatarUrl = ? WHERE username = ?');
    updateAvatarStmt.run(avatarUrl, effectiveUsername);

    return reply.send({ succes: true, message: 'Avatar uploaded successfully!', avatarUrl: avatarUrl });
  } 
  catch (error) {
    server_account.log.error('Error uploading avatar:', error);
    return reply.status(501).send({ succes: false, message: 'Failed to upload avatar.' });
  }
});

server_account.register(fastifyStatic, {
  root: join(__dirname, '..', 'uploads'),
  prefix: '/uploads',
});

server_account.get('/avatar/:username', async (request: FastifyRequest, reply: FastifyReply) => {
  let { username } = request.params as { username: string };
  username = sanitizeUsername(username);

  const user = db.prepare('SELECT avatarUrl FROM users WHERE username = ?').get(username) as { avatarUrl?: string } | undefined;

  let filePath: string;
  if (!user || !user.avatarUrl) {
    filePath = join(__dirname, '..', 'uploads', 'avatars', 'default-avatar.png')
    if (!fs.existsSync(filePath)) {
      return reply.status(404).send('Default avatar not found.'); }
    }
    else {
      filePath = join(__dirname, '..', user.avatarUrl);
      if (!fs.existsSync(filePath)) {
        filePath = join(__dirname, '..', 'uploads', 'avatars', 'default-avatar.png');
      }
    }
  reply.type('image/png');
  return reply.send(fs.createReadStream(filePath));
});

server_account.post('/friends/add', async (request, reply) => {
    let { username, friendusername } = request.body as { username: string, friendusername: string };
    username = sanitizeUsername(username);
    friendusername = sanitizeUsername(friendusername);

    if (username === friendusername) {
        return reply.status(400).send({ succes: false, message: "Vous ne pouvez pas vous ajouter comme ami." });
    }

    try {
        db.prepare('INSERT INTO friends (username, friendusername) VALUES (?, ?)').run(username, friendusername);
        return reply.send({ succes: true, message: "Friend added successfully." });
    } catch (error) {
        return reply.status(400).send({ succes: false, message: "Friend already added." });
    }
});

server_account.post('/friends/remove', async (request, reply) => {
    let { username, friendusername } = request.body as { username: string, friendusername: string };
    username = sanitizeUsername(username);
    friendusername = sanitizeUsername(friendusername);
    if (!username || !friendusername) {
        return reply.status(400).send({ succes: false, message: "Champs manquants." });
    }
    try {
        const stmt = db.prepare('DELETE FROM friends WHERE username = ? AND friendusername = ?');
        const result = stmt.run(username, friendusername);
        if (result.changes > 0) {
            return reply.send({ succes: true, message: "Ami supprimé." });
        } else {
            return reply.status(404).send({ succes: false, message: "Ami non trouvé." });
        }
    } catch (error) {
        return reply.status(500).send({ succes: false, message: "Erreur lors de la suppression." });
    }
});

server_account.post('/add_game', async (request, reply) => {
    let { username, scoreleft, scoreright, mode, date } = request.body as {
        username: string;
        mode: string;
        scoreleft: number;
        scoreright: number;
        date: string;
    };
    username = sanitizeUsername(username);
    mode = typeof mode === 'string' ? mode.trim().slice(0, 20) : '';
    scoreleft = Number(scoreleft);
    scoreright = Number(scoreright);
    date = typeof date === 'string' ? date.trim().slice(0, 30) : '';

    if (!username || scoreleft === undefined || scoreright  === undefined || !mode ||!date) {
        return reply.status(400).send({ succes: false, message: "Champs manquants (username, leftscore, rightscore, mode, date) requis." });
    }

    try {
        const insertStmt = db.prepare('INSERT INTO game (username, leftscore, rightscore, mode, date) VALUES (?, ?, ?, ?, ?)');
        insertStmt.run(username, scoreleft, scoreright, mode, date);

        return reply.send({ succes: true, message: "Game ajouté avec succès." });
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ succes: false, message: error });
    }
});

server_account.get('/get_1v1_stats', async (request, reply) => {
    let { username } = request.query as { username: string };
    username = sanitizeUsername(username);

    if (!username) {
      return reply.status(400).send({ success: false, message: "Username is required." });
    }
    try {
        const stmt = db.prepare(`
          SELECT leftscore, rightscore FROM game WHERE username = ? AND mode = '1v1'`);
        const games = stmt.all(username);
        let wins = 0;
        let losses = 0;
        let gamesCount = games.length;
        for (const game of games) {
          if (game.leftscore > game.rightscore) {
            wins++;
          } else if (game.leftscore < game.rightscore) {
            losses++;
          }
        }
        return reply.send({ success: true, wins, losses, gamesCount });
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ success: false, message: "Erreur lors de la récupération des stats mode 1v1" });
    }
});

server_account.get('/get_survival_stats', async (request, reply) => {
    let { username } = request.query as { username: string };
    username = sanitizeUsername(username);

    if (!username) {
      return reply.status(400).send({ success: false, message: "Username is required." });
    }
    try {
        const stmt = db.prepare(`
          SELECT leftscore FROM game WHERE username = ? AND mode = 'survival'`);
        const games = stmt.all(username);
        let record = 0;
        let gamesCount = games.length;
        for (const game of games) {
          if (game.leftscore > record) {
            record = game.leftscore;
          }
        }
        return reply.send({ success: true, record, gamesCount})
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ success: false, message: "Erreur lors de la récupération des stats mode survival" });
    }
});

server_account.get('/get_1v1v1v1_stats', async (request, reply) => {
    let { username } = request.query as { username: string };
    username = sanitizeUsername(username);

    if (!username) {
      return reply.status(400).send({ success: false, message: "Username is required." });
    }
    try {
        const stmt = db.prepare(`
          SELECT leftscore FROM game WHERE username = ? AND mode = 'survival'`);
        const games = stmt.all(username);
        let record = 0;
        let gamesCount = games.length;
        for (const game of games) {
          if (game.leftscore > record) {
            record = game.leftscore;
          }
        }
        return reply.send({ success: true, record, gamesCount})
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ success: false, message: "Erreur lors de la récupération des stats mode survival" });
    }
});

server_account.get('/get_games_data', async (request, reply) => {
    let { username } = request.query as { username: string };
    username = sanitizeUsername(username);

    if (!username) {
      return reply.status(400).send({ success: false, message: "Username is required." });
    }
    try {
        const stmt = db.prepare(`
          SELECT mode, leftscore, rightscore, date FROM game WHERE username = ?`);
        const games = stmt.all(username);
        return reply.send({ success: true, games });
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ success: false, message: "Erreur lors de la récupération des données de jeu" });
    }
});

server_account.get('/get_all_games', async (request, reply) => {
    try {
        const stmt = db.prepare(`
          SELECT username, mode, leftscore, rightscore, date FROM game`);
        
        const games = stmt.all();
        
        return reply.send({ success: true, games });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ success: false, message: "Erreur lors de la récupération de toutes les données de jeu" });
    }
});

server_account.get('/friends/get', async (request, reply) => {
  let { username } = request.query as { username:string };
  username = sanitizeUsername(username);

  if (!username) {
    return reply.status(400).send({ success:false, message: "Username is required."});
  }
  try {
    const stmt = db.prepare(`
      SELECT friendusername FROM friends WHERE username = ?`);
    const friends = stmt.all(username).map(row => row.friendusername);
    return reply.send({ success:true, friends });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ success:false, message: "Erreur lors de la récupération des amis"});
  }
})

// server_account.post('/debug/delete_user', async (request, reply) => {
//   let { username } = request.body as { username: string };
//   username = sanitizeUsername(username);

//   if (!username) {
//     return reply.status(400).send({ success: false, message: "Username is required." });
//   }

//   try {
//     // Remove from friends (both as user and as friend)
//     db.prepare('DELETE FROM friends WHERE username = ? OR friendusername = ?').run(username, username);
//     // Remove from game
//     db.prepare('DELETE FROM game WHERE username = ?').run(username);
//     // Remove from users
//     const result = db.prepare('DELETE FROM users WHERE username = ?').run(username);

//     if (result.changes > 0) {
//       return reply.send({ success: true, message: `User '${username}' deleted.` });
//     } else {
//       return reply.status(404).send({ success: false, message: "User not found." });
//     }
//   } catch (error) {
//     return reply.status(500).send({ success: false, message: "Failed to delete user." });
//   }
// });

// Lancement du serveur
const start = async () => {
  try {
    await server_account.listen({ port: 8004, host: '0.0.0.0' });
    console.log('Serveur_frontEnd lancé sur http://localhost:8004');

	const address = server_account.server.address();
	const port = typeof address === 'string' ? address : address?.port;

	console.log(port);
  } catch (err) {
    server_account.log.error(err);
    process.exit(1);
  }
};

start();
