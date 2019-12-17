/* eslint no-param-reassign: "error" */
export default {
  setOrderHistoryOrders(state, orders) {
    state.order_history_orders = orders;
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
};
