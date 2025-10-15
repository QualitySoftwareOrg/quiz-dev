const ErroPerguntaMiddleware = require("../middleware/validadePerguntaMiddleware");

describe("ErroPerguntaMiddleware.validarDificuldade", () => {
  test("chama next quando dificuldade valida", () => {
    const req = { body: { dificuldade: "Facil" } };
    const res = {};
    const next = jest.fn();
    ErroPerguntaMiddleware.validarDificuldade(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test("dispara erro quando dificuldade invalida", () => {
    const req = { body: { dificuldade: "Impossible" } };
    const res = {};
    const next = jest.fn();
    ErroPerguntaMiddleware.validarDificuldade(req, res, next);
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(400);
  });
});
