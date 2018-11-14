import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  waypoints: 1,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
