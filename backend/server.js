require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usuarioRoutes = require('./routes/usuarioRoutes');
const perguntasRoutes = require('./routes/perguntasRoutes');
const dbInit = require('./db/dbInit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // <- import Swagger config
const { testConnection } = require('./db/db');



class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000
        this.configureMiddleware()
        this.routes()
    }
    

    configureMiddleware() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }

    routes() {
        this.app.use('/api/usuarios', usuarioRoutes);
        this.app.use('/api/perguntas', perguntasRoutes);

            this.app.get('/', (req, res) => {   
            res.json({
                message: 'Api Quiz interativo está funcionando.',
                database: 'Neon DB PostgreSQL',
                docs: `http://localhost:${this.port}/api-docs`
            });
        });

        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            return res.status(500).json({error: 'Erro interno do servidor'})
        });
    }

    async initDb() {
        try{
            console.log("iniciando banco de dados com Neon DB.");
            const isConnected = await testConnection();
            if (!isConnected) {
                throw new Error('Falha na conexão com o Neon DB');
            }
            console.log('Conexão com Neon DB estabelecida com sucesso');

            await dbInit();
            console.log('Tabela criada com sucesso.');
        } catch (error) {
            console.error('Erro ao conectar com o banco de dados:', error.message );
            throw error;
        }
    }

    async start() { 
    try {
        console.log('🚀 Iniciando servidor...');
        console.log('📊 Ambiente:', process.env.NODE_ENV || 'development');

        await this.initDb(); 

        this.app.listen(this.port, () => {
        console.log(`✅ Servidor rodando na porta ${this.port}`);
        console.log(`📚 Swagger disponível em http://localhost:${this.port}/api-docs`);
        console.log(`🌐 Health check: http://localhost:${this.port}/`);
            });
    } catch (error) {
        console.error('💥 Falha crítica ao iniciar o servidor:', error.message);
        console.log('🔧 Verifique:');
        console.log('   - Suas variáveis de ambiente no arquivo .env');
        console.log('   - A conexão com o Neon DB');
        console.log('   - As credenciais do banco de dados');
        process.exit(1);  

    }
}};

module.exports = Server;
