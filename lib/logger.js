import bunyan from 'bunyan';
import path from 'path';

const log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: path.resolve('./', 'var', 'tmp', 'info.log')
    },
    {
      level: 'error',
      path: path.resolve('./', 'var', 'tmp', 'error.log')
    }
  ]
});

export default log;
