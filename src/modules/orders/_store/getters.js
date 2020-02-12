const getPage = state => state.page;
const showOngoing = state => state.ongoing_show;
const getOngoingOrders = state => state.ongoing_orders;
const getMarkers = state => state.map.markers;
const getPolyline = state => state.map.polyline;
const getVendors = state => state.map.vendors;
const getHomeLocations = state => state.home_locations;
const getStorePath = state => state.location_path;
const getOuterPriceRequestData = state => state.outer_price_request;
const getOuterActiveVendorDetails = state => state.outer_active_vendor_data;
const getOuterActivePackageClass = state => state.outer_active_package_data;
const getParentOrder = state => state.parent_order;


export default {
  getPage,
  showOngoing,
  getOngoingOrders,
  getMarkers,
  getPolyline,
  getVendors,
  getHomeLocations,
  getStorePath,
  getOuterPriceRequestData,
  getOuterActiveVendorDetails,
  getOuterActivePackageClass,
  getParentOrder,
};
