import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
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
    polylines: [{

    }],
    vendors: []
  },
  ongoing_show :0,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
