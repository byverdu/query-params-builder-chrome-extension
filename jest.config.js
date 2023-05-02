/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['src/**/*.js', '!src/libs/*.js', '!src/types/*.js'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['(helpers.)js'],
  // coverageThreshold: {
  //   global: {
  //     branches: 20,
  //     functions: 30,
  //     lines: 50,
  //     statements: 50,
  //   },
  // },
};

export default config;
