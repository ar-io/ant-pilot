module.exports = {
  root: true,
  plugins: ['@typescript-eslint', 'prettier', 'header'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:jest-formatting/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: ['tools/**/*', 'tests/**/*'], // Replace with your folder path
      rules: {
        'no-console': 'off', // Turn off no-console for these files
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '_' }],
    'header/header': ['error', 'resources/license.header.js'],
  },
};
