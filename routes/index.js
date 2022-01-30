const router = require('express').Router();
const {
    liveSearch,
    getLevels,
    getChildren,
    getHouseChildren,
    getRooms,
    getParams,
    getGeometry
} = require('../controllers');

router.get('/livesearch', liveSearch);
router.get('/levels', getLevels);
router.get('/children', getChildren);
router.get('/housechildren', getHouseChildren);
router.get('/rooms', getRooms);
router.get('/params', getParams);
router.get('/geometry', getGeometry);

module.exports = router;
