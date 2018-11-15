const toggle_ongoing = (state) => {
  if (state.ongoing_show == 0) {
    state.ongoing_show = 1;
  }
  else {
    state.ongoing_show = 0;
  }

};

export default {
  toggle_ongoing,
};
