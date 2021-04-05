const { candidate, opinion, election, user } = require('../models');

module.exports = {
    getComments: async (req, res) => {
        res.send('getComments')
    },
    postComment: async (req, res) => {
        res.send('postComment')
    }
}