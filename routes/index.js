const router = require('express').Router();
const {
    liveSearch,
    getAdmDistricts,
    getAdmDistrictsDetails,
    getMunDistricts,
    getMunStructures,
    getCities,
    getSettles,
    getTerritories,
    getStreets,
    getLevels,
    getSteads,
    getHouses
} = require('../controllers');

router.get('/livesearch', liveSearch);
router.get('/levels', getLevels);
router.get('/admdistricts', getAdmDistricts);
router.get('/admdistrDetails', getAdmDistrictsDetails);
router.get('/mundistricts', getMunDistricts);
router.get('/munstructures', getMunStructures);
router.get('/cities', getCities);
router.get('/settlements', getSettles);
router.get('/territories', getTerritories);
router.get('/streets', getStreets);
router.get('/steads', getSteads);
router.get('/houses', getHouses);

module.exports = router;
