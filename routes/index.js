const router = require('express').Router();
const { getObjectsByLevel, getLevels, getSteads } = require('../controllers');

router.get('/districts', getObjectsByLevel);
router.get('/levels', getLevels);
router.get('/steads', getSteads);

module.exports = router;
