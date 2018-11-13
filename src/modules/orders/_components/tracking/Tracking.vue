<template lang="html">
  <info-window/>
</template>

<script>
import tracking_store from './_store';
import InfoWindow from './_components/InfoComponent.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';

export default {
  name:'Tracking',
  components : {InfoWindow},
  mixins: [ RegisterStoreModule ],
  created() {
    this.$store.registerModule(['$_orders','$_tracking'], tracking_store);
    // const STORE_KEY = '$_tracking';
    // this.$store.registerModule(['$_orders','$_tracking'], tracking_store);
  },
}
</script>

<style lang="css">
</style>
