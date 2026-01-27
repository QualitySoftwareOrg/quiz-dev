jest.mock("../db/db");
const db = require("../db/db");
const initDb = require("../db/dbInit");

describe("dbInit", () => {
  beforeEach(() => jest.clearAllMocks());

  test("cria tabelas quando não existem", async () => {
    // primeira chamada: verifica usuario -> retorna null
    db.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] })
      // criação retorna vazio
      .mockResolvedValueOnce({ rows: [] })
      // verifica pergunta -> null
      .mockResolvedValueOnce({ rows: [{ to_regclass: null }] })
      // criação pergunta
      .mockResolvedValueOnce({ rows: [] });

    await expect(initDb()).resolves.toBeUndefined();
    expect(db.query).toHaveBeenCalled();
  });

  test("não cria quando já existem", async () => {
    db.query
      .mockResolvedValueOnce({ rows: [{ to_regclass: "usuario" }] })
      .mockResolvedValueOnce({ rows: [{ to_regclass: "pergunta" }] });

    await expect(initDb()).resolves.toBeUndefined();
  });

  test("captura erro do db", async () => {
    db.query.mockRejectedValueOnce(new Error("boom"));
    await expect(initDb()).resolves.toBeUndefined();
  });
});
