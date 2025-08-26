const { query } = require('./db');

const createTableUsuario = async () => {
    const createQueryUsuario = `
        CREATE TABLE IF NOT EXISTS usuario (
            id SERIAL PRIMARY KEY NOT NULL,
            nome VARCHAR(100) NOT NULL,
            sobrenome VARCHAR(100) NOT NULL,
            data_nascimento DATE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            historico_pontuacoes JSONB,
            tentativas_login INT DEFAULT 0,
            tempo_bloqueio TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await query(createQueryUsuario);
        console.log("✅ Tabela Usuário verificada/criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabela Usuário:", error.message);
        throw error;
    }
};

const createTablePergunta = async () => {
    const createQueryPergunta = `
        CREATE TABLE IF NOT EXISTS pergunta (
            id SERIAL PRIMARY KEY NOT NULL,
            categoria TEXT NOT NULL,
            pontuacao INTEGER NOT NULL,
            pergunta TEXT NOT NULL,
            resposta_correta TEXT NOT NULL,
            respostas_incorretas JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    try {
        await query(createQueryPergunta);
        console.log("✅ Tabela Pergunta verificada/criada com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao criar tabela Pergunta:", error.message);
        throw error;
    }
};

const initDb = async () => {
    try {
        console.log('🔄 Inicializando banco de dados no Neon DB...');
        await createTableUsuario();
        await createTablePergunta();
        console.log('✅ Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro crítico na inicialização do banco:', error.message);
        throw error;
    }
};

module.exports = initDb;