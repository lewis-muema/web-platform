import axios from "axios";

const endpoint = "https://privateapitest.sendyit.com/v1/";

export default {
    requestSignIn({dispatch, commit, getters, rootGetters}, payload) {
        // let root_state = rootState;
        // console.log(root_state);

        console.log("payload", payload);
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(
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
    requestResetPassword(context, payload) {
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
  requestCheckToken(context, payload) {
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
