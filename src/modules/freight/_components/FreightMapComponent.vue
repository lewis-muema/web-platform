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
        <gmap-info-window
          :options="infoOptions"
          :position="infoWindowPos"
          :opened="infoWinOpen"
          @closeclick="infoWinOpen = false"
        >
          <div v-html="infoContent" />
        </gmap-info-window>
      </GmapMap>
    </no-ssr>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';

const moment = require('moment');

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
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      infoContent: '',
      extraNotificationInfo: '',
    };
  },
  computed: {
    ...mapGetters({
      trucks: '$_freight/getShipmentTrucks',
      truckId: '$_freight/getTruckId',
      getTruckDetailsFromStore: '$_freight/getTruckDetailsFromStore',
    }),
  },
  watch: {
    trucks(data) {
      this.infoWinOpen = false;
      this.infoContent = '';
      this.extraNotificationInfo = '';
      this.setTrackingData(data);
    },
  },
  methods: {
    setTrackingData(data) {
      if (data !== undefined && Object.keys(data).length > 0) {
        const truckDatalocation = data[this.truckId].position;

        this.checkTruckDelay(data[this.truckId]);
        this.infoContent = this.getInfoWindowContent(
          data[this.truckId],
          this.getTruckDetailsFromStore,
        );
        this.mapCentreLocation.lat = truckDatalocation.lat;
        this.mapCentreLocation.lng = truckDatalocation.lng;
        this.infoWindowPos = truckDatalocation;
        this.infoWinOpen = true;
      }
    },
    truck_icon() {
      return {
        url: 'https://images.sendyit.com/web_platform/vendor_type/top/25_freight.png',
        scaledSize: new google.maps.Size(60, 35),
      };
    },
    checkTruckDelay(details) {
      const onlineTime = moment(details.time);
      const currentTime = moment();
      const truckOnlineTimeRange = currentTime.diff(onlineTime, 'minutes');
      if (truckOnlineTimeRange <= 0) {
        this.extraNotificationInfo = 'Location updated few seconds ago';
      } else if (truckOnlineTimeRange > 0 && truckOnlineTimeRange <= 60) {
        this.extraNotificationInfo = `Location updated ${truckOnlineTimeRange} minutes ago`;
      } else {
        this.extraNotificationInfo = `(${this.$t('general.network_issues')})`;
      }
    },
    getInfoWindowContent(locationDetails, truckDetails) {
      return `<div class="outer_freight_info_content_trackers">
                 <div class="freight_info_window_descript">
                   <div class="freight-tracking-header">${truckDetails.reg_no}</div>
                   <div class="align-truck-details">
                   <div class ="set-extra-tracking-details">${
  truckDetails.vehicle_size
} Tonnes </div>
                   <div class="freight-tracking-divider"></div>
                   <div class ="set-extra-tracking-details">${truckDetails.carrier_type}</div>
                   <div class="freight-tracking-divider"></div>
                   <div class ="set-extra-tracking-details">${truckDetails.cargo_type}</div>
                   </div>
                   <div class="freight_info_window_trackers_extra">${
  this.extraNotificationInfo
}</div>
                   </div>
              </div>`;
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/freight_tracking_component.css';
</style>
