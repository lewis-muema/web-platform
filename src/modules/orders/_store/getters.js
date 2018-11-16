const show_ongoing = state => state.ongoing_show;
const get_ongoing_orders = state => state.ongoing_orders;
const get_markers = state => state.map.markers;
const get_polylines = state => state.map.polylines;

export default {
  show_ongoing,
  get_ongoing_orders,
  get_markers,
  get_polylines
};
