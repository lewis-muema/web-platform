import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
    keys_list : [],
    users_list : [],
    departments_list : [],
    cop_id: 0,
    base_url: '',
    view_state: 1,
    biz_name: '',
    departments: '',
    adds: 3,
    invite_link: '',
    invites:{
    },
    added_status: ''
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
