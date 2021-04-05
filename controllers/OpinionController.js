const { candidate, opinion, election, user } = require('../models');
// const { delete } = require('../routes/OpinionRouter');

module.exports = {
    getComments: async (req, res) => {
        opinion.findAll()
            .then(rawOpinions => {
                if (rawOpinions.length === 0) {
                    res.status(200).json({
                        comments: []
                    })
                } else {
                    return rawOpinions.map(rawOpinion => rawOpinion.dataValues)
                }
            })
            .then(opinions => {
                const comments = opinions.map(opinion => {
                    delete opinion.updatedAt;
                    return opinion
                })
                res.status(200).json({
                    comments
                })
            })
            .catch(err => {
                if (err) {
                    res.status(500).json({
                        message: "Internal server error!"
                    })
                }
            })
    },
    postComment: async (req, res) => {
        res.send('postComment')
    }
}