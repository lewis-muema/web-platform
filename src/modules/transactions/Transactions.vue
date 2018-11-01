<template lang="html">
  <div class="" id="transactions_container">
    Testing one 3 one 3
  </div>
</template>

<script>
import trans_store from './_store';
import RegisterStoreModule from '../../mixins/registerStoreModule'

export default {
  name:'Transactions',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_transactions';
    this.registerStoreModule(STORE_KEY, trans_store);
  },
}
</script>

<style lang="css">
</style>
