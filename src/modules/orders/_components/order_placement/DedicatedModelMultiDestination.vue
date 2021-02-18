<template lang="html">
  <div
    v-if="getDedicatedAccessStatus"
    class="homeview--outer"
  >
    <div class="homeview--outer-selection-panel">
      <div
        class="homeview--outer-selections"
        @click="switchMode('/orders')"
      >
        {{$t('general.on_demand')}}
      </div>
      <div
        class="homeview--outer-selections homeview--outer-selections__active"
        @click="switchMode('/orders/dedicated/no-destination')"
      >
       {{$t('general.dedicated')}}
      </div>
    </div>
    <div>
      <div
        v-if="!get_extended_options"
        class="homeview--outer-modes"
      >
        <div class="homeview--outer-mode-options">
          <input
            id="no-destination"
            v-model="mode"
            type="radio"
            value="/orders/dedicated/no-destination"
          ><br>
          <label for="no-destination">{{$t('general.open_destination')}}</label>
        </div>
        <div class="homeview--outer-mode-options">
          <input
            id="multi-destination"
            v-model="mode"
            type="radio"
            value="/orders/dedicated/multi-destination"
          ><br>
          <label for="multi-destination">{{$t('general.multi_destination')}}</label>
        </div>
      </div>
      <OrderPlacement />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import orderPlacementStore from './_store';
import OrderPlacement from './OrderPlacement.vue';
import EventsMixin from '../../../../mixins/events_mixin';

export default {
  name: 'DedicatedMultiDestinationModel',
  components: { OrderPlacement },
  mixins: [EventsMixin],
  data() {
    return {
      mode: '/orders/dedicated/multi-destination',
    };
  },
  computed: {
    ...mapGetters({
      get_extended_options: '$_orders/$_home/getExtendedOptions',
      getDedicatedAccessStatus: 'getDedicatedAccessStatus',
    }),
  },
  watch: {
    mode(val) {
      this.switchMode(val);
    },
  },
  created() {
    this.registerOrderPlacementModule();
  },
  methods: {
    switchMode(route) {
      if (route === '/orders/dedicated/no-destination') {
        this.selectNoDestnationOrder('Select no-destination orders');
      }
      this.$router.push(route);
    },
    selectNoDestnationOrder(name) {
      const acc = this.$store.getters.getSession;
      const accDefault = acc[acc.default];
      this.trackMixpanelEvent(name, {
        'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Account': accDefault.user_email,
        'Client name': accDefault.user_name,
      });
      this.trackGAEvent(name);
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
          mixpanel.track(name, event);
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
@import "../../../../assets/styles/orders_order_placement.css?v=1";
</style>
