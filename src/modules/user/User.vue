<template lang="html">
  <div class="" id="user_container">
      <external-header></external-header>
    <router-view></router-view>
  </div>
</template>

<script>
import user_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import ExternalHeader from '../../components/headers/ExternalHeader.vue'
export default {
  name:'User',
  mixins: [ RegisterStoreModule ],
  components : {ExternalHeader},
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, user_store);
  },
}
</script>

<style lang="css">
</style>
