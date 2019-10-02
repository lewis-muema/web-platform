//configs for the staging env (the pre-prod environment)
module.exports = {
  ENVIRONMENT: '"staging"',
  DEBUG_MODE: true,
  NODE_PRIVATE_API: '"https://auth.staging.sendyit.com/v1/"',
    PRIVATE_API: '"https://auth.staging.sendyit.com/parcel/"',
  BACKEND_CUSTOMERS_APP: '"https://customers.staging.sendyit.com/customers/"',
  BACKEND_API_KEY: '"4RNNeyATKN6B6S6XiOyJdPMEJ3oLRKBT"',
  DOMAIN: '"app.staging.sendyit.com"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: process.env.GOOGL_API_KEY,
};


delete process.env.GOOGL_API_KEY
