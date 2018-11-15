<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">
      <div class="homeview--form homeview--row">
        <div class="homeview--input">
          <no-ssr placeholder="">
            <gmap-autocomplete placeholder="Enter Pickup Location" :select-first-on-enter="true" class="input-control"></gmap-autocomplete>
          </no-ssr>
        </div>
        <transition name="slide-fade">
          <div class="homeview--input" v-if="this.get_waypoints > 1">
            <a href="#" class="homeview--stops">{{this.get_waypoints - 1}} stops</a>
          </div>
        </transition>
        <transition-group name="slide-fade" tag="div" v-on:enter="enter">
          <div v-for="n in this.get_waypoints" :key="n" v-if="show_destination(n)" v-bind:data-index="n">
            <div class="homeview--destinations">
              <div class="homeview--input">
                <no-ssr placeholder="">
                  <gmap-autocomplete placeholder="Enter Destination Location" :select-first-on-enter="true" class="input-control"></gmap-autocomplete>
                </no-ssr>
              </div>
              <div class="homeview--input row">
                <input type="text" name="" value="" placeholder="Recipient Name" class="input-control">
                <input type="text" name="" value="" placeholder="Phone Number" class="input-control">
              </div>
            </div>
          </div>
        </transition-group>

      </div>
      <div class="homeview--row">
        <a href="#" class="homeview--add" @click="add_waypoint()">Add Destination</a>
      </div>
    </div>
    <vendor-view/>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';
import home_store from './_store';
import VendorComponent from './_components/VendorComponent.vue'

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
.homeview--outer
{
  position: absolute;
  margin-top: 10px;
  left: 10px;
  background-color: #fff;
  width: 400px;
}
.homeview--inner
{
  padding: 20px;
  box-shadow: inset 0px -10px 10px -10px rgba(0,0,0,0.75)
}
.homeview--form
{
  border-left: 3px solid #ccc;
}
.homeview--input
{
  padding-bottom: 10px;
  width: 100%;
}
.homeview--stops
{
  text-decoration: none;
  color: #1782c5;
  font-size: 13px;
  padding-top: 10px;
}
.homeview--row
{
  padding: 10px 20px;
}
.homeview--add
{
  text-decoration: none;
  color: #1782c5;
  font-size: 13px;
}
.row
{
  display: flex;
  flex-direction: row;
}
.homeview--destinations
{
  padding: 10px;
  background-color: #efefef;
}
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter
{
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to
{
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-move
{
  transition: transform 1s;
}
</style>
