const { requireAdmin, requireSelfOrAdmin } = require("../middleware/authorization");

describe("authorization middleware", () => {
  test("requireAdmin permite quando role é admin", () => {
    const req = { user: { role: "admin" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("requireAdmin bloqueia quando role não é admin", () => {
    const req = { user: { role: "user" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: "FORBIDDEN",
      message: "Acesso negado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("requireSelfOrAdmin permite quando user é o dono", () => {
    const req = { user: { id: 10, role: "user" }, params: { id: "10" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    requireSelfOrAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("requireSelfOrAdmin permite quando user é admin", () => {
    const req = { user: { id: 1, role: "admin" }, params: { id: "99" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    requireSelfOrAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("requireSelfOrAdmin bloqueia quando user não é dono", () => {
    const req = { user: { id: 1, role: "user" }, params: { id: "99" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    const next = jest.fn();
    requireSelfOrAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      code: "FORBIDDEN",
      message: "Acesso negado",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
