<template lang="html">
  <div class="content">
    <no-ssr placeholder="">
      <GmapMap :center="{lat:-1.3084143, lng:36.7658132}" :zoom="13" map-type-id="roadmap" class="content" :options="mapOptions" ref="map">
        <gmap-marker v-for="m,number in markers" :position="get_position(m.position)" :key="number" v-if="mapLoaded" :icon="path_icon(m.icon)"></gmap-marker>
        <gmap-polyline v-if="typeof polyline == 'object' && this.mapLoaded" :path="decode_path(polyline.path)" ref="polyline" :options="polyline.options"></gmap-polyline>
        <!-- <gmap-marker v-for="v in vendors" :position="v.position" :key="index" :ref="`marker${index}`" :icon="draw_rotated(v.vendor_type,v.rotation)" :visible="v.visible"></gmap-marker> -->
        <gmap-marker v-for="v in vendors" :position="v.position" :key="v.rider_id" :ref="`marker${v.rider_id}`" :icon="vendor_icon(v.vendor_type,v.rotation)" :visible="v.visible"></gmap-marker>

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
      markerOptions: {

      },
      mapLoaded: false,
    }
  },
  methods: {
    path_icon: function(icon) {
      if (icon == 'pickup') {
        return {
          url: 'https://images.sendyit.com/web_platform/orders/pickup_placeholder.png',
          scaledSize: new google.maps.Size(23, 40),
        }
      }
      else {
        return {
          url: 'https://images.sendyit.com/web_platform/orders/destination_placeholder.png',
          scaledSize: new google.maps.Size(23, 40),
        }
      }
    },
    vendor_icon: function(id){
       return {
        url: 'https://images.sendyit.com/web_platform/vendor_type/top/' + id + '.png',
        scaledSize: new google.maps.Size(50, 50),
      };
    },
    draw_rotated: function(vendor_type, rotation) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute("id", "rot_canvas");
      var ctx = canvas.getContext("2d");

      canvas.width = 100
      canvas.height = 100

      var image = document.createElement("img");
      image.crossOrigin = "anonymous"
      image.src = 'https://images.sendyit.com/web_platform/vendor_type/top/' + vendor_type + '.svg';
      const imageLoadPromise = new Promise(resolve => {
        image.onload = resolve
      }).then(() => {
        ctx.drawImage(image, 0, 0);
      })

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation) * Math.PI / 180);
      ctx.drawImage(image, -canvas.width / 2, -canvas.height / 2);

      var rotated = canvas.toDataURL();
      ctx.restore();

      return {
        url: rotated,
        scaledSize: new google.maps.Size(50, 50),
      };
    },
    decode_path: function(path) {
      return google.maps.geometry.encoding.decodePath(path)
    },
    get_position: function(literal) {
      return new google.maps.LatLng(literal)
    }
  },
  computed: {
    ...mapGetters({
      markers: '$_orders/get_markers',
      vendors: '$_orders/get_vendors',
      polyline: '$_orders/get_polyline',
    }),
  },
  watch: {
     markers(markers) {
       if (this.mapLoaded && markers.length > 0) {
         const bounds = new google.maps.LatLngBounds()
         for (let m of this.markers) {
           bounds.extend(m.position)
         }
         this.$refs.map.$mapObject.fitBounds(bounds);
         this.$refs.map.$mapObject.setZoom(this.$refs.map.$mapObject.zoom - 1);
       }
     }
  },
  mounted() {
    this.$gmapApiPromiseLazy().then(() => {
      this.mapLoaded = true
    })
    this.$store.dispatch('$_orders/connect_mqtt')
  }
}
</script>

<style lang="css">
</style>
