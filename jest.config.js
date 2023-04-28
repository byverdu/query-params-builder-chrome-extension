/** @type {import('jest').Config} */
const config = {
  collectCoverageFrom: ['**/*.{js}', '!**/node_modules/**'],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
};

export default config;
