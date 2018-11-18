<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">

      <div class="homeview--form homeview--row homeview--form__scrollable" id="homeview-form">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">
              <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange" width="10px"  />
              <gmap-autocomplete @place_changed="setLocation($event, 0)" :options="map_options"  v-model="locations[0]" placeholder="Pickup" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"></gmap-autocomplete>
              <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="clearLocation(0)"/>
          </no-ssr>
        </div>
        <div class="homeview--destinations">
            <div class="homeview--input-bundler">
              <no-ssr placeholder="">
                  <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                  <gmap-autocomplete  @place_changed="setLocation($event, 1)" :options="map_options"  v-model="locations[1]" placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                  <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="clearLocation(1)"/>
              </no-ssr>
            </div>
        </div>
        <div class="homeview--destinations"  v-for="n in get_extra_destinations" :key="n+2" v-bind:data-index="n+2">
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
                <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                <gmap-autocomplete  @place_changed="setLocation($event, n+2)" :options="map_options"  v-model="locations[2]" placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="remove_location(n+2)"/>
            </no-ssr>
          </div>

        </div>

      </div>
      <!-- <div class="homeview--row homeview--row__more-destinations">
           <font-awesome-icon icon="plus" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" />
        <a href="#" class="homeview--add" @click="newDestination()">Add</a>
      </div> -->
      <div v-if="get_order_path.length > 1">
          <vendor-view ></vendor-view>
      </div>
      </div>

  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters,mapMutations,mapActions } from 'vuex';
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
       map_options:{componentRestrictions: {country: ['ke', 'tz', 'ug', 'rw', 'bi']}},
       locations:[],

    }
  },
  components: {
    'no-ssr': NoSSR,
    'vendor-view': VendorComponent
  },
  computed: {
    ...mapGetters({
      // get_waypoints : '$_orders/$_home/get_waypoints',
      get_max_destinations : '$_orders/$_home/get_max_destinations',
      get_order_path : '$_orders/$_home/get_order_path',
      get_extra_destinations : '$_orders/$_home/get_extra_destinations',
    }),
  },
  methods: {
    ...mapMutations({
      set_location_marker : '$_orders/set_location_marker',
      unset_location_marker : '$_orders/unset_location_marker',
      set_order_path: '$_orders/$_home/set_order_path',
      unset_order_path: '$_orders/$_home/unset_order_path',
      set_extra_destinations: '$_orders/$_home/set_extra_destinations',
      // add_waypoint : '$_orders/$_home/add_waypoint',
      // remove_waypoint : '$_orders/$_home/remove_waypoint'
    }),
    ...mapActions({
        requestPriceQuote: '$_orders/$_home/requestPriceQuote',
    }),
    clearLocation(index){
        if(index == 0){
            //set pickup cleared
        }
        this.unset_location_marker(index);
        this.unset_order_path(index);
    },
    setLocation(place,index){
        // TO Do reset marker on store when leaving the route
        if (!place) return
        let path_obj = {
            "name":place.name,
            "coordinates": ''+place.geometry.location.lat()+','+place.geometry.location.lng()+'',
            "waypoint_details_status":true,
            "type":"coordinates",
            "more":{
                "Estate": "",
                "FlatName": "",
                "place_idcustom": place.place_id,
                "Label": "",
                "HouseDoor": "",
                "Other description": "",
                "Typed": "",
                "Vicinity": "Not Indicated",
                "Address": "Not Indicated"
            }
        };
        let path_payload = {
            "index":index,
            "path":path_obj
        };
        this.setMarker(place.geometry.location.lat(),place.geometry.location.lng(),index );
        this.set_order_path(path_payload);
        if(this.get_order_path.length > 1){
            this.doPriceRequest();
        }
    },
    setMarker(lat,lng, index){
        let mark = {
            "position":{"lat":lat, "lng":lng, "icon":"destination"}
        };
        if(index == 0){
            mark.icon = "pickup";
            console.log('in pickup');
        }
        let marker_payload = {
            "index":index,
            "marker":mark
        }
        this.set_location_marker(marker_payload);
    },
    newDestination(){

    },
    getOrderDetailsFromSessionData(){

    },
    createPriceRequestObject(){
        let obj = {"path":this.get_order_path};
        let infor = {
          "email": "ian@sendy.co.ke",
          "client_mode": "0",
          "cop_id": 0,
          "name": "Evanson",
          "phone": "0700177140",
          "date_time": "2018-11-18 22:07:07",
          "schedule_status": false,
          "schedule_time": "2018-11-18 22:07:13",
          "vendor_type": 1,
          "group_id": 1,
          "client_type": "corporate",
          "rider_dist": 0,
          "no_charge_status": false,
          "is_re_request": false,
          "rider_phone": "",
          "insurance": "0",
          "type": "coordinates",
          "promotion_status": false,
          "destination_paid_status": false
        }
        let json_decoded_path = JSON.stringify(obj);
        infor.path = json_decoded_path;
        let final_obj = {"values":infor};
        console.log('infor'.infor);
        return final_obj;
    },
    doPriceRequest(){
        let payload = {
          "values" : this.createPriceRequestObject(),
          "vm":this,
          "app":"PRIVATE_API",
          "endpoint":"pricing_multiple"
        };

        this.requestPriceQuote(payload).then(response => {

           console.log(response);

           if(response.status == true){


           } else {

              console.warn('login failed');

           }

        }, error => {
            console.error("Check Internet Connection")
            console.log(error);
        });
    },
    completeOrder(){

    },
    scroll_to_bottom(){
        let container = this.$el.querySelector("#homeview-form");
        container.scrollTop = container.scrollHeight;
    },
    initial_destination_css(n){
        return {
            'homeview--input-bundler__destination-short-input': false
        }
    }
  },

  created() {
    this.$store.registerModule(['$_orders','$_home'], home_store);
  },

  watch:{
      // get_order_path: function (val) {
         // if(val.length  > 1 ){
         //     let more_slots = this.get_max_destinations - val.length
         //     this.set_extra_destinations(val.length )
         // }
       // },
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
