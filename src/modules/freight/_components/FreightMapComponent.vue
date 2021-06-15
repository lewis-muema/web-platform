<template lang="html">
  <div class="freight-maps">
    <no-ssr placeholder="">
      <GmapMap
        ref="map"
        :center="mapCentreLocation"
        :zoom="14"
        map-type-id="roadmap"
        :options="mapOptions"
        style="width: 95%; height: 450px"
      />
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'FreightMapComponent',
  components: {
    'no-ssr': NoSSR,
  },
  data() {
    return {
      mapOptions: {
        disableDefaultUI: true,
      },
      mapCentreLocation: {
        lat: -1.3084143,
        lng: 36.7658132,
      },
    };
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
  methods: {
    ...mapActions({}),
    ...mapMutations({}),
  },
};
</script>

<style lang="css" scoped>
.freight-maps{
  margin-bottom: 2%;
  margin-top: 2%;
}
</style>
