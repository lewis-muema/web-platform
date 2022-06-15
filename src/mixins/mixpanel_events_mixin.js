const MixpanelEventsMixin = {
  methods: {
    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
export default MixpanelEventsMixin;
