const { opinion } = require('../models');

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
                    delete opinion.userId;
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
        const { comment } = req.body;
        if (comment) {
            opinion.create({
                comment,
                ban: 0
            })
            .then(createdOpinion => {
                if (createdOpinion) {
                    const { dataValues } = createdOpinion;
                    delete dataValues.updatedAt
                    res.status(201).json({
                        ...dataValues
                    })
                }
            })
            .catch(err => {
                if (err) {
                    res.status(500).json({
                        message: 'Internal server error'
                    })
                }
            })
        } else {
            res.status(400).json({
                message: 'body data required'
            })
        }
    },
    deleteComment: async (req, res) => {
        const { commentId } = req.params;
        const deletedComment = await opinion.findOne({
            where: {
                id: commentId
            }
        })
        if (deletedComment) {
            if (deletedComment.dataValues.ban >= 5) {
                await opinion.destroy({
                    where: {
                      id: Number(commentId)
                    }
                })
                res.status(200).json({
                    message: 'Successfully deleted'
                })
            } else {
                res.status(400).json({
                    message: 'you should request update endpoint'
                })
            }
        } else {
            res.status(404).json({
                message: 'send proper commentId'
            })
        }
    },
    updateComment: async (req, res) => {
        const { commentId } = req.params;
        const updatedComment = await opinion.findOne({
            where: {
                id: commentId
            }
        })
        if (updatedComment) {
            if (updatedComment.dataValues.ban < 5) {
                await opinion.update({
                    ban: updatedComment.dataValues.ban + 1
                }, {
                    where: {
                      id: commentId
                    }
                });
                res.status(200).json({
                    message: 'Successfully updated'
                })
            } else {
                res.status(400).json({
                    message: 'you should request delete endpoint'
                })
            }
        } else {
            res.status(404).json({
                message: 'send proper commentId'
            })
        }
    }
}