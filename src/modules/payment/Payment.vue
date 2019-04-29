<template lang="html">
  <div class="">
    <main-header />
    <div class="tracking-back-button">
      <i class="el-icon-back edit-back" @click="go_back()" />
    </div>
    <div id="payment_container" class="container-small">
      <component :is="currentPageHeader" class="payment--header" />
      <payment-body />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWallet, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import payment_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import AccountBalance from './_components/AccountBalance.vue';
import OrderCost from './_components/OrderCost.vue';
import PaymentBody from './_components/PaymentBody.vue';
const currencyConversion = require('country-tz-currency');

library.add(faWallet, faCcVisa, faCcMastercard, faTrash);

export default {
  name: 'Payment',
  components: {
    MainHeader,
    AccountBalance,
    OrderCost,
    PaymentBody,
  },
  mixins: [RegisterStoreModule],
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
    currentPageHeader() {
      return 'account-balance';
    },
  },
  watch: {
    getSession: {
      handler() {
        this.$router.push('/orders');
      },
      deep: true,
    },
  },
  created() {
    this.registerPaymentModule();
  },
  mounted() {
    this.checkUserLocation();
  },
  methods: {
    ...mapActions({
      requestCountryCode: '$_payment/requestCountryCode',
    }),

    go_back() {
      this.$router.go(-1);
    },

    registerPaymentModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_payment !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_payment', payment_store);
      }
    },
    checkUserLocation() {
      let markedCoords = '';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          let lat = position.coords.latitude;
          let long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      const payload = {};
      payload.coordinates = position;
      let full_payload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'geocountry',
      };
      this.requestCountryCode(full_payload).then(
        response => {
          let code = response.country_code;
          this.$store.commit('setCountryCode', code);
          let country_code_data = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', country_code_data.currencyCode);
        },
        error => {}
      );
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/payment.css";
</style>
