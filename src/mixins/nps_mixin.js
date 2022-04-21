import { mapGetters, mapMutations } from 'vuex';

const NpsMxn = {
  data() {
    return {
      nps_status: false,
    };
  },
  computed: {
    ...mapGetters({
      getNPSStatus: 'getNPSStatus',
    }),
  },
  watch: {
    getNPSStatus(status) {
      this.nps_status = status;
    },
  },
  methods: {
    ...mapMutations({
      setNPSStatus: 'setNPSStatus',
    }),

    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
  },

};
export default NpsMxn;
