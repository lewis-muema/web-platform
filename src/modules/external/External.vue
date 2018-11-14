<template lang="html">
  <div class="user-invite-outer">
    <header-component></header-component>
    <bod-component></bod-component>
  </div>
</template>

<script>
// import Vue from 'vue'
import external_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import HeaderComponent from './components/HeaderComponent.vue'
import BodComponent from './components/BodComponent.vue'

export default {
  name:'External',
  mixins: [ RegisterStoreModule ],
  components: {HeaderComponent,BodComponent},
  created() {
    this.$store.registerModule('$_external', external_store);
  },
}
</script>

<style lang="css">
.user-invite-outer{
  background-color: #fcfcfc;
}
</style>
