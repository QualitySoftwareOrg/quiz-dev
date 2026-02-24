const usuarioRepository = require("../repositories/usuarioRepository");
const db = require("../db/db");

describe("usuarioRepository", () => {
  beforeEach(() => jest.clearAllMocks());

  test("getByEmail retorna null quando nao existe", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await usuarioRepository.getByEmail("a@a.com");
    expect(db.query).toHaveBeenCalled();
    expect(res).toBeNull();
  });

  test("getByEmail retorna row quando existe", async () => {
    const row = { id: 1, email: "a@a.com" };
    db.query = jest.fn().mockResolvedValue({ rows: [row] });
    const res = await usuarioRepository.getByEmail("a@a.com");
    expect(res).toBeDefined();
    expect(res.id).toBe(1);
    expect(res.email).toBe("a@a.com");
  });

  test("create lança erro quando email ja existe", async () => {
    db.query = jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] }); // existing
    await expect(
      usuarioRepository.create({ email: "a@a.com" })
    ).rejects.toThrow("Email j\u00e1 cadastrado");
  });

  test("create insere e retorna usuario", async () => {
    db.query = jest
      .fn()
      .mockResolvedValueOnce({ rows: [] }) // existing check
      .mockResolvedValueOnce({ rows: [{ id: 2, nome: "A" }] });
    const res = await usuarioRepository.create({
      nome: "A",
      sobrenome: "B",
      data_nascimento: null,
      email: "a@a.com",
      password: "p",
    });
    expect(res).toBeDefined();
    expect(res.id).toBe(2);
  });

  test("getById retorna null quando nao encontrado", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await usuarioRepository.getById(10);
    expect(res).toBeNull();
  });

  test("getById retorna usuario quando encontrado", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [{ id: 3, nome: "C" }] });
    const res = await usuarioRepository.getById(3);
    expect(res).toBeDefined();
    expect(res.id).toBe(3);
  });

  test("remove retorna null quando nao existe", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await usuarioRepository.remove(10);
    expect(res).toBeNull();
  });

  test("remove retorna usuario quando deletado", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [{ id: 4, nome: "D" }] });
    const res = await usuarioRepository.remove(4);
    expect(res).toBeDefined();
    expect(res.id).toBe(4);
  });

  test("update retorna null quando nao existe", async () => {
    // getById (called inside update) returns null
    usuarioRepository.getById = jest.fn().mockResolvedValue(null);
    const res = await usuarioRepository.update(99, { nome: "X" });
    expect(res).toBeNull();
  });

  test("update retorna usuario atualizado quando existe", async () => {
    usuarioRepository.getById = jest
      .fn()
      .mockResolvedValue({ id: 5, nome: "Old" });
    db.query = jest.fn().mockResolvedValue({ rows: [{ id: 5, nome: "New" }] });
    const res = await usuarioRepository.update(5, { nome: "New" });
    expect(res).toBeDefined();
    expect(res.id).toBe(5);
  });

  test("getAll mapeia rows para Usuario", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [{ id: 10, nome: "A" }] });
    const res = await usuarioRepository.getAll();
    expect(db.query).toHaveBeenCalledWith(`SELECT * FROM usuario`);
    expect(Array.isArray(res)).toBe(true);
    expect(res[0].id).toBe(10);
  });

  test("incrementarTentativas faz update", async () => {
    db.query = jest.fn().mockResolvedValue({});
    await usuarioRepository.incrementarTentativas("a@a.com");
    expect(db.query).toHaveBeenCalled();
  });

  test("resetarTentativas faz update", async () => {
    db.query = jest.fn().mockResolvedValue({});
    await usuarioRepository.resetarTentativas("a@a.com");
    expect(db.query).toHaveBeenCalled();
  });

  test("bloquearUsuario faz update", async () => {
    db.query = jest.fn().mockResolvedValue({});
    await usuarioRepository.bloquearUsuario("a@a.com", 15);
    expect(db.query).toHaveBeenCalled();
  });
});
