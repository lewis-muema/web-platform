<template lang="html">
    <div>
        <div class="payment--loading-title">
        {{payment_loading_title}}
        </div>
        <div class="payment--mpesa-image">
            <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/success.png"/>
        </div>
        <div class="paymemt--mpesa-loader-actions">
            <button type="button" class="button-primary paymentbody--input-button" @click="backToPaymentRequest">
                Ok
            </button>
        </div>  
    </div>
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "payment_success",
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
      return "Your payment was successful";
    }
  }
};
</script>

<style lang="css">
</style>
