const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const passport = require('passport')
router.get('/google/login', passport.authenticate("google", {scope: ["profile", "email"]}), authController.redirect);
router.get('/google/logout', authController.logout);


module.exports = router;