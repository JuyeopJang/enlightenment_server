const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({
    extended: false
})
const opinionController = require('../controllers/OpinionController');

router.get('/comments', opinionController.getComments);
router.post('/comment', opinionController.postComment);

module.exports = router;