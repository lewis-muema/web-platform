// configs for the staging env (the pre-prod environment)
module.exports = {
  ENVIRONMENT: '"staging"',
  DEBUG_MODE: true,
  NODE_PRIVATE_API: '"https://auth.staging.sendyit.com/v1/"',
  PRIVATE_API: '"https://auth.sendyit.com/parcel/"',
  BACKEND_CUSTOMERS_APP: '"https://customers.staging.sendyit.com/customers/"',
  BACKEND_API_KEY: '"4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT"',
  DOMAIN: '"app.staging.sendyit.com"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: "'AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc'",
  FIREBASE_CONFIG:
    "{apiKey: 'AIzaSyAdX8pwL-CmC8srLn2LaCzhhnhwgJx9lXc',authDomain: 'sendymain.firebaseapp.com',databaseURL: 'https://sendymain.firebaseio.com', projectId: 'sendymain',storageBucket: 'sendymain.appspot.com',messagingSenderId: '1083459536124',appId: '1:1083459536124:web:c3706df9c3efc2cbe9c379'}",
  ELASTIC_APM_SERVICE_NAME: '"vue-web-platform-client"',
  ELASTIC_APM_SERVICE_VERSION: '"1.0.0"',
  ELASTIC_APM_SERVER_URL: '"https://staging-elk.sendyit.com:8200"',
  ELASTIC_APM_ENVIRONMENT: '"staging"',
  ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS: '"https://authtest.sendyit.com"',
  HUBSPOT_URL: '"https://api.hsforms.com/submissions/v3/integration/submit/"',
  ADONIS_PRIVATE_API: '"https://auth.staging.sendyit.com/adonis/"',
  ORDERS_APP: '"https://auth.sendyit.com/orders/"',
  CUSTOMERS_APP: '"https://auth.sendyit.com/customers/"',
  OWNER_SEARCH: '"https://gate.sendyit.com/solr/owner/"',
  CUSTOMERS_APP: '"https://auth.sendyit.com/customers/"',
  VGS_VAULT_ID: '"tntr6hr8zz0"',
  VGS_ENVIRONMENT: '"live"',
  CUSTOMERS_APP_AUTH:'"https://authtest.sendyit.com/customers/"',
};
