import axios from 'axios';

const endpoint = 'https://privateapitest.sendyit.com/v1/';

export default {
  requestSignIn({
    dispatch, commit, getters, rootGetters,
  }, payload) {
    // let root_state = rootState;
    // console.log(root_state);

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
  requestForgotPassword(context, payload) {
    // console.log("payload", payload);

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
  requestResetPassword(context, payload) {
    // console.log("payload", payload);

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
  requestSignUpCheck(context, payload) {
    // console.log("payload", payload);

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
  requestCheckToken(context, payload) {
    // console.log("payload", payload);

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
  requestSignUpSegmentation(context, payload) {
    // console.log("payload", payload);

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
  requestSignUpPhoneVerification({ commit, dispatch, rootGetters }, payload) {
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
  requestSignUpVerificationVerify({ commit, dispatch, rootGetters }, payload) {
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
