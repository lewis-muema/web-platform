export default {
  requestPriceQuote({ commit, dispatch, rootGetters }, payload) {
    // console.log("payload", payload);

    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          console.log('in store dispatch to global store');
          if (response.data.status) {
            const priceRequestObject = response.data.values;
            commit('set_price_request_object', priceRequestObject);
            // commit("$_orders/set_polyline", response.data.values.polyline[0], {
            //   root: true
            // });
            // console.log("set_polyline", response.data.values.polyline[0]);

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

  requestOrderCompletion({ commit, dispatch, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          // console.log("in store dispatch to global store");
          if (response.data.status) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
          // console.log("failed to dispatch to global store", error);
        },
      );
    });
  },

  requestSavedCards({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          // console.log("in store dispatch to global store");
          if (response.status === 200) {
            resolve(response.data);
          } else {
            // console.log("response not true");
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
          // console.log("failed to dispatch to global store");
        },
      );
    });
  },
};
