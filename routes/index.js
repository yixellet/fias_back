const router = require('express').Router();
const { getObjectsByLevel } = require('../controllers');

router.get('/districts', getObjectsByLevel);

module.exports = router;
