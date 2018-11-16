import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
    cop_users: [],
    order_history_orders : [],
    payments: [
      {
        "Method": "Mpesa",
        "Txn": "AC31NK346-6DK",
        "Description": "Order Payment",
        "Amount": 240,
        "Date": "2018-11-15 09:54:00",
      },
      {
        "Method": "Mpesa",
        "Txn": "AC31NK346-6DK",
        "Description": "Order Payment",
        "Amount": 240,
        "Date": "2018-11-15 09:54:00",
      }
    ],
    statement: [
      {
        "Method": "Mpesa",
        "Txn": "AC31NK346-6DK",
        "Description": "Order Payment",
        "Amount": 240,
        "Date": "2018-11-15 09:54:00",
      },
      {
        "Method": "Mpesa",
        "Txn": "AC31NK346-6DK",
        "Description": "Order Payment",
        "Amount": 240,
        "Date": "2018-11-15 09:54:00",
      }
    ],
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
