<template lang="html">
  <div class="" id="admin_container">
    Testing one 6 one 6
  </div>
</template>

<script>
import admin_store from './_store';
import RegisterStoreModule from '../../mixins/registerStoreModule'

export default {
  name:'Admin',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_admin';
    this.registerStoreModule(STORE_KEY, admin_store);
  },
}
</script>

<style lang="css">
</style>
