const express = require('express');
const controller = require('../controllers/usuarioController');
const ValidateUsuario = require('../middleware/validateUsuario');
const authenticateToken = require('../middleware/authMiddleware');
const { requireAdmin, requireSelfOrAdmin } = require('../middleware/authorization');
const { loginLimiter, otpLimiter } = require('../middleware/rateLimiters');


class UsuarioRoutes {
    constructor() {
        this.router = express.Router();
        this.registerRouter();
    }

    registerRouter() {
        /**
         * @swagger
         * /api/usuarios: 
         *   get:
         *     summary: Retorna todos os usuarios
         *     tags: [Usuarios]
         *     responses: 
         *       200:
         *         description: Lista de usuarios
         */
        this.router.get('/', authenticateToken, requireAdmin, controller.getAll);

        /**
         * @swagger
         * /api/usuarios/{id}:
         *   get: 
         *     summary: Retorna o usuario correspondente ao id
         *     tags: [Usuarios]
         *     parameters: 
         *       - in: path
         *         name: id
         *         required: true
         *         schema: 
         *           type: string
         *         description: id do usuario
         *     responses: 
         *       200:
         *         description: Usuario encontrado
         *       404: 
         *         description: Usuario não encontrado
         */
        this.router.get('/:id', authenticateToken, requireSelfOrAdmin, controller.getById);

        /**
         * @swagger
         * /api/usuarios:
         *   post:
         *     summary: Adiciona um novo usuario 
         *     tags: [Usuarios]
         *     requestBody: 
         *       required: true
         *       content: 
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - nome
         *               - email
         *               - password
         *               - historico_pontuacoes
         *             properties:
         *               nome:
         *                 type: string
         *               sobrenome:
         *                 type: string
         *               data_nascimento:
         *                 type: string
         *                 format: date
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *               historico_pontuacoes:
         *                 type: object
         *     responses:
         *       201:
         *         description: Usuario criado com sucesso.    
         */
        this.router.post('/', ValidateUsuario.validateCreate, controller.create);  

        /**
         * @swagger
         * /api/usuarios/{id}:
         *   put:
         *     summary: Atualiza o usuario
         *     tags: [Usuarios]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               nome:
         *                 type: string
         *               sobrenome:
         *                 type: string
         *               data_nascimento:
         *                 type: string
         *                 format: date
         *               email:
         *                 type: string
         *               password:
         *                 type: string
         *               historico_pontuacoes:
         *                 type: object
         *     responses:
         *       200:
         *         description: Usuario atualizado com sucesso
         *       404:
         *         description: usuario não encontrado
         */
        this.router.put('/:id', authenticateToken, requireSelfOrAdmin, ValidateUsuario.validateUpdate, controller.update)

        /**
         * @swagger
         * /api/usuarios/{id}:
         *   delete:
         *     summary: Remove o usuario
         *     tags: [Usuarios]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: string
         *     responses:
         *       204:
         *         description: Usuario removido com sucesso
         *       404:
         *         description: Usuario não encontrado
         */
        this.router.delete('/:id', authenticateToken, requireSelfOrAdmin, controller.delete)

        /**
         * @swagger
         * /api/usuarios/{id}/pontuacao:
         *   post:
         *     summary: Registra pontuacao do usuario
         *     tags: [Usuarios]
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
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
         *               acertos:
         *                 type: integer
         *               total:
         *                 type: integer
         *     responses:
         *       200:
         *         description: Pontuacao registrada
         */
        this.router.post('/:id/pontuacao', authenticateToken, requireSelfOrAdmin, controller.registrarPontuacao)

        this.router.post('/login', loginLimiter, controller.login)

        this.router.post('/solicitar-otp', otpLimiter, controller.solicitarOtp);
        this.router.post('/verificar-otp', otpLimiter, ValidateUsuario.validateCreate, controller.verificarOtp);
    }

    getRouter() {
        return this.router
    }
}

module.exports = new UsuarioRoutes().getRouter();
