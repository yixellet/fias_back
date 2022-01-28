const router = require('express').Router();
const {
    liveSearch,
    getLevels,
    getChildren,
    getHouseChildren,
    getRooms,
    getParams
} = require('../controllers');

router.get('/livesearch', liveSearch);
router.get('/levels', getLevels);
router.get('/children', getChildren);
router.get('/housechildren', getHouseChildren);
router.get('/rooms', getRooms);
router.get('/params', getParams);

module.exports = router;
