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
        Dedicated Vehicles
      </div>
    </div>
    <order-placement />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderPlacement from './OrderPlacement.vue';

export default {
  name: 'Home',
  components: { OrderPlacement },
  data() {
    return {
      mode: 1,
    };
  },
  methods: {
    switchMode(route) {
      this.$router.push(route);
    },
  },
};
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css?v=2";
</style>
