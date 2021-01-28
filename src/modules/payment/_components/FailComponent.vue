<template lang="html">
  <div>
    <div class="payment--loading-title">
      {{ payment_loading_title }}
    </div>
    <div class="payment--mpesa-image">
      <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/fail.png" />
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
import { resolve } from 'path';
import { mapActions } from 'vuex';

export default {
  name: 'PaymentFail',
  data() {
    return {
      loading: true,
      paybillCredentials: {},
    };
  },
  computed: {
    payment_loading_title() {
      return `Sorry, Safaricom cannot be reached. Instead, please pay to Pay Bill no. ${
        this.paybillCredentials.pay_bill
      } with Account Number.${this.paybillCredentials.account_no}`;
    },
    getSession(){
      return this.$store.getters.getSession;
    }
  },
  mounted() {
    this.requestPaybillCredentials();
  },
  methods: {
    ...mapActions({
      _resetMpesaPaymentRequest: '$_payment/resetMpesaPaymentRequest',
      getPaybill: '$_payment/fetchPaybillCredentials',
    }),
    backToPaymentRequest() {
      const payload = {};
      this.$store.dispatch('resetMpesaPaymentRequest', payload).then(
        (response) => {},
        (error) => {
          // ...
        }
      );
    },

    requestPaybillCredentials() {
      const defaultUser = this.getSession.default;

      let copId = defaultUser === 'biz' ? this.getSession[defaultUser].cop_id : 0;

      let userId = this.getSession[defaultUser].user_id;
      const payload = { cop_id: copId, user_id: userId };

      const full_payload = {
        values: payload,
        vm: this,
        app: 'CUSTOMERS_APP_AUTH',
        endpoint: 'mpesa/paybill',
      };

      return new Promise((resolve) => {
        this.getPaybill(full_payload).then(
          (response) => {
            this.paybillCredentials = response;
            resolve(true);
          },
          (error) => {
            resolve(false);
          }
        );
      });
    },
  },
};
</script>

<style lang="css"></style>
