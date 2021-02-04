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
const setEditLocationDialog = (state, data) => {
  state.edit_location = data;
};
const showNotesDialog = (state, data) => {
  state.edit_notes = data;
};
const showScheduleTimeDialog = (state, data) => {
  state.edit_scheduled_time = data;
};
const updatePickUpTimeInStore = (state, data) => {
  state.pick_up_time = data;
};
const updateNotesInStore = (state, data) => {
  state.stored_notes = data;
};
const setPickUpFilled = (state, data) => {
  state.pickup_filled = data;
};
const setPickUpFilledStatus = (state, data) => {
  state.pick_up_filled_status = data;
};
const unsetOrderPath = (state, index) => {
  state.order_path.splice(index, 1);
};
const unsetLocationName = (state, index) => {
  state.location_names.splice(index, 1);
};
const setOrderPath = (state, val) => {
  state.order_path.splice(val.index, val.index === 0 ? 0 : 1, val.path);
};
const clearStorePath = (state) => {
  state.order_path = [];
};
const unsetStorePath = (state, index) => {
  state.order_path.splice(index, 1);
};
const setLocationName = (state, val) => {
  state.location_names.splice(val.index, val.index === 0 ? 0 : 1, val.name);
};
const addExtraDestination = (state) => {
  state.extra_destinations++;
};
const removeExtraDestination = (state) => {
  state.extra_destinations--;
};
const setExtraDestination = (state, val) => {
  state.extra_destinations = val;
};
const setAmountDue = (state, val) => {
  state.amount_due = val;
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
  setEditLocationDialog,
  showNotesDialog,
  showScheduleTimeDialog,
  updatePickUpTimeInStore,
  updateNotesInStore,
  setPickUpFilled,
  setPickUpFilledStatus,
  unsetOrderPath,
  unsetLocationName,
  setOrderPath,
  clearStorePath,
  unsetStorePath,
  setLocationName,
  addExtraDestination,
  removeExtraDestination,
  setExtraDestination,
  setAmountDue,
};
