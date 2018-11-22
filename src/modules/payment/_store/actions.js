export default {
  requestPromoCodePayment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
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
  requestCardPayment({ commit }, payload) {
    console.log("set loading status before dispatch");
    commit("setCardLoadingStatus", true);

    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
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
  terminateCardPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setCardLoadingStatus", false);
      commit("setCardFailStatus", true);
      commit("setCardSuccessStatus", false);
      resolve(true);
    });
  },
  completeCardPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setCardLoadingStatus", false);
      commit("setCardSuccessStatus", true);
      commit("setCardFailStatus", false);
      resolve(true);
    });
  },
  resetCardPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setCardLoadingStatus", false);
      commit("setCardFailStatus", false);
      commit("setCardSuccessStatus", false);
      resolve(true);
    });
  },

  requestMpesaPayment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
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
  terminateMpesaPaymentRequest({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("setMpesaLoadingStatus", false);
      commit("setMpesaFailStatus", true);
      commit("setMpesaSuccessStatus", false);
      resolve(true);
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

  requestRunningBalance({ commit,dispatch,rootGetters }, payload) {
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
