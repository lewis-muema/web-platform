import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  freight_orders: [],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
