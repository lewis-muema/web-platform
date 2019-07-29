<template lang="html">
  <div class="monthly-dashboard">
    <iframe
      class="monthly-iframe"
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
  name: 'Monthly',
  data() {
    return {
      resource: 17,
    };
  },
  computed: {
    account() {
      if (typeof this.$store.getters.getSession.biz !== undefined) {
        return `SENDY${this.$store.getters.getSession.biz.cop_id}`;
      }
    },
  },
  methods: {
    showBoard() {
      const METABASE_SITE_URL = 'https://metabase.sendyit.com';
      const METABASE_SECRET_KEY = 'baddc28e2149d570c8967cd8c6589e13d7356cd6a1c71e50f07d5f08d6b3bdc6';

      const payload = {
        resource: { dashboard: parseInt('100017'.substring(4), 10) },
        params: {
          acc_no: this.account,
        },
      };
      const token = jwt.sign(payload, METABASE_SECRET_KEY);

      const iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=false&titled=false`;

      return iframeUrl;
    },
  },
};
</script>

<style lang="css">
.monthly-iframe
{
  min-height: 142vh;
}
.monthly-dashboard{
    height: auto;
}
</style>
