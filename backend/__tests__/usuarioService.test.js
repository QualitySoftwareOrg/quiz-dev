jest.mock("../repositories/usuarioRepository");
jest.mock("bcrypt");

const usuarioRepo = require("../repositories/usuarioRepository");
const bcrypt = require("bcrypt");
const usuarioService = require("../services/usuarioService");

describe("UsuarioService - login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("lança 401 quando usuário não existe", async () => {
    usuarioRepo.getByEmail = jest.fn().mockResolvedValue(null);
    await expect(usuarioService.login("no@no.com", "p")).rejects.toMatchObject({
      status: 401,
    });
  });

  test("lança 403 quando usuário está bloqueado", async () => {
    const bloqueado = {
      id: 1,
      email: "a@a",
      password: "x",
      tempo_bloqueio: new Date(Date.now() + 60000),
    };
    usuarioRepo.getByEmail = jest.fn().mockResolvedValue(bloqueado);
    await expect(usuarioService.login("a@a", "p")).rejects.toMatchObject({
      status: 403,
    });
  });

  test("senha inválida incrementa tentativas e retorna 401", async () => {
    const user = { id: 2, email: "b@b", password: "hash", tentativas_login: 0 };
    usuarioRepo.getByEmail = jest.fn().mockResolvedValue(user);
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    usuarioRepo.incrementarTentativas = jest.fn().mockResolvedValue();

    await expect(usuarioService.login("b@b", "wrong")).rejects.toMatchObject({
      status: 401,
    });
    expect(usuarioRepo.incrementarTentativas).toHaveBeenCalledWith("b@b");
  });

  test("login bem-sucedido retorna token e usuario", async () => {
    const user = { id: 3, email: "c@c", password: "hash", nome: "C" };
    usuarioRepo.getByEmail = jest.fn().mockResolvedValue(user);
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    usuarioRepo.resetarTentativas = jest.fn().mockResolvedValue();

    const res = await usuarioService.login("c@c", "p");
    expect(res).toHaveProperty("token");
    expect(res).toHaveProperty("usuario");
  });
});
