

export default {
    getOrderHistoryOrders(state){
        return state.order_history_orders;
    },
    getOrderHistoryOrderDetails: (state) => (order_id) => {
        return state.order_history_orders.find( order => order.order_no ===  order_id);
    }
};
