const Server = require('./server');

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Exceção não capturada:', error);
    process.exit(1);
});

// Inicialização do servidor
const server = new Server();

// Graceful shutdown
const gracefulShutdown = () => {
    console.log('\n🛑 Recebido sinal de desligamento...');
    console.log('⏳ Encerrando servidor gracefulmente...');
    
    setTimeout(() => {
        console.log('👋 Servidor encerrado');
        process.exit(0);
    }, 1000);
};

// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Inicia o servidor
server.start().catch(error => {
    console.error('💥 Falha ao iniciar servidor:', error);
    process.exit(1);
});