module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "models/**/*.js",
    "services/authService.js",
    "services/emailService.js",
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
};
