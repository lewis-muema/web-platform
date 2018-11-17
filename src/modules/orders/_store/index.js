import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  page: 0, //0 - Order Placement, 1 - Tracking, 2 - Rating
  ongoing_orders: {},
  map: {
    markers: [
      {
        position: {
          lat: -1.3005695,
          lng: 36.778638
        }
      },
      {
        position: {
          lat: -1.3292761,
          lng: 36.6960015
        }
      }
    ],
    polyline: {
      path: "zp{Fm_p_FaAFmADIHUl@DbBF~FPhIL`G\\hRZtSDnCD`Bt@BxDB`EFnGL~BFhBAfGFnFHz@?@dAJvE",
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
