module.exports = {
    hasCookies: async (req, res, next) => {
        const { accessToken, userId } = req.cookies
        if (accessToken === req.user.accessToken && userId === req.user.userId ) {
            next()
        } else {
            res.status(401).json({
                message: 'Invalid user'
            })
        }
    }
}