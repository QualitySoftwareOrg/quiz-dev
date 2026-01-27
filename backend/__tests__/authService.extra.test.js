const auth = require("../services/authService");

describe("AuthService", () => {
  test("generateToken usa default expiresIn quando não fornecido", () => {
    const spy = jest
      .spyOn(require("jsonwebtoken"), "sign")
      .mockReturnValue("tok");
    const token = auth.generateToken({ id: 1 });
    expect(token).toBe("tok");
    expect(spy).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    spy.mockRestore();
  });

  test("genereteToken (alias) delega para generateToken com expiresIn explícito", () => {
    const spy = jest
      .spyOn(require("jsonwebtoken"), "sign")
      .mockReturnValue("tok2");
    const token = auth.genereteToken({ id: 2 }, "2h");
    expect(token).toBe("tok2");
    expect(spy).toHaveBeenCalledWith({ id: 2 }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    spy.mockRestore();
  });
});
