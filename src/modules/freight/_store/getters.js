const getFreightOrders = state => state.freight_orders;
const getDocumentUrl = state => state.document_url;
const getDocumentName = state => state.document_name;
const getDocumentDialog = state => state.document_dialog;
const getOrderDetail = state => state.order_details_state;
const getDeclineDocument = state => state.decline_doc;
const getDocumentDialogDocument = state => state.decline_dialog;
const getLoadingDocs = state => state.loading_documents;
const getLoadingDocumentDialog = state => state.loading_dialog;
const getShipmentDetail = state => state.shipment_detail;
const getUploadLoadingDocs = state => state.upload_loading_docs_state;
const getLoadingDocumentOptions = state => state.loading_docs_options;
const getVehicleId = state => state.vehicle_id;
const getQuatationId = state => state.quotation_id;
const getReuploadDialog = state => state.reupload_dialog;
const getReUploadData = state => state.reupload_data;
const getShipmentTrucks = state => state.freight_shipment.trucks;
const getTruckId = state => state.truck_id;
const getAllocatedTrucks = state => state.tracked_vehicles;
const getTruckDetailsFromStore = state => state.truck_details;
const getVerificationStep = state => state.verification_step;
const getVerificationStage = state => state.verification_stage;

export default {
  getFreightOrders,
  getDocumentUrl,
  getDocumentName,
  getDocumentDialog,
  getOrderDetail,
  getDeclineDocument,
  getDocumentDialogDocument,
  getLoadingDocs,
  getLoadingDocumentDialog,
  getShipmentDetail,
  getUploadLoadingDocs,
  getLoadingDocumentOptions,
  getVehicleId,
  getQuatationId,
  getReuploadDialog,
  getReUploadData,
  getShipmentTrucks,
  getTruckId,
  getAllocatedTrucks,
  getTruckDetailsFromStore,
  getVerificationStep,
  getVerificationStage,
};
