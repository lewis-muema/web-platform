/* eslint no-param-reassign: "error" */
export default {
  setOrderHistoryOrders(state, orders) {
    state.order_history_orders = orders;
  },
  setUserCurrencies(state, currencies) {
    state.user_currencies = currencies;
  },
  setCopUsers(state, users) {
    state.cop_users = users;
  },
  setPayments(state, payments) {
    state.payments = payments;
  },
  setStatement(state, statement) {
    state.statement = statement;
  },
  setFilterDataPayload(state, payload) {
    state.filter_data_payload = payload;
  },
};
