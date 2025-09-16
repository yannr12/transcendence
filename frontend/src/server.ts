import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import fastifyStatic from '@fastify/static';
import fastifyHttpProxy from '@fastify/http-proxy';
import fastifyCors from '@fastify/cors';
import { request } from 'undici';
import view from '@fastify/view';
import { join } from 'path';
import fetch from 'node-fetch';
import { pageRoutes } from './sending_page';

const server_frontend: FastifyInstance = Fastify({ logger: true });

server_frontend.register(fastifyCors, {
	origin: true,
	credentials: true
});

server_frontend.register(fastifyStatic, {
	root: join(__dirname, '../public'),
	prefix: '/',
});

// server_frontend.register(fastifyStatic, {
	//   root: join(__dirname, '../public'),
	//   prefix: '/',
	//   decorateReply: false, 
	// });
	
	
pageRoutes(server_frontend);

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-authentification:8001",
	prefix: '/authentification', 
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-authentification:8001/update",
	prefix: '/authentification/update',
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-authentification:8001/friends/search",
	prefix: '/authentification/friends/search', 
	rewritePrefix: '/friends/search',
	http2: false
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-authentification:8001/user/profile",
	prefix: '/user/profile',
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004",
	prefix: '/account', 
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/update",
	prefix: '/account/update', 
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/check",
	prefix: '/account/check', 
	rewritePrefix: '',
});

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/upload-avatar",
	prefix: '/account/upload-avatar', 
	rewritePrefix: '/upload-avatar'
});


server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/avatar/:username",
	prefix: '/account/avatar/:username', 
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/add_game",
	prefix: '/account/add_game', 
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/get_1v1_stats",
	prefix: '/account/get_1v1_stats', 
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/get_survival_stats",
	prefix: '/account/get_survival_stats',
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/get_games_data",
	prefix: '/account/get_games_data',
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/get_all_games",
	prefix: '/account/get_all_games',
	rewritePrefix: '',
})

server_frontend.register(fastifyHttpProxy, {
	upstream: "http://service-account:8004/friends/get",
	prefix: '/account/friends/get',
	rewritePrefix: '',
})

const start = async () => {
  try {
    await server_frontend.listen({ port: 8003, host: '0.0.0.0' });
    console.log('Serveur_frontEnd lancé sur http://localhost:8003');

	const address = server_frontend.server.address();
	const port = typeof address === 'string' ? address : address?.port;

	console.log(port);
  } catch (err) {
    server_frontend.log.error(err);
    process.exit(1);
  }
};

start();