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
            //get from local storage
            let jwtToken = localStorage.getItem('jwtToken');
            //the json is ok
            //set content type to json
            if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
                config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwtToken
                    }
                };

            }
            else if (payload.endpoint == "sign_up_check" || payload.endpoint == "sign_in" || payload.endpoint == "onboard_user" || payload.endpoint == "forgot_pass" || payload.endpoint == "forgot_token" || payload.endpoint == "sign_up_submit"|| payload.endpoint == "update_pass"|| payload.endpoint == "insert_rate"|| payload.endpoint == "onboard_details"|| payload.endpoint == "pending_delivery") {
                config = {
                    headers: {
                        "Content-Type": "application/json"
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
            let jwtToken = localStorage.getItem('jwtToken');
            payload.values = '"' + payload.values + '"';
            if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
                config = {headers: {
                    "Content-Type": "text/plain",
                    "Authorization": jwtToken
                }};

            }
            else if (payload.endpoint == "sign_up_check" || payload.endpoint == "sign_in" || payload.endpoint == "onboard_user" || payload.endpoint == "forgot_pass" || payload.endpoint == "forgot_token" || payload.endpoint == "sign_up_submit"|| payload.endpoint == "update_pass"|| payload.endpoint == "insert_rate"|| payload.endpoint == "onboard_details"|| payload.endpoint == "pending_delivery") {

                config = {
                    headers: {
                        "Content-Type": "text/plain"

                    }
                };
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
