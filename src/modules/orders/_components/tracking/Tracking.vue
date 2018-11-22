<template lang="html">
  <div class="">
    <a class="back--button" @click="$router.push('/orders')"><font-awesome-icon icon="arrow-left" width="15px" /></a>
    <info-window/>
  </div>
</template>

<script>
import tracking_store from './_store';
import InfoWindow from './_components/InfoComponent.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';
import { mapMutations } from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowLeft)

export default {
  name:'Tracking',
  components : {InfoWindow},
  mixins: [ RegisterStoreModule ],
  methods :{
    ...mapMutations({
      hide_vendors: '$_orders/hide_vendors',
      change_page : '$_orders/set_page'
    })
  },
  created() {
    this.$store.registerModule(['$_orders','$_tracking'], tracking_store);
  },
  mounted() {
    this.change_page(1)
    this.hide_vendors()
  },
  watch :{
    $route (to, from){
      this.$store.commit('$_orders/remove_polyline',[])
      this.$store.commit('$_orders/remove_markers',[])
    }
  }
}
</script>

<style lang="css">
.back--button
{
  position: absolute;
  top: 80px;
  left: 10px;
  border: 1px solid;
  background-color: #fff;
  border-radius: 50%;
  padding: 15px;
  font-size: larger;
}
</style>
