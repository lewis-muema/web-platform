const getDefaultState = () => ({
  active_package_class: '',
  active_vendor_name: '',
  active_order_option: '',
  price_request_object: {},
  max_destinations: 9,
  order_path: [],
  location_names: [],
  saved_cards: [],
  schedule_time: '',
  order_notes: '',
  extra_destinations: 0,
  pickup_filled: false,
  payment_method: '',
  stripe_user_id: '',
  carrier_type_id: '',
  return_status: false,
  max_temperature: 4,
  delivery_item: '',
  load_weight: '',
  load_units: 'kgs',
  additional_loader: '',
  no_of_loaders: 1,
});

/* eslint no-param-reassign: "error" */
export default {
  setPriceRequestObject(state, val) {
    state.price_request_object = val;
  },

  clearPriceRequestObject(state) {
    state.price_request_object = [];
  },

  setActivePackageClass(state, val) {
    state.active_package_class = val;
  },

  setMaxDestinations(state, val) {
    state.max_destinations = val;
  },

  setActiveVendorName(state, val) {
    state.active_vendor_name = val;
  },

  setActiveVendorDetails(state, val) {
    state.active_vendor_details = val;
  },

  setActiveOrderOption(state, val) {
    state.active_order_option = val;
  },

  setScheduleTime(state, val) {
    state.schedule_time = val;
  },

  setOrderNotes(state, val) {
    state.order_notes = val;
  },
  setPaymentMethod(state, val) {
    state.payment_method = val;
  },

  setOrderPath(state, val) {
    // state.order_path.splice(index,1);
    state.order_path.splice(val.index, val.index === 0 ? 0 : 1, val.path);
  },

  setLocationName(state, val) {
    // unset_location_name(val.index);
    state.location_names.splice(val.index, val.index === 0 ? 0 : 1, val.name);
  },

  unsetOrderPath(state, index) {
    state.order_path.splice(index, 1);
  },

  clearOrderPath(state) {
    state.order_path = [];
  },

  unsetLocationName(state, index) {
    state.location_names.splice(index, 1);
  },

  clearLocationNames(state) {
    state.location_names = [];
  },
  addExtraDestination(state) {
    state.extra_destinations++;
  },

  removeExtraDestination(state) {
    state.extra_destinations--;
  },

  clearExtraDestinations(state) {
    state.extra_destinations = 0;
  },

  setPickUpFilled(state, val) {
    state.pickup_filled = val;
  },

  setSavedCards(state, val) {
    state.saved_cards = val;
  },

  setStripeUserId(state, val) {
    state.stripe_user_id = val;
  },

  resetState(state) {
    Object.assign(state, getDefaultState());
  },

  setCarrierType(state, val) {
    state.carrier_type_id = val;
  },

  setReturnStatus(state, val) {
    state.return_status = val;
  },

  setMaxTemperature(state, val) {
    state.max_temperature = val;
  },

  setCustomerMinAmount(state, val) {
    state.customer_min_amount = val;
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
  setExtendOptions(state, val) {
    state.extended_options = val;
  },
  setOrderState(state, val) {
    state.order_state = val;
  },
  setPairWithRiderStatus(state, val) {
    state.pair_rider_status = val;
  },
  setPairSerialNumber(state, val) {
    state.pair_serial_number = val;
  },
  setPairRiderPhone(state, val) {
    state.pair_rider_phone = val;
  },
  setCountryCode(state, val) {
    state.country_code = val;
  },
  setDefaultCurrency(state, val) {
    state.default_currency = val;
  },
  setTestSpecs(state, val) {
    state.test_specs = val;
  },
  setLoadWeightValue(state, val) {
    state.load_weight_val = val;
  },
  setLoadWeightStatus(state, val) {
    state.load_weight_status = val;
  },
};
