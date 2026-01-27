const repo = require("../repositories/perguntasRepository");
const db = require("../db/db");

describe("perguntasRepository", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getAll mapeia rows para Pergunta", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 1, pergunta: "q" }] });
    const res = await repo.getAll();
    expect(res.length).toBe(1);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM pergunta");
  });

  test("getById retorna null quando nao existe", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await repo.getById(99);
    expect(res).toBeNull();
  });

  test("getById retorna pergunta quando existe", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 2, pergunta: "ok" }] });
    const res = await repo.getById(2);
    expect(res).toBeDefined();
    expect(res.id).toBe(2);
  });

  test("getByCategoria mapeia resultados", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 3, categoria: "x" }] });
    const res = await repo.getByCategoria("x");
    expect(res.length).toBe(1);
  });

  test("create salva e retorna pergunta", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 4, pergunta: "new" }] });
    const res = await repo.create({
      categoria: "x",
      pontuacao: 1,
      pergunta: "new",
      resposta_correta: "a",
      respostas_incorretas: ["b"],
    });
    expect(res).toBeDefined();
    expect(res.id).toBe(4);
  });

  test("update retorna null quando nao existe", async () => {
    repo.getById = jest.fn().mockResolvedValue(null);
    const res = await repo.update(99, { pergunta: "x" });
    expect(res).toBeNull();
  });

  test("update retorna pergunta atualizada", async () => {
    repo.getById = jest
      .fn()
      .mockResolvedValue({
        id: 5,
        pergunta: "old",
        respostas_incorretas: "[]",
      });
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 5, pergunta: "new" }] });
    const res = await repo.update(5, { pergunta: "new" });
    expect(res).toBeDefined();
    expect(res.id).toBe(5);
  });

  test("remove retorna null quando nao existe", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await repo.remove(99);
    expect(res).toBeNull();
  });

  test("remove retorna pergunta quando deletada", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ id: 6, pergunta: "d" }] });
    const res = await repo.remove(6);
    expect(res).toBeDefined();
    expect(res.id).toBe(6);
  });
});
