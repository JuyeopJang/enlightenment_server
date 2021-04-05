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
        const { candidateId, electionId, comment, accessToken } = req.body;
        const userInfo = await user.findOne({
            where: {
                accessToken: accessToken
            }
        })
        if(!userInfo){
            res.status(401).json({
                message: 'Invalid token'
            })
        } else{
            const candidateInfo = await candidate.findAll({
                where: {
                    electionId: electionId
                }
            })
            if(candidateInfo){
                opinion.create({
                    comment: comment,
                    candidateId: candidateId,
                    userId: userInfo.id
                })
                res.status(201).json({
                    message: 'Successfully created!'
                })
            }
        }
    }
}