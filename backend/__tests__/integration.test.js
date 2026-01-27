const request = require("supertest");
const Server = require("../server");

describe("Integration test - server routes", () => {
  let server;

  beforeAll(() => {
    server = new Server();
  });

  test("GET / should return working message", async () => {
    const res = await request(server.app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/A api usuarios está funcionando/);
  });
});
