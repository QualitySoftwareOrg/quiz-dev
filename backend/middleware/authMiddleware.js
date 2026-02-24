const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/errorResponse');

const secret = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return sendError(res, 401, 'TOKEN_MISSING', 'Token não fornecido');

    jwt.verify(token, secret, (err, user) => {
        if (err) return sendError(res, 403, 'TOKEN_INVALID', 'Token inválido');
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
