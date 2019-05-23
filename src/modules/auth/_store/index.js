import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  password: '',
  phone: '',
  email: '',
  name: '',
  country_code: '',
  request_id: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
