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
const setShareOption = (state, data) => {
  state.share_option = data;
};
const setTrackMoreInfo = (state, data) => {
  state.track_more_info = data;
};
const setTrackVendorName = (state, data) => {
  state.track_vendor_name = data;
};
const setTrackPartnerName = (state, data) => {
  state.track_partner_name = data;
};
const setTrackPackageName = (state, data) => {
  state.track_package_name = data;
};
const setConfirmEta = (state, data) => {
  state.confirm_eta = data;
};
const setPickUpEta = (state, data) => {
  state.pickup_eta = data;
};
const setDeliveryEta = (state, data) => {
  state.delivery_eta = data;
};

export default {
  setTrackingData,
  setTrackedOrder,
  setIsMQTTConnected,
  setDateTime,
  setShareOption,
  setTrackMoreInfo,
  setTrackVendorName,
  setTrackPartnerName,
  setTrackPackageName,
  setConfirmEta,
  setPickUpEta,
  setDeliveryEta,
};
