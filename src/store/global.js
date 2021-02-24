import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);
const plugins = [];

const state = {
  session: {},
  ENV: {},
  running_balance: 0,
  notification: {},
  notification_status: false,
  country_code: 'KE',
  default_currency: 'KES',
  fcm_token: null,
  fcm_data: {},
  redirect_status: false,
  redirect_order: ' ',
  nps_status: false,
  dedicated_access_status: false,
  secondary_profile: '',
  pick_up_filled_status: false,
  language: 'en-US,en;q=0.9',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  plugins,
};
