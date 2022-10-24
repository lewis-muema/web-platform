module.exports = {
  extends: ['plugin:vue/recommended', 'airbnb-base'],
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
    'max-len': 'off',
    'no-unused-vars': 'off',
    'import/no-cycle': 'off',
    'object-curly-newline': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'no-case-declarations': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-restricted-globals': 'off',
    'arrow-parens': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/label-has-for': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-restricted-syntax': 'off',
    camelcase: 'off',
    'vue/no-v-html': 'off',
    'operator-linebreak': 'off',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    extends: 'standard',
    parser: '@babel/eslint-parser',
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
