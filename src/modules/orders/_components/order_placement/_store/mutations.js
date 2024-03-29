const getDefaultState = () => ({
  active_package_class: '',
  active_vendor_name: '',
  active_order_option: '',
  price_request_object: {},
  max_destinations: 24,
  order_path: [],
  location_names: [],
  saved_cards: [],
  schedule_time: '',
  schedule_end_time: '',
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
  no_of_loaders: 0,
  product_categories: [],
  product_id: 1,
  product_phase: 1,
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

  setScheduleEndTime(state, val) {
    state.schedule_end_time = val;
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
  setPairWithRiderState(state, val) {
    state.pair_rider_state = val;
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
  setVendorPrice(state, val) {
    state.active_vendor_details.cost = val;
  },
  setProductCategories(state, val) {
    state.product_categories.splice(val.index, val.index === 0 ? 0 : 1, val.data);
  },
  setProductId(state, val) {
    state.product_id = val;
  },
  setProductPhase(state, val) {
    state.product_phase = val;
  },
  setVehicleDetails(state, val) {
    state.vehicle_plate = val;
  },
  setPairErrorMessage(state, val) {
    state.pair_error_msg = val;
  },
  setInstructionNotes(state, val) {
    state.instruction_notes = val;
  },
  clearInstructionNotes(state) {
    state.instruction_notes = [];
  },
  setInterCountySenderInfo(state, val) {
    state.inter_county_order_details.sender_info = val;
  },
  setIntercountyLoadType(state, val) {
    state.inter_county_order_details.package_type = val;
  },
  setIntercountyParcelSize(state, val) {
    state.inter_county_order_details.approximate_weight = val;
  },
  setInterCountyRecipientInfo(state, val) {
    state.inter_county_order_details.recipient_info = val;
  },
  setInterCountyWaypointInfo(state, val) {
    state.inter_county_order_details.pickup_waypoint_instructions = val;
  },
  setInterCountyPickUpStatus(state, val) {
    state.inter_county_order_details.pickup_delivery_status = val;
  },
  setInterCountyPickUpId(state, val) {
    state.inter_county_order_details.pickup_pricing_uuid = val;
  },
  setInterCountyDeliveryStatus(state, val) {
    state.inter_county_order_details.destination_delivery_status = val;
  },
  setInterCountyDeliveryId(state, val) {
    state.inter_county_order_details.destination_pricing_uuid = val;
  },
  setInterCountyDeliveryMode(state, val) {
    state.inter_county_order_details.destination_delivery_mode = val;
  },
};
