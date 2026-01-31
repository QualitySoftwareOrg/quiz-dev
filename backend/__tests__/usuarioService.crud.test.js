const usuarioService = require("../services/usuarioService");
const repository = require("../repositories/usuarioRepository");
const bcrypt = require("bcrypt");

describe("usuarioService create/update/delete", () => {
  beforeEach(() => jest.clearAllMocks());

  test("create faz hash e chama repository.create", async () => {
    bcrypt.hash = jest.fn().mockResolvedValue("hashed");
    repository.create = jest.fn().mockResolvedValue({ id: 1, email: "a@a" });
    const res = await usuarioService.create({ email: "a@a", password: "p" });
    expect(bcrypt.hash).toHaveBeenCalledWith("p", 10);
    expect(repository.create).toHaveBeenCalled();
    expect(res).toHaveProperty("id", 1);
  });

  test("create propaga erro de email ja cadastrado", async () => {
    bcrypt.hash = jest.fn().mockResolvedValue("h");
    repository.create = jest
      .fn()
      .mockRejectedValue(new Error("Email já cadastrado"));
    await expect(
      usuarioService.create({ email: "a@a", password: "p" })
    ).rejects.toThrow("Email já cadastrado");
  });

  test("update faz hash quando senha presente e retorna usuario", async () => {
    bcrypt.hash = jest.fn().mockResolvedValue("h2");
    bcrypt.compare = jest.fn().mockResolvedValue(false);
    repository.getById = jest.fn().mockResolvedValue({ id: 2, password: "old" });
    repository.update = jest.fn().mockResolvedValue({ id: 2, nome: "B" });
    const res = await usuarioService.update(2, { senha: "new" });
    expect(bcrypt.hash).toHaveBeenCalledWith("new", 10);
    expect(repository.update).toHaveBeenCalledWith(
      2,
      expect.objectContaining({ password: "h2" })
    );
    expect(res).toHaveProperty("id", 2);
  });

  test("update retorna null quando usuario nao existe", async () => {
    bcrypt.hash = jest.fn();
    repository.getById = jest.fn().mockResolvedValue(null);
    repository.update = jest.fn().mockResolvedValue(null);
    const res = await usuarioService.update(99, { nome: "X" });
    expect(res).toBeNull();
  });

  test("delete retorna usuario deletado ou null", async () => {
    repository.remove = jest.fn().mockResolvedValue({ id: 3 });
    const res = await usuarioService.delete(3);
    expect(res).toHaveProperty("id", 3);
    repository.remove = jest.fn().mockResolvedValue(null);
    const res2 = await usuarioService.delete(99);
    expect(res2).toBeNull();
  });
});
