<template lang="html">
  <div class="homeview--outer">
    <order-placement></order-placement>
    <!-- <order-options></order-options> -->
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import OrderPlacement from './OrderPlacement.vue'
// import OrderOptions from './_components/OrderOptions.vue'

export default {
  name: 'Home',
  components: {OrderPlacement},
  // computed: {
  //   ...mapGetters(
  //     {
  //       getOrderState:'$_external/getViewState',
  //     }
  //   )
  // },
  mounted(){
    console.log('Am here');
  }
}
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css";

</style>
