const perguntasController = require("../controllers/perguntasController");
const usuarioController = require("../controllers/usuarioController");
const usuarioService = require("../services/usuarioService");

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

  test("PerguntaController.getPerguntaById returns 404 when not found", async () => {
    perguntasController.perguntasService = {
      getPerguntaById: jest.fn().mockResolvedValue(null),
    };
    const req = { params: { id: 99 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.getPerguntaById(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("PerguntaController.createPergunta returns 201", async () => {
    perguntasController.perguntasService = {
      createPergunta: jest.fn().mockResolvedValue({ id: 5 }),
    };
    const req = { body: { pergunta: "x" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.createPergunta(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("UsuarioController.create returns 201 on success", async () => {
    usuarioService.create = jest
      .fn()
      .mockResolvedValue({ id: 1, email: "a@a.com", nome: "A" });
    const req = { body: { nome: "A", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("UsuarioController.update returns 404 when not found", async () => {
    usuarioService.update = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 10 }, body: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
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
