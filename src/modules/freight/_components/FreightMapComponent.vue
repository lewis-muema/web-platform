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
      >
        <gmap-marker
          v-for="v in trucks"
          :key="v.rider_id"
          :ref="`marker${v.rider_id}`"
          :position="v.position"
          :icon="truck_icon(v.vendor_type, v.rotation)"
          :visible="v.visible"
        />
      </GmapMap>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';

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
    ...mapGetters({
      trucks: '$_freight/getShipmentTrucks',
      truckId: '$_freight/getTruckId',
    }),
  },
  watch: {
    trucks(data) {
      if (data !== undefined && Object.keys(data).length > 0) {
        const truckDatalocation = data[this.truckId].position;

        this.mapCentreLocation.lat = truckDatalocation.lat;
        this.mapCentreLocation.lng = truckDatalocation.lng;
      }
    },
  },
  methods: {
    truck_icon(id) {
      return {
        url: `https://images.sendyit.com/web_platform/vendor_type/top/${id}.png`,
        scaledSize: new google.maps.Size(50, 50),
      };
    },
  },
};
</script>

<style lang="css" scoped>
.freight-maps{
  margin-bottom: 2%;
  margin-top: 2%;
}
</style>
