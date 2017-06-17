const router = require('router-middleware');
const http = require('http');
const ecstatic = require('ecstatic');
const argv = require('optimist')
  .demand('p')
  .describe('p', 'port to start service on')
  .argv;
//const lib = require('./lib');
const app = router();
const server = http.createServer(app);

server.listen(argv.p, () => {

  console.log("Server listening on port " + argv.p);
})

app.fileserver(ecstatic({ root: __dirname + '/web', handleError: false }));

