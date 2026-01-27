// Configura mocks e variáveis de ambiente globais para os testes
process.env.JWT_SECRET = "test-jwt-secret";
process.env.EMAIL_USER = "test@example.com";
process.env.EMAIL_PASS = "pass";

// Silencia mensagens excessivas no console durante os testes (opcional)
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // mantém erros visíveis, mas evita ruído desnecessário
    originalConsoleError(...args);
  };
});
