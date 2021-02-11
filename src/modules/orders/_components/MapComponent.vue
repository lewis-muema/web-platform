<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap
        ref="map"
        :center="mapCentreLocation"
        :zoom="14"
        map-type-id="roadmap"
        class="content"
        :options="mapOptions"
        style=" top: 0; left: 0;right: 0; bottom: 0; position: fixed;"
      >
        <gmap-marker
          v-for="(m, number) in markers"
          v-if="mapLoaded"
          :key="number"
          :position="get_position(m.position)"
          :icon="path_icon(m.icon)"
        />
        <gmap-polyline
          v-if="typeof polyline === 'object' && mapLoaded"
          ref="polyline"
          :path="decode_path(polyline.path)"
          :options="polyline.options"
        />
        <gmap-marker
          v-for="v in vendors"
          :key="v.rider_id"
          :ref="`marker${v.rider_id}`"
          :position="v.position"
          :icon="vendor_icon(v.vendor_type, v.rotation)"
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
import { mapGetters, mapActions, mapMutations } from 'vuex';

const currencyConversion = require('country-tz-currency');
const moment = require('moment');

export default {
  name: 'MapComponent',
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
      markerOptions: {},
      mapLoaded: false,
      infoWinOpen: false,
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35,
        },
      },
      infoContent: '',
      infoHeader: '',
      infoDescription: '',
      iconLabel: '',
      vendor_icon_id: '',
      pickUpEta: '',
      deliveryEta: '',
      vendor_name: '',
      destination_waiting: false,
      rider_online_status: false,
      riderId: '',
      vehicleRegistration: '',
      speedData: '',
      riderLastSeen: '',
      trackers: [1, 2, 3, 6, 10, 13, 14, 17, 18, 19, 20, 23],
      extraNotificationInfo: '',
      activeStateIcon: '',
      vendorStatus: 'active',
      small_vendors: [1, 23],
    };
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/getMarkers',
      vendors: '$_orders/getVendors',
      polyline: '$_orders/getPolyline',
      tracking_data: '$_orders/$_tracking/getTrackingData',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
    }),
  },
  watch: {
    markers(markers) {
      if (markers !== undefined) {
        if (this.mapLoaded && markers.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          for (const m of this.markers) {
            bounds.extend(m.position);
          }
          this.$refs.map.$mapObject.fitBounds(bounds);
          this.$refs.map.$mapObject.setZoom(this.$refs.map.$mapObject.zoom - 1);
          this.activeState();
          this.activeMarker();
        }
      }
    },
    '$route.params.order_no': function trackedOrder(order) {
      this.$store.dispatch('$_orders/getOrderData', { order_no: order }).then((response) => {
        if (response.status) {
          this.orderStatus(response.data);
        } else {
          this.infoWinOpen = false;
        }
      });
    },
    $route(to, from) {
      this.infoWinOpen = false;
    },
    vendors(data) {
      if (this.$route.name === 'freight_order_placement' && data !== undefined) {
        const keys = Object.keys(data);
        keys.forEach((row) => {
          this.setTrackersInfoWindow({
            rider: {
              rider_id: row,
            },
          });
          this.infoWinOpen = false;
        });
      }
    },
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true;
    });
    this.$store.dispatch('$_orders/connectMqtt');
    this.activeState();
    this.activeMarker();
    this.checkUserLocation();
    this.removeStoredMarkers();
  },
  methods: {
    ...mapActions({
      requestCountryCode: '$_orders/requestCountryCode',
    }),
    ...mapMutations({
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      set_tracking_data: '$_orders/$_tracking/setTrackingData',
    }),
    path_icon(icon) {
      if (icon === 'pickup') {
        return {
          url: 'https://images.sendyit.com/web_platform/orders/pickup_placeholder.png',
          scaledSize: new google.maps.Size(23, 40),
        };
      }
      if (icon === 'region') {
        return {
          url: 'https://images.sendyit.com/web_platform/orders/region_placeholder2.png',
          scaledSize: new google.maps.Size(150, 150),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(75, 75),
        };
      }
      return {
        url: 'https://images.sendyit.com/web_platform/orders/destination_placeholder.png',
        scaledSize: new google.maps.Size(23, 40),
      };
    },
    vendor_icon(id) {
      if (this.vendorStatus === 'offline') {
        return {
          url: `https://images.sendyit.com/web_platform/vendor_type/top/${id}_offline.png`,
          scaledSize: new google.maps.Size(50, 50),
        };
      }
      return {
        url: `https://images.sendyit.com/web_platform/vendor_type/top/${id}.png`,
        scaledSize: new google.maps.Size(50, 50),
      };
    },
    draw_rotated(vendorType, rotation) {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'rot_canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 100;
      canvas.height = 100;

      const image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.src = `https://images.sendyit.com/web_platform/vendor_type/top/${vendorType}.svg`;
      const imageLoadPromise = new Promise((resolve) => {
        image.onload = resolve;
      }).then(() => {
        ctx.drawImage(image, 0, 0);
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2);

      const rotated = canvas.toDataURL();
      ctx.restore();

      return {
        url: rotated,
        scaledSize: new google.maps.Size(50, 50),
      };
    },
    decode_path(path) {
      return google.maps.geometry.encoding.decodePath(path);
    },
    get_position(literal) {
      return new google.maps.LatLng(literal);
    },
    activeMarker(data) {
      const size = Object.keys(this.markers).length;
      if (this.iconLabel !== '' && size > 0 && this.polyline.path !== '') {
        const main = this.markers.find(location => location.icon === this.iconLabel);
        if (data !== undefined && data.confirm_status !== undefined) {
          this.toggleInfoWindow(main, data);
        }
      } else {
        this.infoWinOpen = false;
      }
      
    },
    orderStatus(data) {
      this.checkRiderPosition();
      if (data.status) {
        if (data.confirm_status > 0) {
          this.riderId = data.rider.rider_id;
        }

        const waiting = data.delivery_log.find(position => position.log_type === 10);
        const waitingIndex = data.delivery_log.findIndex(position => position.log_type === 10);

        if (waitingIndex !== -1) {
          const string = data.delivery_log[waitingIndex].description;
          if (string.includes('is ready to deliver your order')) {
            this.destination_waiting = true;
          } else {
            this.destination_waiting = false;
          }
        }

        const riderLocations = this.rider_online_status;
        if (data.rider.vendor_id === 23) {
          this.vendor_icon_id = 1;
        } else {
          this.vendor_icon_id = data.rider.vendor_id;
        }

        if (data.rider.vendor_id === 23 || data.rider.vendor_id === 1) {
          this.vendor_name = 'rider';
        } else {
          this.vendor_name = 'driver';
        }

        if (data.delivery_status === 3) {
          // return 'Delivered';
          this.infoHeader = '';
          this.infoDescription = '';
        } else if (data.rider.vendor_id === 26) {
          this.handleInterCountyToolTip(data);
        } else if (
          data.delivery_status === 2
          && waiting !== undefined
          && this.destination_waiting
        ) {
          // return 'Waiting at destination'
          this.infoHeader = `Your ${
            this.vendor_name
          }has arrived and is waiting at the destination.`;
          this.iconLabel = 'destination';
          this.infoDescription = '';
        } else if (data.delivery_status === 2) {
          // return 'In Transit';
          if (!riderLocations) {
            this.infoHeader = this.$t('general.delivery_still_inprogress',{vendor_name:this.vendor_name});
            
            this.infoDescription = '';
            this.iconLabel = 'destination';
            this.vendor_icon_id = 'location';
          } else {
            this.infoHeader = this.$t('general.delivery_in_progress');
            this.infoDescription = `${this.$t('general.order_arrival_time')} ${this.deliveryEta}`;
            this.iconLabel = 'destination';
          }
        } else if (
          data.delivery_status === 0
          && data.confirm_status === 1
          && waiting !== undefined
        ) {
          // return 'Waiting at pick up location';
          this.infoHeader = this.$t('general.order_arrived', {vendor_name:this.vendor_name});
          this.infoDescription = '';
          this.iconLabel = 'pickup';
        } else if (data.delivery_status === 0 && data.confirm_status === 1) {
          // return 'Confirmed';
          if (!riderLocations) {
            this.infoHeader = this.$t('general.order_still_on_the_way', {vendor_name:this.vendor_name});
            this.infoDescription = '';
            this.iconLabel = 'pickup';
            this.vendor_icon_id = 'location';
          } else {
            this.infoHeader = this.$t('general.your_driver_on_the_way', {vendor_name:this.vendor_name});
            this.infoDescription = this.$t('general.order_pickup_time', {pickUpEta:this.pickUpEta});
            this.iconLabel = 'pickup';
          }
        } else {
          // return 'Pending';
          this.infoHeader = this.$t('general.matching_order_with', {vendor_name:this.vendor_name});
          this.infoDescription = '';
          this.iconLabel = 'pickup';
        }
        this.activeMarker(data);
        this.orderETA(data);
      } else {
        this.infoWinOpen = false;
      }
    },
    handleInterCountyToolTip(val) {
      if (
        val.inter_county_order_details.status === 'enroute'
        || val.inter_county_order_details.status === 'arrived'
        || val.inter_county_order_details.status === 'completed'
      ) {
        this.iconLabel = 'delivery';
      } else {
        this.iconLabel = 'pickup';
      }
      const data = val.order_timeline;
      for (let i = 0; i < data.length; i++) {
        if (data[i].status === 'ongoing') {
          this.infoHeader = data[i].message;
          this.infoDescription = '';
        }
      }
    },
    orderETA(data) {
      if (data !== undefined) {
        if (data.eta_data.status) {
          if (data.confirm_status === 1 && data.delivery_status === 0) {
            const pickUpEta = data.eta_data.etp;
            const etaSplit = pickUpEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.pickUpEta = `${startEta}-${endEta}`;
            this.deliveryEta = '';
          } else if (data.delivery_status === 2) {
            const deliveryEta = data.eta_data.etd;
            const etaSplit = deliveryEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.deliveryEta = `${startEta}-${endEta}`;
            this.pickUpEta = '';
          } else {
            // ...
          }
        }
      }
    },
    activeState() {
      const namePath = ['tracking', 'tracking_external', 'freight_order_tracking'];
      if (namePath.includes(this.$route.name)) {
        this.$store
          .dispatch('$_orders/getOrderData', { order_no: this.$route.params.order_no })
          .then((response) => {
            if (response.data.status) {
              this.orderStatus(response.data);
            } else {
              this.infoWinOpen = false;
            }
          });
      } else {
        this.infoWinOpen = false;
      }
    },
    checkRiderPosition() {
      const size = Object.keys(this.vendors).length;
      if (size > 0) {
        this.rider_online_status = true;
      } else {
        this.rider_online_status = false;
      }
    },

    toggleInfoWindow(marker, data) {
      if (Object.prototype.hasOwnProperty.call(data, 'confirm_status')) {
        if (data.confirm_status > 0 && this.trackers.includes(data.rider.vendor_id)) {
          const size = Object.keys(this.vendors).length;
          if (size > 0) {
            this.handleTrackersNotification(data);
            this.setTrackersInfoWindow(data);
          } else {
            this.infoWindowPos = marker.position;
            this.infoContent = this.getInfoWindowContent(marker);
            this.infoWinOpen = true;
          }
        } else {
          this.infoWindowPos = marker.position;
          this.infoContent = this.getInfoWindowContent(marker);
          this.infoWinOpen = true;
        }
      } else {
        this.infoWindowPos = marker.position;
        this.infoContent = this.getInfoWindowContent(marker);
        this.infoWinOpen = true;
      }
    },
    handleTrackersNotification(data) {
      if (this.small_vendors.includes(data.rider.vendor_id)) {
        this.handleSmallVendorsTrackers(data);
      } else {
        this.handleLargeVendorsTrackers(data);
      }
    },
    handleSmallVendorsTrackers(data) {
      const riderId = data.rider.rider_id;
      const riderLocationDetails = this.vendors[riderId];
      if (riderLocationDetails !== undefined && riderLocationDetails.time !== undefined) {
        const onlineTime = moment(riderLocationDetails.time);
        const currentTime = moment();
        const riderOnlineTimeRange = currentTime.diff(onlineTime, 'minutes');

        if (riderOnlineTimeRange <= 30) {
          this.vehicleRegistration = `Vehicle \u00A0:\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0:\u00A0 ${riderLocationDetails.speed.toFixed(2)}kmph`;
          this.riderLastSeen = '';
          this.extraNotificationInfo = '';
          this.activeStateIcon = this.vendor_icon_id;
          this.vendorStatus = 'active';
        } else if (riderOnlineTimeRange > 30 && riderOnlineTimeRange <= 60) {
          this.vehicleRegistration = `Vehicle \u00A0:\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0:\u00A0 ${riderLocationDetails.speed.toFixed(2)}kmph`;
          this.riderLastSeen = `Tracker \u00A0\u00A0:\u00A0\u00A0 Last signal sent ${riderOnlineTimeRange} minutes ago`;
          this.extraNotificationInfo = '';
          this.activeStateIcon = this.vendor_icon_id;
          this.vendorStatus = 'active';
        } else {
          this.vehicleRegistration = `Vehicle \u00A0:\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0:\u00A0 ${riderLocationDetails.speed.toFixed(2)}kmph`;
          this.riderLastSeen = 'Tracker \u00A0:\u00A0 No Signal';
          this.extraNotificationInfo = '(This could be due to network issues)';
          this.activeStateIcon = `${this.vendor_icon_id}_offline`;
          this.vendorStatus = 'offline';
        }
      }
    },
    handleLargeVendorsTrackers(data) {
      const riderId = data.rider.rider_id;
      const riderLocationDetails = this.vendors[riderId];
      if (riderLocationDetails !== undefined && riderLocationDetails.time !== undefined) {
        const onlineTime = moment(riderLocationDetails.time);
        const currentTime = moment();
        const riderOnlineTimeRange = currentTime.diff(onlineTime, 'minutes');

        if (riderOnlineTimeRange <= 30) {
          this.vehicleRegistration = `Vehicle \u00A0\u00A0:\u00A0\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0\u00A0:\u00A0\u00A0 ${riderLocationDetails.speed.toFixed(
            2,
          )}kmph`;
          this.riderLastSeen = '';
          this.extraNotificationInfo = '';
          this.activeStateIcon = this.vendor_icon_id;
          this.vendorStatus = 'active';
        } else if (riderOnlineTimeRange > 30 && riderOnlineTimeRange <= 60) {
          this.vehicleRegistration = `Vehicle \u00A0\u00A0:\u00A0\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0\u00A0:\u00A0\u00A0 ${riderLocationDetails.speed.toFixed(
            2,
          )}kmph`;
          this.riderLastSeen = `Tracker \u00A0\u00A0:\u00A0\u00A0 Last signal sent ${riderOnlineTimeRange} minutes ago`;
          this.extraNotificationInfo = '';
          this.activeStateIcon = this.vendor_icon_id;
          this.vendorStatus = 'active';
        } else {
          this.vehicleRegistration = `Vehicle \u00A0\u00A0:\u00A0\u00A0 ${data.rider.number_plate}`;
          this.speedData = `Speed \u00A0\u00A0:\u00A0\u00A0 ${riderLocationDetails.speed.toFixed(
            2,
          )}kmph`;
          this.riderLastSeen = 'Tracker \u00A0\u00A0:\u00A0\u00A0 No Signal';
          this.extraNotificationInfo = '(This could be due to network issues)';
          this.activeStateIcon = `${this.vendor_icon_id}_offline`;
          this.vendorStatus = 'offline';
        }
      }
    },
    setTrackersInfoWindow(data) {
      const riderId = data.rider.rider_id;
      const riderLocationDetails = this.vendors[riderId];
      if (riderLocationDetails !== undefined) {
        const riderMarkerLocation = riderLocationDetails.position;
        this.mapCentreLocation.lat = riderMarkerLocation.lat;
        this.mapCentreLocation.lng = riderMarkerLocation.lng;

        this.infoWindowPos = riderMarkerLocation;
        this.infoContent = this.getTrackerInfoWindowContent();
        this.infoWinOpen = true;
      }
    },
    getTrackerInfoWindowContent() {
      return `<div class="outer_info_content_trackers">
                 <div class="info_window_descript">
                   <div>${this.vehicleRegistration}</div>
                   <div>${this.speedData}</div>
                   <div>${this.riderLastSeen}</div>
                   <div class="info_window_trackers_extra">${this.extraNotificationInfo}</div>
                   </div>
              </div>`;
    },
    getInfoWindowContent() {
      return `<div class="outer_info_content">
               <div class="outer_inner_content">
          <img class="info_window_img" src="https://images.sendyit.com/web_platform/vendor_type/top/${
  this.vendor_icon_id
}.png"></img>
                 </div>
                 <div class="info_window_descript_inner">
                   <div>${this.infoHeader}</div>
                   <div>${this.infoDescription}</div>
                   </div>
              </div>`;
    },
    checkUserLocation() {
      let markedCoords = '';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      this.requestCountryCode({ coordinates: position }).then((response) => {
        if (response.data.status) {
          const code = response.data.country_code;
          this.$store.commit('setCountryCode', code);
          const countryCodeData = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', countryCodeData.currencyCode);
          this.setMapCentreLocation(code);
        }
      });
    },
    setMapCentreLocation(code) {
      if (code === 'UG') {
        this.mapCentreLocation.lat = 0.3355622;
        this.mapCentreLocation.lng = 32.5801543;
      } else {
        this.mapCentreLocation.lat = -1.3084143;
        this.mapCentreLocation.lng = 36.7658132;
      }
    },
    removeStoredMarkers() {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', '');
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../assets/styles/map_component.css";
</style>
