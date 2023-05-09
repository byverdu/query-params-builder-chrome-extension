/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['src/**/*.js', '!src/libs/*.js', '!src/types/*.js'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['(helpers.)js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};

export default config;
