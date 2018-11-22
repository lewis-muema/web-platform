<template lang="html">
  <div class="homeview--outer">
    <div class="homeview--inner">

      <div class="homeview--form homeview--row homeview--form__scrollable" id="homeview-form">
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">
              <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange" width="10px"  />
              <gmap-autocomplete @place_changed="setLocation($event, 0)" :options="map_options"  v-model="locations[0]" placeholder="Pickup" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"></gmap-autocomplete>
              <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup     " width="10px"  @click="clearLocation(0)" />
          </no-ssr>
        </div>
        <div class="homeview--destinations">
            <div class="homeview--input-bundler">
              <no-ssr placeholder="">
                  <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                  <gmap-autocomplete  @place_changed="setLocation($event, 1)" :options="map_options"  v-model="locations[1]" placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                  <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup " width="10px"  @click="clearLocation(1)"/>
              </no-ssr>
            </div>
        </div>
        <div class="homeview--destinations"  v-for="n in get_extra_destinations" :key="n+2" v-bind:data-index="n+2">
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
                <font-awesome-icon icon="circle" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue" width="10px"  />
                <gmap-autocomplete  @place_changed="setLocation($event, n+2)" :options="map_options"  v-model="locations[n+2]" placeholder="Destination" :select-first-on-enter="true" class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input" ></gmap-autocomplete>
                <font-awesome-icon icon="times" size="xs" class="homeview--row__font-awesome homeview--input-bundler__img-right " width="10px"  @click="removeExtraDestinationWrapper(n+2)"/>
            </no-ssr>
          </div>

        </div>

      </div>
      <div class="homeview--row homeview--row__more-destinations" v-if="allow_add_destination">
           <font-awesome-icon icon="plus" size="xs" class="sendy-blue homeview--row__font-awesome" width="10px" />
        <a href="#" class="homeview--add" @click="addExtraDestination()">Add</a>
      </div>
      <div class="orders-loading-container" v-loading="loading" v-if="loading">
      </div>
      <div v-if="get_order_path.length > 1 && !loading">
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
        return !this.loading && ((this.get_order_path.length-1) <= this.get_max_destinations) && (this.get_order_path.length>1) && (this.get_extra_destinations <= this.get_order_path.length-2 );
    }
  },
  methods: {
    ...mapMutations({
      set_location_marker : '$_orders/set_location_marker',
      unset_location_marker : '$_orders/unset_location_marker',
      set_order_path: '$_orders/$_home/set_order_path',
      set_location_name: '$_orders/$_home/set_location_name',
      unset_order_path: '$_orders/$_home/unset_order_path',
      unset_location_name: '$_orders/$_home/unset_location_name',
      setPickupFilled: '$_orders/$_home/set_pickup_filled',
      addExtraDestination : '$_orders/$_home/add_extra_destination',
      removeExtraDestination : '$_orders/$_home/remove_extra_destination'
    }),
    ...mapActions({
        requestPriceQuote: '$_orders/$_home/requestPriceQuote',
    }),
    removeExtraDestinationWrapper(index){
        this.removeExtraDestination();
        this.clearLocation(index);
    },
    addExtraDestinationWrapper(){
        let next_index = this.get_order_path.length;
        this.clearLocation(next_index);
    },
    clearLocation(index){
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
        this.clearLocation(index);
        this.setMarker(place.geometry.location.lat(),place.geometry.location.lng(),index );
        this.set_order_path(path_payload);
        this.setLocationInModel(index,);
        this.set_location_name(location_name_payload);
        if(index == 0){
            this.setPickupFilled(true);
        }
        if(this.get_order_path.length > 1 && this.get_pickup_filled == true){
            this.doPriceRequest();
        }
    },
    setLocationInModel(index, name){
        this.locations.splice(index,0,name);
    },
    deleteLocationInModel(index){
        this.locations.splice(index,1);
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
          "vm":this,
          "app":"PRIVATE_API",
          "endpoint":"pricing_multiple"
        };
        this.loading = true;
        this.requestPriceQuote(payload).then(response => {
            this.loading = false;
           console.log(response);

           if(response.status == true){
               // this.newDestination();

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
    // scroll_to_bottom(){
    //     let container = this.$el.querySelector("#homeview-form");
    //     container.scrollTop = container.scrollHeight;
    // },
    initial_destination_css(n){
        return {
            'homeview--input-bundler__destination-short-input': false
        }
    },
    initializeOrderPlacementHome(){
        console.log('in initializeOrderPlacementHome');
        if(this.get_location_names.length > 0){
            this.locations = this.get_location_names;
        }
        console.log('out initializeOrderPlacementHome');

    }
  },
  mounted() {
    this.$store.commit('$_orders/remove_polyline',[])
    this.$store.commit('$_orders/remove_markers',[])
  },
  created() {
    const STORE_PARENT = "$_orders";
    const STORE_KEY = "$_home";
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT,STORE_KEY], home_store);
    }
    this.initializeOrderPlacementHome();
    console.log('in created');
  },
  beforeRouteLeave (to, from, next) {
    if(to.name == 'tracking'){
        if(this.get_map_markers.length > 0){
            for(let i=0; i< this.get_map_markers.length; i++){
                this.unset_location_marker(i);
                this.unset_order_path(i);
                this.deleteLocationInModel(i);
                this.unset_location_name(i);
            }
        }
    }
    next();
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
