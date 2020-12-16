/* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

const updateFreightStatus = function updateFreightStatus({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        let workingResponse = response;
        if (response.length > 1) {
          workingResponse = response[0];
        }

        resolve(workingResponse.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const requestFreightStatus = function requestFreightStatus({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosGet', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const createFreightOrder = function createFreightOrder({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const requestFreightOrders = function requestFreightOrders({ commit, dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        let workingResponse = response;
        /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
        if (response.length > 1) {
          workingResponse = response[0];
        }
        if (workingResponse.data.status) {
          commit('setFreightOrders', workingResponse.data.orders);
          resolve(workingResponse.data);
        } else {
          reject(workingResponse.data);
        }
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const getFreightOrderDetail = function getFreightOrderDetail({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};
const getOwnersListing = function getOwnersListing({ dispatch }) {
  const payload = {
    app: 'ORDERS_APP',
    endpoint: 'v2/freight/owners',
  };
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosGet', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const getCargoTypes = function getCargoTypes({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosGet', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const getCarrierTypes = function getCarrierTypes({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosGet', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const getFilteredOwnersListing = function getFilteredOwnersListing({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const approveDocument = function approveDocument({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPatch', payload, { root: true }).then(
      (response) => {
        let workingResponse = response;
        if (response.length > 1) {
          workingResponse = response[0];
        }

        resolve(workingResponse.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const sendCustomerQuote = function sendCustomerQuote({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

const requestActivity = function requestActivity({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        resolve(response.data);
      },
      (error) => {
        reject(error);
      },
    );
  });
};

export default {
  updateFreightStatus,
  requestFreightStatus,
  createFreightOrder,
  requestFreightOrders,
  getFreightOrderDetail,
  getOwnersListing,
  getCargoTypes,
  getCarrierTypes,
  getFilteredOwnersListing,
  approveDocument,
  sendCustomerQuote,
  requestActivity,
};
