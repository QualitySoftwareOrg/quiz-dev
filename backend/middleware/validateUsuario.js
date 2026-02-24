const { sendError } = require('../utils/errorResponse');

const isValidIsoDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
};

class ValidateUsuario {
    static validateCreate (req, res, next) {
        const { nome, sobrenome, email, password, data_nascimento} = req.body;

        if (!nome || !sobrenome || !email || !password || !data_nascimento) {
            return sendError(res, 400, 'VALIDATION_ERROR', "Todos os campos sÃ£o obrigatÃ³rios");
        }
        const regex = /^[\p{L}\s]+$/u;
        if (nome && !regex.test(nome)) {
            return sendError(res, 400, 'VALIDATION_ERROR', "O nome deve conter apenas letras.");
        }
        if (sobrenome && !regex.test(sobrenome)) {
            return sendError(res, 400, 'VALIDATION_ERROR', "O sobrenome deve conter apenas letras.");
        }
        // ValidaÃ§Ã£o do formato DD/MM/AAAA e conversÃ£o para YYYY-MM-DD
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_nascimento)) {
            const [dia, mes, ano] = data_nascimento.split('/');
            req.body.data_nascimento = `${ano}-${mes}-${dia}`;
        }

        // ValidaÃ§Ã£o do formato final
        if (!isValidIsoDate(req.body.data_nascimento)) {
            return sendError(res, 400, 'VALIDATION_ERROR', "Data de nascimento invÃ¡lida. Use o formato DD/MM/AAAA ou AAAA-MM-DD.");
        }
        next();
    }

    static validateUpdate (req, res, next) {
        const { nome, sobrenome, email, password, historico_pontuacoes, data_nascimento } = req.body;

        if (!nome && !sobrenome && !email && !password && !historico_pontuacoes && !data_nascimento) {
            return sendError(res, 400, 'VALIDATION_ERROR', "Envie pelo menos um campo para atualizar");
        }

        const regex = /^[\p{L}\s]+$/u;
        if (nome && !regex.test(nome)) {
            return sendError(res, 400, 'VALIDATION_ERROR', "O nome deve conter apenas letras.");
        }
        if (sobrenome && !regex.test(sobrenome)) {
            return sendError(res, 400, 'VALIDATION_ERROR', "O sobrenome deve conter apenas letras.");
        }

        if (data_nascimento) {
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_nascimento)) {
                const [dia, mes, ano] = data_nascimento.split('/');
                req.body.data_nascimento = `${ano}-${mes}-${dia}`;
            }
            if (!isValidIsoDate(req.body.data_nascimento)) {
                return sendError(res, 400, 'VALIDATION_ERROR', "Data de nascimento invÃ¡lida. Use o formato DD/MM/AAAA ou AAAA-MM-DD.");
            }
        }
        
        next();
    }
}

module.exports = ValidateUsuario;
