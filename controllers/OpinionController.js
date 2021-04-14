const { opinion, user } = require('../models');
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
        const { userId } = req.cookies
        const { comment, electionName, candidateName } = req.body;
        if ( userId === req.user.userId && comment && electionName && candidateName ) {
            const userInfo = await user.findOne({
                where: {
                    id: userId
                }
            })
            if (!userInfo) {
                res.status(401).json({
                    message: 'Invalid user'
                })
            } else {
                opinion.create({
                    userId,
                    comment,
                    electionName,
                    candidateName
                })
                .then(createdOpinion => {
                    const { dataValues } = createdOpinion;
                    delete dataValues.updatedAt
                    res.status(201).json({
                        ...dataValues
                    })
                })
                .catch(err => {
                    if (err) {
                        res.status(500).json({
                            message: 'Internal server error'
                        })
                    }
                })
            }
        } else {
            res.status(400).json({
                message: 'body data required'
            })
        }
    },
    // getElections: async (req, res) => {
    //     election.findAll()
    //     .then(rawElections => {
    //         if (rawElections.length === 0) {
    //             res.status(200).json({
    //                 elections: []
    //             })
    //         } else {
    //             return rawElections.map(rawElection => rawElection.dataValues)
    //         }
    //     })
    //     .then(elections => {
    //         const electionsData = elections.map(election => {
    //             delete election.updatedAt;
    //             delete election.createdAt;
    //             return election
    //         })
    //         res.status(200).json({
    //             elections: electionsData
    //         })
    //     })
    //     .catch(err => {
    //         if (err) {
    //             res.status(500).json({
    //                 message: "Internal server error!"
    //             })
    //         }
    //     })
    // },
    // getCandidates: async (req, res) => {
    //     const { electionId } = req.body;
    //     candidate.findAll({
    //         where: {
    //             electionId: electionId
    //         }
    //     })
    //     .then(rawCandidates => {
    //         if (rawCandidates.length === 0) {
    //             res.status(404).json({
    //                 message: 'Not found'
    //             })
    //         } else {
    //             const candidates = rawCandidates.map(rawCandidate => rawCandidate.dataValues)
    //             const candidatesData = candidates.map(candidate => {
    //                 delete candidate.updatedAt;
    //                 delete candidate.createdAt;
    //                 return candidate
    //             })
    //             res.status(200).json({
    //                 candidatesData
    //             })
    //         }
    //     })
    //     .catch(err => {
    //         if (err) {
    //             res.status(500).json({
    //                 message: "Internal server error!"
    //             })
    //         }
    //     })
    // },
    deleteComment: async (req, res) => {
        const { userId } = req.cookies;
        if ( userId === req.user.userId ) {
            const { commentId } = req.params;
            const deletedComment = await opinion.findOne({
                where: {
                    id: commentId
                }
            })
            if (deletedComment) {
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
                    message: 'commentId is not correct'
                })
            }
        } else {
            res.status(401).json({
                message: 'Invalid user'
            })
        }
    },
    updateComment: async (req, res) => {
        const { userId } = req.cookies;
        const { newComment, newElectionName, newCandidateName } = req.body;
        if ( userId === req.user.userId && newComment && newElectionName && newCandidateName ) {
            const { commentId } = req.params;
            const updatedComment = await opinion.findOne({
                where: {
                    id: commentId
                }
            })
            if (updatedComment) {
                await opinion.update({
                    comment: newComment,
                    electionName: newElectionName,
                    candidateName: newCandidateName
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
                    message: 'commentId is not correct'
                })
            }
        } else {
            res.status(401).json({
                message: 'Invalid user'
            })
        }
    }
}