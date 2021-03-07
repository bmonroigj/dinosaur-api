require('dotenv').config();
const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const debug = require('debug')('dinosaur-api:server');

// Connect to MongoDB database
const db = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/dinosaur-db';
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
// Listen for MongoDB connection errors
mongoose.connection.on('error', (err) =>
  debug(`MongoDB connection error: ${err.message}`),
);
// Create HTTP server
const server = http.createServer(app);
const port = process.env.PORT || 3000;
// Listen for connections
server.listen(port);
// Listen for server events
server.on('error', (err) => debug(`HTTP server error: ${err.message}`));
server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
});
