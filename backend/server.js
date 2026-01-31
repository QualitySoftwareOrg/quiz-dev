require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usuarioRoutes = require('./routes/usuarioRoutes');
const perguntasRoutes = require('./routes/perguntasRoutes');
const dbInit = require('./db/dbInit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swaggerConfig'); // <- import Swagger config



class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000
        this.configureMiddleware()
        this.routes()
    }
    

    configureMiddleware() {
        this.app.use(express.json());
        const allowedOrigins = (process.env.CORS_ORIGINS || '')
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean);
        const corsOptions = allowedOrigins.length
            ? {
                origin: (origin, callback) => {
                    if (!origin || allowedOrigins.includes(origin)) {
                        return callback(null, true);
                    }
                    return callback(new Error('Not allowed by CORS'));
                },
                credentials: true,
            }
            : undefined;
        this.app.use(cors(corsOptions));
        this.app.use(morgan('dev'));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        }

    routes() {
        this.app.use('/api/usuarios', usuarioRoutes);
        this.app.use('/api/perguntas', perguntasRoutes);

            this.app.get('/', (req, res) => {   
            res.send('A api usuarios está funcionando')
        });

        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            return res.status(500).json({error: 'Erro interno do servidor'})
        });

    
    }

    async initDb() {
        try{
            console.log("iniciando banco de dados");
            await dbInit();
            console.log('Tabela criada com sucesso.');
        } catch (error) {
            console.error('Erro ao criar a tabela', error);
        }
    }

    async start() { 
    try {
      await this.initDb(); 
      this.app.listen(this.port, () => {
        console.log(`Servidor rodando na porta ${this.port}`);
        console.log(`Swagger disponível em http://localhost:${this.port}/api-docs`);
      });
    } catch (error) {
      console.error('Falha crítica ao iniciar o servidor:', error);
      process.exit(1); 
    }
  }
}
module.exports = Server;
