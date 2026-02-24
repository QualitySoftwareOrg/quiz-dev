
const usuarioService = require('../services/usuarioService');
const otpService = require('../services/otpService');
const authService = require('../services/authService');
const { sendError, normalizeError } = require('../utils/errorResponse');

const handleError = (res, error, fallback) => {
    const { status, code, message, details } = normalizeError(error, fallback);
    return sendError(res, status, code, message, details);
};

class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await usuarioService.getAll();
            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuarios', error);
            return handleError(res, error, {
                status: 500,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro ao buscar usuarios',
            });
        }
    }

    async getById (req, res) {
        try {
            const { id } = req.params;
            const usuarios = await usuarioService.getById(id);
            
            if (!usuarios) {
                return sendError(res, 404, 'USER_NOT_FOUND', 'Usuario não encontrado');
            }

            res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao buscar usuario', error);
            return handleError(res, error, {
                status: 500,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Erro ao buscar usuario',
            });
        }
    }

    async create(req, res) {
        try {
            const usuario = req.body;
            const usuarios = await usuarioService.create(usuario);
            const token = authService.genereteToken(
                { id: usuarios.id, email: usuarios.email, nome: usuarios.nome, role: usuarios.role || 'user' },
                '1h'
            );
            return res.status(201).json({message: 'Usuario criado com sucesso',token , usuario: usuarios});
        } catch (error) {
            if (error.message === 'Email já cadastrado') {
                return sendError(res, 409, 'EMAIL_IN_USE', 'Email já cadastrado');
            }
            console.error('Erro ao criar usuario', error);
            return handleError(res, error, {
                status: 400,
                code: 'USER_CREATE_FAILED',
                message: 'Erro ao criar usuario',
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const usuario  = req.body;
            const usuarioAtualizado = await usuarioService.update(id, usuario);
            if (!usuarioAtualizado) {
                return sendError(res, 404, 'USER_NOT_FOUND', 'Usuario não encontrado');
            }
            return res.status(200).json({message: 'Usuario atualizado com sucesso', usuario: usuarioAtualizado })
        } catch (error) {
            console.error('Erro ao atualizar usuario', error);

            if (error.code === 'PASSWORD_REUSE') {
                return sendError(res, 422, 'PASSWORD_REUSE', error.message);
            }
            return handleError(res, error, {
                status: 400,
                code: 'USER_UPDATE_FAILED',
                message: 'Erro ao atualizar usuario',
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const usuarioDeletado = await usuarioService.delete(id);

            if (!usuarioDeletado) {
                return sendError(res, 404, 'USER_NOT_FOUND', 'Usuario não encontrado para a remoção.');
            } 

            return res.status(200).json({ message: 'Usuario deletado com sucesso', usuario: usuarioDeletado });
        } catch (error) {
            console.error('Erro ao removerusuario: ', error);
            return handleError(res, error, {
                status: 400,
                code: 'USER_DELETE_FAILED',
                message: 'Erro ao remover usuario',
            });
        }
    }

    async solicitarOtp(req, res) {
        try {
            const { email } = req.body;                
                if (!email) {
                    return sendError(res, 400, 'VALIDATION_ERROR', 'Email é obrigatorio');
                }
                const response = await otpService.solicitarOtp(email);
                res.status(200).json(response)
            } catch (error) {
                return handleError(res, error, {
                    status: 400,
                    code: 'OTP_REQUEST_FAILED',
                    message: 'Erro ao solicitar OTP',
                });
            }
    }
    async verificarOtp(req, res) {
        try {
            const { email, otp, nome, sobrenome, data_nascimento, password } = req.body;
            const result = await otpService.verificarOtp(email, otp, nome, sobrenome, data_nascimento, password);
            return res.status(200).json(result)
        } catch (error) {
            return handleError(res, error, {
                status: 400,
                code: 'OTP_VERIFY_FAILED',
                message: 'Erro ao verificar OTP',
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return sendError(res, 400, 'VALIDATION_ERROR', 'Email e password são obrigatorios');
            }
            const result = await usuarioService.login( email, password );
            res.status(200).json(result);

        } catch (error) {
            return handleError(res, error, {
                status: 500,
                code: 'LOGIN_FAILED',
                message: 'Erro ao efetuar login',
            });
        }
    }

    async registrarPontuacao(req, res) {
        try {
            const { id } = req.params;
            const { categoria, acertos, total } = req.body;

            if (!categoria || typeof acertos !== 'number' || typeof total !== 'number') {
                return sendError(res, 400, 'VALIDATION_ERROR', 'Categoria, acertos e total sao obrigatorios');
            }

            if (req.user && String(req.user.id) !== String(id)) {
                return sendError(res, 403, 'FORBIDDEN', 'Acesso negado');
            }

            const usuarioAtualizado = await usuarioService.registrarPontuacao(
                id,
                categoria,
                acertos,
                total
            );

            if (!usuarioAtualizado) {
                return sendError(res, 404, 'USER_NOT_FOUND', 'Usuario nao encontrado');
            }

            return res.status(200).json({
                message: 'Pontuacao registrada com sucesso',
                usuario: usuarioAtualizado,
            });
        } catch (error) {
            return handleError(res, error, {
                status: 500,
                code: 'SCORE_REGISTER_FAILED',
                message: 'Erro ao registrar pontuacao',
            });
        }
    }
}

module.exports = new UsuarioController();
