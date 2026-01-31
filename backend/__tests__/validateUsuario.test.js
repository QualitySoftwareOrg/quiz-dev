const ValidateUsuario = require("../middleware/validateUsuario");

describe("ValidateUsuario middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe("validateCreate", () => {
    test("should return 400 when required fields are missing", () => {
      ValidateUsuario.validateCreate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Todos os campos sÃ£o obrigatÃ³rios",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 when nome contains invalid characters", () => {
      req.body = {
        nome: "Jo3n",
        sobrenome: "Silva",
        data_nascimento: "2000-01-01",
        email: "a@b.com",
        password: "pw",
      };
      ValidateUsuario.validateCreate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "O nome deve conter apenas letras.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 when sobrenome contains invalid characters", () => {
      req.body = {
        nome: "Joao",
        sobrenome: "Silv4",
        data_nascimento: "2000-01-01",
        email: "a@b.com",
        password: "pw",
      };
      ValidateUsuario.validateCreate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "O sobrenome deve conter apenas letras.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next when all fields are valid", () => {
      req.body = {
        nome: "Joao",
        sobrenome: "Silva",
        data_nascimento: "2000-01-01",
        email: "a@b.com",
        password: "pw",
      };
      ValidateUsuario.validateCreate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("validateUpdate", () => {
    test("should return 400 when no updatable fields are provided", () => {
      req.body = {};
      ValidateUsuario.validateUpdate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Envie pelo menos um campo para atualizar",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 when nome is invalid", () => {
      req.body = { nome: "An@" };
      ValidateUsuario.validateUpdate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "O nome deve conter apenas letras.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 when sobrenome is invalid", () => {
      req.body = { sobrenome: "X1" };
      ValidateUsuario.validateUpdate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "O sobrenome deve conter apenas letras.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should call next when at least one valid field is provided", () => {
      req.body = { nome: "Maria" };
      ValidateUsuario.validateUpdate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
