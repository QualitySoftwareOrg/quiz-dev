jest.mock("../db/dbInit");
const dbInit = require("../db/dbInit");
const Server = require("../server");

describe("Server", () => {
  test("Server.construct and configure middleware", async () => {
    dbInit.mockResolvedValue();
    const srv = new Server();
    // initDb should call dbInit when start is invoked
    await srv.initDb();
    expect(dbInit).toHaveBeenCalled();
  });
});
