import Vue from 'vue'
import Vuex from 'vuex'
import global_store from './global'
// Vuex.prototype.mqtt = mqtt

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store(global_store);
}
