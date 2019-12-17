import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  base_url: '',
  score: 0,
  package_id: '',
  rider_image: '',
  driver_image_base: '',
  user_email: '',
  step: 1,
  driver_name: '',
  images_base_url: '',
  post_rating_component: 0,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
