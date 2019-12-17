// import axios from 'axios';
// import mqtt from 'mqtt';

const positions = [];

const fetchOngoingOrders = function fetchOngoingOrders({ commit, dispatch, rootState }) {
  const { session } = rootState;
  const data = { phone: `${session[session.default].user_phone}` };
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'ongoing_deliveries',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        commit('setOngoingOrders', response.data);
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const connectMqtt = function connectMqtt({ commit }) {
  for (let i = 0; i < positions.length; i += 1) {
    const vendor = positions[i];
    commit('setVendorMarkers', vendor);
  }
};

const intializeMqtt = function intializeMqtt() {
  return false;
};

const getOrderData = function getOrderData({ dispatch }, data) {
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'pending_delivery',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
        // handle failure to dispatch to global store
      },
    );
  });
};

export default {
  fetchOngoingOrders,
  connectMqtt,
  intializeMqtt,
  getOrderData,
};
