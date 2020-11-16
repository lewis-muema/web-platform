const EventsMixin = {
  methods: {
    fireGAEvent(payload) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          window.ga('send', 'event', {
            eventCategory: payload.eventCategory,
            eventAction: payload.eventAction,
            eventLabel: payload.eventLabel,
          });
        }
      } catch (er) {
        // ...
      }
    },
    trackEcommerceData(payload) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          window.ga('ecommerce:addTransaction', {
            id: payload.orderNo,
            affiliation: payload.vendorType,
            revenue: payload.amount,
          });
          window.ga('ecommerce:send');
        }
      } catch (er) {
        // ...
      }
    },
  },
};
export default EventsMixin;
