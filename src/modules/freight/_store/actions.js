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
    dispatch('requestAxiosGet', payload, { root: true }).then(
      (response) => {
        let workingResponse = response;
        /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
        if (response.length > 1) {
          workingResponse = response[0];
        }
        if (workingResponse.data.status) {
          commit('setFreightOrders', workingResponse.data.data);
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
    dispatch('requestAxiosGet', payload, { root: true }).then(
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
    app: 'PARTNERS_APP',
    endpoint: 'transporters',
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
  return new Promise((resolve) => {
    dispatch('requestAxiosPut', payload, { root: true }).then(
      (response) => {
        let workingResponse = response;
        if (response.length > 1) {
          workingResponse = response[0];
        }

        resolve(workingResponse.data);
      },
      (error) => {
        resolve(error.response.data);
      },
    );
  });
};

const rateFreightOrder = function rateFreightOrder({ dispatch }, payload) {
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

const getOwnersDetail = function getOwnersDetail({ dispatch }, payload) {
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

const requestUsersList = function requestUsersList({ dispatch }, payload) {
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
const awardShipment = function awardShipment({ dispatch }, payload) {
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
const declineShipment = function declineShipment({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPatch', payload, {
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
const requestApproveApprover = function requestApproveApprover({ dispatch }, payload) {
  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPatch', payload, {
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
const requestApproversList = function requestApproversList({ dispatch }, payload) {
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

const getDocumentTypes = function getDocumentTypes({ dispatch }, payload) {
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
  getOwnersDetail,
  rateFreightOrder,
  requestUsersList,
  requestApproveApprover,
  requestApproversList,
  getDocumentTypes,
  awardShipment,
  declineShipment,
};
