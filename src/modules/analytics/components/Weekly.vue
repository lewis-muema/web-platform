<template lang="html">
    <div class="dashboard" v-if="!this.loading">
       <iframe class="iframe"
         v-bind:src="this.showBoard()"
         frameborder="0"
         width="100%"
         height="100%"
         allowtransparency>
       </iframe>
    </div>
</template>

<script>
let jwt = require("jsonwebtoken");
export default {
    name:"Weekly",
    data: function() {
        return {
          loading: true,
          resource: 17
        }
      },
      methods: {
        showBoard: function() {
          var METABASE_SITE_URL = "https://metabase.sendyit.com";
          var METABASE_SECRET_KEY = "baddc28e2149d570c8967cd8c6589e13d7356cd6a1c71e50f07d5f08d6b3bdc6";

          var payload = {
            resource: { dashboard: parseInt("100015".substring(4)) },
            params: {
              "acc_no": this.account
            }
          };
          var token = jwt.sign(payload, METABASE_SECRET_KEY);

          var iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=false&titled=false";

          return iframeUrl
        }
      },
      computed : {
        account: function() {
          if (typeof this.$store.getters.getSession.biz != undefined) {
            return "SENDY"+this.$store.getters.getSession.biz.cop_id
          }
        }
      },
      mounted() {
        this.loading = false
      }
}
</script>

<style lang="css">
.iframe{
  min-height: 142vh;
}
.dashboard{
    height: auto;
}
</style>
