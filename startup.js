import yar from 'yar';

import server from './lib/server';

server
  .register([
    {
      register: yar,
      options: {
        cookieOptions: {
          password: 'emojinary!',
          isSecure: false
        }
      }
    }
  ], (err) => {
    if (!err) { server.start(); }
  });

server.start((err) => {
  if (err) { server.log(err); }
  else { server.log('server started...'); }
});
