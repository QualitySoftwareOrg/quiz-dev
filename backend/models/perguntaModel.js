class Pergunta {
    constructor({ id, categoria, dificuldade, pontuacao, pergunta, resposta_correta, respostas_incorretas }) {
        this.id = id;
        this.categoria = categoria;
        this.dificuldade = dificuldade;
        this.pontuacao = pontuacao;
        this.pergunta = pergunta;
        this.resposta_correta = resposta_correta;
        this.respostas_incorretas = respostas_incorretas;
    }
}

module.exports = Pergunta;
