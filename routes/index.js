const router = require('express').Router();
const { getObjectsByLevel, getSelsovets, getLevels, getSteads, getHouses } = require('../controllers');

router.get('/levels', getLevels);
router.get('/districts', getObjectsByLevel);
router.get('/selsovets', getSelsovets)
router.get('/steads', getSteads);
router.get('/houses', getHouses);

module.exports = router;
