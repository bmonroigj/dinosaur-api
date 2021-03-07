require('dotenv').config();
const app = require('./app');
const http = require('http');
const debug = require('debug')('dinosaur-api:server');

// Create HTTP server
const server = http.createServer(app);
const port = process.env.PORT || 8080;
// Listen for connections
server.listen(port);
// Listen for server events
server.on('error', (err) => debug(`HTTP server error: ${err}`));
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
});
