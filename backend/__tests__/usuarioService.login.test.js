const usuarioService = require("../services/usuarioService");
const repository = require("../repositories/usuarioRepository");
const bcrypt = require("bcrypt");
const authService = require("../services/authService");

describe("usuarioService.login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("lança 401 quando usuario inexistente", async () => {
    repository.getByEmail = jest.fn().mockResolvedValue(null);
    await expect(usuarioService.login("a@a.com", "p")).rejects.toEqual({
      status: 401,
      message: "Email ou senha incorretos",
    });
  });

  test("lança 403 quando usuario bloqueado", async () => {
    const future = new Date(Date.now() + 10 * 60000).toISOString();
    repository.getByEmail = jest
      .fn()
      .mockResolvedValue({
        id: 1,
        email: "a@a.com",
        password: "hash",
        tempo_bloqueio: future,
      });
    await expect(usuarioService.login("a@a.com", "p")).rejects.toMatchObject({
      status: 403,
    });
  });

  test("senha invalida incrementa tentativas e retorna 401", async () => {
    const usuario = {
      id: 1,
      email: "a@a.com",
      password: "hash",
      tentativas_login: 0,
    };
    repository.getByEmail = jest.fn().mockResolvedValue(usuario);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    repository.incrementarTentativas = jest.fn().mockResolvedValue();
    await expect(
      usuarioService.login("a@a.com", "wrong")
    ).rejects.toMatchObject({ status: 401 });
    expect(repository.incrementarTentativas).toHaveBeenCalledWith("a@a.com");
  });

  test("senha invalida muitas tentativas bloqueia e retorna 403", async () => {
    const usuario = {
      id: 1,
      email: "a@a.com",
      password: "hash",
      tentativas_login: 4,
    };
    repository.getByEmail = jest.fn().mockResolvedValue(usuario);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    repository.incrementarTentativas = jest.fn().mockResolvedValue();
    repository.bloquearUsuario = jest.fn().mockResolvedValue();
    await expect(
      usuarioService.login("a@a.com", "wrong")
    ).rejects.toMatchObject({ status: 403 });
    expect(repository.bloquearUsuario).toHaveBeenCalledWith(
      "a@a.com",
      expect.any(Number)
    );
  });

  test("login com sucesso retorna token e reseta tentativas", async () => {
    const usuario = { id: 1, email: "a@a.com", password: "hash", nome: "A" };
    repository.getByEmail = jest.fn().mockResolvedValue(usuario);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    repository.resetarTentativas = jest.fn().mockResolvedValue();
    authService.genereteToken = jest.fn().mockReturnValue("tok");

    const result = await usuarioService.login("a@a.com", "p");
    expect(repository.resetarTentativas).toHaveBeenCalledWith("a@a.com");
    expect(authService.genereteToken).toHaveBeenCalledWith({
      id: 1,
      email: "a@a.com",
      nome: "A",
    });
    expect(result).toMatchObject({ token: "tok" });
  });
});
