import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
const plugins = [];

const state = {
  session: {},
  ENV: {},
  running_balance: 0,
  notification: {},
  notification_status: false
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
  plugins: plugins
};
