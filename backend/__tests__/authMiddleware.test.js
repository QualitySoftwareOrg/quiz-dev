const authenticateToken = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");

describe("authMiddleware", () => {
  test("retorna 401 quando token não fornecido", () => {
    const req = { headers: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("retorna 403 quando token inválido", () => {
    const req = { headers: { authorization: "Bearer badtoken" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    jest
      .spyOn(jwt, "verify")
      .mockImplementation((t, s, cb) => cb(new Error("inv")));
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    jwt.verify.mockRestore();
  });

  test("chama next quando token válido", () => {
    const req = { headers: { authorization: "Bearer good" } };
    const res = {};
    const next = jest.fn();
    jest
      .spyOn(jwt, "verify")
      .mockImplementation((t, s, cb) => cb(null, { id: 1 }));
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 1 });
    jwt.verify.mockRestore();
  });
});
