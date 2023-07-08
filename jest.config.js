/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    '!src/extension/libs/*.js',
    '!src/extension/types/*.js',
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  testRegex: '__tests__/.*\\.spec\\.(jsx?|js)$',
  setupFilesAfterEnv: ['./jest.setup.js'],
};

export default config;
