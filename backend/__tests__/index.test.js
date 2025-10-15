describe("Index (entrada)", () => {
  test("deve instanciar Server e chamar start", () => {
    const startMock = jest.fn();
    const ServerMock = jest
      .fn()
      .mockImplementation(() => ({ start: startMock }));

    jest.isolateModules(() => {
      // usa doMock dentro de isolateModules para garantir que o require use o mock
      jest.doMock("../server", () => ServerMock);
      // ao requerer o index ele deve instanciar e chamar start
      require("../index");
    });

    expect(ServerMock).toHaveBeenCalled();
    expect(startMock).toHaveBeenCalled();
  });
});
