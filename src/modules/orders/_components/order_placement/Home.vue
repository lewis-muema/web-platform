<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">
      <div class="homeview--form homeview--row">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">

              <font-awesome-icon icon="circle" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" class="homeview--input-bundler__img" />
              <!-- <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/orders/orange_button.png" alt="" > -->
              <gmap-autocomplete placeholder="Pickup Location" :select-first-on-enter="true" class="input-control homeview--input-bundler__input"></gmap-autocomplete>
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
                    <!-- <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/orders/blue_button.png" alt="" class="homeview--input-bundler__img"> -->
                    <font-awesome-icon icon="map-marker-alt" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" class="homeview--input-bundler__img" />

                    <gmap-autocomplete placeholder="Enter Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input"></gmap-autocomplete>
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
        <a href="#" class="homeview--add" @click="add_waypoint()">Add Destination</a>
      </div>
      <div class="">
          <div class="home-view--seperator">
          </div>
          <div class="home-view-vendor-classes">
              <div class="home-view-vendor-classes--title">
                  What size of load do you want delivered?
              </div>
              <div class="home-view-vendor-classes--body">
                  <div class="home-view-vendor-classes--icons">
                      <div class="home-view-vendor-classes-icons-item">
                         <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/small.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                      </div>
                      <div class="home-view-vendor-classes-icons-item">
                          <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/medium.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                      </div>
                      <div class="home-view-vendor-classes-icons-item">
                          <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/large.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                      </div>
                  </div>
                  <div class="home-view-vendor-classes--label">
                      <div class="home-view-vendor-classes-label-item">
                          small
                      </div>
                      <div class="home-view-vendor-classes-label-item">
                          medium
                      </div>
                      <div class="home-view-vendor-classes-label-item">
                          large
                      </div>
                  </div>
              </div>
          </div>
        </div>
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
import { faPlus, faMapMarkerAlt, faCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)

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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
}
.homeview--form
{
  /* border-left: 3px solid #ccc; */
}
.homeview--input-bundler
{
  padding-bottom: 15px;
  /* width: 100%; */
  display: flex;
}
.homeview--input-bundler__img, .homeview--input-bundler__input{
     display: flex;
}
.homeview--input-bundler__img{
    max-width: 10px;
    height: 10px;
    position: relative;
    top: 15px;
    left: -15px;
}
.homeview--input-bundler__input{

}
.homeview--input-bundler__waypoints{
    margin-top: -10px;
    padding-left: 10px;
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
  font-size: 13px;
}
.homeview--row__more-destinations{
    padding-left: 5px;
    margin-top: -10px;
}
.homeview--row__font-awesome{
    padding-right: 10px;
    font-size: 13px;
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
  /* padding: 10px; */
  /* background-color: #efefef; */
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


/*
vendor classes
*/
.home-view--seperator{
    border-top: 1px solid #6663;
    margin-left: -20px;
    margin-right: -20px;
}
.home-view-vendor-classes{

}
.home-view-vendor-classes--title{
    text-align: center;
    font-weight: normal;
    padding: 20px;
}
.home-view-vendor-classes--body{

}
.home-view-vendor-classes--icons, .home-view-vendor-classes--label, .home-view-vendor-classes-icons-item, .home-view-vendor-classes-label-item{
    display: flex;
}
.home-view-vendor-classes-icons-item, .home-view-vendor-classes-label-item{
    flex: 1;
    justify-content: center;
    align-items: center;
}
.home-view-vendor-classes--icons{

}
.home-view-vendor-classes--label{
    padding: 5px 0px;
}
.home-view-vendor-classes-icons-item--img{
    width: 30px;
    max-height: 30px;
}

/* price */
</style>
