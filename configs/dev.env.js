var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENVIRONMENT: '"development"',
  DEBUG_MODE : true,
  NODE_PARTNER_API: '"https://privateapitest.sendyit.com/v1/"',
  PRIVATE_API:'"https://apitest.sendyit.com/parcel/index.php/api/v10/"'
});
