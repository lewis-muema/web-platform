export default {
  requestPriceQuote({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            const priceRequestObject = response.data.values;
            commit('setPriceRequestObject', priceRequestObject);

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
  requestFreightProductCategories({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosGet', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
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
  requestOrderCompletion({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
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

  requestDedicatedOrderCompletion({ dispatch }, payload) {
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
          reject(error);
        },
      );
    });
  },

  requestPairRider({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response.status === 400) {
            const notification = {
              title: 'Rider Pairing Failure!',
              level: 2,
              message: error.response.data.message,
            };
            commit('setNotification', notification, { root: true });
            commit('setNotificationStatus', true, { root: true });
          }
          reject(error);
        });
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
};
