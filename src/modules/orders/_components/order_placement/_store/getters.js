const get_waypoints = state => state.waypoints;
const get_price_request_object = state => state.price_request_object;
const get_active_package_class = state => state.active_package_class;
const get_max_way_points = state => state.max_way_points;
const get_order_locations = state => state.order_locations;

export default {
  get_waypoints,get_price_request_object,get_active_package_class,get_max_way_points,get_order_locations
};
