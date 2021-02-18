<template lang="html">
  <div class="">
    <external-header />

    <div
      id="orders_container"
      class="box"
    >
      <map-component />
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import orderStore from '../orders/_store';
import ExternalHeader from '../../components/headers/ExternalHeader.vue';
import MapComponent from '../orders/_components/MapComponent.vue';

export default {
  name: 'ExternalTracking',
  components: { ExternalHeader, MapComponent },

  watch: {
    $route(to, from) {
      this.$store.commit('$_orders/remove_polyline', []);
      this.$store.commit('$_orders/remove_markers', []);
      this.$store.commit('$_orders/$_tracking/set_tracked_order', '');
    },
  },

  created() {
    this.registerOrdersStore();
  },
  methods: {
    registerOrdersStore() {
      const moduleIsRegistered = this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_orders', orderStore);
      }
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css?v=1";

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
