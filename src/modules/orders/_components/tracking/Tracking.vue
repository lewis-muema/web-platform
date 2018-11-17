<template lang="html">
  <info-window/>
</template>

<script>
import tracking_store from './_store';
import InfoWindow from './_components/InfoComponent.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';
import { mapMutations } from 'vuex'

export default {
  name:'Tracking',
  components : {InfoWindow},
  mixins: [ RegisterStoreModule ],
  methods :{
    ...mapMutations({
      hide_markers: '$_orders/hide_markers',
      change_page : '$_orders/set_page'
    })
  },
  created() {
    this.$store.registerModule(['$_orders','$_tracking'], tracking_store);
  },
  mounted() {
    this.change_page(1)
    this.hide_markers()
  }
}
</script>

<style lang="css">
</style>
