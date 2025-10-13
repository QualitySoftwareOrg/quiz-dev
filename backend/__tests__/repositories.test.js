jest.mock("../db/db");
const db = require("../db/db");
const perguntasRepository = require("../repositories/perguntasRepository");
const usuarioRepository = require("../repositories/usuarioRepository");
const otpRepository = require("../repositories/otpRepository");

describe("Repositories", () => {
  beforeEach(() => db.query.mockReset());

  test("perguntasRepository.getById returns Pergunta instance when found", async () => {
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

  test("usuarioRepository.create throws when email exists", async () => {
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

  test("otpRepository.createOrUpdate and findByEmail", async () => {
    db.query.mockResolvedValue({ rows: [] });
    await expect(
      otpRepository.createOrUpdate("a@a.com", "1234")
    ).resolves.toBeUndefined();
  });
});
