var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  ENVIRONMENT: '"development"',
  DEBUG_MODE : true,
  NODE_PRIVATE_API: '"https://privateapitest.sendyit.com/v1/"',
  PRIVATE_API:'"https://apitest.sendyit.com/parcel/index.php/api/v11/"',
  BACKEND_CUSTOMERS_APP:'"https://staging.sendyit.com/customers/"',
});
