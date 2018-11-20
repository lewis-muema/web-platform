import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  tracking_data: {}
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
