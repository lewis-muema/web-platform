<template lang="html">
  <div class="homeview--freight">
    <div class="homeview--outer">
      <order-placement v-if="componentKey" />
    </div>
  </div>
</template>

<script>
import OrderPlacement from './FreightOrderPlacement.vue';

export default {
  name: 'Home',
  components: { OrderPlacement },
  data() {
    return {
      componentKey: true,
    };
  },
  mounted() {
    this.rootListener();
  },
  methods: {
    rootListener() {
      this.$root.$on('Order Placement Force Update', () => {
        this.componentKey = false;
        setTimeout(() => {
          this.componentKey = true;
        }, 200);
      });
    },
  },
};
</script>
<style lang="css">
@import '../../../../assets/styles/orders_order_placement.css?v=2';
</style>
