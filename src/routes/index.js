const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Hello from HTTP serever',
  });
});

module.exports = router;
