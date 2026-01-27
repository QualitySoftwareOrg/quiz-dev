describe("PerguntasController", () => {
  let req, res, next;
  beforeEach(() => {
    req = { params: {}, query: {}, body: {} };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    next = jest.fn();
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("getPerguntas retorna lista", async () => {
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = {
      getPerguntas: async () => [{ id: 1 }],
    };
    await perguntasController.getPerguntas(req, res, next);
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test("getPerguntaById retorna 404 quando não encontrada", async () => {
    req.params.id = 9;
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = {
      getPerguntaById: async () => null,
    };
    await perguntasController.getPerguntaById(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("getPerguntaById sucesso", async () => {
    req.params.id = 2;
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = {
      getPerguntaById: async () => ({ id: 2 }),
    };
    await perguntasController.getPerguntaById(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ id: 2 });
  });

  test("getPerguntasByCategoria retorna 400 quando categoria ausente", async () => {
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    await perguntasController.getPerguntasByCategoria(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("getPerguntasByCategoria retorna 404 quando sem resultados", async () => {
    req.query.categoria = "x";
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = {
      getPerguntasByCategoria: async () => [],
    };
    await perguntasController.getPerguntasByCategoria(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("createPergunta retorna 201", async () => {
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = {
      createPergunta: async () => ({ id: 3 }),
    };
    await perguntasController.createPergunta(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 3 });
  });

  test("updatePergunta 404 quando não existe", async () => {
    req.params.id = 5;
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = { updatePergunta: async () => null };
    await perguntasController.updatePergunta(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("removePergunta 404 quando não existe", async () => {
    req.params.id = 6;
    let perguntasController;
    jest.isolateModules(() => {
      perguntasController = require("../controllers/perguntasController");
    });
    perguntasController.perguntasService = { removePergunta: async () => null };
    await perguntasController.removePergunta(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
