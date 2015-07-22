import Hapi from 'hapi';

const server = new Hapi.Server({
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
