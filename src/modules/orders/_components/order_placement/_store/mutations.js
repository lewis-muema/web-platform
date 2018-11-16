const add_waypoint = (state) => {
  state.waypoints++
};

const set_price_request_object = (state, val) => {
  state.price_request_object=val;
};

const set_active_package_class = (state, val) => {
  state.active_package_class=val;
};

export default {
  add_waypoint,set_price_request_object,set_active_package_class
};
