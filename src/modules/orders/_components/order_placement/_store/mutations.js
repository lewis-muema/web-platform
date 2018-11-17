const add_waypoint = (state) => {
  state.waypoints++
};
// TO DO: replace with locations
const remove_waypoint = (state) => {
  state.waypoints--
};
const set_price_request_object = (state, val) => {
  state.price_request_object=val;
};

const set_active_package_class = (state, val) => {
  state.active_package_class=val;
};

const set_max_way_points = (state, val) => {
  state.max_way_points=val;
};

const set_order_locations = (state, val) => {
  state.order_locations=val;
};

const set_active_vendor_name = (state, val) => {
  state.active_vendor_name=val;
};
const set_active_order_option = (state, val) => {
  state.active_order_option=val;
};


export default {
  add_waypoint,set_price_request_object,set_active_package_class, set_max_way_points,set_order_locations,remove_waypoint,set_active_vendor_name,set_active_order_option
};
