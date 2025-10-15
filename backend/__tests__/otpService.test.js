jest.mock("../repositories/otpRepository");
jest.mock("../repositories/usuarioRepository");

const otpRepo = require("../repositories/otpRepository");
const userRepo = require("../repositories/usuarioRepository");
const otpService = require("../services/otpService");

describe("OtpService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("verificarOtp lança 401 quando não existe registro", async () => {
    otpRepo.findByEmail = jest.fn().mockResolvedValue(undefined);
    await expect(otpService.verificarOtp("x@x", "1234")).rejects.toMatchObject({
      status: 401,
    });
  });

  test("verificarOtp lança 404 quando usuário não existe", async () => {
    otpRepo.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: "a@a", otp: "1111" });
    userRepo.getByEmail = jest.fn().mockResolvedValue(null);
    await expect(otpService.verificarOtp("a@a", "1111")).rejects.toMatchObject({
      status: 404,
    });
  });

  test("verificarOtp retorna token e usuário quando ok", async () => {
    otpRepo.findByEmail = jest
      .fn()
      .mockResolvedValue({ email: "b@b", otp: "2222" });
    userRepo.getByEmail = jest.fn().mockResolvedValue({ id: 1, email: "b@b" });
    otpRepo.deleteByEmail = jest.fn().mockResolvedValue();
    const res = await otpService.verificarOtp("b@b", "2222");
    expect(res).toHaveProperty("token");
    expect(res).toHaveProperty("usuario");
  });
});
