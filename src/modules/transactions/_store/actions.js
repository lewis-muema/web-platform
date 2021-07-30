/* eslint-disable prefer-destructuring */
export default {
  requestOrderHistoryOrders({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }
          if (workingResponse.data.status) {
            commit('setOrderHistoryOrders', workingResponse.data.data);
            commit('setUserCurrencies', workingResponse.data.currencies);
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
  },

  requestCopUsers({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }
          if (workingResponse.data.status) {
            commit('setCopUsers', workingResponse.data.data);
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
  },
  requestPayments({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setPayments', response.data.data);
            commit('setUserCurrencies', response.data.currencies);
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
  },
  requestStatement({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setStatement', response.data.data);
            commit('setUserCurrencies', response.data.currencies);
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
  },
  requestDisputeDeliveryDocs({ dispatch }, payload) {
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
  },
  requestDisputeStatus({ dispatch }, payload) {
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
  },
  requestDisputeDocStatus({ dispatch }, payload) {
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
  },
};
