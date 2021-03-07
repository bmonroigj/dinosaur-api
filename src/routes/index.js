const router = require('express').Router();
const { baseUrl } = require('../utils');
const apiEndpoints = require('./api');
const getHandlers = require('../middlewares/data');

router.get('/', (req, res) => {
  res.json({
    dinosaurs: `${baseUrl}/dinosaur`,
    diets: `${baseUrl}/diet`,
    periods: `${baseUrl}/period`,
    locations: `${baseUrl}/location`,
    taxonomies: `${baseUrl}/taxonomy`,
  });
});

apiEndpoints.forEach((endpoint) => {
  const handlers = getHandlers();
  router.get(endpoint.path, handlers[endpoint.handler]);
});

module.exports = router;
