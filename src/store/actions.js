import axios from "axios";

export default {
    requestAxiosPost({state, commit}, payload) {
        let url = state.ENV[payload.app];
        //add api key - if request is going to the backend
        if (payload.app == "BACKEND_CUSTOMERS_APP") {
            payload.endpoint = payload.endpoint + "?apikey=" + state.ENV["BACKEND_API_KEY"];
        }
        let config = {};

        //check if payload is a string here and change the content type
        if ("params" in payload) {
            payload.values = payload.params;
            if(typeof  payload.params === 'object'){
                 payload.values = JSON.stringify(payload.params);
            }
        } else {
            //assume we used values
            if(typeof payload.values === 'object'){
                payload.values = JSON.stringify(payload.values);
            }
        }
        let jwtToken = localStorage.getItem('jwtToken');
        let requestedPayload = payload.endpoint;
        let externalEndpoints = ['sign_up_check', 'sign_in', 'onboard_user', 'forgot_pass', 'forgot_token', 'sign_up_submit', 'onboard_details', 'update_pass', 'pending_delivery', 'insert_rate'];
        if (
            /^[\],:{}\s]*$/.test(
                payload.values
                    .replace(/\\["\\\/bfnrtu]/g, "@")
                    .replace(
                        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                        "]"
                    )
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
            )
        ) {
            //the json is ok
            //set content type to json
            if(externalEndpoints.includes(requestedPayload)){
                console.log("trueee", requestedPayload)
                config = {
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
            }
            else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
                config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwtToken
                    }
                };

            }
            else{
                let notification = {"title":"Your session has expired!", "level":2, "message":"Please log out and log in again."};
                commit("setNotification", notification);
                commit("setNotificationStatus", true);
                return true;
            }
        } else {
            //the json is not ok
            // assume it is just a string
            // add quotes to the string
            payload.values = '"' + payload.values + '"';

            if(externalEndpoints.includes(requestedPayload)){
                config = {
                    headers: {
                        "Content-Type": "text/plain"

                    }
                };
            }
            else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
                config = {headers: {
                    "Content-Type": "text/plain",
                    "Authorization": jwtToken
                }};

            }
            else{
                let payload = {"title":"Your session has expired!", "level":2, "message":"Please log out and log in again."};
                commit("setNotification", payload);
                commit("setNotificationStatus", true);
                return true;
            }
        }

        return new Promise((resolve, reject) => {
            axios
                .post(url + payload.endpoint, payload.values , config)
                .then(response => {
                    resolve(response);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },

    show_notification({commit}, payload) {
        commit("setNotification", payload);
        commit("setNotificationStatus", true);
        return true;
    },
    updateRunningBalance({commit}, rb) {
        commit("setRunningBalance", rb);
        return true;
    },
    requestRunningBalance({ dispatch , commit }, payload) {
        return new Promise((resolve, reject) => {
          dispatch("requestAxiosPost", payload, { root: true }).then(
            response => {
              if (response.status == 200) {
                let rb = response.data.running_balance;
                commit("setRunningBalance", rb);
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
};
