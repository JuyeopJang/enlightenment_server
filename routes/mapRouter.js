const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

router.get('/elections', mapController.getElections)
router.post('/places', mapController.getPlaces)

module.exports = router