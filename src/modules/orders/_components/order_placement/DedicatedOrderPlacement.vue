<template lang="html">
  <div class="homeview--inner">
    <!-- <div class="homeview--form__header">
         New Delivery
     </div> -->
    <div v-if="!get_extended_options">
      <div
        ref="scrollable_locations"
        class="homeview--form homeview--row homeview--form__scrollable"
        @click="$root.$emit('tour class hidden', 1)"
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
              id="homeview--pick-up-location-input"
              v-model="locations[0]"
              :options="map_options"
              :placeholder="$t('general.enter_pickup_location')"
              :select-first-on-enter="true"
              class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
              @place_changed="setLocation($event, 0, 1)"
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
          <div
          v-if="activeEl === 'homeview--pick-up-location-input' && hiddenSuggestionsStatus"
          class="homeview--input-suggestions"
          :style="{ marginTop: `${(scrollFromTop - 15)}px`, width: `${suggestionsWidth}px`, left: `${leftDisplacement}px` }"
          @mouseover="activeSuggestionList = true"
          @mouseout="activeSuggestionList = false"
        >
          <div class="homeview--input-suggetions-title">
            {{$t('general.saved_and_frequently_used')}}
          </div>
          <div
            v-for="(suggestion, index) in pickUpSuggestions"
            :key="index"
            class="homeview--input-suggestion-rows"
            :class="activeRow === index ? 'homeview--input-suggestion-rows-active' : ''"
            @mouseover="activeRow = index"
            @mouseout="activeRow = ''"
            @click="setLocation(suggestion, 0, 2)"
          >
            <span class="homeview--input-suggestion-icon-holder">
              <font-awesome-icon
                v-if="suggestion.location_type === 'frequent'"
                icon="history"
                size="xs"
                class="homeview--input-suggestion-icon"
                width="10px"
              />
              <font-awesome-icon
                v-if="suggestion.location_type === 'saved'"
                icon="star"
                size="xs"
                class="homeview--input-suggestion-icon"
                width="10px"
              />
            </span>
            <span class="locations-popup-saved-name">
              <span class="homeview--input-suggestion-place-name">
                {{ suggestion.name }},
              </span>
              <span class="homeview--input-suggestion-address-name">
                {{ suggestion.address }}
              </span>
            </span>
          </div>
          <div
            class="homeview--input-suggetions-link"
            @click="triggerLocationsManagementPopUp(true, 'PICKUP')"
          >
            {{$t('general.add_remove_saved_loc')}} >
          </div>
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
                id="destination"
                v-model="dropOffRegion"
                :options="map_options"
                :placeholder="$t('general.enter_region')"
                :select-first-on-enter="true"
                class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                @place_changed="addRegion($event)"
                @keyup="checkChangeEvents($event, 0)"
                @change="checkChangeEvents($event, 0)"
              />
            </no-ssr>
            <font-awesome-icon
              icon="times"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup "
              width="10px"
              @click="clearLocation(1)"
            />
          </div>
          <div
            v-if="activeEl === 'destination' && hiddenSuggestionsStatus"
            class="homeview--input-suggestions"
            :style="{ marginTop: `${(scrollFromTop - 15)}px`, width: `${suggestionsWidth}px`, left: `${leftDisplacement}px` }"
            @mouseover="activeSuggestionList = true"
            @mouseout="activeSuggestionList = false"
          >
            <div class="homeview--input-suggetions-title">
              {{$t('general.saved_and_frequently_used')}}
            </div>
            <div
              v-for="(suggestion, index) in destinationSuggestions"
              :key="index"
              class="homeview--input-suggestion-rows"
              :class="activeRow === index ? 'homeview--input-suggestion-rows-active' : ''"
              @mouseover="activeRow = index"
              @mouseout="activeRow = ''"
              @click="addRegion(suggestion)"
            >
              <span class="homeview--input-suggestion-icon-holder">
                <font-awesome-icon
                  v-if="suggestion.location_type === 'frequent'"
                  icon="history"
                  size="xs"
                  class="homeview--input-suggestion-icon"
                  width="10px"
                />
                <font-awesome-icon
                  v-if="suggestion.location_type === 'saved'"
                  icon="star"
                  size="xs"
                  class="homeview--input-suggestion-icon"
                  width="10px"
                />
              </span>
              <span class="locations-popup-saved-name">
                <span class="homeview--input-suggestion-place-name">
                  {{ suggestion.name }},
                </span>
                <span class="homeview--input-suggestion-address-name">
                  {{ suggestion.address }}
                </span>
              </span>
            </div>
            <div
              class="homeview--input-suggetions-link"
              @click="triggerLocationsManagementPopUp(true, 'DROPOFF')"
            >
              {{$t('general.add_remove_saved_loc')}} >
            </div>
          </div>
        </div>
        <div class="homeview--destinations">
          <div class="homeview--input-bundler">
            <no-ssr placeholder="">
              <gmap-autocomplete
                id="return"
                v-model="locations[1]"
                :options="map_options"
                :placeholder="$t('general.return_location')"
                :select-first-on-enter="true"
                class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-return-location"
                @place_changed="setLocation($event, 1, 1)"
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
          <div
            v-if="activeEl === 'return' && hiddenSuggestionsStatus"
            class="homeview--input-suggestions"
            :style="{ marginTop: `${(scrollFromTop - 15)}px`, width: `${suggestionsWidth}px`, left: `${leftDisplacement}px` }"
            @mouseover="activeSuggestionList = true"
            @mouseout="activeSuggestionList = false"
          >
            <div class="homeview--input-suggetions-title">
              {{$t('general.saved_and_frequently_used')}}
            </div>
            <div
              v-for="(suggestion, index) in destinationSuggestions"
              :key="index"
              class="homeview--input-suggestion-rows"
              :class="activeRow === index ? 'homeview--input-suggestion-rows-active' : ''"
              @mouseover="activeRow = index"
              @mouseout="activeRow = ''"
              @click="setLocation(suggestion, 1, 2)"
            >
              <span class="homeview--input-suggestion-icon-holder">
                <font-awesome-icon
                  v-if="suggestion.location_type === 'frequent'"
                  icon="history"
                  size="xs"
                  class="homeview--input-suggestion-icon"
                  width="10px"
                />
                <font-awesome-icon
                  v-if="suggestion.location_type === 'saved'"
                  icon="star"
                  size="xs"
                  class="homeview--input-suggestion-icon"
                  width="10px"
                />
              </span>
              <span class="locations-popup-saved-name">
                <span class="homeview--input-suggestion-place-name">
                  {{ suggestion.name }},
                </span>
                <span class="homeview--input-suggestion-address-name">
                  {{ suggestion.address }}
                </span>
              </span>
            </div>
            <div
              class="homeview--input-suggetions-link"
              @click="triggerLocationsManagementPopUp(true, 'DROPOFF')"
            >
              {{$t('general.add_remove_saved_loc')}} >
            </div>
          </div>
        </div>
        <div v-if="fileUploadStatus">
          <p class="home-view--upload-par">
            {{$t('general.or')}}
          </p>
          <p
            class="home-view--upload-button"
            @click="initiateUpload()"
          >
           {{$t('general.upload_file')}}
          </p>
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
          {{$t('general.continue')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import _ from 'lodash';
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
  faHistory,
} from '@fortawesome/free-solid-svg-icons';
import orderPlacementStore from './_store';
import orderStore from '../../_store';
import paymentsModuleStore from '../../../payment/_store';
import VendorComponent from './_components/DedicatedVendorComponent.vue';
import SessionMxn from '../../../../mixins/session_mixin';
import EventsMixin from '../../../../mixins/events_mixin';

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
  faHistory,
);

export default {
  name: 'OrderPlacement',
  components: {
    'no-ssr': NoSSR,
    'vendor-view': VendorComponent,
  },
  mixins: [SessionMxn, EventsMixin],
  data() {
    return {
      show_destinations: false,
      loading: false,
      locations: [],
      activeRow: '',
      activeEl: '',
      DOM: '',
      scrollFromTop: 0,
      suggestionsWidth: 0,
      leftDisplacement: 0,
      hiddenSuggestionsStatus: true,
      activeSuggestionList: false,
      map_options: {
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
      dropOffRegion: '',
      fileUploadStatus: false,
    };
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
      getSuggestions: '$_orders/getSuggestions',
    }),

    show_vendor_view() {
      return (
        Array.isArray(this.getStoreOrderPath)
        && this.getStoreOrderPath.length > 0
        && Object.prototype.hasOwnProperty.call(this.getOuterPriceRequestData, 'economy_price_tiers')
      );
    },
    pickUpSuggestions() {
      const data = [];
      this.getSuggestions.forEach((row) => {
        if (row.type === 'PICKUP' || row.waypoint_type === 'PICKUP') {
          data.push(row);
        }
      });
      return data;
    },
    destinationSuggestions() {
      const data = [];
      this.getSuggestions.forEach((row) => {
        if (row.type === 'DROPOFF' || row.waypoint_type === 'DROPOFF') {
          data.push(row);
        }
      });
      return data;
    },
  },
  watch: {
    get_session: {
      handler(val, oldVal) {
        if (this.show_vendor_view || this.loading) {
          this.handleStoredData();
        }
      },
      deep: true,
    },
    DOM: {
      handler(val, oldVal) {
        this.addFocusListener();
        this.triggerFetchsuggestions();
      },
      deep: true,
    },
    activeEl: {
      handler(val, oldVal) {
        if (val) {
          this.hiddenStatus();
          const inputValue = document.getElementById(val);
          if (inputValue) {
            inputValue.onkeydown = this.hiddenStatus;
          }
        } else {
          const oldValue = document.getElementById(oldVal);
          if (oldValue) {
            oldValue.onkeydown = '';
          }
        }
      },
      deep: true,
    },
  },
  created() {
    this.instantiateHomeComponent();
    this.initializeOrderFlow();
    this.DOM = process;
  },
  mounted() {
    const session = this.$store.getters.getSession;
    if (Object.keys(session).length > 0) {
      this.checkSessionData();
    }
  },
  destroyed() {
    this.destroyOrderPlacement();
  },
  beforeDestroy() {
    this.removeFocusListener();
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
      setExtendOptions: '$_orders/$_home/setExtendOptions',
      set_tracking_data: '$_orders/$_tracking/setTrackingData',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
    }),

    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

    // eslint-disable-next-line func-names
    addRegion(place) {
      this.dropOffRegion = place.name;
      this.activeEl = '';
      this.trackLocationSelect(place.name, 2);
      this.attemptPriceRequest();
      this.sendGA4Events('add_region', {'drop_off_region': place.name});
    },

    ...mapActions({
      requestPriceQuote: '$_orders/$_home/requestPriceQuote',
      fetchSuggestions: '$_orders/fetchSuggestions',
    }),

    initiateUpload() {
      this.$root.$emit('Upload status', true);
    },

addFocusListener() {
      document.addEventListener('focus', this.focusedInput, true);
      document.addEventListener('blur', this.blurredInput, true);
      document.querySelector('.homeview--form__scrollable').addEventListener('scroll', this.scrollingDiv, true);
    },

    focusedInput() {
      this.activeEl = document.activeElement.id;
      this.suggestionsWidth = document.activeElement.offsetWidth;
      this.leftDisplacement = document.activeElement.offsetLeft;
    },
    blurredInput() {
      this.activeEl = this.activeSuggestionList ? this.activeEl : '';
    },
    scrollingDiv(evt) {
      this.scrollFromTop = (evt.target.scrollTop * -1);
    },
    removeFocusListener() {
      document.removeEventListener('focus', this.focusedInput, true);
      document.removeEventListener('blur', this.blurredInput, true);
      if (document.querySelector('.homeview--form__scrollable')) {
        document.querySelector('.homeview--form__scrollable').removeEventListener('scroll', this.scrollingDiv, true);
      }
    },
    hiddenStatus() {
      setTimeout(() => {
        if (document.getElementById(this.activeEl).value) {
          this.hiddenSuggestionsStatus = false;
        } else {
          this.hiddenSuggestionsStatus = true;
        }
      }, 100);
    },
    triggerFetchsuggestions() {
      const session = this.$store.getters.getSession;
      const userId = session[session.default].user_id;
      const copId = session.default === 'biz' ? session[session.default].cop_id : 0;
      this.fetchSuggestions({
        user_id: userId,
        cop_id: copId,
        type: 1,
      });
    },

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

    mixpanelTrackPricingServiceRequest(data) {
      if (!Object.prototype.hasOwnProperty.call(data, 'order_no')) {
        this.trackMixpanelEvent('Make Price Request - Pricing Service', {
          'Cop ID': data.client_id,
        });
      }
    },

    trackLocationSelect(location, type) {
      const acc = this.$store.getters.getSession;
      const accDefault = acc[acc.default];
      let eventName = '';
      const eventData = {
        'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Account': accDefault.user_email,
        'Client name': accDefault.user_name,
      };
      if (type === 0) {
        eventData['Pick up location'] = location;
        eventName = 'Enter pick-up location for no-destination';
      } else if (type === 2) {
        eventData['Delivery region'] = location;
        eventName = 'Enter delivery region for no-destination';
      } else if (type === 1) {
        eventData['Return location'] = location;
        eventName = 'Enter return location for no-destination';
      }
      this.trackMixpanelEvent(eventName, eventData);
      this.trackGAEvent(eventName);
    },

    trackGAEvent(eventLabel) {
      const eventPayload = {
        eventCategory: 'Sendy Dedicated',
        eventAction: 'Click',
        eventLabel,
      };
      this.fireGAEvent(eventPayload);
    },

    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name, event);
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

    setLocation(place, index, type) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = type === 1 ? place.address_components.findIndex(country_code => country_code.types.includes('country')) : '';
      const pathObj = {
        name: place.name,
        coordinates: type === 1 ? `${place.geometry.location.lat()},${place.geometry.location.lng()}` : place.coordinates,
        waypoint_details_status: true,
        type: type === 1 ? 'coordinates' : place.type,
        country_code: type === 1 ? place.address_components[countryIndex].short_name : place.country_code,
        more: {
          Estate: '',
          FlatName: '',
          place_idcustom: type === 1 ? place.place_id : place.more.place_idcustom,
          Label: '',
          HouseDoor: '',
          Otherdescription: '',
          Typed: '',
          Vicinity: 'Not Indicated',
          Address: type === 1 ? place.formatted_address : place.more.Address,
        },
      };
      if (index === 0) {
        this.sendGA4Events('add_pick_up_location', {'pick_up_location': place.name});
      } else if (index === 1) {
        pathObj.waypoint_type = 'RETURN';
        this.sendGA4Events('add_return_location', {'return_location': place.name});
      }
      if (type === 2) {
        this.trackMixpanelEvent(`Populate ${index === 0 ? 'pickup' : 'destination'} input with location suggestion`, pathObj);
        this.trackGAEvent(`Populate ${index === 0 ? 'pickup' : 'destination'} input with location suggestion`);
      }
      const pathPayload = {
        index,
        path: pathObj,
      };
      const locationNamePayload = {
        index,
        name: pathObj.name,
      };
      this.hiddenSuggestionsStatus = true;
      this.trackLocationSelect(pathObj.name, index);
      this.resetPathLocation(index);
      this.setMarker(parseFloat(pathObj.coordinates.split(',')[0]), parseFloat(pathObj.coordinates.split(',')[1]), index);
      this.set_order_path(pathPayload);
      this.setStorePath(pathPayload);
      this.setLocationInModel(index, `${pathObj.name} (${pathObj.more.Address})`);
      this.set_location_name(locationNamePayload);
      this.activeEl = '';
      if (index === 0) {
        this.setPickupFilled(true);
      }
      this.attemptPriceRequest();
    },
    attemptPriceRequest() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 0
        && this.dropOffRegion
        && this.get_pickup_filled === true
      ) {
        this.clearOuterPriceRequestObject();
        this.clearOuterActiveVendorDetails();
        this.doPriceRequest();
      }
    },

    setLocationInModel(index, name) {
      this.locations[index] = name;
      const activeElement = this.activeEl;
      setTimeout(() => {
        if (document.getElementById(activeElement) !== null) {
          if (!document.getElementById(activeElement).value) {
            document.getElementById(activeElement).value = name;
          }
        }
      }, 100);
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
        date_time: this.moment.utc(),
        schedule_status: false,
        schedule_time: this.moment.utc(),
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
        drop_off_region: this.dropOffRegion,
        order_type_tag: 'dedicated_order',
        country_code: this.getSessionItem('country_code'),
        default_currency: this.getSessionItem('default_currency'),
        preffered_currency: this.getSessionItem('default_currency'),
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
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'orders/price_request',
      };
      this.loading = true;
      const definedLocations = this.locations;
      this.requestPriceQuote(payload).then(
        (response) => {
          this.setOrderState(1);
          this.setHomeLocations(definedLocations);
          response.values.economy_price_tiers.forEach((row) => {
            row.price_tiers.forEach((row1) => {
              // eslint-disable-next-line no-param-reassign
              row1.tally = 0;
            });
          });
          this.setOuterPriceRequestObject(response.values);
          this.loading = false;
          this.setDefaultPackageClass();
          const acc = this.$store.getters.getSession;
          const accDefault = acc[acc.default];
          this.mixpanelTrackPricingServiceRequest(response);
          if (Object.prototype.hasOwnProperty.call(acc, 'admin_details')) {
            this.trackMixpanelEvent('Make Price Request', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
              'Super User Id': acc.admin_details.admin_id,
              'Client Account': accDefault.user_email,
            });
          } else {
            this.trackMixpanelEvent('Make Price Request', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
            });
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'crisis_notification')) {
            this.doNotification(
              3,
              error.response.data.reason,
              error.response.data.crisis_notification.msg,
            );
          } else {
            this.doNotification(
              3,
              this.$t('general.price_request_failed'),
              this.$t('general.price_request_failed_text'),
            );
          }

          this.loading = false;
        },
      );
    },
    handleStoredData() {
      this.clearOuterPriceRequestObject();
      this.clearOuterActiveVendorDetails();
      this.setExtendOptions(false);
      this.doPriceRequest();
    },

    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },

    doSetDefaultPackageClass() {
      if (
        this.get_price_request_object !== undefined
        && this.get_price_request_object.economy_price_tiers !== undefined
      ) {
        try {
          const defaultPackageClass = this.get_price_request_object.economy_price_tiers[0]
            .tier_group;
          this.set_active_package_class(defaultPackageClass);
        } catch (er) {
          // console.log(er);
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

    initial_destination_css() {
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
        this.$store.registerModule('$_orders', orderStore);
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
      } else {
        this.$apm.setUserContext({
          id: acc.user_id,
          username: acc.user_name,
          email: acc.user_email,
        });
      }
    },
    initializeOrderFlow() {
      if (this.$route.path === '/orders/') {
        const storedLocation = this.getHomeLocations;
        if (storedLocation.length > 0) {
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
    getSessionItem(itemName) {
      const session = this.$store.getters.getSession;
      return session[session.default][itemName];
    },
    resetPathLocation(index) {
      if (index === 0) {
        this.setPickupFilled(false);
        this.unset_order_path(index);
        this.unsetStorePath(index);
      }
      this.unset_location_marker(index);
      this.deleteLocationInModel(index);
      this.unset_location_name(index);
    },
    triggerLocationsManagementPopUp(status, type) {
      this.activeEl = '';
      this.$root.$emit('Locations status', status, type);
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
