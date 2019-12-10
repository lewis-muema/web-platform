<template lang="html">
  <div class="homeview--freight">
    <div class="homeview--outer">
      <order-placement />
    </div>
    <div class="homeview--bottom">
      <fbu-child-order-info />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import OrderPlacement from './FreightOrderPlacement.vue';
import FbuChildOrderInfo from '../tracking/_components/FbuChildOrderInfo.vue';

export default {
  name: 'Home',
  components: { OrderPlacement, FbuChildOrderInfo },
};
</script>

<style lang="css">
@import '../../../../assets/styles/orders_order_placement.css';
</style>
