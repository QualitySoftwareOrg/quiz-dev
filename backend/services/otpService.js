const sendOtpEmail  = require('./emailService');
const OtpRepository = require('../repositories/otpRepository');
const UsuarioRepository = require('../repositories/usuarioRepository');
const AuthService = require('./authService');

class OtpService {
    cosntructor() {
        this.otpRepository = new OtpRepository();
        this.usuarioRepository = new UsuarioRepository();
        this.authService = new AuthService();
    }
    
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

    async verificarOtp(email) {
        const otpValido = await OtpRepository.findByEmail(email);
        if (!otpValido) {
            throw { message: 'OTP inválido ou expirado' };
        }
        // Busca o usuário no banco
        const usuario = await UsuarioRepository.getByEmail(email);
        if (!usuario) {
            throw { message: 'Usuário não encontrado' };
        }
        // Gera JWT
        const token = AuthService.genereteToken({
            id: usuario.id,
            email: usuario.email,
            authMethod: 'otp'
        }, '30m');
        // Remove ou invalida OTP após uso
        await OtpRepository.excluirOtp(email);
        return { message: 'OTP verificada com sucesso', token, usuario };
        }
    };


module.exports = new OtpService();