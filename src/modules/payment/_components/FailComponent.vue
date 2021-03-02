<template lang="html">
  <div>
    <div class="payment--loading-title">
      {{ payment_loading_title }}
    </div>
    <div class="payment--mpesa-image">
      <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/fail.png">
    </div>
    <div class="paymemt--mpesa-loader-actions">
      <button
        type="button"
        class="button-primary align-left"
        @click="backToPaymentRequest"
      >
        {{$t('general.help')}}
      </button>
      <button
        type="button"
        class="button-primary align-right"
        @click="backToPaymentRequest"
      >
        {{$t('general.ok')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'PaymentFail',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    payment_loading_title() {
      const session = this.$store.getters.getSession;
      let accountNo = session[session.default].user_phone;
      if (session.default === 'biz') {
        accountNo = `SENDY ${session.biz.cop_id}`;
      }
      return `${this.$t('general.sorry_safaricom')} ${accountNo}`;
    },
  },
  methods: {
    ...mapActions(['$_payment/resetMpesaPaymentRequest']),
    backToPaymentRequest() {
      const payload = {};
      this.$store.dispatch('$_payment/resetMpesaPaymentRequest', payload).then(
        (response) => {},
        (error) => {
          // ...
        },
      );
    },
  },
};
</script>

<style lang="css"></style>
