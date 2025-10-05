const sendOtpEmail  = require('./emailService');
const OtpRepository = require('../repositories/otpRepository');
const UsuarioRepository = require('../repositories/usuarioRepository');
const AuthService = require('./authService');
const UsuarioService = require('./usuarioService')

class OtpService {

    
    async solicitarOtp(email) {
        console.log('📧 Solicitando OTP para:', email);
        
        // Verifica se o usuário existe
        const usuarioExistente = await UsuarioRepository.getByEmail(email);
            if (usuarioExistente) {
            throw { 
                status: 409, 
                message: 'Usuário já cadastrado. Faça login ou recupere sua senha.' 
            };
        }      
        
        // Gera código OTP (6 dígitos)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('🔢 Código OTP gerado:', otpCode);

        // Salva OTP no banco com expiração (ex: 10 minutos)
        await OtpRepository.createOrUpdate(email, otpCode, 10);

        // TODO: Implementar envio de email aqui
        await sendOtpEmail(email, otpCode);
        
        console.log('📤 OTP gerado (implementar envio de email):', otpCode);
        
        return { 
            success: true, 
            message: 'OTP enviado com sucesso',
            otp: otpCode // Em desenvolvimento, pode retornar o código
        };
    }

    async verificarOtp(email, otp, nome, sobrenome, data_nascimento, password) {
        
        const otpValido = await OtpRepository.findByEmail(email, otp);
        if (!otpValido) {
            throw { status: 401, message: 'OTP inválido ou expirado' };
        }

        const dados = { nome, sobrenome, data_nascimento, email, password};
        const novoUsuario = await UsuarioService.create(dados)
        // Gera JWT
        const token = AuthService.genereteToken({
            id: novoUsuario.id,
            email: novoUsuario.email,
            authMethod: 'otp'
        }, '30m');

        // Remove ou invalida OTP após uso
        await OtpRepository.deleteByEmail(email);

        return { message: 'OTP verificada com sucesso', token, novoUsuario };
        }
    };


module.exports = new OtpService();