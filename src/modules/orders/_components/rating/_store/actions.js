/* eslint no-param-reassign: "error" */
/* eslint-disable prefer-destructuring */
export default {
  requestOrder({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          const responder = '';
          if (response.length > 1) {
            response = response[0];
          }
          if (response.data) {
            // commit('updateOrder',response.data.data);
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

  requestRatingStatus({ commit }, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch('requestAxiosPost', payload).then(
        (response) => {
          if (response.data.status) {
            commit('setRatingStatus', response.data.data);
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
  requestUpdateRating({ commit }, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch('requestAxiosPost', payload).then(
        (response) => {
          if (response.data.status) {
            commit('setRatingUpdate', response.data.data);
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
};
