export default {
  getMpesaLoadingStatus(state) {
    return state.mpesa_loading_status;
  },
  getMpesaFailStatus(state) {
    return state.mpesa_fail_status;
  },
  getMpesaSuccessStatus(state) {
    return state.mpesa_success_status;
  },
  getCardLoadingStatus(state) {
    return state.card_loading_status;
  },
  getCardFailStatus(state) {
    return state.card_fail_status;
  },
  getCardSuccessStatus(state) {
    return state.card_success_status;
  }
};
