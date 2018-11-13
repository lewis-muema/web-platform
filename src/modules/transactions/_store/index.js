import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  number: 12,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
