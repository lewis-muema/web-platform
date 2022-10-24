module.exports = {
  extends: ['plugin:vue/recommended', 'airbnb'],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/no-unresolved': [
      'error',
      {
        ignore: ['@/'],
      },
    ],
    'no-plusplus': 'off',
    'import/extensions': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    extends: 'standard',
    parser: 'babel-eslint',
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['@/data/state'],
      },
    },
  },
  globals: {
    mixpanel: 'readonly',
    analytics: 'readonly',
  },
};
