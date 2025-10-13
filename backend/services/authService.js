const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        this.tokenExpiration = '1h';
    }

    generateToken(payload, expiresIn = this.tokenExpiration) {
        return jwt.sign(payload, this.jwtSecret, { expiresIn });
    }

    verifyToken(token) {
        return jwt.verify(token, this.jwtSecret);
    }


}

module.exports = new AuthService();