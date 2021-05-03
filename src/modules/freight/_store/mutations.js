/* eslint no-param-reassign: "error" */
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
    state.order_id = val;
  },
  setDeclineDocument(state, val) {
    state.decline_doc = val;
  },
  setDocumentDialogDocument(state, val) {
    state.decline_dialog = val;
  },
};
