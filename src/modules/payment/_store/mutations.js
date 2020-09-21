/* eslint no-param-reassign: "error" */
export default {
  setMpesaFailStatus(state, status) {
    state.mpesa_fail_status = status;
  },
  setMpesaSuccessStatus(state, status) {
    state.mpesa_success_status = status;
  },
  setMpesaLoadingStatus(state, status) {
    state.mpesa_loading_status = status;
  },
  setCardFailStatus(state, status) {
    state.card_fail_status = status;
  },
  setCardSuccessStatus(state, status) {
    state.card_success_status = status;
  },
  setCardLoadingStatus(state, status) {
    state.card_loading_status = status;
  },
  setSavedCards(state, status) {
    state.saved_cards = status;
  },
  setStripeUserId(state, status) {
    state.stripe_user_id = status;
  },
  setActiveCurrency(state, status) {
    state.active_currency = status;
  },
  setCardPaymentStatus(state, status) {
    state.card_payment_status = status;
  },
};
