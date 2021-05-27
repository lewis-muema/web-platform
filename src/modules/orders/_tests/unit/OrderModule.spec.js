/* global describe,it */
/* eslint no-undef: "error" */
import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
// import { Store } from 'vuex-mock-store'
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import moment from 'moment';
import '../../../../../test/localStorage.js';
import messages from '../../../../../test/messages.js';
import trackingstore from '../../_components/tracking/_store/actions';
import homestore from '../../_components/order_placement/_store/actions';
import paymentstore from '../../../payment/_store/actions';
import globalstore from '../../../../store/actions'
import TimezoneMxn from '../../../../mixins/timezone_mixin';
// import Order from '../../Orders.vue';
// import OngoingComponent from '../../_components/OngoingComponent.vue';
// import MapComponent from '../../_components/MapComponent.vue';
// import OrderOptions from '../../_components/order_placement/_components/OrderOptions.vue';
// import VendorComponent from '../../_components/order_placement/_components/VendorComponent.vue';
// import Comments from '../../_components/rating/components/Comments.vue';
// import PostRate from '../../_components/rating/components/PostRate.vue';
// import PostRateBusiness from '../../_components/rating/components/PostRateBusiness.vue';
import infoComponent from '../../_components/tracking/_components/InfoComponent.vue';

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
const router = new VueRouter();
describe('Order.vue', () => {
  it('checks the order module', () => {});
  // it('Check text', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   const message = wrapper.find('h1').text();
  //   expect(message).to.equal('Am Here');
  // });
});
describe('InfoComponent.vue', () => {
  const tracking_data = {
    "path": [
      {
        "coordinates": "-1.2789845,36.7358726",
        "country_code": "KE",
        "more": {
          "Address": "Not Indicated",
          "Estate": "",
          "FlatName": "",
          "HouseDoor": "",
          "Label": "",
          "Otherdescription": "",
          "Road": "",
          "Typed": "",
          "Vicinity": "Not Indicated",
          "landmark": "",
          "place_idcustom": "ChIJ7w7g_n4ZLxgRT57b1bzmRW0",
          "viewport": {
            "northeast": {
              "lat": 0,
              "lng": 0
            },
            "southwest": {
              "lat": 0,
              "lng": 0
            }
          }
        },
        "name": "Ndwaru Road",
        "notes": null,
        "notify": false,
        "recipient_name": null,
        "recipient_phone": null,
        "reference_number": null,
        "waypoint_details_status": true,
        "waypoint_type": "PICKUP",
        "visited": false
      },
      {
        "coordinates": "-1.285549,36.826400",
        "country_code": "KE",
        "more": {
          "Address": "",
          "Estate": "",
          "FlatName": "",
          "HouseDoor": "",
          "Label": "",
          "Otherdescription": "",
          "Road": "",
          "Typed": "",
          "Vicinity": "",
          "landmark": "",
          "place_idcustom": "",
          "viewport": {
            "northeast": {
              "lat": 0,
              "lng": 0
            },
            "southwest": {
              "lat": 0,
              "lng": 0
            }
          }
        },
        "name": "RNG Plaza",
        "notes": null,
        "notify": false,
        "recipient_name": null,
        "recipient_phone": null,
        "reference_number": null,
        "waypoint_details_status": false,
        "waypoint_type": "DELIVERY",
        "visited": false
      }
    ],
    "description_head": "We are matching your order with a rider",
    "marketing_message": "A rider will be allocated to your order",
    "sliding_message": [
      "Your order has been received. ",
      "We are dispatching to Drivers in the area. ",
      "The driver's details will appear here once confirmed."
    ],
    "slide_time_milliseconds": 5000,
    "price_type": 1,
    "main_status": 1,
    "amount": 616,
    "city_id": 1,
    "order_no": "AC94BX839-KXN",
    "parent_order_no": "AC94LH842-USH",
    "confirm_status": 0,
    "delivery_status": 0,
    "rate_status": 0,
    "date_time": "2021-05-21 05:31:09",
    "user": {
      "name": "Faithshopy",
      "email": "faithshop@gmail.com",
      "phone": "+254709779779"
    },
    "rider": {
      "rider_id": 1,
      "rider_name": "Sendy Rider",
      "rider_phone": "0709779779",
      "number_plate": " WER 565t",
      "vehicle_name": null,
      "phone_no_1": "0709779779",
      "rider_rating": "4.0",
      "rider_photo": "https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png",
      "vendor_id": 1,
      "vendor_description": null,
      "vendor_name": "Bike"
    },
    "delivery_log": [
      {
        "description": "Order AC94BX839-KXN created",
        "log_type": 1,
        "text_json": "{\"client_mode\":669,\"delivery_id\":1359919,\"duration\":42,\"order_no\":\"AC94BX839-KXN\",\"rider_id\":1,\"rider_name\":\"Sendy Driver\",\"_push_description\":\"Order AC94BX839-KXN created\",\"_push_description_id\":1,\"_push_type\":6,\"description\":\"New delivery request\",\"log_type\":1,\"pickupduration\":34}",
        "log_time": "2021-05-21T02:31:09.000Z"
      }
    ],
    "order_notes": [
      {
        "msg": "none"
      }
    ],
    "price_tier": {},
    "package_details": {
      "additional_loader": false,
      "customer_min_amount": 0,
      "delivery_item": "",
      "load_units": "tonnes",
      "load_weight": 0,
      "max_temperature": 4,
      "no_of_loaders": 1
    },
    "tier_name": "",
    "polyline": "rxxFk~e_F}BB}@@q@@{@Fm@Ng@VUPa@d@eA|As@rAg@x@_@b@{@l@aEbBmDjAy@\\g@b@k@`@]j@Sh@e@jCU~ASt@a@`A]j@Y`@gC`DiAzA_@d@aAfAcBxBg@z@i@dAmAtCiBzC{@hBUZY^cAlAsCbDyAnBqAzA_A`AKDKTO`@I^?RE\\MTOL[Lm@?e@SSYEKKEMGmAC}@@y@EsCWqBUaAOoCk@cDo@uA_@[Im@Ae@?m@Ju@ZQ\\I^Cl@Hf@LXRX`@Lz@HXCTGHEb@]Zg@Ro@Lq@F_ALaCXaBt@uCjAmD~@uB`@}@lDwGhAuBrAiDx@_Dl@mCb@uD^wFz@kLLwFBiBCmRS_PIkH?aGOkKKaCGqHG}F?oCBmEFoCBgAA}FO{HGyCSuEYcGQkESwDMcBi@aFWyBa@yEYyAY_Ae@gA[m@oAyBgDcGc@eAg@qByA{K[gCs@{Fq@qFS}ASkAa@iAOs@Io@Au@FiCCs@QwB]aEIiDAiDDuA`@gGx@eNr@wMPaGR{FXuDf@qELm@Ru@Z_BPgBNkC@eATaF`@iGNsBD{@LqAPeAx@wD^}Ap@{BXk@f@w@\\a@jCyBdA{@p@a@nAu@r@m@TYFOTUHAl@Il@[bAy@t@o@vAqApA}An@u@T[rE_EdCsBtBiBtFsEhFiE`BuAlBoBbAsA`@}@vA{Ct@}At@qAp@s@p@s@hAcA~ByA`Am@^O~@a@lAc@xAWnD]vD[dBQbB[rA[lAe@`Bs@VU@EDILGPEPBFDB@^M|DsAbFqBzIoDdAg@NM@KHSLIVGPBHBVAnA[zB{@n@WxEgBpBw@`GaClBw@~CwAb@WBKHG@I?MGk@gBuEiEmKkHoQ_@q@OOWOI?QGOUBYFQi@sAyGhCQRy@ZeA^sDxAq@V",
    "eta_data": {
      "order_no": "AC94BX839-KXN",
      "reason": "The order does not exist.",
      "status": false,
      "cancelled": false,
      "cancelled_message": ""
    },
    "fixed_cost": true,
    "status": true,
    "to_details": {
      "to_name": "RNG Plaza",
      "to_cord": "-1.285549,36.826400",
      "to_lat": "-1.285549",
      "to_long": "36.826400"
    },
    "from_details": {
      "from_name": "Ndwaru Road",
      "from_cord": "-1.2789845,36.7358726",
      "to_lat": "-1.2789845",
      "to_long": "36.7358726"
    },
    "city_code": "ke-nairobi",
    "customer_care_number": "+254 709 779 779",
    "currency": "KES",
    "edit_config": {
      "add_drop_off": false,
      "add_pickup": false,
      "change_drop_off": false,
      "change_notes": false,
      "change_pickup": false
    },
    "payment_method": 12,
    "payment_option": 1
  };
  let actions;
  let getters;
  let store;
  beforeEach(() => {
    actions = {
      'requestAxiosPost': globalstore.requestAxiosPost,
      '$_orders/$_tracking/getTrackingData': trackingstore.getTrackingData,
      '$_orders/$_home/requestPriceQuote': homestore.requestPriceQuote,
      '$_orders/$_home/requestSavedCards': homestore.requestSavedCards,
      '$_orders/$_home/requestPaymentOptions': trackingstore.requestPaymentOptions,
      '$_payment/requestMpesaPayment': paymentstore.requestMpesaPayment,
      '$_payment/completeMpesaPaymentRequest': paymentstore.completeMpesaPaymentRequest,
      '$_orders/$_tracking/requestCancellationReasons': trackingstore.requestCancellationReasons,
    };
    getters = {
      '$_orders/$_tracking/trackingData': () => tracking_data,
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
      '$_orders/$_home/getSavedCards': () => [],
      '$_payment/getCardPaymentStatus': () => '',
      getSession: () => '',
      '$_orders/$_tracking/getAmountDue': () => '',
      getLanguage: () => 'en',
    };
    store = new Vuex.Store({
      actions,
      getters,
    });
  });
  let wrapper;
  beforeEach(() => {
    moxios.install(axios);
    window.axios = axios;
    wrapper = mount(infoComponent, {
      i18n,
      store,
      mixins: [TimezoneMxn],
      localVue,
      router,
    });
    wrapper.vm.moment = moment;
  });
  afterEach(() => {
    moxios.uninstall();
  });
  it('checks the ongoing orders component', () => {
    console.log(wrapper.vm.moment);
    wrapper.find('input');
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
