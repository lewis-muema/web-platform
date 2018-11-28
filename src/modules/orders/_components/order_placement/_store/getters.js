
export default {
    get_price_request_object: (state) => state.price_request_object,
    get_active_package_class: (state) => state.active_package_class,
    get_active_vendor_name: (state) => state.active_vendor_name,
    get_active_order_option: (state) => state.active_order_option,
    get_schedule_time: (state) => state.schedule_time,
    get_order_notes: (state) => state.order_notes,
    get_order_path: (state) => state.order_path,
    get_location_names: (state) => state.location_names,
    get_max_destinations: (state) => state.max_destinations,
    get_extra_destinations: (state) => state.extra_destinations,
    get_pickup_filled: (state) => state.pickup_filled,
    get_payment_method: (state) => state.payment_method,
    get_saved_cards: (state) => state.saved_cards,
    get_stripe_user_id: (state) => state.stripe_user_id,
};
