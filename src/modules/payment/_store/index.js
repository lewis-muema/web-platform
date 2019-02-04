import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  mpesa_loading_status: false,
  mpesa_fail_status: false,
  mpesa_success_status: false,
  card_loading_status: false,
  card_fail_status: false,
  card_success_status: false,
  saved_cards: [],
  stripe_user_id: '',
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
