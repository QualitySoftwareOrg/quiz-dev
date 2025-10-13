// Setup global mocks and env for tests
process.env.JWT_SECRET = "test-jwt-secret";
process.env.EMAIL_USER = "test@example.com";
process.env.EMAIL_PASS = "pass";

// Silence console during tests (optional)
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // keep errors visible but not noisy
    originalConsoleError(...args);
  };
});
