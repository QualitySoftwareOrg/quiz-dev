const AuthService = require("../services/authService");
const PerguntasService = require("../services/perguntasService");
const perguntasRepository = require("../repositories/perguntasRepository");

describe("Serviços", () => {
  test("AuthService gera e verifica token", () => {
    const payload = { id: 1, email: "a@a.com" };
    const token = AuthService.generateToken(payload, "1h");
    const decoded = AuthService.verifyToken(token);
    expect(decoded.email).toBe("a@a.com");
  });

  test("PerguntasService delega para o repositório", async () => {
    // mock das funções do repositório
    const mock = jest
      .spyOn(perguntasRepository, "getAll")
      .mockResolvedValue([{ id: 1 }]);
    const service = new PerguntasService();
    const res = await service.getPerguntas();
    expect(res).toEqual([{ id: 1 }]);
    mock.mockRestore();
  });
});
