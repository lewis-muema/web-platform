const getFreightOrders = state => state.freight_orders;
const getDocumentUrl = state => state.document_url;
const getDocumentName = state => state.document_name;
const getDocumentDialog = state => state.document_dialog;
const getOrderDetail = state => state.order_id;
const getDeclineDocument = state => state.decline_doc;
const getDocumentDialogDocument = state => state.decline_dialog;

export default {
  getFreightOrders,
  getDocumentUrl,
  getDocumentName,
  getDocumentDialog,
  getOrderDetail,
  getDeclineDocument,
  getDocumentDialogDocument,
};
