import Hapi from 'hapi';

const server = Hapi.server({
  port: 8080
});

server.route({
    method: 'GET',

    path: '/',

    handler (request, reply) {
       reply('hello world');
    }
});

export default server;
