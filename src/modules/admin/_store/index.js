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
  biz_name: '',
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
  webhook_events: [],
  api_password: '',
  api_token: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
