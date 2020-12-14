// import axios from 'axios';
// import mqtt from 'mqtt';

const updateFreightStatus = function updateFreightStatus({ dispatch }, payload) {
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

export default {
  updateFreightStatus,
  requestFreightStatus,
  createFreightOrder,
  requestFreightOrders,
};
