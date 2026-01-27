jest.mock("pg", () => {
  const mQuery = jest.fn().mockResolvedValue({ rows: [] });
  const mPool = jest.fn().mockImplementation(() => ({ query: mQuery }));
  return { Pool: mPool };
});

const { Pool } = require("pg");
const db = require("../db/db");

describe("db wrapper", () => {
  test("query delega para pool.query", async () => {
    await expect(db.query("SELECT 1", [1])).resolves.toEqual({ rows: [] });
    // Pool deve ter sido instanciado
    expect(Pool).toHaveBeenCalled();
  });
});
