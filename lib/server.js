import Hapi from 'hapi';

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.route({
    method: 'GET',

    path: '/',

    handler (request, reply) {
       reply('hello world');
    }
});

export default server;
