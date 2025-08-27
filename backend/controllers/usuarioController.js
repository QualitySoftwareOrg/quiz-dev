
const UsuarioService = require('../services/usuarioService');
const OtpService = require('../services/otpService');


class UsuarioController {

    async getAll(req, res) {
        try {
            const usuarios = await UsuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuarios', error);
            res.status(404).json({error: 'Erro ao buscar usuario '});
        }
    }

    async getById (req, res) {
        try {
            const { id } = req.params;
            const usuarios = await UsuarioService.getById(id);
            
            if (!usuarios) {
                return res.status(404).json({ error: 'Usuario não encontrado' });
            }

            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuario', error);
            res.status(404).json({ error: 'Erro ao buscar usuario '});
        }
    }

    async create(req, res) {
        try {
            const usuario = req.body;
            const usuarios = await UsuarioService.create(usuario);
            const token = jwt.sign(
                { id: usuarios.id, email: usuarios.email, nome: usuarios.nome },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            return res.status(201).json({message: 'Usuario criado com sucesso',token , usuario: usuarios});
        } catch (error) {
            if (error.message === 'Email já cadastrado') {
                return res.status(400).json({error: 'Email já cadastrado'});
            }
            console.error('Erro ao criar usuario', error);
            return res.status(400).json({error: 'Erro ao criar usuario'});
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const usuario  = req.body;
            const usuarioAtualizado = await UsuarioService.update(id, usuario);

            if (!usuarioAtualizado) {
                return res.status(404).json({ error: 'Usuario não encontrado' });
            }
            return res.status(200).json({message: 'Usuario atualizado com sucesso', usuario: usuarioAtualizado })
        } catch (error) {
            console.error('Erro ao atualizar usuario', error);
            return res.status(400).json({error: 'Erro ao atualizar usuario'});
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const usuarioDeletado = await UsuarioService.delete(id);

            if (!usuarioDeletado) {
                return res.status(404).json({message: 'Usuario não encontrado para a remoção.'})
            } 

            return res.status(200).json({ message: 'Usuario deletado com sucesso', usuario: usuarioDeletado });
        } catch (error) {
            console.error('Erro ao removerusuario: ', error);
            return res.status(400).json({error: 'Erro ao remover usuario'});
        }
    }

        async solicitarOtp(req, res) {
            try {
                const { email } = req.body;                
                    if (!email) {
                        return res.status(400).json ({error: 'Email é obrigatorio'})
                    }
                    await OtpService.solicitarOtp(email);
                res.status(200).json({ message: 'OTP enviada para o seu e-mail'})
            } catch (error) {
                res.status(400).json({ erro: error.message });
                console.error(error)
            }
        }
    async verificarOtp(req, res) {
        try {
            const {email, otp, nome, sobrenome, data_nascimento, password } = req.body;
            const result = await OtpService.verificarOtp(email, otp, nome, sobrenome, data_nascimento, password);
            return res.status(201).json( result )
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error: error.message})
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({message: 'Email e password são obrigatorios'});
            }
            const result = await UsuarioService.login( email, password );
            res.status(200).json(result);

        } catch (error) {
            console.log(error)
            res.status(error.status || 500).json({ message: error.message || 'Erro ao efetuar login'});
        }
    }
}

module.exports = new UsuarioController();