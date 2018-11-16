import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  name: 'Clinton Merchants',
  email: 'clintonmerchants@gmail.com'
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
