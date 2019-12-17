/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import Vuex from 'vuex';
import globalStore from './global';

Vue.use(Vuex);
export function createStore() {
  return new Vuex.Store(globalStore);
}
