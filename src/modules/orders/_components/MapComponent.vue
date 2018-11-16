<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap :center="{lat:-1.3084143, lng:36.7658132}" :zoom="13" map-type-id="roadmap" class="content" :options="mapOptions">
        <gmap-marker v-for="m in markers" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
      </GmapMap>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';

export default {
  name: 'map-component',
  components: {
    'no-ssr': NoSSR
  },
  data: function () {
    return {
      mapOptions: {
        disableDefaultUI : true,
      },
    }
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/get_markers'
    }),
  }

}
</script>

<style lang="css">
</style>
