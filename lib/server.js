import Hapi from 'hapi';

import routes from './routes';
//import Team from '../models/team';

const server = new Hapi.Server();
server.connection({ port: 8080 });

// server.ext('onPreHandler', (request, reply) => {
//   new Team({ id: request.payload.team_id })
//     .fetch()
//     .then((team) => {
//       if (!team) {
//         reply.continue();
//         return;
//       }
//
//       if (request.payload.token !== team.get('token')) {
//         console.log(new Error({
//           message: 'Token mismatch!',
//           token: request.payload.token
//         }));
//       }
//
//       request.team = team;
//
//       reply.continue();
//     });
// });

server.ext('onPreResponse', (request, reply) => {

    var response = request.response;
    if (response.isBoom) {
        console.log(response);
        reply(response)
          .type('text/plain');
        return;
    }

    reply.continue();
});

server.route(routes);

export default server;
