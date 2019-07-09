<template lang="html">
  <div class="homeview--inner">
    <!-- <div class="homeview--form__header">
         New Delivery
     </div> -->
    <div v-if="!get_extended_options">
      <div
        ref="scrollable_locations"
        class="homeview--form homeview--row homeview--form__scrollable"
      >
        <div class="homeview--input-bundler">
          <no-ssr placeholder="">
            <font-awesome-icon
              icon="circle"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange"
              width="10px"
            />
            <gmap-autocomplete
              v-model="locations[0]"
              :options="map_options"
              placeholder="Enter a pickup location"
              :select-first-on-enter="true"
              class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
              @place_changed="setLocation($event, 0)"
              @keyup="checkChangeEvents($event, 0)"
              @change="checkChangeEvents($event, 0)"
            />
            <font-awesome-icon
              icon="times"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup     "
              width="10px"
              @click="clearLocation(0)"
            />
          </no-ssr>
        </div>
        <div class="homeview--destinations">
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue"
                width="10px"
              />
              <gmap-autocomplete
                v-model="locations[1]"
                :options="map_options"
                placeholder="Enter a destination location"
                :select-first-on-enter="true"
                class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                @place_changed="setLocation($event, 1)"
                @keyup="checkChangeEvents($event, 1)"
                @change="checkChangeEvents($event, 1)"
              />
              <font-awesome-icon
                icon="times"
                size="xs"
                class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup "
                width="10px"
                @click="clearLocation(1)"
              />
            </no-ssr>
          </div>
        </div>
        <div
          v-for="n in get_extra_destinations"
          :key="n + 1"
          class="homeview--destinations"
          :data-index="n + 1"
        >
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue"
                width="10px"
              />
              <gmap-autocomplete
                v-model="locations[n + 1]"
                :options="map_options"
                placeholder="Enter a destination location"
                :select-first-on-enter="true"
                class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                @place_changed="setLocation($event, n + 1)"
                @keyup="checkChangeEvents($event, (n = 1))"
                @change="checkChangeEvents($event, n + 1)"
              />
              <font-awesome-icon
                icon="times"
                size="xs"
                class="homeview--row__font-awesome homeview--input-bundler__img-right "
                width="10px"
                @click="removeExtraDestinationWrapper(n + 1)"
              />
            </no-ssr>
          </div>
        </div>
      </div>

      <div
        v-if="allow_add_destination"
        class="homeview--row homeview--row__more-destinations homeview-locations-options"
      >
        <div class="homeview-locations-options--add-destination">
          <font-awesome-icon
            icon="plus"
            size="xs"
            class="sendy-blue homeview--row__font-awesome"
            width="10px"
          />
          <a
            class="homeview--add"
            @click="addExtraDestinationWrapper()"
          >Add Destination</a>
        </div>
      </div>
      <div
        v-if="loading"
        v-loading="loading"
        class="orders-loading-container"
      />
    </div>
    <div>
      <div v-if="show_vendor_view && !loading">
        <vendor-view @vendorComponentDestroyed="destroyOrderPlacement()" />
      </div>
      <div
        v-if="!show_vendor_view && !loading"
        class="home-view--seperator home-view--form__seperator"
      >
        <button
          type="button"
          class="button--primary-inactive home-view--place-order"
        >
          Confirm Order
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
import {
  faPlus,
  faMapMarkerAlt,
  faCircle,
  faClock,
  faPen,
  faDollarSign,
  faTimes,
  faMobileAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import orderPlacementStore from './_store';
import paymentsModuleStore from '../../../payment/_store';
import VendorComponent from './_components/VendorComponent.vue';
import SessionMxn from '../../../../mixins/session_mixin';

library.add(
  faPlus,
  faMapMarkerAlt,
  faCircle,
  faClock,
  faPen,
  faDollarSign,
  faTimes,
  faMobileAlt,
  faStar,
  faCcVisa,
  faCcMastercard,
);

export default {
  name: 'OrderPlacement',

  components: {
    'no-ssr': NoSSR,
    'vendor-view': VendorComponent,
  },
  mixins: [SessionMxn],
  data() {
    return {
      show_destinations: false,
      loading: false,
      locations: [],
      map_options: {
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
    };
  },
  watch: {
    get_session: {
      handler(val, oldVal) {
        if (this.show_vendor_view || this.loading) {
          this.doPriceRequest();
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters({
      get_map_markers: '$_orders/getMarkers',
      get_max_destinations: '$_orders/$_home/getMaxDestinations',
      get_order_path: '$_orders/$_home/getOrderPath',
      get_location_names: '$_orders/$_home/getLocationNames',
      get_extra_destinations: '$_orders/$_home/getExtraDestinations',
      get_order_notes: '$_orders/$_home/getOrderNotes',
      get_price_request_object: '$_orders/$_home/getPriceRequestObject',
      get_active_package_class: '$_orders/$_home/getActivePackageClass',
      get_active_vendor_name: '$_orders/$_home/getActiveVendorName',
      get_pickup_filled: '$_orders/$_home/getPickupFilled',
      get_session: 'getSession',
      get_extended_options: '$_orders/$_home/getExtendedOptions',
      getCountryCode: 'getCountryCode',
      getDefaultCurrency: 'getDefaultCurrency',
      getHomeLocations: '$_orders/getHomeLocations',
      getStoreOrderPath: '$_orders/getStorePath',
      getOuterPriceRequestData: '$_orders/getOuterPriceRequestData',
    }),

    allow_add_destination() {
      return (
        !this.loading
        && Array.isArray(this.get_order_path)
        && this.get_order_path.length - 1 <= this.get_max_destinations
        && this.get_order_path.length > 1
        && this.get_extra_destinations <= this.get_order_path.length - 2
      );
    },

    show_vendor_view() {
      return (
        Array.isArray(this.getStoreOrderPath)
        && this.getStoreOrderPath.length > 1
        && Object.prototype.hasOwnProperty.call(this.getOuterPriceRequestData, 'economy_price_tiers')
      );
    },
  },
  created() {
    this.instantiateHomeComponent();
    this.initializeOrderFlow();
  },
  mounted() {
    this.checkSessionData();
  },
  destroyed() {
    this.destroyOrderPlacement();
  },
  methods: {
    ...mapMutations({
      set_location_marker: '$_orders/setLocationMarker',
      unset_location_marker: '$_orders/unsetLocationMarker',
      set_polyline: '$_orders/setPolyline',
      unset_polyline: '$_orders/removePolyline',
      set_order_path: '$_orders/$_home/setOrderPath',
      unset_order_path: '$_orders/$_home/unsetOrderPath',
      unsetStorePath: '$_orders/unsetStorePath',
      set_location_name: '$_orders/$_home/setLocationName',
      unset_location_name: '$_orders/$_home/unsetLocationName',
      setPickupFilled: '$_orders/$_home/setPickUpFilled',
      addExtraDestination: '$_orders/$_home/addExtraDestination',
      removeExtraDestination: '$_orders/$_home/removeExtraDestination',
      set_active_package_class: '$_orders/$_home/setActivePackageClass',
      set_active_vendor_name: '$_orders/$_home/setActiveVendorName',
      set_active_vendor_details: '$_orders/$_home/setActiveVendorDetails',
      remove_markers: '$_orders/removeMarkers',
      remove_polyline: '$_orders/removePolyline',
      clear_order_path: '$_orders/$_home/clearOrderPath',
      clear_location_names_state: '$_orders/$_home/clearLocationNames',
      clear_price_request_object: '$_orders/$_home/clearPriceRequestObject',
      clear_extra_destinations: '$_orders/$_home/clearExtraDestination',
      resetState: '$_orders/$_home/resetState',
      setCountryCode: '$_orders/$_home/setCountryCode',
      setDefaultCurrency: '$_orders/$_home/setDefaultCurrency',
      setHomeLocations: '$_orders/setHomeLocations',
      setStorePath: '$_orders/setStorePath',
      clearStorePath: '$_orders/clearStorePath',
      clearOuterPriceRequestObject: '$_orders/clearOuterPriceRequestObject',
      clearOuterActiveVendorDetails: '$_orders/clearOuterActiveVendorDetails',
      setOuterPriceRequestObject: '$_orders/setOuterPriceRequestObject',
      setOrderState: '$_orders/$_home/setOrderState',
    }),

    ...mapActions({
      requestPriceQuote: '$_orders/$_home/requestPriceQuote',
    }),

    removeExtraDestinationWrapper(index) {
      this.removeExtraDestination();
      this.clearLocation(index);
    },

    addExtraDestinationWrapper() {
      this.addExtraDestination();
      this.scrollToBottom();
    },

    checkChangeEvents(evt, index) {
      // console.log('index', index);
      // console.log('evt', evt);
      // TO DO research implementation of native input events
    },

    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },

    clearLocation(index) {
      this.resetLocation(index);
      this.attemptPriceRequest();
    },

    resetLocation(index) {
      if (index === 0) {
        this.setPickupFilled(false);
      }

      this.unset_location_marker(index);
      this.unset_order_path(index);
      this.unsetStorePath(index);
      this.deleteLocationInModel(index);
      this.unset_location_name(index);
    },

    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = place.address_components.findIndex(country_code => country_code.types.includes('country'));
      const pathObj = {
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        waypoint_details_status: true,
        type: 'coordinates',
        country_code: place.address_components[countryIndex].short_name,
        more: {
          Estate: '',
          FlatName: '',
          place_idcustom: place.place_id,
          Label: '',
          HouseDoor: '',
          Otherdescription: '',
          Typed: '',
          Vicinity: 'Not Indicated',
          Address: 'Not Indicated',
        },
      };
      const pathPayload = {
        index,
        path: pathObj,
      };
      const locationNamePayload = {
        index,
        name: place.name,
      };
      this.resetLocation(index);
      this.setMarker(place.geometry.location.lat(), place.geometry.location.lng(), index);
      this.set_order_path(pathPayload);
      this.setStorePath(pathPayload);
      this.setLocationInModel(index, place.name);
      this.set_location_name(locationNamePayload);
      if (index === 0) {
        this.setPickupFilled(true);
      }
      this.attemptPriceRequest();
    },
    attemptPriceRequest() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.get_pickup_filled === true
      ) {
        this.clearOuterPriceRequestObject();
        this.clearOuterActiveVendorDetails();
        this.doPriceRequest();
      }
    },

    setLocationInModel(index, name) {
      this.locations.splice(index, 0, name);
    },

    deleteLocationInModel(index) {
      this.locations.splice(index, 1);
    },

    clearLocationNamesModel() {
      this.locations = [];
    },

    setMarker(lat, lng, index) {
      const mark = {
        position: { lat, lng, icon: 'destination' },
      };
      if (index === 0) {
        mark.icon = 'pickup';
      }
      const markerPayload = {
        index,
        marker: mark,
      };
      this.set_location_marker(markerPayload);
    },

    createPriceRequestObject() {
      const obj = { path: this.getStoreOrderPath };
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }
      const infor = {
        email: acc.user_email,
        client_mode: 'cop_id' in acc ? acc.cop_id : 0,
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        name: acc.user_name,
        phone: acc.user_phone,
        date_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        schedule_status: false,
        schedule_time: this.moment().format('YYYY-MM-DD HH:mm:ss'),
        vendor_type: 1,
        group_id: 1,
        client_type: 'corporate',
        rider_dist: 0,
        no_charge_status: false,
        is_re_request: false,
        rider_phone: '0709779779',
        insurance: '0',
        type: 'coordinates',
        promotion_status: false,
        destination_paid_status: false,
        is_edit: false,
        country_code: this.getCountryCode,
        default_currency: this.getDefaultCurrency,
        preffered_currency: this.getDefaultCurrency,
      };
      const jsonDecodedPath = JSON.stringify(obj);
      infor.path = jsonDecodedPath;
      const finalObj = { values: infor };
      return finalObj;
    },
    doPriceRequest() {
      this.setOuterPriceRequestObject('');
      const payload = {
        values: this.createPriceRequestObject(),
        app: 'PRIVATE_API',
        endpoint: 'pricing_multiple',
      };
      this.loading = true;
      const previousActiveVendor = this.get_active_vendor_name;
      const definedLocations = this.locations;
      this.requestPriceQuote(payload).then(
        (response) => {
          this.setOrderState(1);
          this.setHomeLocations(definedLocations);
          this.setOuterPriceRequestObject(response.values);
          this.loading = false;
          this.setDefaultPackageClass();
          this.setDefaultVendorType(previousActiveVendor);
          const acc = this.$store.getters.getSession;

          this.trackMixpanelEvent('Make Price Request', {
            'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
            'Client Type': 'Web Platform',
          });
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'crisis_notification')) {
            this.doNotification(3, error.reason, error.crisis_notification.msg);
          } else {
            this.doNotification(
              3,
              'Price request failed',
              'Price request failed. Please try again after a few minutes.',
            );
          }

          this.loading = false;
        },
      );
    },

    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },

    doSetDefaultPackageClass() {
      try {
        const defaultPackageClass = this.get_price_request_object.economy_price_tiers[0].tier_group;
        this.set_active_package_class(defaultPackageClass);
      } catch (er) {
        // console.log(er);
      }
    },

    doSetDefaultVendorType() {
      try {
        const defaultVendorDetails = this.get_price_request_object.economy_price_tiers[0]
          .price_tiers[0];
        this.set_active_vendor_name(defaultVendorDetails.vendor_name);
        this.set_active_vendor_details(defaultVendorDetails);
      } catch (er) {
        // console.log(er);
      }
    },
    setDefaultVendorType(previous) {
      if (this.get_active_vendor_name === '') {
        this.doSetDefaultVendorType();
      } else {
        const result = this.get_price_request_object.economy_price_tiers.filter(pack => pack.price_tiers.some(vendor => vendor.vendor_name === previous));

        if (result.length == 0) {
          this.doSetDefaultVendorType();
        } else {
          const newActivePriceObject = result[0].price_tiers.find(
            vendor => vendor.vendor_name === previous,
          );
          this.set_active_vendor_details(newActivePriceObject);
        }
      }
    },

    setDefaultPackageClass() {
      if (this.get_active_package_class === '') {
        this.doSetDefaultPackageClass();
      } else {
        const self = this;
        const _package = this.get_price_request_object.economy_price_tiers.filter(
          pack => pack.tier_group === self.get_active_package_class,
        );
        if (_package.length === 0) {
          this.doSetDefaultPackageClass();
        }
      }
    },

    scrollToBottom() {
      const container = this.$refs.scrollable_locations;
      container.scrollTop = container.scrollHeight;
    },

    initial_destination_css(n) {
      return {
        'homeview--input-bundler__destination-short-input': false,
      };
    },

    removePolyline() {
      this.unset_polyline([]);
    },

    destroyOrderPlacement() {
      this.clearLocationNamesModel();
      this.setPickupFilled(false);
      try {
        this.$store.unregisterModule(['$_orders', '$_home']);
      } catch (er) {
        // console.log('failed to unregisterModule $_orders $_home on order placement home', er);
      }

      // do not unregister payments module since we do not expect any conflicts with the payment page state

      this.clear_order_path();
      this.remove_markers();
      this.remove_polyline();
      this.clear_location_names_state();
      this.clear_price_request_object();
      this.setPickupFilled(false);
      this.clear_extra_destinations();
      this.$destroy();
    },

    registerPaymentModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_payment !== undefined;

      if (!moduleIsRegistered) {
        this.$store.registerModule('$_payment', paymentsModuleStore);
      }
    },

    registerOrderPlacementModule() {
      let moduleIsRegistered = false;
      try {
        moduleIsRegistered = this.$store._modules.root._children.$_orders._children.$_home !== undefined;
      } catch (er) {
        //
      }

      if (!moduleIsRegistered) {
        this.$store.registerModule(['$_orders', '$_home'], orderPlacementStore);
      }
    },

    instantiateHomeComponent() {
      this.registerPaymentModule();
      this.registerOrderPlacementModule();
    },
    checkSessionData() {
      const session = this.$store.getters.getSession;
      const acc = session[session.default];
      if (!acc.hasOwnProperty('country_code')) {
        this.deleteSession();
        this.$router.push({ path: '/auth/sign_in' });
      }
    },
    initializeOrderFlow() {
      if (this.$route.path === '/orders/') {
        const storedLocation = this.getHomeLocations;
        if (storedLocation.length > 1) {
          this.locations = storedLocation;
          this.setPickupFilled(true);
          this.setPickupFilled(true);
          this.attemptPriceRequest();
        }
      } else {
        this.clearStorePath();
        this.setOrderState(3);
        this.clearOuterPriceRequestObject();
        this.clearOuterActiveVendorDetails();
      }
    },
  },
};
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
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: #1782c5;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
