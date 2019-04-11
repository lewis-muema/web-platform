const getPage = state => state.page;
const showOngoing = state => state.ongoing_show;
const getOngoingOrders = state => state.ongoing_orders;
const getMarkers = state => state.map.markers;
const getPolyline = state => state.map.polyline;
const getVendors = state => state.map.vendors;

export default {
  getPage,
  showOngoing,
  getOngoingOrders,
  getMarkers,
  getPolyline,
  getVendors,
};
