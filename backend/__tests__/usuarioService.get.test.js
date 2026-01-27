const usuarioService = require("../services/usuarioService");
const repository = require("../repositories/usuarioRepository");

describe("usuarioService get methods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAll retorna lista de usuarios", async () => {
    repository.getAll = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await usuarioService.getAll();
    expect(repository.getAll).toHaveBeenCalled();
    expect(res).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("getById retorna usuario quando existe", async () => {
    repository.getById = jest.fn().mockResolvedValue({ id: 5, nome: "Z" });
    const res = await usuarioService.getById(5);
    expect(repository.getById).toHaveBeenCalledWith(5);
    expect(res).toEqual({ id: 5, nome: "Z" });
  });

  test("getById retorna null quando nao existe", async () => {
    repository.getById = jest.fn().mockResolvedValue(null);
    const res = await usuarioService.getById(99);
    expect(res).toBeNull();
  });
});
