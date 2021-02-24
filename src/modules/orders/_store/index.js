import actions from './actions';
import getters from './getters';
import mutations from './mutations';

export default {
  namespaced: true,
  state() {
    return {
      page: 0, // 0 - Order Placement, 1 - Tracking, 2 - Rating
      ongoing_orders: [],
      map: {
        markers: [],
        polyline: {
          path: '',
          options: {
            strokeColor: '#1782c5',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          },
        },
        vendors: {},
      },
      ongoing_show: 1,
      home_locations: [],
      order_path: [],
      location_path: [],
      outer_price_request: {},
      active_vendor_tally: [],
      expanded_active_vendor_tally: [],
      paired_drivers_tally: 0,
      outer_active_vendor_data: {},
      outer_active_package_data: 'small',
      parent_order: '',
      suggestions: [],
    };
  },
  actions,
  getters,
  mutations,
};
