import Hapi from 'hapi';

import routes from './routes';

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.route(routes);

export default server;
