const router = require('express').Router();
const { baseUrl } = require('../utils');
const apiEndpoints = require('./api');
const getHandlers = require('../middlewares/data');

router.get('/', (req, res) => {
  res.json({
    dinosaurs: `${baseUrl}/api/dinosaur`,
    diets: `${baseUrl}/api/diet`,
    periods: `${baseUrl}/api/period`,
    locations: `${baseUrl}/api/location`,
    taxonomies: `${baseUrl}/api/taxonomy`,
  });
});

apiEndpoints.forEach((endpoint) => {
  const handlers = getHandlers();
  router.get(endpoint.path, handlers[endpoint.handler]);
});

module.exports = router;
