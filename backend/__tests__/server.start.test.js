const Server = require("../server");

describe("Server.start", () => {
  test("start chama initDb e não chama process.exit em sucesso", async () => {
    const srv = new Server();
    srv.initDb = jest.fn().mockResolvedValue();
    srv.app.listen = jest.fn((port, cb) => cb());
    const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    await srv.start();
    expect(srv.initDb).toHaveBeenCalled();
    expect(spyExit).not.toHaveBeenCalled();
    spyExit.mockRestore();
  });

  test("start chama process.exit em erro critico", async () => {
    const srv = new Server();
    srv.initDb = jest.fn().mockRejectedValue(new Error("crash"));
    const spyExit = jest.spyOn(process, "exit").mockImplementation(() => {});
    await srv.start();
    expect(srv.initDb).toHaveBeenCalled();
    expect(spyExit).toHaveBeenCalledWith(1);
    spyExit.mockRestore();
  });

  test("construtor usa PORT do env quando definido", () => {
    const old = process.env.PORT;
    process.env.PORT = "4321";
    const srv = new Server();
    expect(srv.port).toBe("4321");
    process.env.PORT = old;
  });

  test("construtor usa porta padrao quando PORT não definido", () => {
    const old = process.env.PORT;
    delete process.env.PORT;
    const srv = new Server();
    expect(srv.port).toBe(3000);
    process.env.PORT = old;
  });
});
