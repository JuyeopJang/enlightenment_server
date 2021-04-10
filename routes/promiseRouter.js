const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const promiseController = require('../controllers/promiseController');

router.post('/candidates', promiseController.getCandidates)
router.post('', promiseController.getPromises)
// 미완성
router.post('/electionplaces', promiseController.getElectionPlaces)

module.exports = router