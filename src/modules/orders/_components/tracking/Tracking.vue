<template lang="html">
  <div class="">
    <a
      v-if="this.$route.name != 'tracking_external'"
      class="back--button"
      @click="$router.push('/orders')"
    >
      <i class="el-icon-back" />
    </a>
    <info-window :key="componentKey" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faWallet } from '@fortawesome/free-solid-svg-icons';
import TrackingStore from './_store';
import InfoWindow from './_components/InfoComponent.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';

library.add(faArrowLeft);
library.add(faWallet);

export default {
  name: 'Tracking',
  components: { InfoWindow },
  mixins: [RegisterStoreModule],
  data() {
    return {
      componentKey: 0,
    };
  },
  watch: {
    $route() {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.hide_vendors();
      this.componentKey += 1;
    },
  },
  created() {
    const STORE_PARENT = '$_orders';
    const STORE_KEY = '$_tracking';
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT, STORE_KEY], TrackingStore);
    }
  },
  mounted() {
    this.change_page(1);
    this.hide_vendors();
    this.componentKey += 1;
  },
  methods: {
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      change_page: '$_orders/setPage',
    }),
  },
};
</script>

<style lang="css">
.back--button
{
  position: absolute;
  top: 80px;
  left: 10px;
  border: 1px solid #55555500;
  background-color: #fff;
  border-radius: 50%;
  padding: 15px;
  font-size: larger;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  cursor: pointer;
  color: #555;
}
</style>
