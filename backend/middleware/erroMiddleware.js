const { sendError } = require('../utils/errorResponse');

class ErroHandle {
    static handle(err, req, res, next) {
        console.error(err);
        const status = err.status || err.statusCode || 500;
        const code = err.code || (status === 400 ? 'BAD_REQUEST' : 'INTERNAL_SERVER_ERROR');
        const message = err.message || 'Erro interno do servidor.';
        return sendError(res, status, code, message, err.details);
    }
}


module.exports = ErroHandle;
