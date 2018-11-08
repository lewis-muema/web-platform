<template lang="html">
  <div class="" id="orders_container">
  </div>
</template>

<script>
import order_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'

export default {
  name:'Orders',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_orders';
    this.register_store_module(STORE_KEY, order_store);
  },
}
</script>

<style lang="css">
</style>
