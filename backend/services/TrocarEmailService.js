const OtpService = require('./otpService');
const UsuarioService = require('./usuarioService')


class TrocarEmailService {
    async solicitarTrocaEmail(novoEmail, id) {
        try {
            const emailAtual = await UsuarioService.getById(novoEmail)
            if (emailAtual) {
                throw new Error("E-mail já esta em uso")
            }
            const usuario = await UsuarioService.getById(id);
            if (!usuario) {
                throw new Error("Usuario inxistente");
            }
            const emailPendente = await UsuarioService.setEmailPendente(novoEmail)
            if (!emailPendente) {
                throw new Error("erro no email pendente")
            }
            const otp = await UsuarioService.solicitarOtp(emailPendente)
                return {
                    message: "Codigo de verificação enviado para o seu email",
                    emailPendete: emailPendente,
                    otp
                }
            
        } catch (error) {
            console.error("Erro ao solicitar troca de email", error);
            throw error;
        }
    }
}


module.exports = new TrocarEmailService()