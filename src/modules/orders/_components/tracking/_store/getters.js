const getTrackingData = state => state.tracking_data;
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

export default {
  getTrackingData,
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
};
