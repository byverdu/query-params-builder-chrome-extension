module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    jest: true,
  },
  globals: {
    bootstrap: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
  },
};
