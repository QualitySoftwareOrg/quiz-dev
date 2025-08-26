// db/db.js
require('dotenv').config();
const { Pool } = require('pg');

// Configuração flexível que aceita DATABASE_URL ou variáveis individuais
const getDbConfig = () => {
    if (process.env.DATABASE_URL) {
        console.log('📡 Usando DATABASE_URL para conexão');
        return {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        };
    }

    if (process.env.DB_HOST) {
        console.log('📡 Usando variáveis individuais para conexão');
        return {
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
            ssl: { rejectUnauthorized: false }
        };
    }

    throw new Error('❌ Nenhuma configuração de banco de dados encontrada');
};

const pool = new Pool({
    ...getDbConfig(),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000 // Aumentado para Neon DB
});

// Teste de conexão detalhado
const testConnection = async () => {
    try {
        console.log('🔄 Testando conexão com o banco de dados...');
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as current_time, current_database() as db_name');
        client.release();
        
        console.log('✅ Conexão bem-sucedida!');
        console.log(`   📊 Banco: ${result.rows[0].db_name}`);
        console.log(`   ⏰ Hora do servidor: ${result.rows[0].current_time}`);
        return true;
    } catch (error) {
        console.error('❌ Falha na conexão:');
        console.error('   📌 Mensagem:', error.message);
        console.error('   🔍 Código:', error.code);
        
        if (error.code === 'ETIMEDOUT') {
            console.error('   💡 Timeout - Verifique sua conexão com a internet');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('   💡 Conexão recusada - Verifique host e porta');
        } else if (error.code === '28P01') {
            console.error('   💡 Autenticação falhou - Verifique usuário/senha');
        }
        
        return false;
    }
};
const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        
        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Query:', text.length > 100 ? text.substring(0, 100) + '...' : text);
            // CORREÇÃO: Verifica se rowCount existe
            const rowCountInfo = res.rowCount !== undefined ? `📋 Linhas: ${res.rowCount}` : '📋 (Query DDL)';
            console.log('   ⏱️  Duração:', duration + 'ms', rowCountInfo);
        }
        
        return res;
    } catch (error) {
        console.error('❌ Erro na query:', error.message);
        console.log('   🔍 Query:', text);
        if (params) console.log('   📌 Parâmetros:', params);
        throw error;
    }
};


module.exports = {
    query,
    pool,
    testConnection,
    getClient: () => pool.connect()
};