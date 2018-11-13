<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap :center="{lat:-1.3084143, lng:36.7658132}" :zoom="13" map-type-id="roadmap" class="content" :options="mapOptions">
      </GmapMap>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';

export default {
  name: 'map-component',
  components: {
    'no-ssr': NoSSR
  },
  data: function () {
    return {
      mapOptions: {
        disableDefaultUI : true,
      }
    }
  }
}
</script>

<style lang="css">
</style>
