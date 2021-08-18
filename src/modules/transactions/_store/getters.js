export default {
  getOrderHistoryOrders(state) {
    return state.order_history_orders;
  },
  getUserCurrencies(state) {
    return state.user_currencies;
  },
  getPayments(state) {
    return state.payments;
  },
  getStatement(state) {
    return state.statement;
  },
  getCopUsers(state) {
    return state.cop_users;
  },
  getFilterDataPayload(state) {
    return state.filter_data_payload;
  },
};
