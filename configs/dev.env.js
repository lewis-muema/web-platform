/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true}] */
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  ENVIRONMENT: '"development"',
  DEBUG_MODE: true,
  AUTH: '"https://authtest.sendyit.com/"',
  NODE_PRIVATE_API: '"https://authtest.sendyit.com/v1/"',
  PRIVATE_API: '"https://apitest.sendyit.com/parcel/index.php/api/v11/"',
  BACKEND_CUSTOMERS_APP: '"https://customerstest.sendyit.com/customers/"',
  PAYMENT_SERVICE: '"https://authtest.sendyit.com/localisation/"',
  BACKEND_API_KEY: '"4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT"',
  DOMAIN: '"localhost"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: "'AIzaSyAB963lJdUXP05F3DtURdwAZpuwpjOoS6w'",
  FIREBASE_CONFIG:
    "{apiKey: 'AIzaSyAdX8pwL-CmC8srLn2LaCzhhnhwgJx9lXc',authDomain: 'sendymain.firebaseapp.com',databaseURL: 'https://sendymain.firebaseio.com', projectId: 'sendymain',storageBucket: 'sendymain.appspot.com',messagingSenderId: '1083459536124',appId: '1:1083459536124:web:c3706df9c3efc2cbe9c379'}",
  ELASTIC_APM_SERVICE_NAME: '"vue-web-platform-client"',
  ELASTIC_APM_SERVICE_VERSION: '"1.0.0"',
  ELASTIC_APM_SERVER_URL: '"http://localhost:8200"',
  ELASTIC_APM_ENVIRONMENT: '"dev"',
  ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: '"https://authtest.sendyit.com"',
});
