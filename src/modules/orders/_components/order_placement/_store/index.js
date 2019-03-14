import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state() {
    return {
      // waypoints: 1,
      active_package_class: '',
      active_vendor_name: '',
      active_vendor_details: {},
      active_order_option: '',
      price_request_object: {},
      max_destinations: 9,
      order_path: [],
      location_names: [],
      saved_cards: [],
      schedule_time: '',
      order_notes: '',
      extra_destinations: 0,
      pickup_filled: false,
      payment_method: '',
      stripe_user_id: '',
      carrier_type_id: '',
      return_status: false,
      max_temperature: 4,
      customer_min_amount: '',
      delivery_item: '',
      load_weight: '',
      load_units: 'tonnes',
      additional_loader: '',
      no_of_loaders: 1,
    };
  },
  actions,
  getters,
  mutations,
};
