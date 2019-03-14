import Vue from 'vue';
import Vuex from 'vuex';
import globalStore from './global';
// Vuex.prototype.mqtt = mqtt
Vue.use(Vuex);
export function createStore() {
  return new Vuex.Store(globalStore);
}
