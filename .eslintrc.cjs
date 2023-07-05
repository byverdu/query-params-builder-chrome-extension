module.exports = {
  plugins: ['react'],
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
    jest: true,
    node: true,
  },
  globals: {
    bootstrap: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    'react/prop-types': 0,
  },
};
