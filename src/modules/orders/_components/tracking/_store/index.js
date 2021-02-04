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
  edit_location: false,
  edit_scheduled_time: false,
  pick_up_time: '',
  pick_up_filled_status: false,
  pickup_filled: false,
  order_path: [],
  location_names: [],
  location_path: [],
  extra_destinations: 0,
  max_destinations: 24,
  edit_notes: false,
  stored_notes: {},
  amount_due: 0,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
