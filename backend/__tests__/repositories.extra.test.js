const perguntasRepo = require("../repositories/perguntasRepository");
const usuarioRepo = require("../repositories/usuarioRepository");
const db = require("../db/db");

jest.mock("../db/db");

describe("PerguntasRepository update/remove branches", () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  test("update retorna null quando pergunta não existe", async () => {
    jest.spyOn(perguntasRepo, "getById").mockResolvedValue(null);
    const res = await perguntasRepo.update(1, { pergunta: "x" });
    expect(res).toBeNull();
    perguntasRepo.getById.mockRestore();
  });

  test("update aplica valores e retorna Pergunta quando existe", async () => {
    const fake = {
      id: 1,
      categoria: "c",
      pontuacao: 10,
      pergunta: "p",
      resposta_correta: "r",
      respostas_incorretas: "[]",
    };
    jest.spyOn(perguntasRepo, "getById").mockResolvedValue(fake);
    db.query.mockResolvedValue({ rows: [fake] });
    const res = await perguntasRepo.update(1, { categoria: "new" });
    expect(res).toBeTruthy();
    perguntasRepo.getById.mockRestore();
  });
});

describe("UsuarioRepository branches", () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  test("getByEmail retorna row quando existe", async () => {
    db.query.mockResolvedValue({ rows: [{ email: "a@a" }] });
    const r = await usuarioRepo.getByEmail("a@a");
    expect(r).toEqual({ email: "a@a" });
  });

  test("incrementar/resetar/bloquear chama db.query", async () => {
    db.query.mockResolvedValue({ rows: [] });
    await usuarioRepo.incrementarTentativas("a@a");
    await usuarioRepo.resetarTentativas("a@a");
    await usuarioRepo.bloquearUsuario("a@a", 5);
    expect(db.query).toHaveBeenCalled();
  });
});
