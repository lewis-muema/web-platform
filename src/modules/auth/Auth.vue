<template lang="html">
  <div class="" id="auth_container">
    Testing one 5 one 5
  </div>
</template>

<script>
import auth_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'

export default {
  name:'Auth',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_auth';
    this.register_store_module(STORE_KEY, auth_store);
  },
}
</script>

<style lang="css">
</style>
