const otpRepository = require("../repositories/otpRepository");
const db = require("../db/db");

describe("otpRepository", () => {
  beforeEach(() => jest.clearAllMocks());

  test("createOrUpdate cria tabela e insere/atualiza", async () => {
    db.query = jest.fn().mockResolvedValue({});
    await expect(
      otpRepository.createOrUpdate("a@a.com", "1234")
    ).resolves.toBeUndefined();
    expect(db.query).toHaveBeenCalled();
  });

  test("findByEmail retorna undefined quando nao encontrado", async () => {
    db.query = jest.fn().mockResolvedValue({ rows: [] });
    const res = await otpRepository.findByEmail("a@a.com");
    expect(res).toBeUndefined();
  });

  test("findByEmail retorna row quando encontrado", async () => {
    db.query = jest
      .fn()
      .mockResolvedValue({ rows: [{ email: "a@a.com", otp: "1234" }] });
    const res = await otpRepository.findByEmail("a@a.com");
    expect(res).toEqual({ email: "a@a.com", otp: "1234" });
  });

  test("deleteByEmail executa query", async () => {
    db.query = jest.fn().mockResolvedValue({});
    await expect(
      otpRepository.deleteByEmail("a@a.com")
    ).resolves.toBeUndefined();
    expect(db.query).toHaveBeenCalled();
  });
});
