class ErroPerguntaMiddleware extends Error {
    constructor(message) {
        super(message);
        this.name = 'ErroPerguntaMiddleware';
        this.statusCode = 400; // Bad Request
        this.code = 'VALIDATION_ERROR';
    }

    static validarDificuldade(req, res, next) {
        const { dificuldade } = req.body;
        const permitidos = ["Facil", "Medio", "Dificil"];
        if (dificuldade && !permitidos.includes(dificuldade)) {
            return next(new ErroPerguntaMiddleware('Dificuldade deve ser "Facil", "Medio" ou "Dificil".'));
        }
        next();
    }
}

module.exports = ErroPerguntaMiddleware;
