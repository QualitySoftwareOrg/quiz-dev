jest.mock("../db/dbInit");
const dbInit = require("../db/dbInit");
const Server = require("../server");

describe("Servidor", () => {
  test("Server constrói e configura middlewares", async () => {
    dbInit.mockResolvedValue();
    const srv = new Server();
    // initDb should call dbInit when start is invoked
    await srv.initDb();
    expect(dbInit).toHaveBeenCalled();
  });
});
