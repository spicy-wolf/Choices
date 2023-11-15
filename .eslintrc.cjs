/* eslint-env node */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    es6: true
  },
  plugins: [
    '@stylistic/js' 
  ],
  rules: {
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/quotes': ['error', 'single'],
    '@stylistic/js/indent': ['error', 2],
    '@stylistic/js/quote-props': ['error', 'as-needed'],
  },
  ignorePatterns: ['dist/*'],
  overrides: [
    {
      files: ['**/*.json'],
      extends: ['plugin:json/recommended'],
      rules: {
        '@stylistic/js/quotes': ['error', 'double'],
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      excludedFiles: ['**/*.js','**/*.jsx'],
      env: {
        browser: true,
        commonjs: true,
      },
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        '@stylistic/js/semi': 'off',
        '@typescript-eslint/semi': 'error',
        '@stylistic/js/indent': 'off',
        '@typescript-eslint/indent': ['error', 2],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    }
  ],
};