import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

export async function pageRoutes(server: FastifyInstance) {

	const getTemplate = async (request : FastifyRequest, reply : FastifyReply) => {
		return (reply.sendFile("template/index.html"));
	}


	server.get('/', getTemplate);
	server.get('/login', getTemplate);
	server.get('/register', getTemplate);
	server.get('/guest', getTemplate);
	server.get('/registered_user', getTemplate);
	server.get('/profile', getTemplate);
	server.get('/2fa', getTemplate);
	server.get('/pvp', getTemplate);
	server.get('/pong_4P', getTemplate);
	server.get('/modes', getTemplate);
	server.get('/pong_1vbot', getTemplate);
	server.get('/survival_mode', getTemplate);
	server.get('/ranking', getTemplate);
	server.get('/tournoi', getTemplate);
	server.get('/stats', getTemplate);
	server.get('/friends', getTemplate);
	

	server.get('/:username', getTemplate);
	server.get('/:username/2fa', getTemplate);
	server.get('/:username/profil', getTemplate);
	

	server.setNotFoundHandler(async (request, reply) => {
		if (request.url.includes('.')) {
			reply.code(404).send('Not Found');
			return;
		}

		return reply.sendFile("template/index.html");
	});
}