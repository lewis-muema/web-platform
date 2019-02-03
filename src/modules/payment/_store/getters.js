export default {
  getMpesaLoadingStatus: state => state.mpesa_loading_status,
  getMpesaFailStatus: state => state.mpesa_fail_status,
  getMpesaSuccessStatus: state => state.mpesa_success_status,
  getCardLoadingStatus: state => state.card_loading_status,
  getCardFailStatus: state => state.card_fail_status,
  getCardSuccessStatus: state => state.card_success_status,
  getSavedCards: state => state.saved_cards,
  getStripeUserId: state => state.stripe_user_id,
};
