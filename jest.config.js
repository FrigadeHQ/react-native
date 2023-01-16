module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  setupFilesAfterEnv: [
    './jest.setup.js'
  ],
  testPathIgnorePatterns: ['/__helpers__/']
};