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

  test("ErroHandle.handle responde 500", () => {
    const req = {};
    const res = { status: jest.fn(() => res), json: jest.fn() };
    ErroHandle.handle(new Error("boom"), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
