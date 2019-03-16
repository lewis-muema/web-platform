export default {
  requestInvitation(context, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch('requestAxiosPost', payload).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestTokenValidation(context, payload) {
    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch('requestAxiosPost', payload).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestOnboardingPhoneVerification({ dispatch }, payload) {
    // console.log("payload", payload);

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
  requestOnboardingVerificationVerify({ dispatch }, payload) {
    // console.log("payload", payload);

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
