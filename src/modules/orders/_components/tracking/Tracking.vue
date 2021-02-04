<template lang="html">
  <div class="">
    <a
      v-if="this.$route.name != 'tracking_external'"
      class="back--button"
      @click="$router.push('/orders')"
    >
      <i class="el-icon-back" />
    </a>
    <info-window :key="componentKey" />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faWallet } from '@fortawesome/free-solid-svg-icons';
import VeeValidate, { Validator } from 'vee-validate';
import TrackingStore from './_store';
import InfoWindow from './_components/InfoComponent.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';
import paymentsModuleStore from '../../../payment/_store';
import orderPlacementStore from '../order_placement/_store';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => 'The phone number not valid',
  validate: (value) => {
    let validity = false;
    try {
      const rawNumber = phoneUtil.parseAndKeepRawInput(value);
      const numberCode = phoneUtil.getRegionCodeForNumber(rawNumber);
      const number = phoneUtil.parse(value, numberCode);
      validity = phoneUtil.isValidNumber(number);
    } catch (e) {
      validity = false;
    }
    return validity;
  },
});

library.add(faArrowLeft);
library.add(faWallet);

export default {
  name: 'Tracking',
  components: { InfoWindow },
  mixins: [RegisterStoreModule],
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: {
    $route() {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.hide_vendors();
      this.componentKey += 1;
    },
  },
  created() {
    const STORE_PARENT = '$_orders';
    const STORE_KEY = '$_tracking';
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT, STORE_KEY], TrackingStore);
    }
    this.instantiateHomeComponent();
  },
  mounted() {
    this.change_page(1);
    this.hide_vendors();
    this.componentKey += 1;
  },
  methods: {
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      change_page: '$_orders/setPage',
    }),
    instantiateHomeComponent() {
      this.registerPaymentModule();
      this.registerOrderPlacementModule();
    },
    registerPaymentModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_payment !== undefined;

      if (!moduleIsRegistered) {
        this.$store.registerModule('$_payment', paymentsModuleStore);
      }
    },
    registerOrderPlacementModule() {
      let moduleIsRegistered = false;
      try {
        moduleIsRegistered = this.$store._modules.root._children.$_orders._children.$_home !== undefined;
      } catch (er) {
        //
      }

      if (!moduleIsRegistered) {
        this.$store.registerModule(['$_orders', '$_home'], orderPlacementStore);
      }
    },
  },
};
</script>

<style lang="css">
.back--button
{
  position: absolute;
  top: 80px;
  left: 10px;
  border: 1px solid #55555500;
  background-color: #fff;
  border-radius: 50%;
  padding: 15px;
  font-size: larger;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  cursor: pointer;
  color: #555;
}
</style>
