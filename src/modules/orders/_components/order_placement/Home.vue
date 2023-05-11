<template lang="html">
  <div class="homeview--outer">
    <div
      v-if="getDedicatedAccessStatus"
      class="homeview--outer-selection-panel"
    >
      <div
        class="homeview--outer-selections homeview--outer-selections__active"
        @click="switchMode('/orders')"
      >
        {{ $t('general.on_demand') }}
      </div>
      <div
        class="homeview--outer-selections"
        @click="switchMode('/orders/dedicated/no-destination');"
      >
        {{ $t('general.dedicated') }}
        <span class="tour-pointer-1" />
      </div>
    </div>
    <order-placement />
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import { mapGetters } from 'vuex';
import orderPlacementStore from './_store';
import OrderPlacement from './OrderPlacement.vue';
import EventsMixin from '../../../../mixins/events_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => { { $t('general.phone_number_not_valid'); } },
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

export default {
  name: 'Home',
  components: { OrderPlacement },
  mixins: [EventsMixin],
  data() {
    return {
      mode: 1,
    };
  },
  computed: {
    ...mapGetters({
      getDedicatedAccessStatus: 'getDedicatedAccessStatus',
    }),
  },
  created() {
    this.registerOrderPlacementModule();
  },
  methods: {
    switchMode(route) {
      if (route === '/orders/dedicated/no-destination') {
        this.selectDedicatedVehicles();
        this.$root.$emit('tour class', 1, 2000);
      }
      this.$router.push(route);
    },
    selectDedicatedVehicles() {
      const acc = this.$store.getters.getSession;
      const accDefault = acc[acc.default];
      this.trackMixpanelEvent('Select dedicated vehicles', {
        'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Account': accDefault.user_email,
        'Client name': accDefault.user_name,
      });
      this.trackGAEvent('Select dedicated vehicles');
      this.trackMixpanelEvent('Select no-destination orders', {
        'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Account': accDefault.user_email,
        'Client name': accDefault.user_name,
      });
      this.trackGAEvent('Select no-destination orders');
    },
    trackGAEvent(eventLabel) {
      const eventPayload = {
        eventCategory: 'Sendy Dedicated',
        eventAction: 'Click',
        eventLabel,
      };
      this.fireGAEvent(eventPayload);
    },
    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
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
@import "../../../../assets/styles/orders_order_placement.css";
.tour-pointer-1 {
  position: relative;
  left: 20px;
}
</style>
