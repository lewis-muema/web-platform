import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  ongoing_orders: 12,
  map: 16,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
