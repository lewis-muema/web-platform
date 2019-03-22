import Vue from 'vue';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Analytics from '../../Analytics.vue';
import Monthly from '../../components/Monthly.vue';
import Weekly from '../../components/Weekly.vue';

Vue.use(Vuex);

describe('Analytics.vue', () => {
  it('checks the analytics module', () => {});
  // it('Check text', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   const message = wrapper.find('h1').text();
  //   expect(message).to.equal('Am Here');
  // });
});
describe('Monthly.vue', () => {
  it('checks the monthly component', () => {});

});
describe('Weekly.vue', () => {
  it('checks the weekly component', () => {});

});
