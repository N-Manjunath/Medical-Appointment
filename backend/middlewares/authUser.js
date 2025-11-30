import jwt from 'jsonwebtoken'

// user authentication middleware
const authUser = async (req, res, next) => {
    let token = req.headers.token;
    // Also support standard Authorization: Bearer <token>
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!req.body) req.body = {}
        req.body.userId = token_decode.id
        next()
    } catch (error) {
           console.log('the error is showing here ?')
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser
