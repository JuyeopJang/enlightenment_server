const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinionController');

router.get('/comments', opinionController.getComments);
router.post('/comment', opinionController.postComment);
router.delete('/comment/:commentId', opinionController.deleteComment);
router.put('/comment/:commentId', opinionController.updateComment);
// router.patch('/candidates', opinionController.getCandidates);

module.exports = router;