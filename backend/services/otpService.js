const OtpRepository = require("../repositories/otpRepository");
const UsuarioRepository = require("../repositories/usuarioRepository");
const AuthService = require("./authService");

class OtpService {
  constructor() {
    this.otpRepository = OtpRepository; // repository is exported as instance
    this.usuarioRepository = UsuarioRepository;
    this.authService = AuthService;
  }

  async solicitarOtp(email, otp) {
    // helper: save or update otp
    return await this.otpRepository.createOrUpdate(email, otp);
  }

  async verificarOtp(email, codigoOtp) {
    const registro = await this.otpRepository.findByEmail(email);
    if (!registro || registro.otp !== String(codigoOtp)) {
      throw { status: 401, message: "OTP inválido ou expirado" };
    }

    // Busca o usuário no banco
    const usuario = await this.usuarioRepository.getByEmail(email);
    if (!usuario) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    // Gera JWT
    const token = this.authService.genereteToken(
      {
        id: usuario.id,
        email: usuario.email,
        authMethod: "otp",
      },
      "30m"
    );

    // Remove ou invalida OTP após uso
    await this.otpRepository.deleteByEmail(email);

    return { message: "OTP verificada com sucesso", token, usuario };
  }
}

module.exports = new OtpService();
