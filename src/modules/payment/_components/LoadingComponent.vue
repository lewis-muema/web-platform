<template lang="html">
    <div>
        <div class="payment--loading-title">
        {{payment_loading_title}}
        </div>
        <div class="payment--mpesa-loader">
        </div>
        <div class="paymemt--mpesa-loader-actions">
            <button type="button" class="button-primary paymentbody--input-button" @click="cancelPaymentRequest">
                Cancel
            </button>
        </div>
    </div>
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "payment_loading",
  props: {
    pay_method: {
      type: String,
      default: "mpesa"
    }
  },
  data() {
    return {
      loading: true
    };
  },
  mounted() {},
  methods: {
    ...mapActions([
      "$_payment/terminateMpesaPaymentRequest",
      "$_payment/terminateCardPaymentRequest"
    ]),
    cancelPaymentRequest() {
      let payload = {};
      if (this.pay_method == "mpesa") {
        this.$store
          .dispatch("$_payment/terminateMpesaPaymentRequest", payload)
          .then(
            response => {
              console.log(response);
            },
            error => {
              console.log(error);
            }
          );
      } else {
        this.$store
          .dispatch("$_payment/terminateCardPaymentRequest", payload)
          .then(
            response => {
              console.log(response);
            },
            error => {
              console.log(error);
            }
          );
      }
    }
  },
  computed: {
    payment_loading_title() {
      if (this.pay_method == "mpesa") {
        return "Please follow the M-Pesa instructions on your phone screen";
      } else if (this.pay_method == "card") {
        return "Processing your card payment";
      }
    }
  }
};
</script>

<style lang="css">
</style>
