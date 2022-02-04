const router = require('express').Router();
const {
    liveSearch,
    search,
    getLevels,
    getChildren,
    getHouseChildren,
    getRooms,
    getParams,
    getGeometry,
    getGenealogy
} = require('../controllers');

router.get('/livesearch', liveSearch);
router.get('/search', search);
router.get('/levels', getLevels);
router.get('/children', getChildren);
router.get('/housechildren', getHouseChildren);
router.get('/rooms', getRooms);
router.get('/params', getParams);
router.get('/geometry', getGeometry);
router.get('/genealogy', getGenealogy);

module.exports = router;
