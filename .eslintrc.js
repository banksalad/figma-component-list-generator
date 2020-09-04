module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'eol-last': ['error', 'always'],
    'max-len': ['error', {
      'code': 100,
      'ignoreComments': false,
      'ignoreUrls': true,
    }],
    'semi': 2,
    'indent': [
      'error', 2,
      { 'SwitchCase': 1 },
    ],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
    ],
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'object-curly-spacing': ['error', 'always', { 'objectsInObjects': false }],
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true,
      'avoidEscape': true,
    }],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
  },
};
