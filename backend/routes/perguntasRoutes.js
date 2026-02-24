const express = require('express');
const perguntasController = require('../controllers/perguntasController');
const authenticateToken = require('../middleware/authMiddleware');
const ValidadePerguntaMiddleware = require('../middleware/validadePerguntaMiddleware');

class PerguntasRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRoutes();
    }

    registerRoutes() {
        /**
         * @swagger
         * /api/perguntas:
         *   get:
         *     summary: Retorna todas as perguntas
         *     tags: [Perguntas]
         *     responses: 
         *       200:
         *         description: Lista as perguntas
         */
        this.router.get('/', perguntasController.getPerguntas);
        /**
         * @swagger
         * /api/perguntas/categoria:
         *   get:
         *     summary: Retorna perguntas por categoria
         *     tags: [Perguntas]
         *     parameters:
         *       - in: query
         *         name: categoria
         *         required: true
         *         description: Categoria da pergunta
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Lista de perguntas filtradas por categoria
         *       400:
         *         description: Erro na validação dos dados
         */
        this.router.get('/categoria', perguntasController.getPerguntasByCategoria);
        /**
         * @swagger
         * /api/perguntas/{id}:
         *   get:
         *     summary: Retorna uma pergunta específica
         *     tags: [Perguntas]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: ID da pergunta
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Retorna os detalhes da pergunta
         *       404:
         *         description: Pergunta não encontrada
         */
        this.router.get('/:id', perguntasController.getPerguntaById);
        /**
         * @swagger
         * /api/perguntas:
         *   post:
         *     summary: Cria uma nova pergunta
         *     tags: [Perguntas]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               categoria:
         *                 type: string
         *               pontuacao:
         *                 type: integer
         *               pergunta:
         *                 type: string
         *               resposta_correta:
         *                 type: string
         *               respostas_incorretas:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       201:
         *         description: Pergunta criada com sucesso
         *       400:
         *         description: Erro na validação dos dados
         */
        this.router.post('/', authenticateToken, ValidadePerguntaMiddleware.validarDificuldade, perguntasController.createPergunta);
        /**
         * @swagger
         * /api/perguntas/{id}:
         *   put:
         *     summary: Atualiza uma pergunta existente
         *     tags: [Perguntas]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: ID da pergunta
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               categoria:
         *                 type: string
         *               pontuacao:
         *                 type: integer
         *               pergunta:
         *                 type: string
         *               resposta_correta:
         *                 type: string
         *               respostas_incorretas:
         *                 type: array
         *                 items:
         *                   type: string
         *     responses:
         *       200:
         *         description: Pergunta atualizada com sucesso
         *       400:
         *         description: Erro na validação dos dados
         *       404:
         *         description: Pergunta não encontrada
         */
        this.router.put('/:id', authenticateToken, ValidadePerguntaMiddleware.validarDificuldade, perguntasController.updatePergunta);
        /**
         * @swagger
         * /api/perguntas/{id}:
         *   delete:
         *     summary: Remove uma pergunta
         *     tags: [Perguntas]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         description: ID da pergunta
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: Pergunta removida com sucesso
         *       404:
         *         description: Pergunta não encontrada
         */
        this.router.delete('/:id', authenticateToken, perguntasController.removePergunta);
    }
}

module.exports = new PerguntasRoutes().router;
