const set_tracking_data = (state, payload) => {
  state.tracking_data = payload;
};
const set_tracked_order = (state, payload) => {
  state.tracked_order = payload;
};
const setIsMQTTConnected = (state, payload) => {
  state.isMQTTConnected = payload;
};

export default {
  set_tracking_data,
  set_tracked_order,
  setIsMQTTConnected,
};
