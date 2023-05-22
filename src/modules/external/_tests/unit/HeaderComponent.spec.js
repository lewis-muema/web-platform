/* global describe,beforeEach,it */
/* eslint no-undef: "error" */
import Vue from 'vue';

import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import HeaderComponent from '../../components/HeaderComponent.vue';

Vue.use(Vuex);

describe('HeaderComponent.vue', () => {
  // let state;
  let getters;
  let store;

  beforeEach(() => {
    getters = { '$_external/getViewState': () => 2 };
    store = new Vuex.Store({
      getters,
    });
  });

});
