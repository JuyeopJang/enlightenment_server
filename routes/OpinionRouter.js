const express = require('express');
const router = express.Router();
const opinionController = require('../controllers/opinionController');

router.get('/comments', opinionController.getComments);
router.post('/comment', opinionController.postComment);
router.put('/comment/:commentId/ban', opinionController.updateCommentBan);
router.put('/comment/:commentId/like', opinionController.updateCommentLike);

module.exports = router;