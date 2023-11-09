module.exports = {
  env: {
   // browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    //'no-console': 'off',
    quotes: [
      'error',
      'single',
    ],
    'no-underscore-dangle': 'allow',
  },
};
// module.exports = {
//   extends: 'airbnb-base',
//   rules: {
//     'no-underscore-dangle': ['error', { 'allow': ['_id']}]
//    },
// };