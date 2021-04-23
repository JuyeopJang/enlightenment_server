module.exports = {
    logout: async (req, res) => {
        if (req.isAuthenticated() && req.cookies.accessToken === req.user.accessToken) {
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.clearCookie('photo');
            res.clearCookie('email');
            req.logout();
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
            // console.log(req.user)
            res.cookie('userId', req.user.userId, {
                expires: new Date(Date.now() + 24 * 3600000),
                sameSite: true 
            })
            res.cookie('accessToken', req.user.accessToken, {
                expires: new Date(Date.now() + 24 * 3600000), 
                sameSite: true    
            }),
            res.cookie('photo', req.user.photo, {
                expires: new Date(Date.now() + 24 * 3600000),
                sameSite: true 
            }),
            res.cookie('email', req.user.email, {
                expires: new Date(Date.now() + 24 * 3600000),
                sameSite: true 
            }),
            // 리다이렉트를 시키기때문에 쿠키로밖에 내려줄 수 없는 상황!
            // userId와 accessToken 이란 이름으로 2개의 쿠키를 만들어 내려줌
            // userId는 왜? 매거진을 쓰고 수정 삭제할때 보내야함!
            // 기한은 하루! 하루가 지나면 없어지고 클라는 쿠키가 없기때문에 로그아웃된 상태로 인식하겠지!
            res.status(302).redirect('http://localhost:3000')
        } else {
            res.status(401).json({
                message: 'Invalid User'
            })
        }
    }
}