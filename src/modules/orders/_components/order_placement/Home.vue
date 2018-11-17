<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">
      <div class="homeview--form homeview--row">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">

              <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-orange" width="10px"  />
              <gmap-autocomplete placeholder="Pickup" :select-first-on-enter="true" class="input-control homeview--input-bundler__input"></gmap-autocomplete>
          </no-ssr>
        </div>
        <!-- <transition name="slide-fade"> -->
          <div class="homeview--input-bundler homeview--input-bundler__waypoints" v-if="this.get_waypoints > 1 && this.show_destinations == false">
            <a href="#" class="homeview--stops">{{this.get_waypoints - 1}} stops</a>
          </div>
        <!-- </transition> -->
        <!-- <transition-group name="slide-fade" tag="div" v-on:enter="enter"> -->
          <div v-for="n in this.get_waypoints" :key="n" v-if="show_destination(n)" v-bind:data-index="n">
            <div class="homeview--destinations">
              <div class="homeview--input-bundler">
                <no-ssr placeholder="">
                    <font-awesome-icon icon="map-marker-alt" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px" />
                    <gmap-autocomplete placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input"></gmap-autocomplete>
                </no-ssr>
              </div>
              <!-- <div class="homeview--input row">
                <input type="text" name="" value="" placeholder="Recipient Name" class="input-control">
                <input type="text" name="" value="" placeholder="Phone Number" class="input-control">
              </div> -->
            </div>
          </div>
        <!-- </transition-group> -->

      </div>
      <div class="homeview--row homeview--row__more-destinations">
           <font-awesome-icon icon="plus" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" />
        <a href="#" class="homeview--add" @click="add_waypoint()">Add</a>
      </div>
      <vendor-view></vendor-view>
      </div>

    <!-- <vendor-view/> -->
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';
import home_store from './_store';
import VendorComponent from './_components/VendorComponent.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faMapMarkerAlt, faCircle, faClock, faPen, faDollarSign } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus,faMapMarkerAlt,faCircle,faClock,faPen,faDollarSign)

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
  methods: {
    ...mapMutations({
      add_waypoint : '$_orders/$_home/add_waypoint'
    }),
    new_destination: function() {
      this.add_waypoint()
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
    }
  },
  computed: {
    ...mapGetters({
      get_waypoints : '$_orders/$_home/get_waypoints'
    }),
  },
  created() {
    this.$store.registerModule(['$_orders','$_home'], home_store);
  }
}
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css";
</style>
