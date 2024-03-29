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
          resolve(error.response.data);
        },
      );
    });
  },

  requestPairRider({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
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
