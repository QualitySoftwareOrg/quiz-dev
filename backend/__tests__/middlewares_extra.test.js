const authMiddleware = require("../middleware/authMiddleware");
const ErroHandle = require("../middleware/erroMiddleware");
const jwt = require("jsonwebtoken");

describe("Middlewares extras", () => {
  test("authMiddleware permite token válido", () => {
    const token = jwt.sign({ id: 1 }, "test-jwt-secret");
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("authMiddleware retorna 401 quando token ausente", () => {
    const req = { headers: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      code: "TOKEN_MISSING",
      message: "Token não fornecido",
    });
  });

  test("authMiddleware retorna 403 quando token inválido", () => {
    const req = { headers: { authorization: "Bearer invalido" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: "TOKEN_INVALID",
      message: "Token inválido",
    });
  });

  test("ErroHandle.handle responde 500", () => {
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    ErroHandle.handle(new Error("boom"), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      code: "INTERNAL_SERVER_ERROR",
      message: "boom",
    });
  });
});
