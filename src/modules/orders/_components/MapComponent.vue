<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap
        ref="map"
        :center="mapCentreLocation"
        :zoom="13"
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
          v-if="typeof polyline === 'object' && this.mapLoaded"
          ref="polyline"
          :path="decode_path(polyline.path)"
          :options="polyline.options"
        />
        <!-- <gmap-marker v-for="v in vendors" :position="v.position" :key="index" :ref="`marker${index}`" :icon="draw_rotated(v.vendor_type,v.rotation)" :visible="v.visible"></gmap-marker> -->
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
import { mapGetters, mapActions } from 'vuex';

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
      pick_up_eta: '',
      delivery_eta: '',
      vendor_name: '',
      destination_waiting: false,
      rider_online_status: false,
    };
  },
  methods: {
    ...mapActions({
      requestCountryCode: '$_orders/$_home/requestCountryCode',
    }),
    path_icon(icon) {
      if (icon === 'pickup') {
        return {
          url: 'https://images.sendyit.com/web_platform/orders/pickup_placeholder.png',
          scaledSize: new google.maps.Size(23, 40),
        };
      }
      return {
        url: 'https://images.sendyit.com/web_platform/orders/destination_placeholder.png',
        scaledSize: new google.maps.Size(23, 40),
      };
    },
    vendor_icon(id) {
      return {
        url: `https://images.sendyit.com/web_platform/vendor_type/top/${id}.png`,
        scaledSize: new google.maps.Size(50, 50),
      };
    },
    draw_rotated(vendor_type, rotation) {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'rot_canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = 100;
      canvas.height = 100;

      const image = document.createElement('img');
      image.crossOrigin = 'anonymous';
      image.src = `https://images.sendyit.com/web_platform/vendor_type/top/${vendor_type}.svg`;
      const imageLoadPromise = new Promise(resolve => {
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
    activeMarker() {
      const size = Object.keys(this.markers).length;
      if (this.iconLabel !== '' && size > 0 && this.polyline.path !== '') {
        const main = this.markers.find(location => location.icon === this.iconLabel);
        const index = this.markers.findIndex(location => location.icon === this.iconLabel);
        this.toggleInfoWindow(main, index);
      } else {
        this.infoWinOpen = false;
      }
    },
    orderStatus(data) {
      this.checkRiderPosition();
      if (data.status) {
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
        const rider_locations = this.rider_online_status;
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
        } else if (
          data.delivery_status === 2 &&
          waiting !== undefined &&
          this.destination_waiting
        ) {
          // return 'Waiting at destination'
          this.infoHeader = `Your ${
            this.vendor_name
          }has arrived and is waiting at the destination.`;
          this.iconLabel = 'destination';
          this.infoDescription = '';
        } else if (data.delivery_status === 2) {
          // return 'In Transit';
          if (!rider_locations) {
            this.infoHeader = `Your delivery is still in progress. We are working to restore the ${
              this.vendor_name
            }'s location.`;
            this.infoDescription = '';
            this.iconLabel = 'destination';
            this.vendor_icon_id = 'location';
          } else {
            this.infoHeader = 'Your delivery is in progress.';
            this.infoDescription = `Order arrival time ${this.delivery_eta}`;
            this.iconLabel = 'destination';
          }
        } else if (
          data.delivery_status === 0 &&
          data.confirm_status === 1 &&
          waiting !== undefined
        ) {
          // return 'Waiting at pick up location';
          this.infoHeader = `Your ${
            this.vendor_name
          } has arrived and is waiting at the pickup location.`;
          this.infoDescription = '';
          this.iconLabel = 'pickup';
        } else if (data.delivery_status === 0 && data.confirm_status === 1) {
          // return 'Confirmed';
          if (!rider_locations) {
            this.infoHeader = `Your ${
              this.vendor_name
            } is still on the way. We are working to restore the ${this.vendor_name}'s location`;
            this.infoDescription = '';
            this.iconLabel = 'pickup';
            this.vendor_icon_id = 'location';
          } else {
            this.infoHeader = `Your ${this.vendor_name} is on the way.`;
            this.infoDescription = `Order pickup time ${this.pick_up_eta}`;
            this.iconLabel = 'pickup';
          }
        } else {
          // return 'Pending';
          this.infoHeader = `We are matching your order with a ${this.vendor_name}. `;
          this.infoDescription = '';
          this.iconLabel = 'pickup';
        }
        this.activeMarker();
        this.orderETA(data);
      } else {
        this.infoWinOpen = false;
      }
    },
    orderETA(data) {
      if (data.confirm_status === 1 && data.delivery_status === 0) {
        const pick_up_eta = data.eta_data.etp;
        const eta_split = pick_up_eta.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const start_eta = moment(start, moment.ISO_8601).format('h:mm a');
        const end_eta = moment(end, moment.ISO_8601).format('h:mm a');

        this.pick_up_eta = `${start_eta}-${end_eta}`;
        this.delivery_eta = '';
      } else if (data.delivery_status === 2) {
        const delivery_eta = data.eta_data.etd;
        const eta_split = delivery_eta.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const start_eta = moment(start, moment.ISO_8601).format('h:mm a');
        const end_eta = moment(end, moment.ISO_8601).format('h:mm a');

        this.delivery_eta = `${start_eta}-${end_eta}`;
        this.pick_up_eta = '';
      } else {
      }
    },
    activeState() {
      this.$store
        .dispatch('$_orders/getOrderData', { order_no: this.$route.params.order_no })
        .then(response => {
          if (response.data.status) {
            this.orderStatus(response.data);
          } else {
            this.infoWinOpen = false;
          }
        });
    },
    checkRiderPosition() {
      let size = Object.keys(this.vendors).length;
      if (size > 0) {
        this.rider_online_status = true;
      } else {
        this.rider_online_status = false;
      }
    },

    toggleInfoWindow(marker, idx) {
      this.infoWindowPos = marker.position;
      this.infoContent = this.getInfoWindowContent(marker);
      this.infoWinOpen = true;
    },
    getInfoWindowContent(marker) {
      return `<div class="" style="width:275px">
               <div style ="display: inline-block;
                 width: 70px;
                 object-fit: contain;
                 float: left;">
          <img style ="height: 45px;" src="https://images.sendyit.com/web_platform/vendor_type/top/${
            this.vendor_icon_id
          }.png"></img>
                 </div>
                 <div style="  width: 70%;
                   display: inline-block;
                   float: left;
                   padding-left: 10px;
                   padding-top: 10px;">
                   <div>${this.infoHeader}</div>
                   <div>${this.infoDescription}</div>
                   </div>
              </div>`;
    },
    checkUserLocation() {
      let markedCoords = '';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          let lat = position.coords.latitude;
          let long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      const payload = {};
      payload.coordinates = position;
      let full_payload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'geocountry',
      };
      this.requestCountryCode(full_payload).then(
        response => {
          let code = response.country_code;
          this.$store.commit('setCountryCode', code);
          let country_code_data = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', country_code_data.currencyCode);
          this.setMapCentreLocation(code);
        },
        error => {}
      );
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
    },
    '$route.params.order_no': function trackedOrder(order) {
      this.$store.dispatch('$_orders/getOrderData', { order_no: order }).then(response => {
        if (response.status) {
          this.orderStatus(response.data);
        } else {
          this.infoWinOpen = false;
        }
      });
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
  },
};
</script>

<style lang="css"></style>
