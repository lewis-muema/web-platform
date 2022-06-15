<template lang="html">
  <div
    v-if="!loading"
    class="dashboard"
  >
    <iframe
      class="iframe"
      :src="showBoard()"
      frameborder="0"
      width="100%"
      height="100%"
      allowtransparency
    />
  </div>
</template>

<script>
const jwt = require('jsonwebtoken');

export default {
  name: 'Weekly',
  data() {
    return {
      loading: true,
      resource_id: 15,
    };
  },
  computed: {
    account() {
      if (typeof this.$store.getters.getSession.biz !== undefined) {
        return this.$store.getters.getSession.biz.cop_id;
      }
      return 0;
    },
  },
  mounted() {
    this.loading = false;
    this.trackMixpanelEvent('View Customer Analytics');
  },
  methods: {
    showBoard() {
      const METABASE_SITE_URL = 'https://metabase.sendyit.com';
      const METABASE_SECRET_KEY = 'baddc28e2149d570c8967cd8c6589e13d7356cd6a1c71e50f07d5f08d6b3bdc6';

      const payload = {
        resource: { dashboard: this.resource_id },
        params: {
          business_id: this.account,
        },
        exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
      };
      const token = jwt.sign(payload, METABASE_SECRET_KEY);

      const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=false&titled=true`;

      return iframeUrl;
    },
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
</script>

<style lang="css">
.iframe{
  min-height: 142vh;
}
.dashboard{
    height: auto;
}
.body--grey{
  background-color: #FFFFFF !important;
}
</style>
