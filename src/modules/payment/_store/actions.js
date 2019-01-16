export default {
  requestPromoCodePayment({ dispatch, commit, getters, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, {
        root: true
      }).then(
        response => {
          console.log("in store dispatch to global store");
          resolve(response);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  requestCardPayment({ dispatch, commit, getters, rootGetters }, payload) {
    console.log("set loading status before dispatch");
    commit("setCardLoadingStatus", true);

    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, {
        root: true
      }).then(
        response => {
          commit("setCardLoadingStatus", false);
          if (response.length > 1) {
            response = response[0];
          }
          resolve(response);
        },
        error => {
          commit("setCardLoadingStatus", false);
          reject(error);
          console.log(
            "failed to dispatch request card payment to global store"
          );
        }
      );
    });
  },
  completeCardPaymentRequest(
    { dispatch, commit, getters, rootGetters },
    payload
  ) {
    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, {
        root: true
      }).then(
        response => {
          console.log("in store dispatch to global store");
          if (response.length > 1) {
            response = response[0];
          }
          resolve(response);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  resetCardPaymentRequest({ dispatch, commit, getters, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      commit("setCardLoadingStatus", false);
      commit("setCardFailStatus", false);
      commit("setCardSuccessStatus", false);
      resolve(true);
    });
  },

  requestMpesaPayment({ dispatch, commit, getters, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, { root: true }).then(
        response => {
          commit("setMpesaLoadingStatus", true);
          commit("setMpesaFailStatus", false);
          commit("setMpesaSuccessStatus", false);
          resolve(response);
        },
        error => {
          commit("setMpesaLoadingStatus", false);
          commit("setMpesaFailStatus", true);
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },

  completeMpesaPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaSuccessStatus", true);
      commit("setMpesaFailStatus", false);
      resolve(true);
    });
  },
  resetMpesaPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaFailStatus", false);
      commit("setMpesaSuccessStatus", false);
      resolve(true);
    });
  },

  terminateMpesaPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaFailStatus", true);
      commit("setMpesaSuccessStatus", false);
      resolve(true);
    });
  },

  requestRunningBalance({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, { root: true }).then(
        response => {
          if (response.status == 200) {
            let rb = response.data.running_balance;
            dispatch("updateRunningBalance", rb, { root: true });
          }
          resolve(response);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  requestAddNewCard({ dispatch, commit }, payload) {
    commit("setCardLoadingStatus", true);

    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, {
        root: true
      }).then(
        response => {
          commit("setCardLoadingStatus", false);
          resolve(response);
        },
        error => {
          commit("setCardLoadingStatus", false);
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  }
};
