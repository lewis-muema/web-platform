<template lang="html">
  <div class="paymethod">
    <router-link
      v-if="getCountryCode === 'KE' && mpesa_valid"
      class="paymethod--link"
      to="/payment/mpesa"
    >
      M-Pesa
    </router-link>
    <router-link
      class="paymethod--link"
      to="/payment/card"
    >
      Card
    </router-link>
    <router-link
      v-if="getCountryCode === 'KE' && mpesa_valid && currency === 'KES'"
      class="paymethod--link"
      to="/payment/promo"
    >
      Promo Code
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'PayMethod',
  data() {
    return {
      mpesa_valid: false,
      currency: 'KES',
    };
  },
  computed: {
    ...mapGetters({
      getCountryCode: 'getCountryCode',
    }),
  },
  created() {
    this.checkUserPhone();
    this.getPaymentOptions();
  },
  methods: {
    ...mapActions({ requestPaymentOptionsAction: '$_payment/requestPaymentOptions' }),

    checkUserPhone() {
      const session = this.$store.getters.getSession;
      const phone = session[session.default].user_phone;
      this.currency = session[session.default].default_currency;
      const intValue = phone.substring(0, 4);
      this.mpesa_valid = intValue !== '+256';
    },
    getPaymentOptions() {
      const session = this.$store.getters.getSession;
      console.log('tete', session);
      const countryCode = session[session.default].country_code;
      let accountType = '';
      const payOption = session[session.default].pay_option;
      if (session.default === 'biz') {
        if (payOption === 1) {
          accountType = 'Business Pre-Pay';
        } else if (payOption === 2) {
          accountType = 'Business Post-Pay';
        }
      } else if (session.default === 'peer') {
        accountType = 'Individual';
      }
      const payload = {
        country_code: countryCode,
        account_type: accountType,
        entry_point: 'Customer App Top Up',
      };
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'PAYMENT_SERVICE',
        endpoint: 'accounts/pay_method',
      };
      // const proxyurl = 'https://cors-anywhere.herokuapp.com/';
      // axios
      // eslint-disable-next-line max-len
      //   .post(`${proxyurl}${process.env.VUE_APP_PAYMENT_SERVICE}getaccounttypepaymentmethods`, payload, this.service_config)
      //   .then((response) => {
      //     this.payment_methods = JSON.parse(JSON.stringify(response.data.payment_methods));
      //   })
      //   .catch((error) => {
      //     this.errorObj = error.response;
      //   });
      this.requestPaymentOptionsAction(fullPayload).then(
        (response) => {
          console.log('response', response);
        },
        (error) => {
          console.log('error', error);
        },
      );
    },
  },
};
</script>

<style lang="css"></style>
