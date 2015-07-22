import Hapi from 'hapi';

import routes from './routes';

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.ext('onPreResponse', function (request, reply) {

    var response = request.response;
    if (response.isBoom) {
        console.log(response);
    }

    reply.continue();
});

server.route(routes);

export default server;
