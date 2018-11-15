const toggle_ongoing = (state) => {
  if (state.ongoing_show == 0) {
    state.ongoing_show = 1;
  }
  else {
    state.ongoing_show = 0;
  }

};

const set_ongoing_orders = (state, payload) => {
  state.ongoing_orders = payload;
};

export default {
  toggle_ongoing,
  set_ongoing_orders,
};
