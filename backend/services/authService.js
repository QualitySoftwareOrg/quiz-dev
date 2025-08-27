const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;

class AuthService {

    static generateToken(payload, expiresIn = '1h') {
        return jwt.sign(payload, JWT_SECRET, { expiresIn });
    }

    verifyToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }


}

module.exports = AuthService;