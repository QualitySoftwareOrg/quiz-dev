const db = require('../db/db');
const Pergunta = require('../models/perguntaModel');

class PerguntasRepository {
    async getAll() {
        const result = await db.query('SELECT * FROM pergunta');
        return result.rows.map(row => new Pergunta(row));
    }

    async getById(id) {
        const result = await db.query('SELECT * FROM pergunta WHERE id = $1', [id]);
        return result.rows[0] ? new Pergunta(result.rows[0]) : null;
    }

    async getByCategoria(categoria) {
        const result = await db.query(
            'SELECT * FROM pergunta WHERE categoria = $1 ORDER BY RANDOM()',
            [categoria]
        );
        return result.rows.map(row => new Pergunta(row));
    }

    async getByCategoriaDificuldade(categoria, dificuldade) {
        const result = await db.query(
            'SELECT * FROM pergunta WHERE categoria = $1 AND dificuldade = $2 ORDER BY RANDOM()',
            [categoria, dificuldade]
        );
        return result.rows.map(row => new Pergunta(row));
    }

    async create({ categoria, dificuldade, pontuacao, pergunta, resposta_correta, respostas_incorretas }) {
        // Garante que respostas_incorretas seja salvo como JSON string
        const result = await db.query(
            'INSERT INTO pergunta (categoria, dificuldade, pontuacao, pergunta, resposta_correta, respostas_incorretas) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [categoria, dificuldade, pontuacao, pergunta, resposta_correta, JSON.stringify(respostas_incorretas)]
        );
        return new Pergunta(result.rows[0]);
    }

    async update(id, dados) {
        const perguntaAtual = await this.getById(id);
        if (!perguntaAtual) return null;
        const categoria = dados.categoria ?? perguntaAtual.categoria;
        const dificuldade = dados.dificuldade ?? perguntaAtual.dificuldade;
        const pontuacao = dados.pontuacao ?? perguntaAtual.pontuacao;
        const pergunta = dados.pergunta ?? perguntaAtual.pergunta;
        const resposta_correta = dados.resposta_correta ?? perguntaAtual.resposta_correta;
        // Corrige aqui: sempre salva como JSON string
        const respostas_incorretas = dados.respostas_incorretas !== undefined
            ? JSON.stringify(dados.respostas_incorretas)
            : perguntaAtual.respostas_incorretas;

        const result = await db.query(
            'UPDATE pergunta SET categoria=$1, dificuldade=$2, pontuacao=$3, pergunta=$4, resposta_correta=$5, respostas_incorretas=$6 WHERE id=$7  RETURNING *',
            [categoria, dificuldade, pontuacao, pergunta, resposta_correta, respostas_incorretas, id]
        );
        return new Pergunta(result.rows[0]);
    }

    async remove(id) {
        const result = await db.query('DELETE FROM pergunta WHERE id = $1 RETURNING *', [id]);
        return result.rows[0] ? new Pergunta(result.rows[0]) : null;
    }
}

module.exports = new PerguntasRepository();