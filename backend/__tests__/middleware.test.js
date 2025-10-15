const authMiddleware = require("../middleware/authMiddleware");
const ValidateUsuario = require("../middleware/validateUsuario");
const ErroPerguntaMiddleware = require("../middleware/validadePerguntaMiddleware");

describe("Middleware", () => {
  test("authMiddleware retorna 401 quando não há token", () => {
    const req = { headers: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("ValidateUsuario.validateCreate rejeita campos faltando", () => {
    const req = { body: { nome: "Ana" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    ValidateUsuario.validateCreate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("ErroPerguntaMiddleware validarDificuldade rejeita dificuldade inválida", () => {
    const req = { body: { dificuldade: "MuitoFacil" } };
    const res = {};
    const next = jest.fn();
    ErroPerguntaMiddleware.validarDificuldade(req, res, next);
    expect(next).toHaveBeenCalled();
    const callArg = next.mock.calls[0][0];
    expect(callArg).toBeInstanceOf(Error);
  });
});
