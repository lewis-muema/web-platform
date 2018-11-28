import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  password:'',
  phone:'',
  email:'',
  name:''
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
