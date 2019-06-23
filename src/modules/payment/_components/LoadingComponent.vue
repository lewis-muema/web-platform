<template lang="html">
  <div>
    <div class="payment--loading-title">
      {{ payment_loading_title }}
    </div>
    <div class="payment--mpesa-loader" />
    <div class="paymemt--mpesa-loader-actions">
      <button
        type="button"
        class="button-primary paymentbody--input-button"
        @click="cancelPaymentRequest"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'PaymentLoading',
  props: {
    payMethod: {
      type: String,
      default: 'mpesa',
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    payment_loading_title() {
      if (this.pay_method === 'mpesa') {
        return 'Please follow the M-Pesa instructions on your phone screen';
      }
      if (this.pay_method === 'card') {
        return 'Processing your card operation';
      }
    },
  },
  methods: {
    ...mapActions(['$_payment/resetMpesaPaymentRequest', '$_payment/resetCardPaymentRequest']),
    cancelPaymentRequest() {
      const payload = {};
      if (this.pay_method === 'mpesa') {
        this.$store
          .dispatch('$_payment/resetMpesaPaymentRequest', payload)
          .then((response) => {}, (error) => {});
      } else {
        this.$store
          .dispatch('$_payment/resetCardPaymentRequest', payload)
          .then((response) => {}, (error) => {});
      }
    },
  },
};
</script>

<style lang="css"></style>
