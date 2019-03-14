import Vue from 'vue';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import HeaderComponent from '../../components/HeaderComponent.vue';

Vue.use(Vuex);

describe('HeaderComponent.vue', () => {
  let state;
  let getters;
  let store;

  beforeEach(() => {
    getters = { '$_external/getViewState': () => 2 };
    store = new Vuex.Store({
      getters,
    });
  });

  it('calculates progress_width from the store getter', () => {
    const wrapper = mount(HeaderComponent, {
      store,
    });
    expect(wrapper.vm.progress_width.width).equal('50%');
  });
});
