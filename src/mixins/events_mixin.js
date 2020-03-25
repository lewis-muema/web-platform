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
  },
};
export default EventsMixin;
