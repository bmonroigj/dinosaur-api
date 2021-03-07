const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

// Create express application
const app = express();
// Setup application middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Setup application routes
const images = [__dirname, '..', 'public', 'dinosaur', 'image'];
app.use('/api/dinosaur/image', express.static(path.join(...images)));
app.use('/api', routes);

module.exports = app;
