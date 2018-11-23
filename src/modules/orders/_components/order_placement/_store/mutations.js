export default {
    set_price_request_object(state, val){
      state.price_request_object=val;
    },

    set_active_package_class(state, val){
      state.active_package_class=val;
    },

    set_max_destinations(state, val){
      state.max_destinations=val;
    },

    set_active_vendor_name(state, val){
      state.active_vendor_name=val;
    },
    set_active_order_option(state, val) {
      state.active_order_option=val;
    },
    set_schedule_time(state, val) {
      state.schedule_time=val;
    },
    set_order_notes(state, val) {
      state.order_notes=val;
    },
    set_payment_method(state, val) {
      state.payment_method=val;
    },
    set_order_path(state, val) {
      state.order_path.splice(val.index,0,val.path);
    },
    set_location_name(state, val) {
      state.location_names.splice(val.index,0,val.name);
    },
    unset_order_path(state, index) {
      state.order_path.splice(index,1);
    },
    unset_location_name(state, index) {
      state.location_names.splice(index,1);
    },
    add_extra_destination(state) {
      state.extra_destinations++;
    },
    remove_extra_destination(state) {
      state.extra_destinations--;
    },
    set_pickup_filled(state, val) {
      state.pickup_filled = val;
    },
    set_saved_cards(state, val) {
      state.saved_cards = val;
    },
    set_stripe_user_id(state, val) {
      state.stripe_user_id = val;
    },
};
