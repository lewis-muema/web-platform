import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  cop_users: [],
  order_history_orders: [],
  payments: [],
  statement: [],
  user_currencies: [],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
