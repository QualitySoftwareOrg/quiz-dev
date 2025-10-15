const usuarioController = require("../controllers/usuarioController");
const usuarioService = require("../services/usuarioService");
const otpService = require("../services/otpService");
const authService = require("../services/authService");

describe("UsuarioController extra tests", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getAll retorna lista e status 200", async () => {
    usuarioService.getAll = jest.fn().mockResolvedValue([{ id: 1 }]);
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("getAll trata erro e retorna 404", async () => {
    usuarioService.getAll = jest.fn().mockRejectedValue(new Error("fail"));
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getById retorna 200 quando encontrado", async () => {
    usuarioService.getById = jest.fn().mockResolvedValue({ id: 2 });
    const req = { params: { id: 2 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 2 });
  });

  test("getById retorna 404 quando nao encontrado", async () => {
    usuarioService.getById = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 99 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("create retorna 400 quando email ja cadastrado", async () => {
    // simulate service throwing Error('Email já cadastrado')
    usuarioService.create = jest
      .fn()
      .mockRejectedValue(new Error("Email já cadastrado"));
    // ensure token generator not required here, but mock anyway
    authService.genereteToken = jest.fn();

    const req = { body: { nome: "A", email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Email j\u00e1 cadastrado",
    });
  });

  test("create retorna 400 em erro generico", async () => {
    usuarioService.create = jest.fn().mockRejectedValue(new Error("boom"));
    const req = { body: { nome: "A", email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("delete retorna 404 quando nao encontrado", async () => {
    usuarioService.delete = jest.fn().mockResolvedValue(null);
    const req = { params: { id: 10 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("delete retorna 200 quando removido", async () => {
    usuarioService.delete = jest.fn().mockResolvedValue({ id: 10 });
    const req = { params: { id: 10 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("delete trata erro e retorna 400", async () => {
    usuarioService.delete = jest.fn().mockRejectedValue(new Error("boom"));
    const req = { params: { id: 11 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("solicitarOtp exige email e responde 400 quando otpservice falha", async () => {
    // case: missing email already covered in controllers.test.js; here test service failure
    otpService.solicitarOtp = jest.fn().mockRejectedValue(new Error("fail"));
    const req = { body: { email: "a@a.com" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.solicitarOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("solicitarOtp sucesso retorna 200", async () => {
    otpService.solicitarOtp = jest.fn().mockResolvedValue();
    const req = { body: { email: "b@b.com" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.solicitarOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("login valida campos obrigatorios", async () => {
    const req = { body: { email: "a@a.com" } }; // missing password
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("login retorna 200 quando sucesso", async () => {
    usuarioService.login = jest.fn().mockResolvedValue({ message: "ok" });
    const req = { body: { email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });

  test("login propaga erro vindo do service", async () => {
    usuarioService.login = jest
      .fn()
      .mockRejectedValue({ status: 401, message: "err" });
    const req = { body: { email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "err" });
  });

  test("login trata erro generico e retorna 500", async () => {
    usuarioService.login = jest.fn().mockRejectedValue(new Error("boom"));
    const req = { body: { email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("getById trata erro generico e retorna 404", async () => {
    usuarioService.getById = jest.fn().mockRejectedValue(new Error("boom"));
    const req = { params: { id: 5 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao buscar usuario " });
  });

  test("update retorna 200 quando atualizado", async () => {
    const updated = { id: 7, nome: "X" };
    usuarioService.update = jest.fn().mockResolvedValue(updated);
    const req = { params: { id: 7 }, body: { nome: "X" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario atualizado com sucesso",
      usuario: updated,
    });
  });

  test("update trata erro e retorna 400", async () => {
    usuarioService.update = jest.fn().mockRejectedValue(new Error("boom"));
    const req = { params: { id: 8 }, body: { nome: "Y" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("verificarOtp trata erro e retorna 400", async () => {
    otpService.verificarOtp = jest.fn().mockRejectedValue(new Error("nope"));
    const req = { body: { email: "c@c.com", otp: "1234" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.verificarOtp(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "nope" });
  });

  test("login trata erro sem mensagem e retorna 500 com mensagem padrao", async () => {
    // simulate rejection with empty object so error.message is undefined
    usuarioService.login = jest.fn().mockRejectedValue({});
    const req = { body: { email: "a@a.com", password: "p" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await usuarioController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Erro ao efetuar login" });
  });
});
