import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  tracked_order: '',
  tracking_data: {},
  isMQTTConnected: false,
  date_time: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
