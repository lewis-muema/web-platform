import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  page: 0, //0 - Order Placement, 1 - Tracking, 2 - Rating
  ongoing_orders: {},
  map: {
    markers: [],
    polyline: {
      path: "",
      options: {
        strokeColor: '#1782c5',
        strokeOpacity: 1.0,
        strokeWeight: 2
      }
    },
    vendors: {}
  },
  ongoing_show :1,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
