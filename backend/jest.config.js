module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**",
    "!coverage/**",
    "!**/*.config.js",
    "!**/__mocks__/**",
    "!**/__tests__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 90,
      lines: 80,
      statements: 80,
    },
  },
};
