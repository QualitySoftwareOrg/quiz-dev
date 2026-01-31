jest.mock("../repositories/otpRepository");
jest.mock("../repositories/usuarioRepository");
jest.mock("../services/usuarioService");

const otpRepo = require("../repositories/otpRepository");
const usuarioService = require("../services/usuarioService");
const otpService = require("../services/otpService");

describe("OtpService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("verificarOtp lança 401 quando não existe registro", async () => {
    otpRepo.findByEmail = jest.fn().mockResolvedValue(undefined);
    await expect(otpService.verificarOtp("x@x", "1234")).rejects.toMatchObject({
      status: 401,
    });
  });

  test("verificarOtp retorna token e usuario quando ok", async () => {
    otpRepo.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: "b@b", otp: "2222" });
    otpRepo.deleteByEmail = jest.fn().mockResolvedValue();
    usuarioService.create = jest.fn().mockResolvedValue({
      id: 1,
      email: "b@b",
      nome: "B",
    });

    const res = await otpService.verificarOtp(
      "b@b",
      "2222",
      "B",
      "Teste",
      "2000-01-01",
      "senha"
    );
    expect(res).toHaveProperty("token");
    expect(res).toHaveProperty("usuario");
  });
});
