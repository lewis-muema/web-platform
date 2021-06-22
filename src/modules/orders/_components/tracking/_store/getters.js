const trackingData = state => state.tracking_data;
const getTrackedOrder = state => state.tracked_order;
const getIsMQTTConnected = state => state.isMQTTConnected;
const getDateTime = state => state.date_time;
const getShareOption = state => state.share_option;
const getTrackMoreInfo = state => state.track_more_info;
const getTrackVendorName = state => state.track_vendor_name;
const getTrackPartnerName = state => state.track_partner_name;
const getTrackPackageName = state => state.track_package_name;
const getConfirmEta = state => state.confirm_eta;
const getPickUpEta = state => state.pickup_eta;
const getDeliveryEta = state => state.delivery_eta;
const getEditLocationDialog = state => state.edit_location;
const getScheduleTimeDialog = state => state.edit_scheduled_time;
const getPickUpTime = state => state.pick_up_time;
const getNotesDialog = state => state.edit_notes;
const getNotesInStore = state => state.stored_notes;
const getPickUpFilled = state => state.pickup_filled;
const getPickUpFilledStatus = state => state.pick_up_filled_status;
const getStorePath = state => state.order_path;
const getExtraDestinations = state => state.extra_destinations;
const getMaxDestinations = state => state.max_destinations;
const getAmountDue = state => state.amount_due;

export default {
  trackingData,
  getTrackedOrder,
  getIsMQTTConnected,
  getDateTime,
  getShareOption,
  getTrackMoreInfo,
  getTrackVendorName,
  getTrackPartnerName,
  getTrackPackageName,
  getConfirmEta,
  getPickUpEta,
  getDeliveryEta,
  getEditLocationDialog,
  getPickUpFilled,
  getPickUpFilledStatus,
  getStorePath,
  getExtraDestinations,
  getMaxDestinations,
  getNotesDialog,
  getNotesInStore,
  getScheduleTimeDialog,
  getPickUpTime,
  getAmountDue,
};
