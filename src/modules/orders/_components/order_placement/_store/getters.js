export default {
  getPriceRequestObject: state => state.price_request_object,
  getActivePackageClass: state => state.active_package_class,
  getActiveVendorName: state => state.active_vendor_name,
  getActiveVendorDetails: state => state.active_vendor_details,
  getActiveOrderOption: state => state.active_order_option,
  getScheduleTime: state => state.schedule_time,
  getScheduleEndTime: state => state.schedule_end_time,
  getOrderNotes: state => state.order_notes,
  getOrderPath: state => state.order_path,
  getLocationNames: state => state.location_names,
  getMaxDestinations: state => state.max_destinations,
  getExtraDestinations: state => state.extra_destinations,
  getPickupFilled: state => state.pickup_filled,
  getPaymentMethod: state => state.payment_method,
  getSavedCards: state => state.saved_cards,
  getStripeUserId: state => state.stripe_user_id,
  getCarrierType: state => state.carrier_type_id,
  getReturnStatus: state => state.return_status,
  getMaxTemperature: state => state.max_temperature,
  getCustomerMinAmount: state => state.customer_min_amount,
  getDeliveryItem: state => state.delivery_item,
  getLoadWeight: state => state.load_weight,
  getLoadUnits: state => state.load_units,
  getAdditionalLoaderStatus: state => state.additional_loader,
  getNOOfLoaders: state => state.no_of_loaders,
  getOrderState: state => state.order_state,
  getExtendedOptions: state => state.extended_options,
  getPairWithRiderStatus: state => state.pair_rider_status,
  getPairSerialNumber: state => state.pair_serial_number,
  getPairRiderPhone: state => state.pair_rider_phone,
  getCountryCode: state => state.country_code,
  getDefaultCurrency: state => state.default_currency,
  getTestSpecs: state => state.test_specs,
  getLoadWeightStatus: state => state.load_weight_status,
  getLoadWeightValue: state => state.load_weight_val,
  getProductCategories: state => state.product_categories,
  getProductPhase: state => state.product_phase,
  getProductId: state => state.product_id,
  getVehicleDetails: state => state.vehicle_plate,
  getPairWithRiderState: state => state.pair_rider_state,
};
