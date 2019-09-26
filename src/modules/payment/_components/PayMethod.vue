<template lang="html">
  <div class="paymethod paymethod--menu">
    <div
      v-for="method in payment_methods"
      :key="method.payment_method_id"
    >
      <a
        href="#"
        class="paymethod--link"
        @click="setCurrentRoute(method.name)"
      > {{ method.name }} </a>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'PayMethod',
  data() {
    return {
      payment_methods: [],
    };
  },
  mounted() {
    this.getPaymentOptions();
  },
  methods: {
    ...mapActions({ requestPaymentOptionsAction: '$_payment/requestPaymentOptions' }),

    getPaymentOptions() {
      const session = this.$store.getters.getSession;
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
        endpoint: 'accounts/pay_methods',
      };
      this.requestPaymentOptionsAction(fullPayload).then(
        (response) => {
          if (response.status) {
            this.payment_methods = response.payment_methods;
          }
        },
        (error) => {
          console.log('error', error);
        },
      );
    },
    setCurrentRoute(method) {
      const paymentMethod = method.replace(/-/g, '');
      this.$router.push(`/payment/${paymentMethod.toLowerCase()}`);
    },
  },
};
</script>

<style lang="css">
  .paymethod--menu {
    padding-bottom: 11px !important;
  }
  a:focus{
    border-bottom: 3px solid #1782c5 !important;
  }
</style>
