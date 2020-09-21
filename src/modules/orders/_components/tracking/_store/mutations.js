/* eslint no-param-reassign: "error" */
const setTrackingData = (state, payload) => {
  state.tracking_data = payload;
};
const setTrackedOrder = (state, payload) => {
  state.tracked_order = payload;
};
const setIsMQTTConnected = (state, payload) => {
  state.isMQTTConnected = payload;
};
const setDateTime = (state, payload) => {
  state.date_time = payload;
};


export default {
  setTrackingData,
  setTrackedOrder,
  setIsMQTTConnected,
  setDateTime,
};
