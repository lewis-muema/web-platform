import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
    order_history_orders : [10],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
