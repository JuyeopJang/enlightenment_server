const { user } = require('../models')
const passport = require('passport')
module.exports = {
    logout: async (req, res) => {

        // const authorization = req.headers['authorization'];
        // // 왜 authorization.split을 사용하는지, 왜 1번째 인덱스의 값을 얻는지 console.log를
        // // 사용해 확인해보세요!
        // const token = authorization.split(' ')[1];
        if (req.isAuthenticated()) {
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
            res.status(302).redirect('http://localhost:3000')
        } else {
            res.status(401).json({
                message: 'Invalid User'
            })
        }
    }
}