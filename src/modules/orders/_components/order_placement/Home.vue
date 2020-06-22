<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--outer-selection-panel">
      <div
        class="homeview--outer-selections homeview--outer-selections__active"
        @click="switchMode('/orders')"
      >
        On Demand
      </div>
      <div
        class="homeview--outer-selections"
        @click="switchMode('/orders/dedicated/no-destination')"
      >
        Dedicated
      </div>
    </div>
    <order-placement />
  </div>
</template>

<script>
import OrderPlacement from './OrderPlacement.vue';
import EventsMixin from '../../../../mixins/events_mixin';


export default {
  name: 'Home',
  components: { OrderPlacement },
  mixins: [EventsMixin],
  data() {
    return {
      mode: 1,
    };
  },
  methods: {
    switchMode(route) {
      if (route === '/orders/dedicated/no-destination') {
        this.selectDedicatedVehicles();
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
          mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css?v=2";
</style>
