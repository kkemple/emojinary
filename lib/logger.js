import path from 'path';

import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: path.resolve('./', 'logs', 'info.log'),
      type: 'rotating-file',
      period: '1d',
      count: 14
    },
    {
      level: 'error',
      path: path.resolve('./', 'logs', 'error.log'),
      type: 'rotating-file',
      period: '1d',
      count: 14
    }
  ]
});

export default log;
