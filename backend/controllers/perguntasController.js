const PerguntasService = require('../services/perguntasService');

class PerguntaController {
    constructor() {
        this.perguntasService = new PerguntasService();
    }

    getPerguntas = async (req, res, next) => {
        try {
            const perguntas = await this.perguntasService.getPerguntas();
            res.json(perguntas);
        } catch (error) {
            next(error);
        }
    }

    getPerguntaById = async (req, res, next) => {
        try {
            const pergunta = await this.perguntasService.getPerguntaById(req.params.id);
            if (!pergunta) return res.status(404).json({ error: 'Pergunta não encontrada' });
            res.json(pergunta);
        } catch (error) {
            next(error);
        }
    }

    getPerguntasByCategoria = async (req, res, next) => {
        try {
            const categoria = req.query.categoria;
            const dificuldade = req.query.dificuldade;
            
            if (!categoria) return res.status(400).json({ error: 'Categoria é obrigatória' });
            
            let perguntas;
            if (dificuldade) {
                perguntas = await this.perguntasService.getPerguntasByCategoriaDificuldade(categoria, dificuldade);
            } else {
                perguntas = await this.perguntasService.getPerguntasByCategoria(categoria);
            }
            
            if (perguntas.length === 0) return res.status(404).json({ error: 'Nenhuma pergunta encontrada para esta categoria' });
            res.json(perguntas);
        } catch (error) {
            next(error);
        }
    }
    createPergunta = async (req, res, next) => {
        try {
            const pergunta = await this.perguntasService.createPergunta(req.body);
            res.status(201).json(pergunta);
        } catch (error) {
            next(error);
        }
    }

    updatePergunta = async (req, res, next) => {
        try {
            const pergunta = await this.perguntasService.updatePergunta(req.params.id, req.body);
            if (!pergunta) return res.status(404).json({ error: 'Pergunta não encontrada' });
            res.json(pergunta);
        } catch (error) {
            next(error);
        }
    }

    removePergunta = async (req, res, next) => {
        try {
            const pergunta = await this.perguntasService.removePergunta(req.params.id);
            if (!pergunta) return res.status(404).json({ error: 'Pergunta não encontrada' });
            res.json(pergunta);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PerguntaController();