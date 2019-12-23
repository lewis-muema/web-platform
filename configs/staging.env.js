// configs for the staging env (the pre-prod environment)
module.exports = {
  ENVIRONMENT: '"staging"',
  DEBUG_MODE: true,
  NODE_PRIVATE_API: '"https://auth.staging.sendyit.com/v1/"',
  PRIVATE_API: '"https://api.staging.sendyit.com/parcel/index.php/api/v11/"',
  BACKEND_CUSTOMERS_APP: '"https://customers.staging.sendyit.com/customers/"',
  BACKEND_API_KEY: '"4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT"',
  DOMAIN: '"app.staging.sendyit.com"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: "'AIzaSyBQMADIJhz5ckM28Zt0eWKbZfQyzsHXYCI'",
  FIREBASE_CONFIG:
    "{apiKey: 'AIzaSyAdX8pwL-CmC8srLn2LaCzhhnhwgJx9lXc',authDomain: 'sendymain.firebaseapp.com',databaseURL: 'https://sendymain.firebaseio.com', projectId: 'sendymain',storageBucket: 'sendymain.appspot.com',messagingSenderId: '1083459536124',appId: '1:1083459536124:web:c3706df9c3efc2cbe9c379'}",
  ELASTIC_APM_SERVER_URL: '""https://staging-apm.sendyit.com:443"',
  ELASTIC_APM_ENVIRONMENT: '"staging"',
};
