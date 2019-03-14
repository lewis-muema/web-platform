export default {
  requestOrderHistoryOrders({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.length > 1) {
            response = response[0];
          }
          if (response.data.status) {
            commit('setOrderHistoryOrders', response.data.data);
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

  requestCopUsers({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.length > 1) {
            response = response[0];
          }
          if (response.data.status) {
            commit('setCopUsers', response.data.data);
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
  requestPayments({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setPayments', response.data.data);
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
};
