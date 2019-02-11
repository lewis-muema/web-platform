const getDefaultState = () => {
  return {
      active_package_class:'',
      active_vendor_name:'',
      active_order_option:'',
      price_request_object:{},
      max_destinations: 9,
      order_path:[],
      location_names:[],
      saved_cards:[],
      schedule_time:'',
      order_notes:'',
      extra_destinations:0,
      pickup_filled:false,
      payment_method:'',
      stripe_user_id:'',
      carrier_type_id:'',
      return_status:false,
      max_temperature:4,
      delivery_item:'',
      load_weight:'',
      load_units:'kgs',
      additional_loader:'',
      no_of_loaders:1,
  };
};

export default {
    set_price_request_object(state, val){
      state.price_request_object=val;
    },

    clear_price_request_object(state){
      state.price_request_object=[];
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

    set_active_vendor_details(state, val){
      state.active_vendor_details=val;
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
      // state.order_path.splice(index,1);
      state.order_path.splice(val.index,val.index == 0 ? 0 : 1,val.path);
    },

    set_location_name(state, val) {
      // unset_location_name(val.index);
      state.location_names.splice(val.index,val.index == 0 ? 0 : 1,val.name);
    },

    unset_order_path(state, index) {
      state.order_path.splice(index,1);
    },

    clear_order_path(state) {
      state.order_path = [];
    },

    unset_location_name(state, index) {
      state.location_names.splice(index,1);
    },

    clear_location_names(state) {
      state.location_names = [];
    },
    add_extra_destination(state) {
      state.extra_destinations++;
    },

    remove_extra_destination(state) {
      state.extra_destinations--;
    },

    clear_extra_destinations(state) {
      state.extra_destinations = 0;
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

    resetState (state) {
      Object.assign(state, getDefaultState());
    },

    set_carrier_type(state, val) {
      state.carrier_type_id = val;
    },

    setReturnStatus(state, val) {
      state.return_status = val;
    },

    setMaxTemperature(state, val) {
      state.max_temperature = val;
    },

    setDeliveryItem(state, val) {
      state.delivery_item = val;
    },

    setLoadWeight(state, val) {
      state.load_weight = val;
    },

    setLoadUnits(state, val) {
      state.load_units = val;
    },

    setAdditionalLoaderStatus(state, val) {
      state.additional_loader = val;
    },

    setNOOfLoaders(state, val) {
      state.no_of_loaders = val;
    },
};
