/* global describe,it */
/* eslint no-undef: "error" */
/* eslint-disable */
import Vue from 'vue';
import axios from 'axios';
import moxios from 'moxios';
// import { Store } from 'vuex-mock-store';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import VueRouter from 'vue-router';
import moment from 'moment';
import ElementUI from 'element-ui';
import '../../../../../test/localStorage.js';
import messages from '../../../../../test/messages.js';
import trackingMutations from '../../_components/tracking/_store/mutations';
import trackingstore from '../../_components/tracking/_store/actions';
import homeMutations from '../../_components/order_placement/_store/mutations';
import homestore from '../../_components/order_placement/_store/actions';
import paymentMutations from '../../../payment/_store/mutations';
import paymentstore from '../../../payment/_store/actions';
import globalMutations from '../../../../store/mutations';
import globalstore from '../../../../store/actions';
import globals from '../../../../store/global';
import orderMutations from '../../_store/mutations';
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
import mutations from '../../../../store/mutations.js';

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
    state = globals.state;
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
  it('Checks the cancellation message when my order is not ready is selected as a reason', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(5);
    expect(wrapper.vm.cancelMessage).to.equal('We are sorry that your order is not ready. You can reschedule the pick up time of you order to another time like now.');
  });
  it('Checks if the cancellation state = 1 if the order status is pending', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    expect(wrapper.vm.getCancellationOrderStatus).to.equal(1);
  });
  it('Checks if the edit location dialog shows if the cancellation reason selected is my order is not ready', () => {
    wrapper.vm.cancellation_reasons = localStorage.cancellation_reasons.data;
    wrapper.vm.cancelChange(5);
    expect(wrapper.vm.rescheduleOptions).to.equal(true);
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
