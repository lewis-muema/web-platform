<template lang="html">
  <div class="homeview--inner homeview--inner-override">
    <!-- <div class="homeview--form__header">
         New Delivery
     </div> -->
    <div
      v-if="phase === 1"
      class="homeview--inputs-override"
    >
      <div
        ref="scrollable_locations"
        class="homeview--form homeview--row homeview--form__scrollable homeview--input-freight-locations"
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
              :placeholder="$t('general.enter_pickup_location')"
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
                :placeholder="$t('general.enter_destination_location')"
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
      </div>
      <div class="homeview--input-containers homeview--row homeview--form__scrollable">
        <div class="homeview--input-bundler homeview--input-freight">
          <no-ssr placeholder="">
            <input
              v-model.number="noOfContainers"
              type="number"
              min="5"
              max="50"
              class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input input-spacer"
              :placeholder="$t('general.no_of_containers')"
            >
            <div class="home-view-truck-options-inner-wrapper homeview--input-pickup">
              <div class="home-view-truck-options-label">
                {{$t('general.pickup_time_for_order')}}
              </div>
              <div class="block">
                <el-date-picker
                  v-model="schedule_time"
                  class="vendor_component-actions__element-date discount-input-width--nondiscounted"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  :placeholder="$t('general.asap')"
                  prefix-icon="el-icon-date"
                  :default-time="moment().format('HH:mm:ss')"
                  :picker-options="dueDatePickerOptions"
                  @change="dispatchScheduleTime"
                />
              </div>
            </div>
            <div class="homeview--return-input">
              <input
                v-model="returnStatus"
                type="checkbox"
                @change="resetDestination()"
              > {{$t('general.return_empty_containers')}}
            </div>
            <gmap-autocomplete
              v-if="returnStatus"
              v-model="locations[3]"
              :options="map_options"
              :placeholder="$t('general.enter_destination_location')"
              :select-first-on-enter="true"
              class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--return-destination"
              @place_changed="setReturnDestination($event)"
              @keyup="checkChangeEvents($event, 3)"
              @change="checkChangeEvents($event, 3)"
            />
          </no-ssr>
        </div>
      </div>
      <div>
        <div class="homeview--proceed">
          <p class="home-view--upload-par">
            {{$t('general.destination_location')}}
          </p>
          <p
            class="home-view--upload-button"
            @click="initiateUpload()"
          >
            {{$t('general.upload_profile')}}
          </p>
          <button
            type="button"
            class="home-view--place-order"
            :class="nextStatus"
            :disabled="nextStatus === 'button--primary-inactive inactive-1'"
            @click="productPhase(2)"
          >
            {{$t('general.continue')}}
          </button>
        </div>
      </div>
    </div>
    <div v-if="phase === 2">
      <table class="homeview--order-details">
        <div
          class="homeview--order-details-edit"
          @click="productPhase(1)"
        >
          {{$t('general.editSmall')}}
          <i class="el-icon-edit" />
        </div>
        <tr class="homeview--top-details">
          <td class="homeview---top-details-left col-left">
            {{$t('general.order_details')}}
          </td>
          <td class="homeview---top-details-right col-right">
            {{$t('general.totoal_containers')}} 
          </td>
        </tr>
        <tr class="homeview--bottom-details">
          <td class="homeview--bottom-details-left col-left">
            <font-awesome-icon
              icon="circle"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange"
              width="10px"
            /> {{$t('general.pick_up')}} <br>
            <span class="homeview--top-locations">{{ locations[0] }}</span>
          </td>
          <td class="homeview--bottom-details-right col-right">
            <font-awesome-icon
              icon="circle"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img sendy-blue"
              width="10px"
            /> {{$t('general.destination')}} <br>
            <span class="homeview--top-locations">{{ locations[1] }}</span>
          </td>
        </tr>
      </table>
      <div v-loading="loading">
        <div
          ref="scrollable_locations"
          class="homeview--form homeview--row homeview--form__scrollable homeview--input-freight-containers"
        >
          <p class="homeview--input-header">
            {{$t('general.container_details')}}
          </p>
          <input
            v-model="cont_no"
            type="text"
            class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-container-details"
            :placeholder="$t('general.container_number')"
          >
          <input∫∫
            v-model.number="cont_weight"
            type="number"
            min="5"
            max="50"
            class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-container-details"
            :placeholder="$t('general.container_weight_in_tonnes')"
          >
          <gmap-autocomplete
            v-model="destination.name"
            :options="map_options"
            placeholder="Empty Container Destination"
            :select-first-on-enter="true"
            class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-container-details homeview--return-destination-input"
            @place_changed="setReturnDestination($event, 2)"
            @keydown.native.capture="checkReturnDestination()"
          />
          <select
            v-model.number="size"
            class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-container-details input-container--size"
          >
            <option
              class=""
              value="none"
            >
              {{$t('general.container_size')}}
            </option>
            <option
              class=""
              value="20"
            >
              {{$t('general.twenty_feet')}}
            </option>
            <option
              class=""
              value="40"
            >
              {{$t('general.fourty_feet')}}
            </option>
          </select>
          <input
            v-model="consignee"
            type="text"
            class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input homeview--input-container-details"
            placeholder="Consignee (name)"
          >
          <button
            v-if="selectedContainer === null"
            class="homeview--button-add-container"
            :class="buttonStatus"
            :disabled="buttonStatus === 'button--primary-inactive inactive-1'"
            @click="addContainer()"
          >
            {{$t('general.add_container_details')}}
          </button>
          <button
            v-else
            class="button-primary homeview--button-add-container bg-button-orange"
            :class="editStatus"
            :disabled="editStatus === 'button--primary-inactive inactive-1'"
            @click="applyContainerChanges()"
          >
            {{$t('general.edit_container_details')}}
          </button>
          <button
            v-if="selectedContainer === null"
            class="homeview--button-add-container"
            :class="placeOrderStatus"
            :disabled="placeOrderStatus === 'button--primary-inactive inactive-2'"
            @click="getQuote()"
          >
            {{$t('general.place_order')}}
          </button>
        </div>
        <div
          v-if="!editingStatus"
          class="homeview--section"
        >
          <div
            v-for="(container, index) in containers"
            :key="container.length"
            class="homeview--section__container"
            :class="`container${index}`"
          >
            <div class="homeview--heading">
              <div
                class="homeview--remove__icon"
                @click="removeContainer(index)"
              >
                <p class="homeview--edit__text">
                  {{$t('general.remove')}}
                </p>
                <i class="el-icon-delete" />
              </div>
              <div
                class="homeview--edit__icon"
                @click="editContainer(index)"
              >
                <p class="homeview--edit__text">
                  {{$t('general.edit')}}
                </p>
                <i class="el-icon-edit" />
              </div>
            </div>
            <table class="homeview--container-table">
              <tr>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container">
                    {{$t('general.container_number')}}
                  </p>
                  <p class="homeview--heading__container-details">
                    {{ container.container_number }}
                  </p>
                </td>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container">
                    {{$t('general.empty_container_destination')}}
                  </p>
                  <p class="homeview--heading__container-details">
                    {{ container.container_destination.name }}
                  </p>
                </td>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container">
                    {{$t('general.container_size')}}
                  </p>
                  <p class="homeview--heading__container-details">
                    {{ container.container_size_feet }} {{$t('general.feet')}}
                  </p>
                </td>
              </tr>
              <tr>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container">
                    {{$t('general.consignee')}}
                  </p>
                  <p class="homeview--heading__container-details">
                    {{ container.consignee }}
                  </p>
                </td>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container">
                    {{$t('general.container_weight')}}
                  </p>
                  <p class="homeview--heading__container-details">
                    {{ container.container_weight_tonnes }}T
                  </p>
                </td>
                <td class="homeview--container-card">
                  <p class="homeview--heading__container" />
                  <p class="homeview--heading__container-details" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="phase === 3 && getOuterPriceRequestData"
      class=""
    >
      <div
        ref="scrollable_locations"
        class="homeview--form homeview--row homeview--form__scrollable homeview--input-freight-complete"
      >
        <table class="homeview--order-confirm">
          <tr>
            <td class="homeview--order-confirm-row__top color-blue">
              {{$t('general.order_status_pending')}}
            </td>
            <td class="homeview--order-confirm-row__top color-orange">
              {{$t('general.cost')}}: {{ getEconomicPriceTiers.currency }} {{ getEconomicPriceTiers.cost }}
            </td>
          </tr>
          <tr>
            <td class="homeview--order-confirm-row__middle">
              {{$t('general.order_details')}}
            </td>
            <td class="homeview--order-confirm-row__middle">
              {{$t('general.truck_size')}}
            </td>
          </tr>
          <tr>
            <td class="homeview--order-confirm-row__middle">
              <p class="homeview--order-confirm-header">
                {{$t('general.pickup_solo')}}
              </p>
              <p class="homeview--order-confirm-body">
                {{ getOuterPriceRequestData.from_name }}
              </p>
            </td>
            <td class="homeview--order-confirm-row__middle">
              <p class="homeview--order-confirm-header">
                {{$t('general.twenty_feet')}}
              </p>
              <p class="homeview--order-confirm-body">
                {{$t('general.twentyfoot_flat_bed_trucks')}}
              </p>
            </td>
          </tr>
          <tr>
            <td class="homeview--order-confirm-row__bottom">
              <p class="homeview--order-confirm-header">
                {{$t('general.drop_off')}}
              </p>
              <p class="homeview--order-confirm-body">
                {{ getOuterPriceRequestData.to_name }}
              </p>
            </td>
            <td class="homeview--order-confirm-row__bottom">
              <p class="homeview--order-confirm-header">
                {{$t('general.fourty_feet')}}              </p>
              <p class="homeview--order-confirm-body">
                {{$t('general.fourty_feet_flat_bed_trucks')}}
              </p>
            </td>
          </tr>
        </table>
        <div class="home-view-truck-options-inner-wrapper">
          <div class="home-view-vendor-classes--label">
            <payment-options />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCcVisa, faCcMastercard, faThinkPeaks } from '@fortawesome/free-brands-svg-icons';
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
import orderPlacementStore from '../_store';
import paymentsModuleStore from '../../../../payment/_store';
import SessionMxn from '../../../../../mixins/session_mixin';
import PaymentOptions from './PaymentOptions.vue';
import NotificationMxn from '../../../../../mixins/notification_mixin';

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
    PaymentOptions,
  },
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      standardOptions: [21, 22, 24],
      schedule_time: '',
      size: 'none',
      cont_no: '',
      cont_weight: '',
      consignee: '',
      destination: '',
      returnEvent: '',
      ReturnDestination: '',
      productCategoryId: 1,
      loadingStatus: true,
      containers: [],
      categories: [],
      twentyfoot: 0,
      fourtyfoot: 0,
      attachedFile: null,
      selectedContainer: null,
      editingStatus: false,
      noOfContainers: '',
      phase: 1,
      returnStatus: false,
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
      getProductCategories: '$_orders/$_home/getProductCategories',
      getProductId: '$_orders/$_home/getProductId',
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
    buttonStatus() {
      if (this.cont_no && this.destination.name && this.size !== 'none' && this.cont_weight && this.containers.length < this.noOfContainers && this.consignee) {
        return 'button-primary bg-button-orange';
      }
      return 'button--primary-inactive inactive-1';
    },
    editStatus() {
      if (this.cont_no && this.destination.name && this.size !== 'none' && this.cont_weight && this.consignee) {
        return 'button-primary bg-button-orange';
      }
      return 'button--primary-inactive inactive-1';
    },
    nextStatus() {
      if (this.locations.length >= 2 && this.noOfContainers > 0) {
        return 'button-primary';
      }
      return 'button--primary-inactive inactive-1';
    },
    placeOrderStatus() {
      if (this.containers.length === this.noOfContainers) {
        return 'button-primary';
      }
      return 'button--primary-inactive inactive-2';
    },
    scheduleStatus() {
      if (this.schedule_time) {
        return true;
      }
      return false;
    },
    getEconomicPriceTiers() {
      return this.getOuterPriceRequestData.economy_price_tiers[0].price_tiers[0];
    },
  },
  created() {
    this.instantiateHomeComponent();
    this.initializeOrderFlow();
    this.productPhase(1);
    this.categories = this.getProductCategories;
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
      setScheduleTime: '$_orders/$_home/setScheduleTime',
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
      requestFreightProductCategories: '$_orders/$_home/requestFreightProductCategories',
    }),

    checkChangeEvents(evt, index) {
      // console.log('index', index);
      // console.log('evt', evt);
      // TO DO research implementation of native input events
    },
    checkReturnDestination(evt, index) {
      if (document.querySelector('.homeview--return-destination-input').value === '') {
        this.destination = {
          name: '',
          coordinates: '',
          waypoint_details_status: true,
          type: 'coordinates',
          country_code: '',
          more: {
            Estate: '',
            FlatName: '',
            place_idcustom: '',
            Label: '',
            HouseDoor: '',
            Otherdescription: '',
            Typed: '',
            Vicinity: 'Not Indicated',
            Address: 'Not Indicated',
          },
        };
      }
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
    productPhase(phase) {
      this.phase = phase;
      this.$emit('clicked', phase);
    },
    resetDestination() {
      if (!this.returnStatus) {
        this.deleteLocationInModel(2);
        this.destination = '';
      }
    },
    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      if (index === 0) {
        this.ReturnDestination = place;
      }
      const countryIndex = place.address_components.findIndex(countryCode => countryCode.types.includes('country'));
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
      // this.attemptPriceRequest();
    },
    setReturnDestination(place) {
      const countryIndex = place.address_components.findIndex(countryCode => countryCode.types.includes('country'));
      this.destination = {
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
      if (this.returnStatus) {
        this.setLocationInModel(2, place.name);
        this.ReturnDestination = place;
      } else {
        this.deleteLocationInModel(2);
      }
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
        schedule_status: this.scheduleStatus,
        schedule_time: this.moment(this.schedule_time).format('YYYY-MM-DD HH:mm:ss'),
        vendor_type: 25,
        group_id: 1,
        client_type: 'corporate',
        rider_dist: 0,
        no_charge_status: false,
        is_re_request: false,
        rider_phone: '0709779779',
        insurance: 0,
        type: 'coordinates',
        promotion_status: false,
        destination_paid_status: false,
        is_edit: false,
        country_code: this.getCountryCode,
        default_currency: this.getDefaultCurrency,
        preffered_currency: this.getDefaultCurrency,
        freight_order_details: {
          containers: {
            container_details: this.containers,
          },
          product_category_id: this.getProductId,
        },
      };
      const jsonDecodedPath = JSON.stringify(obj);
      infor.path = jsonDecodedPath;
      const finalObj = { values: infor };
      return finalObj;
    },
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    dispatchScheduleTime() {
      const dateTime = new Date();
      if (this.schedule_time && dateTime > this.schedule_time) {
        this.schedule_time = new Date();
      }
      this.setScheduleTime(this.schedule_time);
    },
    initiateUpload() {
      this.$root.$emit('Upload status', true);
    },
    addContainer() {
      this.containers.push({
        id: this.containers.length,
        container_number: this.cont_no,
        container_destination: this.destination,
        container_size_feet: this.size,
        container_weight_tonnes: this.cont_weight,
        consignee: this.consignee,
      });
      this.cont_no = '';
      this.cont_weight = '';
      this.consignee = '';
      if (this.returnStatus) {
        this.setReturnDestination(this.ReturnDestination);
        this.setLocationInModel(2, this.locations[3]);
      } else {
        this.destination = '';
        this.deleteLocationInModel(2);
      }
      this.size = 'none';
    },
    removeContainer(id) {
      this.containers.splice(id, 1);
    },
    editContainer(id) {
      this.editingStatus = true;
      this.selectedContainer = id;
      this.cont_no = this.containers[id].container_number;
      this.size = this.containers[id].container_size_feet;
      this.destination = this.containers[id].container_destination;
      this.cont_weight = this.containers[id].container_weight_tonnes;
      this.consignee = this.containers[id].consignee;
    },
    applyContainerChanges() {
      this.containers[this.selectedContainer].container_number = this.cont_no;
      this.containers[this.selectedContainer].container_destination = this.destination;
      this.containers[this.selectedContainer].container_size_feet = this.size;
      this.containers[this.selectedContainer].consignee = this.consignee;
      this.containers[this.selectedContainer].container_weight_tonnes = this.cont_weight;
      this.editingStatus = false;
      this.selectedContainer = null;
      this.cont_no = '';
      if (this.returnStatus) {
        this.setReturnDestination(this.ReturnDestination);
        this.setLocationInModel(2, this.locations[3]);
      } else {
        this.destination = '';
        this.deleteLocationInModel(2);
      }
      this.cont_weight = '';
      this.size = 'none';
      this.consignee = '';
    },
    getContainerSizeNumbers() {
      this.twentyfoot = 0;
      this.fourtyfoot = 0;
      this.containers.forEach((row, i) => {
        if (row.container_size_feet === 20) {
          ++this.twentyfoot;
        }
        if (row.container_size_feet === 40) {
          ++this.fourtyfoot;
        }
      });
    },
    getQuote() {
      this.getContainerSizeNumbers();
      this.clearOuterPriceRequestObject();
      this.clearOuterActiveVendorDetails();
      this.doPriceRequest();
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
          if (response.status) {
            this.setOrderState(1);
            this.setHomeLocations(definedLocations);
            this.loading = false;
            this.productPhase(3);
            this.set_active_vendor_name(response.values.economy_price_tiers[0].price_tiers[0].vendor_name);
            const previousActiveVendor = this.get_active_vendor_name;
            response.values.freight = true;
            this.setOuterPriceRequestObject(response.values);
            this.setDefaultPackageClass();
            this.setDefaultVendorType(previousActiveVendor);
          } else {
            this.productPhase(2);
            if (Object.prototype.hasOwnProperty.call(response, 'crisis_notification') && response.crisis_notification.msg) {
              this.doNotification(3, `${response.reason}`, response.crisis_notification.msg);
            } else {
              this.doNotification(3, this.$t('general.price_request_failed'), this.$t('general.price_request_failed_text'));
            }
            this.loading = false;
          }
          // const acc = this.$store.getters.getSession;
          // const accDefault = acc[acc.default];

          // if (Object.prototype.hasOwnProperty.call(acc, 'admin_details')) {
          //   this.trackMixpanelEvent('Make Price Request', {
          //     'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
          //     'Client Type': 'Web Platform',
          //     'Super User Id': acc.admin_details.admin_id,
          //     'Client Account': accDefault.user_email,
          //   });
          // } else {
          //   this.trackMixpanelEvent('Make Price Request', {
          //     'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
          //     'Client Type': 'Web Platform',
          //   });
          // }
        },
        (error) => {
          this.productPhase(2);
          if (Object.prototype.hasOwnProperty.call(error, 'crisis_notification') && error.crisis_notification.msg) {
            this.doNotification(2, `${error.reason}`, error.crisis_notification.msg);
          } else {
            this.doNotification(2, this.$t('general.price_request_failed'), this.$t('general.price_request_failed_text'));
          }

          this.loading = false;
        },
      );
    },

    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
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

        if (result.length === 0) {
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
@import '../../../../../assets/styles/orders_order_placement.css?v=4';
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=4';
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
  background: #007FFF;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.2);
}
.homeview--return-destination-input, .homeview--input-bundler__destination-input {
  color: black;
  font-weight: 600;
}
.homeview--return-destination-input::-webkit-input-placeholder,
.homeview--input-bundler__destination-input::-webkit-input-placeholder {
  font-weight: 400;
}
</style>
