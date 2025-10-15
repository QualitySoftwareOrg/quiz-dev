const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

describe("authService", () => {
  beforeEach(() => jest.clearAllMocks());

  test("generateToken usa jwt.sign e genereteToken é alias", () => {
    jwt.sign = jest.fn().mockReturnValue("tok");
    const payload = { id: 1 };
    const t1 = authService.generateToken(payload, "1h");
    expect(jwt.sign).toHaveBeenCalledWith(payload, authService.jwtSecret, {
      expiresIn: "1h",
    });
    expect(t1).toBe("tok");
    const t2 = authService.genereteToken(payload, "2h");
    expect(jwt.sign).toHaveBeenCalledWith(payload, authService.jwtSecret, {
      expiresIn: "2h",
    });
  });

  test("verifyToken delega para jwt.verify", () => {
    jwt.verify = jest.fn().mockReturnValue({ id: 1 });
    const res = authService.verifyToken("t");
    expect(jwt.verify).toHaveBeenCalledWith("t", authService.jwtSecret);
    expect(res).toEqual({ id: 1 });
  });
});
