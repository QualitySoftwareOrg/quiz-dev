const jwt = require('jsonwebtoken');

class AuthService {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET;
        this.tokenExpiration = '1h';
    }

    genereteToken(payload, expiresIn = this.tokenExpiration) {
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET nao configurado');
        }
        return jwt.sign(payload, this.jwtSecret, { expiresIn });
    }

    generateToken(payload, expiresIn = this.tokenExpiration) {
        return this.genereteToken(payload, expiresIn);
    }

    verifyToken(token) {
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET nao configurado');
        }
        return jwt.verify(token, this.jwtSecret);
    }


}

module.exports = new AuthService();
