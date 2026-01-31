const sendOtpEmail = require('./emailService');
const OtpRepository = require('../repositories/otpRepository');
const UsuarioRepository = require('../repositories/usuarioRepository');
const AuthService = require('./authService');
const UsuarioService = require('./usuarioService');

class OtpService {
    async solicitarOtp(email) {
        console.log('Solicitando OTP para:', email);

        // Verifica se o usuario existe
        const usuarioExistente = await UsuarioRepository.getByEmail(email);
        if (usuarioExistente) {
            throw {
                status: 409,
                message: 'Usuario ja cadastrado. Faca login ou recupere sua senha.'
            };
        }

        // Gera codigo OTP (6 digitos)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const ttlMinutesRaw = parseInt(process.env.OTP_TTL_MINUTES || '10', 10);
        const ttlMinutes = Number.isFinite(ttlMinutesRaw) && ttlMinutesRaw > 0 ? ttlMinutesRaw : 10;
        const debugOtp = process.env.OTP_DEBUG === 'true';
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        if (debugOtp) {
            console.log('Codigo OTP gerado:', otpCode);
        }

        // Salva OTP no banco com expiracao
        await OtpRepository.createOrUpdate(email, otpCode, ttlMinutes);

        // Envio de email (pula no modo debug ou quando credenciais nao estao configuradas)
        if (debugOtp) {
            console.log('OTP_DEBUG ativo: envio de email foi ignorado.');
        } else if (!emailUser || !emailPass) {
            throw { status: 500, message: 'Email nao configurado no servidor' };
        } else {
            await sendOtpEmail(email, otpCode);
        }

        const response = {
            success: true,
            message: 'OTP enviado com sucesso'
        };
        if (debugOtp) {
            response.otp = otpCode;
        }
        return response;
    }

    async verificarOtp(email, otp, nome, sobrenome, data_nascimento, password) {
        const otpValido = await OtpRepository.findByEmail(email, otp);
        if (!otpValido) {
            throw { status: 401, message: 'OTP invalido ou expirado' };
        }

        const dados = { nome, sobrenome, data_nascimento, email, password };
        const novoUsuario = await UsuarioService.create(dados);

        // Gera JWT
        const token = AuthService.genereteToken({
            id: novoUsuario.id,
            email: novoUsuario.email,
            authMethod: 'otp'
        }, '30m');

        // Remove OTP apos uso
        await OtpRepository.deleteByEmail(email);

        return { message: 'OTP verificada com sucesso', token, usuario: novoUsuario };
    }
}

module.exports = new OtpService();
