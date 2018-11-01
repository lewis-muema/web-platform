<template lang="html">
  <div class="" id="orders_container">
    Testing one 4 one 4
  </div>
</template>

<script>
import order_store from './_store';
import RegisterStoreModule from '../../mixins/registerStoreModule'

export default {
  name:'Orders',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_orders';
    this.registerStoreModule(STORE_KEY, order_store);
  },
}
</script>

<style lang="css">
</style>
