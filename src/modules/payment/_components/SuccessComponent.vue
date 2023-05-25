<template lang="html">
  <div>
    <div class="payment--loading-title">
      {{ payment_loading_title }}
    </div>
    <div class="payment--mpesa-image">
      <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/success.png">
    </div>
    <div class="paymemt--mpesa-loader-actions">
      <button
        type="button"
        class="button-primary paymentbody--input-button"
        @click="backToPaymentRequest"
      >
        {{$t('general.ok')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'PaymentSuccess',
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    this.requestRB();
  },
  methods: {
    ...mapActions(['$_payment/resetMpesaPaymentRequest']),
    backToPaymentRequest() {
      const payload = {};
      this.$store
        .dispatch('$_payment/resetMpesaPaymentRequest', payload)
        .then((response) => {}, (error) => {});
    },
    requestRB() {
      // this will request from the api and update the store
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }
      const running_balance_payload = {
        values: {
          cop_id,
          user_phone: session[session.default].user_phone,
        },
      };

      const payload = {
        values: running_balance_payload,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'running_balance',
      };

      this.$store
        .dispatch('requestRunningBalance', payload, { root: true })
        .then((response) => {}, (error) => {});
    },
  },
  computed: {
    payment_loading_title() {
      return this.$t('general.payment_was_successful');
    },
  },
};
</script>

<style lang="css"></style>
