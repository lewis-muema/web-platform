import axios from "axios";

const endpoint = "https://privateapitest.sendyit.com/v1/";

export default {
    requestSignIn({dispatch, commit, getters, rootGetters}, payload) {
        // let root_state = rootState;
        // console.log(root_state);

        // console.log("payload", payload);

        // return new Promise((resolve, reject) => {
        //   dispatch("requestAxiosPost", payload, { root: true }).then(
        //     response => {
        //       console.log("in store dispatch to global store");
        //       resolve(response.data);
        //     },
        //     error => {
        //       reject(error);
        //       console.log("failed to dispatch to global store");
        //     }
        //   );
        // });
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnb3JvIiwicGF5bG9hZCI6eyJwZWVyIjp7InN0YXR1cyI6ZmFsc2UsInVzZXJfaWQiOm51bGwsInVzZXJfbmFtZSI6bnVsbCwidXNlcl9lbWFpbCI6bnVsbCwidXNlcl9waG9uZSI6bnVsbCwidXNlcl9wcm9tbyI6bnVsbCwicGF5X29wdGlvbiI6MSwicGF5X21ldGhvZCI6MX0sImJpeiI6eyJzdGF0dXMiOnRydWUsInVzZXJfaWQiOjEsInVzZXJfbmFtZSI6IkZhaXRoc2hvcCA5MCIsInVzZXJfZW1haWwiOiJmYWl0aHNob3BAZ21haWwuY29tIiwidXNlcl9waG9uZSI6IjA3MDk3Nzk3NzkiLCJ1c2VyX3Byb21vIjoiOUFMRUVNIiwicGF5X29wdGlvbiI6MiwicGF5X21ldGhvZCI6MSwiY29wX2lkIjo2NjksImNvcF9uYW1lIjoiRmFpdGggc2hvcCIsInVzZXJfdHlwZSI6Mn0sImRlZmF1bHQiOiJiaXoiLCJmaXJzdF90aW1lIjpmYWxzZX0sInN1YiI6Im9wZW4gc2VzYW1lIn0.-ZOTAspOEfG7cxuXDceNbva61xoka--AMrL9PN0dB4c"
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
