import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  password: '',
  phone: '',
  email: '',
  name: '',
  country_code: 'KE',
  request_id: '',
  view_state: 1,
  activeTab: 'Biz',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
