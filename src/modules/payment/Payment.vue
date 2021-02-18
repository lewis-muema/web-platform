<template lang="html">
  <div class="">
    <main-header />
    <div class="tracking-back-button">
      <i class="el-icon-back edit-back" @click="go_back()" />
    </div>
    <div id="payment_container" class="container-small">
      <component :is="currentPageHeader" class="payment--header" />
      <payment-body />
      <NPSFooter v-if="!nps_status" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWallet, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import paymentStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import AccountBalance from './_components/AccountBalance.vue';
import OrderCost from './_components/OrderCost.vue';
import PaymentBody from './_components/PaymentBody.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';

const currencyConversion = require('country-tz-currency');

library.add(faWallet, faCcVisa, faCcMastercard, faTrash);

export default {
  name: 'Payment',
  components: {
    MainHeader,
    AccountBalance,
    OrderCost,
    PaymentBody,
    NPSFooter,
  },
  mixins: [RegisterStoreModule, NpsMixin],
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
    this.trackMixpanelEvent('Opened Paymnents Page');
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
        this.$store.registerModule('$_payment', paymentStore);
      }
    },
    checkUserLocation() {
      let markedCoords = '';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      const payload = {};
      payload.coordinates = position;
      const fullPayload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'geocountry',
      };
      this.requestCountryCode(fullPayload).then(
        response => {
          const code = response.country_code;
          this.$store.commit('setCountryCode', code);
          const countryCodeData = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', countryCodeData.currencyCode);
        },
        error => {
          // ...
        }
      );
    },

    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/payment.css?v=1";
</style>
