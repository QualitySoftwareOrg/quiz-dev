class ValidateUsuario {
    static validateCreate (req, res, next) {
        const { nome, sobrenome, email, password, data_nascimento  } = req.body;

        if (!nome || !sobrenome || !email || !password || !data_nascimento) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios" });
        }

        // Regex: permite apenas letras (com acento) e espaços
        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (!regex.test(nome)) {
            return res.status(400).json({ message: "O nome deve conter apenas letras." });
        }
        if (!regex.test(sobrenome)) {
            return res.status(400).json({ message: "O sobrenome deve conter apenas letras." });
        }
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(data_nascimento)) {
            const [dia, mes, ano] = data_nascimento.split('/');
            req.body.data_nascimento = `${ano}-${mes}-${dia}`;
        }
        
        next();
    }

    static validateUpdate (req, res, next) {
        const { nome, sobrenome, email, password, historico_pontuacoes } = req.body;

        if (!nome && !sobrenome && !email && !password && !historico_pontuacoes) {
            return res.status(400).json({ message: "Envie pelo menos um campo para atualizar" });
        }

        const regex = /^[A-Za-zÀ-ÿ\s]+$/;
        if (nome && !regex.test(nome)) {
            return res.status(400).json({ message: "O nome deve conter apenas letras." });
        }
        if (sobrenome && !regex.test(sobrenome)) {
            return res.status(400).json({ message: "O sobrenome deve conter apenas letras." });
        }
        
        next();
    }
}

module.exports = ValidateUsuario;