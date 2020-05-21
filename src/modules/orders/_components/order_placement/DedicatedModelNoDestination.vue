<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--outer-selection-panel">
      <div
        class="homeview--outer-selections"
        @click="switchMode('/orders')"
      >
        On Demand
      </div>
      <div
        class="homeview--outer-selections homeview--outer-selections__active"
        @click="switchMode('/orders/dedicated/no-destination')"
      >
        Dedicated Vehicles
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
          <label for="no-destination">No destination</label>
        </div>
        <div class="homeview--outer-mode-options">
          <input
            id="multi-destination"
            v-model="mode"
            type="radio"
            value="/orders/dedicated/multi-destination"
          ><br>
          <label for="multi-destination">Multi destination</label>
        </div>
      </div>
      <DedicatedOrderPlacement />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import orderPlacementStore from './_store';
import DedicatedOrderPlacement from './DedicatedOrderPlacement.vue';

export default {
  name: 'DedicatedNoDestinationModel',
  components: { DedicatedOrderPlacement },
  data() {
    return {
      mode: '/orders/dedicated/no-destination',
    };
  },
  computed: {
    ...mapGetters({
      get_extended_options: '$_orders/$_home/getExtendedOptions',
    }),
  },
  watch: {
    mode(val) {
      this.switchRoute(val);
    },
  },
  created() {
    this.registerOrderPlacementModule();
  },
  methods: {
    switchMode(route) {
      this.$router.push(route);
    },
    switchRoute(route) {
      this.$router.push(route);
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
@import "../../../../assets/styles/orders_order_placement.css?v=2";
</style>
