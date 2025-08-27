// test-connection.js
require('dotenv').config();
const { Pool } = require('pg');

console.log('🔍 Testando conexão com Neon DB...');
console.log('📋 Variáveis de ambiente:');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'Definida' : 'Não definida');
console.log('   DB_HOST:', process.env.DB_HOST || 'Não definido');
console.log('   DB_USER:', process.env.DB_USER || 'Não definido');
console.log('   DB_NAME:', process.env.DB_NAME || 'Não definido');

if (process.env.DATABASE_URL) {
    console.log('   DATABASE_URL (partial):', process.env.DATABASE_URL.substring(0, 50) + '...');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
});

async function testConnection() {
    try {
        console.log('\n🔄 Tentando conectar...');
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as time, version() as version');
        console.log('✅ Conexão bem-sucedida!');
        console.log('   ⏰ Hora do servidor:', result.rows[0].time);
        console.log('   🐘 PostgreSQL:', result.rows[0].version.split(',')[0]);
        client.release();
        return true;
    } catch (error) {
        console.log('❌ Erro de conexão:');
        console.log('   📌 Mensagem:', error.message);
        console.log('   🔍 Código:', error.code);
        return false;
    } finally {
        await pool.end();
    }
}

testConnection().then(success => {
    if (!success) {
        console.log('\n💡 Dicas para resolver:');
        console.log('   1. Verifique se o arquivo .env está na raiz do projeto');
        console.log('   2. Confirme se a DATABASE_URL está correta');
        console.log('   3. Teste a conexão no painel do Neon DB');
        console.log('   4. Verifique se sua rede permite conexões SSL');
    }
    process.exit(success ? 0 : 1);
});