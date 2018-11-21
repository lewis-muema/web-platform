import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  // waypoints: 1,
  active_package_class:'',
  active_vendor_name:'',
  active_order_option:'',
  price_request_object:{},
  max_destinations: 9,
  order_path:[],
  location_names:[],
  schedule_time:'',
  order_notes:'',
  extra_destinations:0,
  pickup_filled:false,
  payment_method:'',
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
