const perguntasController = require("../controllers/perguntasController");
const usuarioController = require("../controllers/usuarioController");

describe("Controllers", () => {
  beforeEach(() => jest.clearAllMocks());

  test("PerguntaController.getPerguntas returns list", async () => {
    // inject mock service into controller instance
    perguntasController.perguntasService = {
      getPerguntas: jest.fn().mockResolvedValue([{ id: 1 }]),
    };
    const req = {};
    const res = { json: jest.fn() };
    await perguntasController.getPerguntas(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("UsuarioController.solicitarOtp requires email", async () => {
    const req = { body: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.solicitarOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("UsuarioController.verificarOtp success", async () => {
    // override otpService implementation in module cache
    const otpService = require("../services/otpService");
    otpService.verificarOtp = jest.fn().mockResolvedValue({ token: "t" });

    const req = { body: { email: "a@a.com", otp: "1" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.verificarOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
