import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
    mpesa_loading_status: false,
    mpesa_fail_status: false,
    mpesa_success_status: false
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
