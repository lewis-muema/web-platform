<template lang="html">
  <div class="" id="auth_container">
      <external-header></external-header>
    <router-view></router-view>
  </div>
</template>

<script>
import auth_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import ExternalHeader from '../../components/headers/ExternalHeader.vue'
export default {
  name:'Auth',
  mixins: [ RegisterStoreModule ],
  components : {ExternalHeader},
  created() {
    const STORE_KEY = '$_auth';
    this.register_store_module(STORE_KEY, auth_store);
  },
}
</script>

<style lang="css">
</style>
