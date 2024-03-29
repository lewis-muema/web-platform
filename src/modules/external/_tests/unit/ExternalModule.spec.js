/* eslint no-undef: "error" */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line no-undef */
/* global describe,beforeEach,it */

import Vue from 'vue';
// import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import HeaderComponent from '../../components/HeaderComponent.vue';
// import EmailValidationComponent from '../../components/EmailValidationComponent.vue';

Vue.use(Vuex);

describe('HeaderComponent.vue', () => {
  let getters;
  let store;

  beforeEach(() => {
    getters = { '$_external/getViewState': () => 2 };
    store = new Vuex.Store({
      getters,
    });
  });

  // it('calculates progress_width from the store getter', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   expect(wrapper.vm.progress_width.width).equal('50%');
  // });
  // it('Check text', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   const message = wrapper.find('h1').text();
  //   expect(message).to.equal('Am Here');
  // });
});

// describe('EmailValidationComponent.vue', () => {
//   let state;
//   let store;
//   let mutations;
//   beforeEach(() => {
//     mutations = { '$_external/setViewState': () => 2 };
//     store = new Vuex.Store({
//       mutations,
//     });
//   });
//   it('Check validation message ', () => {
//     const wrapper = mount(EmailValidationComponent, {
//       store,
//     });
//     // const message = wrapper.find('h1').text();
//     // expect(message).to.equal('Am Here');
//   });
// });
