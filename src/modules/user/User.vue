<template lang="html">
  <div class="" id="user_container">
      <main-header></main-header>
    <router-view></router-view>
  </div>
</template>

<script>
import user_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
library.add(faStar)
export default {
  name:'User',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, user_store);
  },
}
</script>

<style lang="css">
</style>
