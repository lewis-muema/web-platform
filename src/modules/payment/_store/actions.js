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
          resolve(response);
        },
        error => {
          reject(error);
          console.log(
            "failed to dispatch request card payment to global store"
          );
        }
      );
    });
  },
  terminateCardPaymentRequest(
    { dispatch, commit, getters, rootGetters },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("setCardLoadingStatus", false);
      commit("setCardFailStatus", true);
      commit("setCardSuccessStatus", false);
      resolve(true);
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
          resolve(response);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );

      resolve(true);
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
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  terminateMpesaPaymentRequest(
    { dispatch, commit, getters, rootGetters },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaFailStatus", true);
      commit("setMpesaSuccessStatus", false);
      resolve(true);
    });
  },
  completeMpesaPaymentRequest(
    { dispatch, commit, getters, rootGetters },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaSuccessStatus", true);
      commit("setMpesaFailStatus", false);
      resolve(true);
    });
  },
  resetMpesaPaymentRequest(
    { dispatch, commit, getters, rootGetters },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaFailStatus", false);
      commit("setMpesaSuccessStatus", false);
      resolve(true);
    });
  },

  requestRunningBalance({ dispatch, commit, getters, rootGetters }, payload) {
    return new Promise((resolve, reject) => {
      dispatch("requestAxiosPost", payload, { root: true }).then(
        response => {
          resolve(response);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  }
};
