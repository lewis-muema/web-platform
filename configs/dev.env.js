var merge = require("webpack-merge");
var prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  ENVIRONMENT: '"development"',
  DEBUG_MODE: true,
  // NODE_PRIVATE_API: '"https://authtest.sendyit.com/v1/"',
  NODE_PRIVATE_API: '"https://privateapitest.sendyit.com/v1/"',
  PRIVATE_API: '"https://apitest.sendyit.com/parcel/index.php/api/v11/"',
  //PRIVATE_API: '"http://localhost:8888/parcel/index.php/api/v11/"',
  BACKEND_CUSTOMERS_APP: '"https://customerstest.sendyit.com/customers/"',
  BACKEND_API_KEY: '"4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT"',
  DOMAIN: '"localhost"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: "'AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI'",
});
