import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  freight_orders: [],
  document_url: '',
  document_name: '',
  document_dialog: false,
  order_details_state: false,
  decline_doc: {},
  decline_dialog: false,
  awarding_docs_options: [],
  loading_docs_options: [],
  fulfillment_docs_options: [],
  loading_documents: [],
  loading_dialog: false,
  shipment_detail: {},
  upload_loading_docs_state: false,
  vehicle_id: '',
  quotation_id: '',
  reupload_dialog: false,
  reupload_data: [],
  freight_shipment: {
    trucks: {},
  },
  truck_id: '',
  tracked_vehicles: [],
  truck_details: {},
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
