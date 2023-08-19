module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'plugin:prettier/recommended',
    'airbnb/hooks',
    'prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  plugins: ['prettier'],
  settings: {
    'import/core-modules': ['@righton/networking'],
  },
};
