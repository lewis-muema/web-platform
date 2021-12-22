/* eslint-disable prefer-destructuring */
export default {
  requestPromoCodePayment({ dispatch }, payload) {
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
  },
  requestCardPayment({ dispatch, commit }, payload) {
    commit('setCardLoadingStatus', true);

    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, {
        root: true,
      }).then(
        (response) => {
          let responseData = response;
          commit('setCardLoadingStatus', false);
          if (response.length > 1) {
            responseData = response[0];
          }
          resolve(responseData);
        },
        (error) => {
          commit('setCardLoadingStatus', false);
          reject(error);
        },
      );
    });
  },
  completeCardPaymentRequest({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, {
        root: true,
      }).then(
        (response) => {
          let responseData = response;
          if (response.length > 1) {
            responseData = response[0];
          }
          resolve(responseData);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  resetCardPaymentRequest({ commit }) {
    return new Promise((resolve) => {
      commit('setCardLoadingStatus', false);
      commit('setCardFailStatus', false);
      commit('setCardSuccessStatus', false);
      resolve(true);
    });
  },
  requestMpesaPayment({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          commit('setMpesaLoadingStatus', true);
          commit('setMpesaFailStatus', false);
          commit('setMpesaSuccessStatus', false);
          resolve(response);
        },
        (error) => {
          commit('setMpesaLoadingStatus', false);
          commit('setMpesaFailStatus', true);
          commit('setMpesaSuccessStatus', false);
          reject(error);
        },
      );
    });
  },

  completeMpesaPaymentRequest({ commit }) {
    return new Promise((resolve) => {
      commit('setMpesaLoadingStatus', false);
      commit('setMpesaSuccessStatus', true);
      commit('setMpesaFailStatus', false);
      resolve(true);
    });
  },
  resetMpesaPaymentRequest({ commit }) {
    return new Promise((resolve) => {
      commit('setMpesaLoadingStatus', false);
      commit('setMpesaFailStatus', false);
      commit('setMpesaSuccessStatus', false);
      resolve(true);
    });
  },

  terminateMpesaPaymentRequest({ commit }) {
    return new Promise((resolve) => {
      commit('setMpesaLoadingStatus', false);
      commit('setMpesaFailStatus', true);
      commit('setMpesaSuccessStatus', false);
      resolve(true);
    });
  },

  requestRunningBalance({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.status === 200) {
            const { data } = response;
            let rb = 0;
            if ('running_balance' in data) {
              rb = response.data.running_balance;
            } else {
              rb = response.data.data.running_balance;
            }
            dispatch('updateRunningBalance', rb, { root: true });
          }
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestAddNewCard({ dispatch, commit }, payload) {
    commit('setCardLoadingStatus', true);

    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, {
        root: true,
      }).then(
        (response) => {
          let responseData = response;
          commit('setCardLoadingStatus', false);
          if (response.length > 0) {
            responseData = response[0];
          }
          resolve(responseData);
        },
        (error) => {
          commit('setCardLoadingStatus', false);
          reject(error);
        },
      );
    });
  },
  requestSavedCards({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.status === 200) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          resolve(error.response.data);
        },
      );
    });
  },
  deleteSavedCard({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
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
  },
  requestCountryCode({ dispatch }, payload) {
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
  requestPaymentOptions({ dispatch }, payload) {
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
  paymentAxiosPost({ dispatch }, payload) {
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
  },
  paymentAxiosGet({ dispatch }, payload) {
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
  },
};
