module.exports = {
  extractCSS: true,
  preserveWhitespace: false,
  postcss: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 3 versions'],
    }),
  ],
};
