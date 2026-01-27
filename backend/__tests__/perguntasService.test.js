const PerguntasService = require("../services/perguntasService");

jest.mock("../repositories/perguntasRepository");
const perguntasRepository = require("../repositories/perguntasRepository");

describe("PerguntasService", () => {
  let service;
  beforeEach(() => {
    service = new PerguntasService();
    jest.clearAllMocks();
  });

  test("getPerguntas deve retornar lista", async () => {
    perguntasRepository.getAll.mockResolvedValue([{ id: 1 }]);
    const res = await service.getPerguntas();
    expect(res).toEqual([{ id: 1 }]);
    expect(perguntasRepository.getAll).toHaveBeenCalled();
  });

  test("getPerguntaById deve retornar item", async () => {
    perguntasRepository.getById.mockResolvedValue({ id: 2 });
    const res = await service.getPerguntaById(2);
    expect(res).toEqual({ id: 2 });
    expect(perguntasRepository.getById).toHaveBeenCalledWith(2);
  });

  test("getPerguntasByCategoria deve delegar", async () => {
    perguntasRepository.getByCategoria.mockResolvedValue([{ cat: "A" }]);
    const res = await service.getPerguntasByCategoria("A");
    expect(res).toEqual([{ cat: "A" }]);
  });

  test("createPergunta deve retornar criado", async () => {
    perguntasRepository.create.mockResolvedValue({ id: 3 });
    const res = await service.createPergunta({ pergunta: "x" });
    expect(res).toEqual({ id: 3 });
  });

  test("updatePergunta deve chamar update", async () => {
    perguntasRepository.update.mockResolvedValue({ id: 4 });
    const res = await service.updatePergunta(4, { pergunta: "y" });
    expect(res).toEqual({ id: 4 });
  });

  test("removePergunta deve chamar remove", async () => {
    perguntasRepository.remove.mockResolvedValue(true);
    const res = await service.removePergunta(5);
    expect(res).toEqual(true);
  });

  test("repositório lança erro é repassado", async () => {
    perguntasRepository.getAll.mockRejectedValue(new Error("boom"));
    await expect(service.getPerguntas()).rejects.toThrow("boom");
  });
});
