

export default {
    getOrderHistoryOrders(state){
        return state.order_history_orders;
    },
    getPayments(state){
      return state.payments;
    },
    getStatement(state){
      return state.statement;
    },
    getCopUsers(state) {
      return state.cop_users;
    }
};
