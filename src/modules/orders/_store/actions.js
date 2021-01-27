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
        if (response.status) {
          commit('setOngoingOrders', response.data);
        } else {
          commit('setOngoingOrders', []);
        }
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

const riderDetails = function riderDetails({ dispatch }, data) {
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'last_partner_position',
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

const requestCountryCode = function requestCountryCode({ dispatch }, data) {
  const payload = {
    app: 'PRIVATE_API',
    endpoint: 'geocountry',
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

const requestCopInfo = function requestCopInfo({ dispatch }, values) {
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'update_cop',
    values,
  };
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
        // handle failure to dispatch to global store
      },
    );
  });
};
const requestIndustries = function requestIndustries({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosGet', payload, { root: true }).then(
      (response) => {
        if (response.status === 200) {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const requestPromoCodePayment = function requestPromoCodePayment({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const updateSocialApprovalStatus = function updateSocialApprovalStatus({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPatch', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

export default {
  fetchOngoingOrders,
  connectMqtt,
  intializeMqtt,
  getOrderData,
  riderDetails,
  requestCountryCode,
  requestCopInfo,
  requestIndustries,
  requestPromoCodePayment,
  updateSocialApprovalStatus,
};
