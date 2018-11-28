<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">
     <!-- <div class="homeview--form__header">
         New Delivery
     </div> -->
      <div class="homeview--form homeview--row homeview--form__scrollable" id="homeview-form">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">
              <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange" width="10px"  />
              <gmap-autocomplete @place_changed="setLocation($event, 0)" @keyup="checkChangeEvents($event, 0)" @change="checkChangeEvents($event, 0)" :options="map_options"  v-model="locations[0]" placeholder="Enter a pickup location" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"></gmap-autocomplete>
              <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup     " width="10px"  @click="clearLocation(0)" />
          </no-ssr>
        </div>
        <div class="homeview--destinations">
            <div class="homeview--input-bundler">
              <no-ssr placeholder="">
                  <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                  <gmap-autocomplete  @place_changed="setLocation($event, 1)"  @keyup="checkChangeEvents($event, 1)" @change="checkChangeEvents($event, 1)" :options="map_options"  v-model="locations[1]" placeholder="Enter a destination location" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                  <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup " width="10px"  @click="clearLocation(1)"/>
              </no-ssr>
            </div>
        </div>
        <div class="homeview--destinations"  v-for="n in get_extra_destinations" :key="n+1" v-bind:data-index="n+1">
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
                <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                <gmap-autocomplete  @place_changed="setLocation($event, n+1)"  @keyup="checkChangeEvents($event, n=1)" @change="checkChangeEvents($event, n+1)" :options="map_options"  v-model="locations[n+1]" placeholder="Enter a destination location" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="removeExtraDestinationWrapper(n+1)"/>
            </no-ssr>
          </div>

        </div>

      </div>
      <div class="homeview--row homeview--row__more-destinations" v-if="allow_add_destination">
           <font-awesome-icon icon="plus" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" />
        <a href="#" class="homeview--add" @click="addExtraDestination()">Add Destination</a>
      </div>
      <div class="orders-loading-container" v-loading="loading" v-if="loading">
      </div>
      <div v-if="show_vendor_view && !loading">
          <vendor-view v-on:vendorComponentDestroyed="destroyOrderPlacement()"></vendor-view>
      </div>
      <div v-if="!show_vendor_view && !loading" class="home-view--seperator home-view--form__seperator">
          <button type="button" class="button--primary-inactive home-view--place-order" >Confirm Order</button>
      </div>
      </div>

  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters,mapMutations,mapActions } from 'vuex';
import order_placement_store from './_store';
import orders_module_store from '../../_store';
import payments_module_store from '../../../payment/_store';
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
       loading:false,

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
      get_location_names : '$_orders/$_home/get_location_names',
      get_extra_destinations : '$_orders/$_home/get_extra_destinations',
      get_order_notes : '$_orders/$_home/get_order_notes',
      get_price_request_object : '$_orders/$_home/get_price_request_object',
      get_active_package_class : '$_orders/$_home/get_active_package_class',
      get_active_vendor_name : '$_orders/$_home/get_active_vendor_name',
      get_pickup_filled : '$_orders/$_home/get_pickup_filled',
      get_map_markers : '$_orders/get_markers'
    }),
    allow_add_destination(){

        return !this.loading && Array.isArray(this.get_order_path) && ((this.get_order_path.length-1) <= this.get_max_destinations) && (this.get_order_path.length>1) && (this.get_extra_destinations <= this.get_order_path.length-2 );
    },
    show_vendor_view(){
        return Array.isArray(this.get_order_path) && this.get_order_path.length > 1;
    }
  },
  methods: {
    ...mapMutations({
      set_location_marker : '$_orders/set_location_marker',
      unset_location_marker : '$_orders/unset_location_marker',
      set_polyline: '$_orders/set_polyline',
      unset_polyline: '$_orders/remove_polyline',
      set_order_path: '$_orders/$_home/set_order_path',
      unset_order_path: '$_orders/$_home/unset_order_path',
      set_location_name: '$_orders/$_home/set_location_name',
      unset_location_name: '$_orders/$_home/unset_location_name',
      setPickupFilled: '$_orders/$_home/set_pickup_filled',
      addExtraDestination : '$_orders/$_home/add_extra_destination',
      removeExtraDestination : '$_orders/$_home/remove_extra_destination',
      set_active_package_class : '$_orders/$_home/set_active_package_class',
      set_active_vendor_name : '$_orders/$_home/set_active_vendor_name',
      remove_markers : '$_orders/remove_markers',
      remove_polyline : '$_orders/remove_polyline',
      clear_order_path : '$_orders/$_home/clear_order_path',
      clear_location_names_state : '$_orders/$_home/clear_location_names',
      clear_price_request_object : '$_orders/$_home/clear_price_request_object',
      clear_extra_destinations : '$_orders/$_home/clear_extra_destination',
      resetState : '$_orders/$_home/resetState',

    }),
    ...mapActions({
        requestPriceQuote: '$_orders/$_home/requestPriceQuote',
    }),
    removeExtraDestinationWrapper(index){
        this.removeExtraDestination();
        this.clearLocation(index);
    },
    addExtraDestinationWrapper(){
        let next_index = Array.isArray(this.get_order_path)? this.get_order_path.length : 0;
        this.clearLocation(next_index-1);
    },
    checkChangeEvents(evt, index){
        console.log('index', index);
        console.log('evt', evt);
        // TO DO research implementation of native input events
    },
    clearLocation(index){
        this.resetLocation(index);
        this.attemptPriceRequest();
    },
    resetLocation(index){
        if(index == 0){
            this.setPickupFilled(false);
        }
        this.unset_location_marker(index);
        this.unset_order_path(index);
        this.deleteLocationInModel(index);
        this.unset_location_name(index);
    },
    setLocation(place,index){
        // TO Do reset marker on store when leaving the route
        if (!place){ console.log('not a place', index);return;}
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
                "Otherdescription": "",
                "Typed": "",
                "Vicinity": "Not Indicated",
                "Address": "Not Indicated"
            }
        };
        let path_payload = {
            "index":index,
            "path":path_obj
        }
        let location_name_payload = {
            "index":index,
            "name":place.name
        }
        this.resetLocation(index);
        this.setMarker(place.geometry.location.lat(),place.geometry.location.lng(),index );
        this.set_order_path(path_payload);
        this.setLocationInModel(index,place.name);
        this.set_location_name(location_name_payload);
        if(index == 0){
            this.setPickupFilled(true);
        }
        this.attemptPriceRequest();

    },
    attemptPriceRequest(){
        if(Array.isArray(this.locations) && this.locations.length > 1 && this.get_pickup_filled == true){
            this.doPriceRequest();
        }
    },
    setLocationInModel(index, name){
        this.locations.splice(index,0,name);
    },
    deleteLocationInModel(index){
        this.locations.splice(index,1);
    },
    clearLocationNamesModel(){
        this.locations = [];
    },
    setMarker(lat,lng, index){
        let mark = {
            "position":{"lat":lat, "lng":lng, "icon":"destination"}
        };
        if(index == 0){
            mark.icon = "pickup";
            console.log('in pickup');
        }
        else{
            console.log('index', index);
        }
        let marker_payload = {
            "index":index,
            "marker":mark
        }
        this.set_location_marker(marker_payload);
    },

    createPriceRequestObject(){
        let obj = {"path":this.get_order_path};
        let acc = {};
        let session = this.$store.getters.getSession;
        if('default' in session){
            acc = session[session.default];
        }
        let infor = {
          "email": acc.user_email,
          "client_mode": 'cop_id' in acc ? acc.cop_id : 0,
          "cop_id": 'cop_id' in acc ? acc.cop_id : 0,
          "name": acc.user_name,
          "phone": acc.user_phone,
          "date_time": this.moment().format('YYYY-MM-DD HH:mm:ss'),
          "schedule_status": false,
          "schedule_time": this.moment().format('YYYY-MM-DD HH:mm:ss'),
          "vendor_type": 1,
          "group_id": 1,
          "client_type": "corporate",
          "rider_dist": 0,
          "no_charge_status": false,
          "is_re_request": false,
          "rider_phone": "0709779779",
          "insurance": "0",
          "type": "coordinates",
          "promotion_status": false,
          "destination_paid_status": false,
          "is_edit": false
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
          "app":"PRIVATE_API",
          "endpoint":"pricing_multiple"
        };
        this.loading = true;
        this.requestPriceQuote(payload).then(response => {
            this.loading = false;
           console.log(response);

           if(response.status == true){
               this.setDefaultPackageClass();

           } else {
               this.doNotification(2,"Price request failed", "Price request failed. Please try again")
              console.warn('Price request failed');

           }

        }, error => {
            console.error("Check Internet Connection")
            console.log(error);
            this.doNotification(3,"Price request failed", "Price request failed. Please check your internet connection and try again.");
            this.loading = false;
        });
    },

    doNotification(level,title, message){
        this.$store.commit('setNotificationStatus', true);
        let notification = {"title":title, "level":level, "message":message};
        this.$store.commit('setNotification', notification);
    },
    setDefaultPackageClass(){
        try{
            if(this.get_active_package_class == ''){
                let default_package_class = this.get_price_request_object.economy_price_tiers[0]["tier_group"];
                console.log('default_package_class');
                this.set_active_package_class(default_package_class);
            }
            if(this.get_active_vendor_name == ''){
                let default_vendor = this.get_price_request_object.economy_price_tiers[0]['price_tiers'][0]['vendor_name'];
                console.log('default_vendor', default_vendor)
                this.set_active_vendor_name(default_vendor);
            }
        }
        catch(er){
            console.log(er);
        }

    },
    // scroll_to_bottom(){
    //     let container = this.$el.querySelector("#homeview-form");
    //     container.scrollTop = container.scrollHeight;
    // },
    initial_destination_css(n){
        return {
            'homeview--input-bundler__destination-short-input': false
        }
    },

    removePolyline(){
        this.unset_polyline([]);
    },
    destroyOrderPlacement(){
        this.clearLocationNamesModel();
        this.setPickupFilled(false);
        try{
            this.$store.unregisterModule(['$_orders','$_home']);
        }
        catch(er){
            console.log('failed to unregisterModule $_orders $_home on order placement home', er);
        }


        try{
            this.$store.unregisterModule('$_payment');
        }
        catch(er){
            console.log('failed to unregisterModule $_orders $_home on order placement home', er);
        }

        this.clear_order_path();
        this.remove_markers();
        this.remove_polyline();
        this.clear_location_names_state();
        this.clear_price_request_object();
        this.setPickupFilled(false);
        this.clear_extra_destinations();
        this.$destroy();
    }
  },
  mounted() {

  },
  created() {
      this.$store.registerModule(['$_orders','$_home'], order_placement_store);
      this.$store.registerModule('$_payment', payments_module_store);
  },
  destroyed () {
      this.destroyOrderPlacement();
  },

  watch:{

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
