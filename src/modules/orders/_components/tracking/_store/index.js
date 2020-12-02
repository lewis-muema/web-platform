import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  tracked_order: '',
  tracking_data: {},
  isMQTTConnected: false,
  date_time: '',
  share_option: false,
  track_more_info: false,
  track_vendor_name: '',
  track_partner_name: '',
  track_package_name: '',
  confirm_eta: '',
  pickup_eta: '',
  delivery_eta: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
