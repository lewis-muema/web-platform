import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  ongoing_orders: {},
  map: 16,
  ongoing_show :0,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
