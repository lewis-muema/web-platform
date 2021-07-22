/* global describe,it */
/* eslint no-undef: "error" */
/* eslint-disable */
import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import moment from 'moment';
import ElementUI from 'element-ui';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';
import './localstorage';
import messages from './messages';
import * as VueGoogleMaps from 'vue2-google-maps';
import trackingMutations from '../../_components/tracking/_store/mutations';
import trackingstore from '../../_components/tracking/_store/actions';
import trackingstates from '../../_components/tracking/_store/index';
import homeMutations from '../../_components/order_placement/_store/mutations';
import homestore from '../../_components/order_placement/_store/actions';
import homestates from '../../_components/order_placement/_store/index';
import paymentMutations from '../../../payment/_store/mutations';
import paymentstore from '../../../payment/_store/actions';
import paymentstates from '../../../payment/_store/index';
import globalMutations from '../../../../store/mutations';
import globalstore from '../../../../store/actions';
import globals from '../../../../store/global';
import orderStore from '../../_store/actions';
import orderMutations from '../../_store/mutations';
import orderstates from '../../_store/index';
import TimezoneMxn from '../../../../mixins/timezone_mixin';
import Orders from '../../Orders.vue';
import OrderPlacement from '../../_components/order_placement/OrderPlacement.vue'
import DedicatedOrderPlacement from '../../_components/order_placement/DedicatedOrderPlacement.vue'
import FBUTracking from '../../_components/tracking/FBUTracking.vue';
import infoComponent from '../../_components/tracking/_components/InfoComponent.vue';
import InterCountyWindow from '../../_components/tracking/_components/InterCountyWindow.vue';
import mutations from '../../../../store/mutations.js';
import { wrap } from 'lodash';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});
Vue.use(Vuex);
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(ElementUI);
Vue.prototype.moment = moment;
const router = new VueRouter();
localVue.use(VueGoogleMaps, {
  load: {
    libraries: ['places', 'geometry'],
    key: process.env.CONFIGS_ENV.GOOGLE_API_KEY,
  },
});
Vue.use(ApmVuePlugin, {
  router,
  config: {
    serviceName: process.env.CONFIGS_ENV.ELASTIC_APM_SERVICE_NAME,
    // agent configuration
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    serviceVersion: process.env.CONFIGS_ENV.ELASTIC_APM_SERVICE_VERSION,
    environment: process.env.CONFIGS_ENV.ELASTIC_APM_ENVIRONMENT,
    distributedTracingOrigins: [process.env.CONFIGS_ENV.ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS],
  },
});

describe('Order.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      verifyNpsUser: globalstore.verifyNpsUser,
      storeNpsSurvey: globalstore.storeNpsSurvey,
      '$_orders/requestIndustries': orderStore.requestIndustries,
      '$_orders/fetchSuggestions': orderStore.fetchSuggestions,
      '$_orders/saveSuggestions': orderStore.saveSuggestions,
      '$_orders/removeSuggestions': orderStore.removeSuggestions,
      '$_orders/requestEditOrder': orderStore.requestEditOrder,
      '$_orders/requestCopInfo': orderStore.requestCopInfo,
      '$_orders/requestCountryCode': orderStore.requestCountryCode,
    };
    getters = {
      '$_orders/$_tracking/trackingData': () => localStorage.tracking_data,
      '$_orders/$_tracking/getIsMQTTConnected': () => '',
      getClosestCity: () => '',
      getDedicatedAccessStatus: () => '',
      getNPSStatus: () => '',
      getCountryCode: () => '',
      getRunningBalance: () => '',
      '$_orders/$_home/getSavedCards': ()=> [],
      '$_payment/getCardPaymentStatus': () => '',
      getSession: ()=> localStorage.session,
      '$_orders/$_tracking/getAmountDue': () => '',
      getLanguage: () => 'en',
      '$_orders/getExpandedActiveVendorTally': () => [],
      '$_orders/getSuggestions': () => localStorage.suggestions,
      '$_orders/getMarkers': () => [],
      '$_orders/getVendors': () => [],
      '$_orders/getPolyline': () => {},
    };
    mutations = {
      '$_orders/$_tracking/setTrackedOrder': trackingMutations.setTrackedOrder,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/removeMarkers': orderMutations.removeMarkers,
      setDedicatedAccessStatus: globalMutations.setDedicatedAccessStatus,
      '$_orders/$_home/setPairWithRiderStatus': homeMutations.setPairWithRiderStatus,
      '$_orders/$_home/setPairWithRiderState': homeMutations.setPairWithRiderState,
      '$_orders/$_home/setPairSerialNumber': homeMutations.setPairSerialNumber,
      '$_orders/$_home/setPairRiderPhone': homeMutations.setPairRiderPhone,
      '$_orders/$_home/setVehicleDetails': homeMutations.setVehicleDetails,
      '$_orders/$_home/setPairErrorMessage': homeMutations.setPairErrorMessage,
      '$_orders/setExpandedActiveVendorTally': orderMutations.setExpandedActiveVendorTally,
      '$_orders/setPairedDriversTally': orderMutations.setPairedDriversTally,
      '$_orders/$_tracking/setTrackingData': trackingMutations.setTrackingData,
      setScheduleStatus: globalMutations.setScheduleStatus,
      setNPSStatus: globalMutations.setNPSStatus,
    };
    state = Object.assign(orderstates.state(), globals.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    state.session = localStorage.session;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    console.error = () => {};
    moxios.install(axios);
    wrapper = mount(Orders, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Check if saved location suggestions are fetched for the pick up waypoint', () => {
    wrapper.vm.waypoint_type = 'PICKUP';
    expect(wrapper.vm.suggestions.length).to.equal(2);
  });
  it('Check if saved location suggestions are fetched for the drop off waypoint', () => {
    wrapper.vm.waypoint_type = 'DROPOFF';
    expect(wrapper.vm.suggestions.length).to.equal(1);
  });
  it('Check if correct label is returned based on waypoint type', () => {
    wrapper.vm.waypoint_type = 'PICKUP';
    expect(wrapper.vm.waypointType).to.equal('pick up');
    wrapper.vm.waypoint_type = 'DROPOFF';
    expect(wrapper.vm.waypointType).to.equal('drop off');
  });
  it('Check if the saveLocation method returns the correct response on success', done => {
    wrapper.vm.waypoint_type = 'PICKUP';
    wrapper.vm.suggestion = localStorage.suggestion;
    wrapper.vm.saveLocation();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            code: 200,
            message: 'Location added successfully',
            status: true
          },
        })
        .then((response) => {
          expect(response.data.message).to.equal('Location added successfully');
          expect(wrapper.vm.location).to.equal('');
          expect(wrapper.vm.locationSavingStatus).to.equal(true);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check if the saveLocation method returns the correct response on fail', done => {
    wrapper.vm.waypoint_type = 'PICKUP';
    wrapper.vm.suggestion = localStorage.suggestion;
    wrapper.vm.saveLocation();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            code: 400,
            message: 'Location could not be saved',
            status: false
          },
        })
        .then((response) => {
          expect(response.data.message).to.equal('Location could not be saved');
          expect(wrapper.vm.location).to.equal('');
          expect(wrapper.vm.locationSavingStatus).to.equal(true);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check if the removeLocation method returns the correct response on success', done => {
    wrapper.vm.waypoint_type = 'PICKUP';
    wrapper.vm.removeLocation(localStorage.suggestions[0]);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            code: 200,
            message: 'Location deleted successfully',
            status: false
          },
        })
        .then((response) => {
          expect(response.data.message).to.equal('Location deleted successfully');
          expect(wrapper.vm.location).to.equal('');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check if the removeLocation method returns the correct response on fail', done => {
    wrapper.vm.waypoint_type = 'PICKUP';
    wrapper.vm.removeLocation(localStorage.suggestions[0]);
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            code: 400,
            message: 'Location could not be deleted',
            status: false
          },
        })
        .then((response) => {
          expect(response.data.message).to.equal('Location could not be deleted');
          expect(wrapper.vm.location).to.equal('');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
  it('Check if the triggerFetchsuggestions method returns location suggestions from backend', done => {
    wrapper.vm.triggerFetchsuggestions();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            code: 200,
            user_id: 1,
            cop_id: 669,
            saved_locations: [
              {
                country_code: 'KE',
                waypoint_type: 'PICKUP',
                city_name: 'Nairobi County',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Ngong Road,Marsabit Plaza,Office no.212, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: '',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'ChIJnXFhGegbLxgRG5E1Lrd8JvY',
                  landmark: '',
                },
                waypoint_details_status: true,
                name: 'Marsabit Plaza',
                coordinates: '-1.3273119,36.780982',
                locality: {
                  name: 'Ngong Road,Marsabit Plaza,Office no.212',
                  coordinates: '-1.3273119,36.780982',
                },
                type: 'coordinates',
                location_id: 1478984,
              },
            ],
            frequent_locations: [
              {
                waypoint_type: 'PICKUP',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Ngong Rd, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: '',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'ChIJnXFhGegbLxgRG5E1Lrd8JvY',
                  landmark: '',
                },
                name: 'Marsabit Plaza',
                coordinates: '-1.3000089,36.77288960000001',
                location_id: 1439492,
              },
              {
                waypoint_type: 'DROPOFF',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Unnamed Road, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: '',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'ChIJWYzzUWAZLxgR-5PQnI0BmVE',
                  landmark: '',
                },
                name: 'Pioneer Heights',
                coordinates: '-1.2798383,36.7196238',
                location_id: 1439494,
              },
              {
                waypoint_type: 'DROPOFF',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Junction Mall Parking Hall, Ngong Rd, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: '',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'ChIJcbhbs2saLxgRP6vWzb7XVbM',
                  landmark: '',
                },
                name: 'Junction Mall Parking Hall',
                coordinates: '-1.2987826,36.7631807',
                location_id: 1439493,
              },
              {
                waypoint_type: 'PICKUP',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Icipe Rd, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: 'Not Indicated',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'EhhJY2lwZSBSZCwgTmFpcm9iaSwgS2VueWEiLiosChQKEgnHwIJljhUvGBGA7AyiiXnKDhIUChIJp0lN2HIRLxgRTJKXslQCz_c',
                  landmark: '',
                },
                locality: {
                  coordinates: '-1.222458,36.895618',
                  name: 'Kasarani Constituency',
                },
                name: 'Icipe Road',
                coordinates: '-1.2225819,36.895653',
                location_id: 1439491,
              },
              {
                waypoint_type: 'DROPOFF',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Icipe Rd, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: 'Not Indicated',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'EhhJY2lwZSBSZCwgTmFpcm9iaSwgS2VueWEiLiosChQKEgnHwIJljhUvGBGA7AyiiXnKDhIUChIJp0lN2HIRLxgRTJKXslQCz_c',
                  landmark: '',
                },
                locality: {
                  coordinates: '-1.222458,36.895618',
                  name: 'Kasarani Constituency',
                },
                name: 'Icipe Road',
                coordinates: '-1.2225819,36.895653',
                location_id: 1439495,
              },
              {
                waypoint_type: 'PICKUP',
                more: {
                  Otherdescription: '',
                  Typed: '',
                  Address: 'Road, Nairobi, Kenya',
                  FlatName: '',
                  Estate: '',
                  viewport: {
                    southwest: {
                      lng: 0,
                      lat: 0,
                    },
                    northeast: {
                      lng: 0,
                      lat: 0,
                    },
                  },
                  Road: '',
                  Vicinity: 'Not Indicated',
                  Label: '',
                  HouseDoor: '',
                  place_idcustom: 'ChIJQdYk8zc_LxgR2Hgw9V7Dsg0',
                  landmark: '',
                },
                name: 'Bethel Plaza',
                coordinates: '-1.2152329,36.90215620000001',
                location_id: 1439490,
              },
            ],
          },
        })
        .then((response) => {
          expect(response.data.saved_locations.length).to.equal(1);
          expect(response.data.frequent_locations.length).to.equal(6);
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
});
describe('OrderPlacement.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      '$_orders/$_home/requestPriceQuote': homestore.requestPriceQuote,
      '$_orders/fetchSuggestions': orderStore.fetchSuggestions,
    };
    getters = {
      '$_orders/$_home/getMaxDestinations': () => 24,
      '$_orders/$_home/getOrderPath': () => [],
      '$_orders/$_home/getLocationNames': () => [],
      '$_orders/$_home/getExtraDestinations': () => 0,
      '$_orders/$_home/getOrderNotes': () => '',
      getCountryCode: () => 'ke',
      '$_orders/$_home/getPriceRequestObject': () => {},
      '$_orders/$_home/getActivePackageClass': ()=> '',
      '$_orders/$_home/getActiveVendorName': () => '',
      getSession: ()=> localStorage.session,
      '$_orders/$_home/getPickupFilled': () => false,
      getLanguage: () => 'en',
      '$_orders/$_home/getExtendedOptions': () => false,
      'getDefaultCurrency': () => 'ksh',
      '$_orders/getSuggestions': () => localStorage.suggestions,
      '$_orders/getMarkers': () => [],
      '$_orders/getHomeLocations': () => [],
      '$_orders/getStorePath': () => {},
      '$_orders/getOuterPriceRequestData': () => '',
    };
    mutations = {
      '$_orders/setLocationMarker': orderMutations.setLocationMarker,
      '$_orders/unsetLocationMarker': orderMutations.unsetLocationMarker,
      '$_orders/setPolyline': orderMutations.setPolyline,
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/$_home/setOrderPath': homeMutations.setOrderPath,
      '$_orders/$_home/unsetOrderPath': homeMutations.unsetOrderPath,
      '$_orders/unsetStorePath': orderMutations.unsetStorePath,
      '$_orders/$_home/setLocationName': homeMutations.setLocationName,
      '$_orders/$_home/unsetLocationName': homeMutations.unsetLocationName,
      '$_orders/$_home/setPickUpFilled': homeMutations.setPickUpFilled,
      'setPickUpFilledStatus': globalMutations.setPickUpFilledStatus,
      '$_orders/$_home/addExtraDestination': homeMutations.addExtraDestination,
      '$_orders/$_home/removeExtraDestination': homeMutations.removeExtraDestination,
      '$_orders/$_home/setActivePackageClass': homeMutations.setActivePackageClass,
      '$_orders/$_home/setActiveVendorName': homeMutations.setActiveVendorName,
      '$_orders/$_home/setActiveVendorDetails': homeMutations.setActiveVendorDetails,
      '$_orders/removeMarkers': orderMutations.removeMarkers,
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/$_home/clearOrderPath': homeMutations.clearOrderPath,
      '$_orders/$_home/clearLocationNames': homeMutations.clearLocationNames,
      '$_orders/$_home/clearPriceRequestObject': homeMutations.clearPriceRequestObject,
      '$_orders/$_home/clearExtraDestination': homeMutations.clearExtraDestinations,
      '$_orders/$_home/resetState': homeMutations.resetState,
      '$_orders/$_home/setCountryCode': homeMutations.setCountryCode,
      '$_orders/$_home/setDefaultCurrency': homeMutations.setDefaultCurrency,
      '$_orders/setHomeLocations': orderMutations.setHomeLocations,
      '$_orders/setStorePath': orderMutations.setStorePath,
      '$_orders/clearStorePath': orderMutations.clearStorePath,
      '$_orders/clearOuterPriceRequestObject': orderMutations.clearOuterPriceRequestObject,
      '$_orders/clearOuterActiveVendorDetails': orderMutations.clearOuterActiveVendorDetails,
      '$_orders/setOuterPriceRequestObject': orderMutations.setOuterPriceRequestObject,
      '$_orders/$_home/setOrderState': homeMutations.setOrderState,
      '$_orders/$_home/setExtendOptions': homeMutations.setExtendOptions,
      '$_orders/$_tracking/setTrackingData': trackingMutations.setTrackingData,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
    };
    state = Object.assign(homestates.state(), globals.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    state.session = localStorage.session;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    moxios.install(axios);
    wrapper = mount(OrderPlacement, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Check whether suggetions are fetched on load (On demand)', () => {
    wrapper.vm.triggerFetchsuggestions();
    expect(wrapper.vm.getSuggestions.length).to.equal(6);
    expect(wrapper.vm.getSuggestions[0].name).to.equal('Bethel Plaza');
    expect(wrapper.vm.getSuggestions[5].coordinates).to.equal('-1.3000089,36.77288960000001');
  });
  it('Check whether suggestions are set as locations when clicked on for the pick up (On demand)', () => {
    wrapper.vm.setLocation(wrapper.vm.pickUpSuggestions[0], 0, 2);
    expect(state.location_names[0]).to.equal('Bethel Plaza');
    expect(state.order_path[0].coordinates).to.equal('-1.2152329,36.90215620000001');
  });
  it('Check whether suggestions are set as locations when clicked on for the destination (On demand)', () => {
    wrapper.vm.setLocation(wrapper.vm.pickUpSuggestions[1], 1, 2);
    expect(state.location_names[0]).to.equal('Icipe Road');
    expect(state.order_path[0].coordinates).to.equal('-1.2225819,36.895653');
  });
});
describe('DedicatedOrderPlacement.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      '$_orders/$_home/requestPriceQuote': homestore.requestPriceQuote,
      '$_orders/fetchSuggestions': orderStore.fetchSuggestions,
    };
    getters = {
      '$_orders/$_home/getMaxDestinations': () => 24,
      '$_orders/$_home/getOrderPath': () => [],
      '$_orders/$_home/getLocationNames': () => [],
      '$_orders/$_home/getExtraDestinations': () => 0,
      '$_orders/$_home/getOrderNotes': () => '',
      getCountryCode: () => 'ke',
      '$_orders/$_home/getPriceRequestObject': () => {},
      '$_orders/$_home/getActivePackageClass': ()=> '',
      '$_orders/$_home/getActiveVendorName': () => '',
      getSession: ()=> localStorage.session,
      '$_orders/$_home/getPickupFilled': () => false,
      getLanguage: () => 'en',
      '$_orders/$_home/getExtendedOptions': () => false,
      'getDefaultCurrency': () => 'ksh',
      '$_orders/getSuggestions': () => localStorage.suggestions,
      '$_orders/getMarkers': () => [],
      '$_orders/getHomeLocations': () => [],
      '$_orders/getStorePath': () => {},
      '$_orders/getOuterPriceRequestData': () => '',
    };
    mutations = {
      '$_orders/setLocationMarker': orderMutations.setLocationMarker,
      '$_orders/unsetLocationMarker': orderMutations.unsetLocationMarker,
      '$_orders/setPolyline': orderMutations.setPolyline,
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/$_home/setOrderPath': homeMutations.setOrderPath,
      '$_orders/$_home/unsetOrderPath': homeMutations.unsetOrderPath,
      '$_orders/unsetStorePath': orderMutations.unsetStorePath,
      '$_orders/$_home/setLocationName': homeMutations.setLocationName,
      '$_orders/$_home/unsetLocationName': homeMutations.unsetLocationName,
      '$_orders/$_home/setPickUpFilled': homeMutations.setPickUpFilled,
      'setPickUpFilledStatus': globalMutations.setPickUpFilledStatus,
      '$_orders/$_home/addExtraDestination': homeMutations.addExtraDestination,
      '$_orders/$_home/removeExtraDestination': homeMutations.removeExtraDestination,
      '$_orders/$_home/setActivePackageClass': homeMutations.setActivePackageClass,
      '$_orders/$_home/setActiveVendorName': homeMutations.setActiveVendorName,
      '$_orders/$_home/setActiveVendorDetails': homeMutations.setActiveVendorDetails,
      '$_orders/removeMarkers': orderMutations.removeMarkers,
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/$_home/clearOrderPath': homeMutations.clearOrderPath,
      '$_orders/$_home/clearLocationNames': homeMutations.clearLocationNames,
      '$_orders/$_home/clearPriceRequestObject': homeMutations.clearPriceRequestObject,
      '$_orders/$_home/clearExtraDestination': homeMutations.clearExtraDestinations,
      '$_orders/$_home/resetState': homeMutations.resetState,
      '$_orders/$_home/setCountryCode': homeMutations.setCountryCode,
      '$_orders/$_home/setDefaultCurrency': homeMutations.setDefaultCurrency,
      '$_orders/setHomeLocations': orderMutations.setHomeLocations,
      '$_orders/setStorePath': orderMutations.setStorePath,
      '$_orders/clearStorePath': orderMutations.clearStorePath,
      '$_orders/clearOuterPriceRequestObject': orderMutations.clearOuterPriceRequestObject,
      '$_orders/clearOuterActiveVendorDetails': orderMutations.clearOuterActiveVendorDetails,
      '$_orders/setOuterPriceRequestObject': orderMutations.setOuterPriceRequestObject,
      '$_orders/$_home/setOrderState': homeMutations.setOrderState,
      '$_orders/$_home/setExtendOptions': homeMutations.setExtendOptions,
      '$_orders/$_tracking/setTrackingData': trackingMutations.setTrackingData,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
    };
    state = Object.assign(homestates.state(), globals.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    state.session = localStorage.session;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    moxios.install(axios);
    wrapper = mount(DedicatedOrderPlacement, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Check whether suggetions are fetched on load (Dedicated)', () => {
    wrapper.vm.triggerFetchsuggestions();
    expect(wrapper.vm.getSuggestions.length).to.equal(6);
    expect(wrapper.vm.getSuggestions[0].name).to.equal('Bethel Plaza');
    expect(wrapper.vm.getSuggestions[5].coordinates).to.equal('-1.3000089,36.77288960000001');
  });
  it('Check whether suggestions are set as locations when clicked on for the pick up (Dedicated)', () => {
    wrapper.vm.setLocation(wrapper.vm.pickUpSuggestions[0], 0, 2);
    expect(state.location_names[0]).to.equal('Bethel Plaza');
    expect(state.order_path[0].coordinates).to.equal('-1.2152329,36.90215620000001');
  });
  it('Check whether suggestions are set as locations when clicked on for the destination (Dedicated)', () => {
    wrapper.vm.setLocation(wrapper.vm.pickUpSuggestions[1], 1, 2);
    expect(state.location_names[0]).to.equal('Icipe Road');
    expect(state.order_path[0].coordinates).to.equal('-1.2225819,36.895653');
  });
});
describe('InfoComponent.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      '$_payment/requestRunningBalance': paymentstore.requestRunningBalance,
      '$_orders/$_tracking/getTrackingData': trackingstore.getTrackingData,
      '$_orders/$_tracking/requestRiderLastPosition': trackingstore.requestRiderLastPosition,
      '$_orders/$_home/requestPriceQuote': homestore.requestPriceQuote,
      '$_orders/$_home/requestSavedCards': homestore.requestSavedCards,
      '$_orders/$_home/requestPaymentOptions': trackingstore.requestPaymentOptions,
      '$_payment/requestMpesaPayment': paymentstore.requestMpesaPayment,
      '$_payment/completeMpesaPaymentRequest': paymentstore.completeMpesaPaymentRequest,
      '$_orders/$_tracking/requestCancellationReasons': trackingstore.requestCancellationReasons,
      '$_orders/$_tracking/computeCancellationFee': trackingstore.computeCancellationFee,
    };
    getters = {
      '$_orders/$_tracking/trackingData': () => localStorage.tracking_data,
      '$_orders/$_tracking/getTrackedOrder': () => '',
      '$_orders/$_tracking/getIsMQTTConnected': () => '',
      '$_orders/getVendors': () => '',
      '$_orders/$_tracking/getShareOption': () => '',
      '$_orders/$_tracking/getTrackMoreInfo': () => '',
      '$_orders/$_tracking/getTrackVendorName': () => '',
      '$_orders/$_tracking/getConfirmEta': () => '',
      '$_orders/$_tracking/getPickUpEta': () => '',
      '$_orders/$_tracking/getDeliveryEta': () => '',
      '$_orders/$_tracking/getEditLocationDialog': () => '',
      '$_orders/$_tracking/getNotesInStore': () => '',
      '$_orders/$_tracking/getNotesDialog': () => '',
      '$_orders/$_tracking/getScheduleTimeDialog': () => '',
      '$_orders/$_tracking/getPickUpTime': () => '',
      '$_orders/$_tracking/getStorePath': () => '',
      '$_orders/$_tracking/getPickUpFilled': () => '',
      '$_orders/$_tracking/getExtraDestinations': () => '',
      '$_orders/$_tracking/getMaxDestinations': () => '',
      getCountryCode: () => '',
      getRunningBalance: () => '',
      '$_orders/$_home/getSavedCards': ()=> [],
      '$_payment/getCardPaymentStatus': () => '',
      getSession: ()=> localStorage.session,
      '$_orders/$_tracking/getAmountDue': () => '',
      getLanguage: () => 'en',
    };
    mutations = {
      '$_orders/$_tracking/setTrackedOrder': trackingMutations.setTrackedOrder,
      '$_orders/hideVendors': orderMutations.hideVendors,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
      '$_orders/$_tracking/setShareOption': trackingMutations.setShareOption,
      '$_orders/$_tracking/setTrackMoreInfo': trackingMutations.setTrackMoreInfo,
      '$_orders/$_tracking/setTrackVendorName': trackingMutations.setTrackVendorName,
      '$_orders/$_tracking/setTrackPartnerName': trackingMutations.setTrackPartnerName,
      '$_orders/$_tracking/setTrackPackageName': trackingMutations.setTrackPackageName,
      '$_orders/$_tracking/setConfirmEta': trackingMutations.setConfirmEta,
      '$_orders/$_tracking/setPickUpEta': trackingMutations.setPickUpEta,
      '$_orders/$_tracking/setDeliveryEta': trackingMutations.setDeliveryEta,
      '$_orders/$_tracking/setEditLocationDialog': trackingMutations.setEditLocationDialog,
      '$_orders/$_tracking/setPickUpFilled': trackingMutations.setPickUpFilled,
      '$_orders/$_tracking/setPickUpFilledStatus': trackingMutations.setPickUpFilledStatus,
      '$_orders/$_tracking/unsetOrderPath': trackingMutations.unsetOrderPath,
      '$_orders/$_tracking/setOrderPath': trackingMutations.setOrderPath,
      '$_orders/$_tracking/clearStorePath': trackingMutations.clearStorePath,
      '$_orders/$_tracking/unsetLocationName': trackingMutations.unsetLocationName,
      '$_orders/$_tracking/setLocationName': trackingMutations.setLocationName,
      '$_orders/$_tracking/addExtraDestination': trackingMutations.addExtraDestination,
      '$_orders/$_tracking/removeExtraDestination': trackingMutations.removeExtraDestination,
      '$_orders/$_home/setSavedCards': homeMutations.setSavedCards,
      '$_payment/setCardPaymentStatus': paymentMutations.setCardPaymentStatus,
      'setSecondaryProfile': globalMutations.setSecondaryProfile,
      '$_orders/$_tracking/showNotesDialog': trackingMutations.showNotesDialog,
      '$_orders/$_tracking/updateNotesInStore': trackingMutations.updateNotesInStore,
      '$_orders/$_tracking/showScheduleTimeDialog': trackingMutations.showScheduleTimeDialog,
      '$_orders/$_tracking/updatePickUpTimeInStore': trackingMutations.updatePickUpTimeInStore,
      '$_orders/$_tracking/setExtraDestination': trackingMutations.setExtraDestination,
      '$_orders/$_tracking/setAmountDue': trackingMutations.setAmountDue,
    };
    state = Object.assign(trackingstates.state, globals.state, paymentstates.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    moxios.install(axios);
    wrapper = mount(infoComponent, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Checks the cancellation message when Placed the wrong locations is selected as a reason', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(4);
    expect(wrapper.vm.cancelMessage).to.equal('We are sorry you entered the wrong locations. You can update the locations below. You may incur cost on updating your destinations.');
  });
  it('Checks the cancellation message when my order is not ready is selected as a reason', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(5);
    expect(wrapper.vm.cancelMessage).to.equal('We are sorry that your order is not ready. You can reschedule the pick up time of you order to another time like now.');
  });
  it('Checks the cancellation message No driver has been allocated to my request is selected as a reason', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(7);
    expect(wrapper.vm.cancelMessage).to.equal('We are sorry that your order has not been matched to a suitable driver. We are doing our best to find your a suitable driver to service your order');
  });
  it('Checks if the cancellation state = 1 if the order status is pending', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    expect(wrapper.vm.getCancellationOrderStatus).to.equal(1);
  });
  it('Checks if the edit location dialog shows if the cancellation reason selected is Placed the wrong locations', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(4);
    expect(wrapper.vm.editLocationOption).to.equal(false);
  });
  it('Checks if the reschedule dialog shows if the cancellation reason selected is my order is not ready', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(5);
    expect(wrapper.vm.rescheduleOptions).to.equal(true);
  });
  it('Checks if the notification dialog shows if the cancellation reason selected is No driver has been allocated to my request', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(7);
    expect(wrapper.vm.driverAllocatedOptions).to.equal(true);
  });
  it('Checks if the notification action is shown before 5 minutes if comparator is less than', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    expect(wrapper.vm.actionComparator({
      action_type: 5,
      applicable_order_status: [1],
      comparator: 1,
      duration: "5",
      message: "We are sorry that your order has not been matched to a suitable driver. We are doing our best to find your a suitable driver to service your order",
    }, 4)).to.equal(true);
  });
  it('Checks if the notification action is shown after 5 minutes if comparator is more than', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    expect(wrapper.vm.actionComparator({
      action_type: 5,
      applicable_order_status: [1],
      comparator: 2,
      duration: "5",
      message: "We are sorry that your order has not been matched to a suitable driver. We are doing our best to find your a suitable driver to service your order",
    }, 6)).to.equal(true);
  });
  it('Checks if the cancellation reasons are fetched using the new endpoint', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons).to.equal(localStorage.cancellation_reasons.data);
  });
  it('Checks if the cancellation reasons contain an actions array', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons[0]).to.have.deep.property('actions');
  });
  it('Checks if the compute fee endpoint returns cancellation fee per reason', done => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.calculateCancellationFee();
    moxios.wait(() => {
      const request = moxios.requests.mostRecent();
      request
        .respondWith({
          status: 200,
          response: {
            cancellation_fee: 0,
            currency: "KES",
            description: "",
            order_no: "AC94HW841-4FH",
            vat: 0
          },
        })
        .then((response) => {
          expect(response.data).to.have.deep.property('cancellation_fee');
          expect(response.data).to.have.deep.property('vat');
          expect(response.data).to.have.deep.property('currency');
          done();
        })
        .catch(error => {
          console.log('caught', error.message);
        });
    });
  });
});
describe('FBUTracking.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      '$_orders/$_tracking/requestCancellationReasons': trackingstore.requestCancellationReasons,
      '$_orders/getOrderData': orderStore.getOrderData,
    };
    getters = {
      '$_orders/$_tracking/trackingData': () => localStorage.tracking_data,
      '$_orders/$_tracking/getTrackedOrder': () => '',
      '$_orders/$_tracking/getIsMQTTConnected': () => '',
      '$_orders/getParentOrder': () => '',
      '$_orders/getVendors': () => '',
      getSession: ()=> localStorage.session,
      '$_orders/$_tracking/getAmountDue': () => '',
      getLanguage: () => 'en',
      getFCMData: () => '',
      '$_orders/$_tracking/getDateTime': () => '',
    };
    mutations = {
      '$_orders/removePolyline': orderMutations.removePolyline,
      '$_orders/removeMarkers': orderMutations.removeMarkers,
      '$_orders/setPage': orderMutations.setPage,
      '$_orders/hideVendors': orderMutations.hideVendors,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
      '$_orders/setParentOrder': orderMutations.setParentOrder,
    };
    state = Object.assign(trackingstates.state, globals.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    moxios.install(axios);
    wrapper = mount(FBUTracking, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Checks if the cancellation reasons contain an actions array for commercial freight', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons[0]).to.have.deep.property('actions');
  });
  it('Checks if the cancellation reasons are fetched using the new endpoint for commercial freight', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons).to.equal(localStorage.cancellation_reasons.data);
  });
});
describe('InterCountyWindow.vue', () => {
  let state;
  let actions;
  let getters;
  let mutations;
  let store;
  const url = 'about:blank#/';
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {
    origin: url,
    href: url,
  };
  let wrapper;
  beforeEach(() => {
    actions = {
      requestAxiosPost: globalstore.requestAxiosPost,
      requestAxiosGet: globalstore.requestAxiosGet,
      '$_orders/$_tracking/runningBalance': trackingstore.runningBalance,
      '$_orders/$_tracking/getTrackingData': trackingstore.getTrackingData,
      '$_payment/requestMpesaPayment': paymentstore.requestMpesaPayment,
      '$_payment/completeMpesaPaymentRequest': paymentstore.completeMpesaPaymentRequest,
      '$_orders/$_tracking/requestCancellationReasons': trackingstore.requestCancellationReasons,
    };
    getters = {
      '$_orders/$_tracking/trackingData': () => localStorage.intercounty_tracking_data,
      '$_orders/$_tracking/getTrackedOrder': () => '',
      '$_orders/$_tracking/getIsMQTTConnected': () => '',
      '$_orders/getVendors': () => '',
      getSession: ()=> localStorage.session,
      getLanguage: () => 'en',
      getCountryCode: () => 'ke',
    };
    mutations = {
      '$_orders/setPage': orderMutations.setPage,
      '$_orders/hideVendors': orderMutations.hideVendors,
      '$_orders/clearVendorMarkers': orderMutations.clearVendorMarkers,
      '$_orders/$_tracking/setTrackedOrder': trackingMutations.setTrackedOrder,
    };
    state = Object.assign(trackingstates.state, globals.state, paymentstates.state);
    state['$_orders'] = localStorage.tracking;
    state.map = localStorage.map;
    store = new Vuex.Store({
      actions,
      getters,
      mutations,
      state,
    });
    moxios.install(axios);
    wrapper = mount(InterCountyWindow, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
      sync: false,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('Checks if the cancellation reasons contain an actions array for Inter county orders', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons[0]).to.have.deep.property('actions');
  });
  it('Checks if the cancellation reasons are fetched using the new endpoint for Inter county orders', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.retrieveCancellationReasons();
    expect(wrapper.vm.cancellation_reasons).to.equal(localStorage.cancellation_reasons.data);
  });
  it('Checks if the cancellation state = 1 if the order status is pending for Inter county orders', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    expect(wrapper.vm.getCancellationOrderStatus).to.equal(1);
  });
});
describe('OngoingComponent.vue', () => {
  it('checks the ongoing orders component', () => {});
});
describe('MapComponent.vue', () => {
  it('checks the map component', () => {});
});
describe('OrderOptions.vue', () => {
  it('checks the order options component', () => {});
});
describe('VendorComponent.vue', () => {
  it('checks the vendor component', () => {});
});
describe('Comments.vue', () => {
  it('checks the comments component', () => {});
});
describe('PostRate.vue', () => {
  it('checks the post rate component', () => {});
});
describe('PostRateBusiness.vue', () => {
  it('checks the post rate business component', () => {});
});
describe('RateDriver.vue', () => {
  it('checks the rate driver component', () => {});
});
