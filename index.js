require('babel/register');

var cluster = require('cluster');

if (cluster.isMaster) {

    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', cluster.fork);

} else {

    require('./startup');
}
