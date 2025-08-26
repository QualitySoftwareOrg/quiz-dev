const express = require('express');
const controller = require('../controllers/usuarioController');
const ValidateUsuario = require('../middleware/validateUsuario');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '7670783fa7ecc5d27f3629cb644d294f3ca7cce8cff5a49fcdd08d2d06281570f09de329a2d5b6e0105c500a0e145fb6a188a53f99a69114ae82bb6c44117053';
const authenticateToken = require('../middleware/authMiddleware');


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
        this.router.get('/', controller.getAll);

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
        this.router.get('/:id', authenticateToken, controller.getById);

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
        this.router.put('/:id', authenticateToken, ValidateUsuario.validateUpdate, controller.update)

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
        this.router.delete('/:id', authenticateToken, controller.delete)

        this.router.post('/login', controller.login)

        this.router.post('/solicitar-otp', controller.solicitarOtp);
        this.router.post('/verificar-otp', ValidateUsuario.validateCreate, controller.verificarOtp);
    }

    getRouter() {
        return this.router
    }
}

module.exports = new UsuarioRoutes().getRouter();
