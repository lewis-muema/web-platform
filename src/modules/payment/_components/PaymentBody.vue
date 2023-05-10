<template lang="html">
  <div class="paymentbody">
    <div
      v-if="defaultCurrency !== getActiveCurrency"
      class="payment-overlay"
    />
    <pay-method />
    <div class="">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PayMethod from './PayMethod.vue';
import EventsMixin from '../../../mixins/events_mixin';

export default {
  name: 'PaymentBody',
  components: { PayMethod },
  mixins: [EventsMixin],
  computed: {
    ...mapGetters({
      getDefaultCurrency: 'getDefaultCurrency',
      getActiveCurrency: '$_payment/getActiveCurrency',
    }),
    defaultCurrency() {
      const session = this.$store.getters.getSession;
      if (session[session.default]) {
        return session[session.default].default_currency;
      }
      return this.getDefaultCurrency;
    },
  },
  mounted() {
    this.sendGA4Events('open_payment_page');
  },
  methods: {
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },
  },
};
</script>

<style lang="css">
.paymentbody {
  margin-top: 50px;
  position: relative;
}
.paymentbody--input-wrap
{
  display: flex;
  min-height: 4rem;
  margin: .5em;
}
.paymentbody--input {
  margin-top: 20px;
}
.paymentbody--input-spaced
{
  justify-content: space-between;
}
.paymentbody--input-button
{
  margin-top: 20px;
  text-transform: capitalize;
  font-size: 14px;
  letter-spacing: 1.1px;
  width: 100%;
  height: 45px;
}
.payment-overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #ffffffb5;
  z-index: 200;
}
</style>
