<template lang="html">
  <div class="homeview--outer">
    <order-placement />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderPlacement from './OrderPlacement.vue';

export default {
  name: 'Home',
  components: { OrderPlacement },
};
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css";
</style>
