/* eslint no-param-reassign: "error" */
import Vue from 'vue';

export default {
  setFreightOrders(state, orders) {
    state.freight_orders = orders;
  },
  setDocumentUrl(state, val) {
    state.document_url = val;
  },
  setDocumentName(state, val) {
    state.document_name = val;
  },
  setDocumentDialog(state, val) {
    state.document_dialog = val;
  },
  setOrderDetail(state, val) {
    state.order_details_state = val;
  },
  setDeclineDocument(state, val) {
    state.decline_doc = val;
  },
  setDocumentDialogDocument(state, val) {
    state.decline_dialog = val;
  },
  setAwardingDocumentOptions(state, val) {
    state.awarding_docs_options = val;
  },
  setLoadingDocumentOptions(state, val) {
    state.loading_docs_options = val;
  },
  setFulfillmentDocumentOptions(state, val) {
    state.fulfillment_docs_options = val;
  },
  setLoadingDocs(state, val) {
    state.loading_documents = val;
  },
  setLoadingDocumentDialog(state, val) {
    state.loading_dialog = val;
  },
  setShipmentDetail(state, val) {
    state.shipment_detail = val;
  },
  setUploadLoadingDocs(state, val) {
    state.upload_loading_docs_state = val;
  },
  setVehicleId(state, val) {
    state.vehicle_id = val;
  },
  setQuatationId(state, val) {
    state.quotation_id = val;
  },
  setReuploadDialog(state, val) {
    state.reupload_dialog = val;
  },
  setReUploadData(state, val) {
    state.reupload_data = val;
  },
  setTruckMarkers(state, payload) {
    const visible = true;
    const id = payload.vehicle_id;
    const value = {
      position: {
        lat: payload.lat,
        lng: payload.lng,
      },
      vendor_type: payload.vendor_type,
      // rotation: payload.bearing,
      time: payload.time,
      speed: payload.speed,
      visible,
    };
    Vue.set(state.freight_shipment.trucks, id, value);
  },
  clearTruckMarkers(state) {
    state.freight_shipment.trucks = {};
  },
  setTruckId(state, val) {
    state.truck_id = val;
  },
  setTrackingVehicles(state, val) {
    state.tracked_vehicles = val;
  },
  setTruckDetailsToStore(state, val) {
    state.truck_details = val;
  },
};
