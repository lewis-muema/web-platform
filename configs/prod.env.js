module.exports = {
  ENVIRONMENT: '"production"',
  DEBUG_MODE: false,
  NODE_PRIVATE_API: '"https://auth.sendyit.com/v1/"',
  PRIVATE_API: '"https://api.sendyit.com/parcel/api/v11/"',
  BACKEND_CUSTOMERS_APP: '"https://prod.sendyit.com/customers/"',
  DOMAIN: '"webapp.sendyit.com"',
  SENTRY_DSN: '"https://f399dc8511c14d6ea9022d28a8955641@sentry.io/1336627"',
  IMAGES_BASE: '"https://images.sendyit.com/"',
  GOOGLE_API_KEY: process.env.GOOGL_API_KEY,
};


delete process.env.GOOGL_API_KEY
