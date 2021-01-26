<template lang="html">
  <div class="paymethod">
    <router-link class="paymethod--link menu-links" :key="method.Payment_method_id" v-for="method in payment_methods" :to="`/payment/${method.name.replace(/-/g, '').toLowerCase()}`">
    {{ method.name }}
</router-link>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

export default {
  name: 'PayMethod',
  data() {
    return {
      payment_methods: [],
      cardActiveStatus: false,
    };
  },
  mounted() {
    this.getPaymentOptions();
    this.setCardPaymentStatus(true);
  },
  methods: {
    ...mapActions({ requestPaymentOptionsAction: '$_payment/requestPaymentOptions' }),
    ...mapMutations({ setCardPaymentStatus: '$_payment/setCardPaymentStatus'}),

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
            this.payment_methods.forEach((row) => {
              if (row.payment_method_id === 2) {
                this.cardActiveStatus = true;
              }
            });
            if (!this.cardActiveStatus) {
              this.$router.push('/payment/promocode');
            }
            this.setCardPaymentStatus(this.cardActiveStatus);
          }
        },
        (error) => {
          console.log('error', error);
        }
      );
    },
  },
};
</script>

<style lang="css">
.menu-links{
  margin-bottom: -0.2rem !important;
}
a:hover {
 cursor: pointer;
}
</style>
