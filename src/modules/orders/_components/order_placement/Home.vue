<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">

      <div class="homeview--form homeview--row homeview--form__scrollable" id="homeview-form">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">

              <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-orange" width="10px"  />
              <gmap-autocomplete placeholder="Pickup" :select-first-on-enter="true" class="input-control homeview--input-bundler__input"></gmap-autocomplete>
          </no-ssr>
        </div>

          <div v-for="n in this.get_waypoints" :key="n" v-bind:data-index="n">
            <div class="homeview--destinations">
              <div class="homeview--input-bundler">
                <no-ssr placeholder="">
                    <font-awesome-icon icon="map-marker-alt" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px" />
                    <gmap-autocomplete placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" :class="initial_destination_css(n)"></gmap-autocomplete>
                    <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="remove_location(n)" v-show="n > 1"/>
                </no-ssr>
              </div>

            </div>
          </div>

      </div>
      <div class="homeview--row homeview--row__more-destinations" v-if="get_max_way_points > get_waypoints">
           <font-awesome-icon icon="plus" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" />
        <a href="#" class="homeview--add" @click="new_destination()">Add</a>
      </div>
      <vendor-view></vendor-view>
      </div>

  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';
import home_store from './_store';
import VendorComponent from './_components/VendorComponent.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMapMarkerAlt, faCircle, faClock, faPen, faDollarSign, faTimes, faMobileAlt,faStar } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus,faMapMarkerAlt,faCircle,faClock,faPen,faDollarSign,faTimes,faMobileAlt, faStar)

export default {
  name: 'home',
  data: function() {
    return {
      show_destinations: false,
    }
  },
  components: {
    'no-ssr': NoSSR,
    'vendor-view': VendorComponent
  },
  computed: {
    ...mapGetters({
      get_waypoints : '$_orders/$_home/get_waypoints',
      get_max_way_points : '$_orders/$_home/get_max_way_points',
      get_order_locations : '$_orders/$_home/get_order_locations'
    }),
  },
  methods: {
    ...mapMutations({
      add_waypoint : '$_orders/$_home/add_waypoint',
      remove_waypoint : '$_orders/$_home/remove_waypoint'
    }),
    new_destination: function() {
      this.add_waypoint();
      if(this.get_waypoints > 5){
          this.scroll_to_bottom();
      }
    },
    show_destination: function (key) {
      if (this.show_destinations == true) {
        return true
      }
      else {
        if (key == this.get_waypoints) {
          return true
        }
      }
      return false
    },
    enter: function(el, done) {
    },
    scroll_to_bottom(){
        let container = this.$el.querySelector("#homeview-form");
        container.scrollTop = container.scrollHeight;
    },
    // To DO: replace with locations
    remove_location(index){
        this.remove_waypoint();
    },
    initial_destination_css(n){
        return {
            'homeview--input-bundler__destination-short-input': n == 1
        }
    }
  },

  created() {
    this.$store.registerModule(['$_orders','$_home'], home_store);
  }
}
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css";
</style>
<style scoped>

    /* unfortunately browser vendors dont care about BEM */
    ::-webkit-scrollbar {
        width: 12px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */
        /* -webkit-border-radius: 10px; */
        /* border-radius: 10px; */
        background-color: rgba(0, 0, 0, 0.05);
    }
    /* Handle */
    ::-webkit-scrollbar-thumb {
        /* -webkit-border-radius: 10px; */
        /* border-radius: 10px; */
        /* background: rgba(255,255,255,0.0); */
        /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5); */
    }
    ::-webkit-scrollbar-thumb:window-inactive {
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
