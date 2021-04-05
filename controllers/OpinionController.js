const { candidate, opinion, election, user } = require('../models');

module.exports = {
    getComments: async (req, res) => {
        res.send('getComments')
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
            }
        }
    }
}