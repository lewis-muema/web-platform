import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  keys_list: [],
  users_list: [],
  departments_list: [],
  cop_id: '',
  base_url: '',
  view_state: 1,
  bizName: '',
  departments: '',
  adds: 3,
  invite_link: '',
  cop_user_id: '',
  user_name: '',
  user_email: '',
  user_phone: '',
  type: '',
  invites: {},
  added_status: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
