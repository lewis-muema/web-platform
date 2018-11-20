import axios from "axios";

const endpoint = "https://privateapitest.sendyit.com/v1/";

export default {
  requestSignIn(context, payload) {
    console.log("payload", payload);

    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
        response => {
          console.log("in store dispatch to global store");
            resolve(response.data);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  requestForgotPassword(context, payload) {
    console.log("payload", payload);
    console.log("context", context);
    return new Promise((resolve, reject) => {
      axios
        .post(endpoint + "", payload)
        .then(response => {
          if (response.data.status == true) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  requestResetPassword(context, payload) {
    console.log("payload", payload);
    console.log("context", context);
    return new Promise((resolve, reject) => {
      axios
        .post(endpoint + "", payload)
        .then(response => {
          if (response.data.status == true) {
            resolve(response.data);
          } else {
            reject(response.data);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  requestSignUpCheck(context, payload) {
    console.log("payload", payload);

    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
        response => {
          console.log("in store dispatch to global store");
            resolve(response.data);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  requestPeerSignUp(context, payload) {
    console.log("payload", payload);

    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
        response => {
          console.log("in store dispatch to global store");
            resolve(response.data);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
  requestCopSignUp(context, payload) {
    console.log("payload", payload);

    return new Promise((resolve, reject) => {
      payload.vm.$store.dispatch("requestAxiosPost", payload).then(
        response => {
          console.log("in store dispatch to global store");
            resolve(response.data);
        },
        error => {
          reject(error);
          console.log("failed to dispatch to global store");
        }
      );
    });
  },
};
