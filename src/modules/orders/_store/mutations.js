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

const set_markers = (state, payload) => {
  state.map.markers.push(payload);
};

const set_polylines = (state, payload) => {
  state.map.polylines.push(payload);
};

export default {
  toggle_ongoing,
  set_ongoing_orders,
  set_markers,
  set_polylines
};
