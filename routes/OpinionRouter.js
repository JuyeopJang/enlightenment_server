const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json())
const opinionController = require('../controllers/OpinionController');

router.get('/comments', opinionController.getComments);
router.post('/comment', opinionController.postComment);
router.get('/elections', opinionController.getElections);
router.get('/candidates', opinionController.getCandidates);

module.exports = router;