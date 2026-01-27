const Usuario = require("../models/usuarioModel");
const Pergunta = require("../models/perguntaModel");

describe("Modelos", () => {
  test("Usuario.toJson retorna formato correto", () => {
    const u = new Usuario({
      id: 1,
      nome: "Ana",
      sobrenome: "Silva",
      data_nascimento: "2000-01-01",
      email: "a@a.com",
      password: "x",
      historico_pontuacoes: {},
    });
    expect(u.toJson()).toEqual({
      id: 1,
      nome: "Ana",
      sobrenome: "Silva",
      data_nascimento: "2000-01-01",
      email: "a@a.com",
      historico_pontuacoes: {},
    });
  });

  test("Pergunta instancia corretamente", () => {
    const p = new Pergunta({
      id: 2,
      categoria: "Geral",
      pontuacao: 10,
      pergunta: "Q",
      resposta_correta: "A",
      respostas_incorretas: ["B"],
    });
    expect(p.id).toBe(2);
    expect(p.categoria).toBe("Geral");
  });
});
