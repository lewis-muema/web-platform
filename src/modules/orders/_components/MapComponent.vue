<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap
        ref="map"
        :center="{ lat: -1.3084143, lng: 36.7658132 }"
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
import { mapGetters } from 'vuex';

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
    };
  },
  methods: {
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
      if (data.status) {
        if (data.rider.vendor_id === 23) {
          this.vendor_icon_id = 1;
        } else {
          this.vendor_icon_id = data.rider.vendor_id;
        }
        if (data.delivery_status === 3) {
          // return 'Delivered';
          this.infoHeader = '';
          this.infoDescription = '';
        } else if (data.delivery_status === 2) {
          // return 'In Transit';
          this.infoHeader = 'Delivery in progress';
          this.infoDescription = 'Order arrival time 1pm-2pm';
          this.iconLabel = 'destination';
        } else if (data.delivery_status === 0 && data.confirm_status === 1) {
          // return 'Confirmed';
          this.infoHeader = 'Rider is on the way';
          this.infoDescription = 'Order pickup time 11am -12pm';
          this.iconLabel = 'pickup';
        } else {
          // return 'Pending';
          this.infoHeader = 'Matching your order';
          this.infoDescription = 'A rider will be allocated to your order';
          this.iconLabel = 'pickup';
        }
        this.activeMarker();
      } else {
        this.infoWinOpen = false;
      }
    },
    activeState() {
      this.$store
        .dispatch('$_orders/get_order_data', { order_no: this.$route.params.order_no })
        .then((response) => {
          if (response.status) {
            this.orderStatus(response.data);
          } else {
            this.infoWinOpen = false;
          }
        });
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
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/get_markers',
      vendors: '$_orders/get_vendors',
      polyline: '$_orders/get_polyline',
      tracking_data: '$_orders/$_tracking/get_tracking_data',
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
      this.$store.dispatch('$_orders/get_order_data', { order_no: order }).then((response) => {
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
    this.$store.dispatch('$_orders/connect_mqtt');
    this.activeState();
    this.activeMarker();
  },
};
</script>

<style lang="css"></style>
