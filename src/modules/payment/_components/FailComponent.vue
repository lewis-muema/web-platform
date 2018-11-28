<template lang="html">
    <div>
        <div class="payment--loading-title">
        {{payment_loading_title}}
        </div>
        <div class="payment--mpesa-image">
            <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/fail.png"/>
        </div>
        <div class="paymemt--mpesa-loader-actions">
            <button type="button" class="button-primary align-left" @click="backToPaymentRequest">
                Help
            </button>
            <button type="button" class="button-primary align-right" @click="backToPaymentRequest">
                Ok
            </button>
            
        </div>  
    </div>
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "payment_fail",
  data() {
    return {
      loading: true
    };
  },
  mounted() {},
  methods: {
    ...mapActions(["$_payment/resetMpesaPaymentRequest"]),
    backToPaymentRequest() {
      let payload = {};
      this.$store.dispatch("$_payment/resetMpesaPaymentRequest", payload).then(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  },
  computed: {
    payment_loading_title() {
      let session = this.$store.getters.getSession;
      let account_no = session[session.default]["user_phone"];
      if (session.default == "biz") {
        account_no = "SENDY" + session.biz.cop_id;
      }
      return (
        "Sorry, Safaricom cannot be reached. Instead, please pay to Pay Bill no. 848450 with Account Number." +
        account_no
      );
    }
  }
};
</script>

<style lang="css">
</style>
