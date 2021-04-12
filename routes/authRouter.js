const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
// router.use(bodyParser.json())
const authController = require('../controllers/authController');
const passport = require('passport')
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.get('/google/login', passport.authenticate("google", {scope: ["profile", "email"]}));
router.get('/google/logout', authController.logout);
router.get('/google/redirect', passport.authenticate("google"), authController.redirect);

module.exports = router;