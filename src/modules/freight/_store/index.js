import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  freight_orders: [],
  document_url: '',
  document_name: '',
  document_dialog: false,
  order_id: '',
  decline_doc: {},
  decline_dialog: false,
  awarding_docs_options: [],
  loading_docs_options: [],
  fulfillment_docs_options: [],
  loading_documents: [],
  loading_dialog: false,
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
