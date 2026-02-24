const { sendError, createError, normalizeError } = require("../utils/errorResponse");

describe("errorResponse utils", () => {
  test("sendError retorna payload com code e message", () => {
    const res = { status: jest.fn(() => res), json: jest.fn() };
    sendError(res, 400, "TEST_CODE", "Mensagem");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ code: "TEST_CODE", message: "Mensagem" });
  });

  test("sendError inclui details quando informado", () => {
    const res = { status: jest.fn(() => res), json: jest.fn() };
    sendError(res, 429, "RATE_LIMITED", "Limite", { retry_after: 10 });
    expect(res.json).toHaveBeenCalledWith({
      code: "RATE_LIMITED",
      message: "Limite",
      details: { retry_after: 10 },
    });
  });

  test("createError cria objeto padrao", () => {
    const err = createError(401, "INVALID", "Falha", { foo: "bar" });
    expect(err).toEqual({
      status: 401,
      code: "INVALID",
      message: "Falha",
      details: { foo: "bar" },
    });
  });

  test("normalizeError usa fallback quando faltam campos", () => {
    const fallback = { status: 500, code: "FALLBACK", message: "Erro" };
    const result = normalizeError({}, fallback);
    expect(result).toEqual({
      status: 500,
      code: "FALLBACK",
      message: "Erro",
      details: undefined,
    });
  });
});
