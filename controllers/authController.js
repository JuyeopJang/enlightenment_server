const { user } = require('../models');
const passport = require('passport');
module.exports = {
    logout: async (req, res) => {
        if (req.isAuthenticated() && req.cookies.accessToken === req.user.accessToken) {
            res.clearCookie('accessToken')
            res.clearCookie('userId')
            req.logout()
            res.status(200).json({
                message: 'Successfully logout!'
            })
        } else {
            res.status(401).json({
                message: 'Invalid User'
            })
        }
    },
    redirect: async (req, res) => {
        if (req.user) {
            res.cookie('userId', req.user.userId)
            res.cookie('accessToken', req.user.accessToken, {
                expires: new Date(Date.now() + 24 * 3600000) // cookie will be removed after 8 hours
            })
            res.status(302).redirect('http://localhost:3000')
        } else {
            res.status(401).json({
                message: 'Invalid User'
            })
        }
    }
}