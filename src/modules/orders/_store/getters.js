const get_page = state => state.page;
const show_ongoing = state => state.ongoing_show;
const get_ongoing_orders = state => state.ongoing_orders;
const get_markers = state => state.map.markers;
const get_polyline = state => state.map.polyline;
const get_vendors = state => state.map.vendors;

export default {
  get_page,
  show_ongoing,
  get_ongoing_orders,
  get_markers,
  get_polyline,
  get_vendors
};
