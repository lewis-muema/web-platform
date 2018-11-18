import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
Vue.use(Vuex)

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
const plugins = []

if (process.browser) {
  const vuexPersist = new VuexPersist({
    key: '_sendyWeb',
    storage: window.localStorage
  })
  plugins.push(vuexPersist.plugin);
  
}

const state = {
  session: {},
  ENV:{},
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
  plugins:plugins
};
