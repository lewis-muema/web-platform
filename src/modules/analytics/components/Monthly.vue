<template lang="html">
    <div class="dashboard">
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
    name:"Monthly",
    data: function() {
        return {
          resource: 17
        }
      },
      methods: {
        showBoard: function() {
          var METABASE_SITE_URL = "https://metabase.sendyit.com";
          var METABASE_SECRET_KEY = "baddc28e2149d570c8967cd8c6589e13d7356cd6a1c71e50f07d5f08d6b3bdc6";

          var payload = {
            resource: { dashboard: parseInt("100017".substring(4)) },
            params: {
              "acc_no": "SENDY"+1083
            }
          };
          var token = jwt.sign(payload, METABASE_SECRET_KEY);

          var iframeUrl = METABASE_SITE_URL + "/embed/dashboard/" + token + "#bordered=false&titled=false";

          return iframeUrl
        }
      },
      computed: {
        getSession () {
          return this.$store.getters.getSession
        }
      }
}
</script>

<style lang="css">
.iframe
{
  min-height: 142vh;
}
.dashboard{
    height: auto;
}
</style>
