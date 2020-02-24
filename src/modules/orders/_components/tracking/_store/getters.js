const getTrackingData = state => state.tracking_data;
const getTrackedOrder = state => state.tracked_order;
const getIsMQTTConnected = state => state.isMQTTConnected;
const getDateTime = state => state.date_time;

export default {
  getTrackingData,
  getTrackedOrder,
  getIsMQTTConnected,
  getDateTime,
};
