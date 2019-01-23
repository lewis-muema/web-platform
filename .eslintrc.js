module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  rules: {
    "no-debugger": process.env.NODE_ENV === 'production' ? 2 : 0,
  }
}
