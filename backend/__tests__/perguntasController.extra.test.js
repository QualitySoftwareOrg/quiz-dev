const perguntasController = require("../controllers/perguntasController");

describe("perguntasController extra", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getPerguntaById retorna 200 quando existe", async () => {
    perguntasController.perguntasService = {
      getPerguntaById: jest.fn().mockResolvedValue({ id: 1 }),
    };
    const req = { params: { id: 1 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.getPerguntaById(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ id: 1 });
  });

  test("getPerguntasByCategoria retorna 200 quando ha resultados", async () => {
    perguntasController.perguntasService = {
      getPerguntasByCategoria: jest.fn().mockResolvedValue([{ id: 2 }]),
    };
    const req = { query: { categoria: "x" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.getPerguntasByCategoria(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith([{ id: 2 }]);
  });

  test("updatePergunta retorna 200 quando atualizado", async () => {
    perguntasController.perguntasService = {
      updatePergunta: jest.fn().mockResolvedValue({ id: 3 }),
    };
    const req = { params: { id: 3 }, body: { pergunta: "x" } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.updatePergunta(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ id: 3 });
  });

  test("removePergunta retorna 200 quando removido", async () => {
    perguntasController.perguntasService = {
      removePergunta: jest.fn().mockResolvedValue({ id: 4 }),
    };
    const req = { params: { id: 4 } };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await perguntasController.removePergunta(req, res, jest.fn());
    expect(res.json).toHaveBeenCalledWith({ id: 4 });
  });
});
