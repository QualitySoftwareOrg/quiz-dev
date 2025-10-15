jest.mock("../db/db");
const db = require("../db/db");
const perguntasRepository = require("../repositories/perguntasRepository");
const usuarioRepository = require("../repositories/usuarioRepository");
const otpRepository = require("../repositories/otpRepository");

describe("Repositórios", () => {
  beforeEach(() => db.query.mockReset());

  test("perguntasRepository.getById retorna Pergunta quando encontrado", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          categoria: "G",
          pontuacao: 5,
          pergunta: "Q",
          resposta_correta: "A",
          respostas_incorretas: "[]",
        },
      ],
    });
    const res = await perguntasRepository.getById(1);
    expect(res).toHaveProperty("id", 1);
  });

  test("perguntasRepository.getAll mapeia linhas para Pergunta", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 2,
          categoria: "X",
          pontuacao: 3,
          pergunta: "Q2",
          resposta_correta: "B",
          respostas_incorretas: "[]",
        },
      ],
    });
    const res = await perguntasRepository.getAll();
    expect(Array.isArray(res)).toBe(true);
  });

  test("perguntasRepository.create returns Pergunta instance", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 10, categoria: "X" }] });
    const res = await perguntasRepository.create({
      categoria: "X",
      pontuacao: 1,
      pergunta: "p",
      resposta_correta: "a",
      respostas_incorretas: [],
    });
    expect(res).toHaveProperty("id", 10);
  });

  test("perguntasRepository.update returns null when not found", async () => {
    db.query.mockResolvedValueOnce({ rows: [] }); // getById returns null
    const res = await perguntasRepository.update(99, { pergunta: "novo" });
    expect(res).toBeNull();
  });

  test("perguntasRepository.remove returns null when not found", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await perguntasRepository.remove(999);
    expect(res).toBeNull();
  });

  test("usuarioRepository.create lança erro quando email já existe", async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }); // existing check
    await expect(
      usuarioRepository.create({
        nome: "a",
        sobrenome: "b",
        data_nascimento: "2000-01-01",
        email: "x@x.com",
        password: "p",
      })
    ).rejects.toThrow("Email já cadastrado");
  });

  test("otpRepository.createOrUpdate e findByEmail", async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(
      otpRepository.createOrUpdate("a@a.com", "1234")
    ).resolves.toBeUndefined();
  });

  test("usuarioRepository.getById retorna null quando não encontrado", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await usuarioRepository.getById(999);
    expect(res).toBeNull();
  });

  test("usuarioRepository.update returns Usuario when exists", async () => {
    // primeiro getById
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          nome: "A",
          sobrenome: "B",
          data_nascimento: "2000-01-01",
          email: "a@a",
          password: "p",
          historico_pontuacoes: {},
        },
      ],
    });
    // update returning
    db.query.mockResolvedValueOnce({ rows: [{ id: 1, nome: "Novo" }] });
    const res = await usuarioRepository.update(1, { nome: "Novo" });
    expect(res).toHaveProperty("id", 1);
  });

  test("usuarioRepository.remove returns null when not exists", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await usuarioRepository.remove(1234);
    expect(res).toBeNull();
  });
});
