const User = require('../models/User');
const JWT = require('jsonwebtoken');
const { JWT_SECRETKEY } = require('../../config/jwt');

// Handle encode token using JWT
const encodedJWT = userid => {
    return JWT.sign(
        {
            iss: 'Quang Dat',
            sub: userid,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 3),
        },
        JWT_SECRETKEY,
    );
};

class AuthController {
    // [POST] /auth/signUp
    async signUp(req, res, next) {
        try {
            const user = new User(req.body);
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) return res.status(403).json({ error: 'Người dùng đã tồn tại' });
            user.save();
            const token = encodedJWT(user._id);
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async signIn(req, res, next) {
        try {
            const token = await encodedJWT(req.user._id);
            res.setHeader('Authorization', 'Bearer ' + token);
            return res.status(200).json({ message: 'Đăng nhập thành công' });
        } catch (error) {
            console.error(error);
        }
    }

    async secret(req, res, next) {
        try {
            return res.status(200).json({ message: 'Confirm token' });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = new AuthController();
