<template lang="html">
  <div class="">
    <main-header />

    <div id="orders_container" class="box">
      <map-component />
      <ongoing-component />
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import order_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import MapComponent from './_components/MapComponent.vue';
import OngoingComponent from './_components/OngoingComponent.vue';

export default {
  name: 'Orders',
  components: { MainHeader, MapComponent, OngoingComponent },
  mixins: [RegisterStoreModule],

  watch: {
    $route(to, from) {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', '');
    },
  },

  created() {
    this.registerOrdersStore();
    // const STORE_KEY = '$_orders';
    // this.register_store_module(STORE_KEY, order_store);
  },

  methods: {
    registerOrdersStore() {
      const moduleIsRegistered = this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_orders', order_store);
      }
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css";

.module-container {
    margin: 8px;
}

.title {
    font-size: 22px;
    padding-bottom: 0px;
    border-bottom: 1px solid #ccc;
    color: #999;
    padding-top: 15px;
    margin-bottom: 30px;
}

.title__text {
    font-weight: 300;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
