import axios from "axios";

export default {
  requestAxiosPost({ state }, payload) {
    let url = state.ENV[payload.app];
    //add api key - if request is going to the backend
    if (payload.app == "BACKEND_CUSTOMERS_APP") {
      payload.endpoint =
        payload.endpoint + "?apikey=" + state.ENV["BACKEND_API_KEY"];
    }
    let config = {};

    //check if payload is a string here and change the content type

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
      config = { headers: { "Content-Type": "application/json" } };
    } else {
      //the json is not ok
      // assume it is just a string
      // add qoutes to the string
      payload.values = '"' + payload.values + '"';
      config = { headers: { "Content-Type": "text/plain" } };
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url + payload.endpoint, payload.values, config)
        .then(response => {
          resolve(response);
        })
        .catch(e => {
          reject(e);
        });
    });
  },

  show_notification({ commit }, payload) {
    console.log("dispatching notification to the store");
    commit("setNotification", payload);
    commit("setNotificationStatus", true);
    return true;
  },
  updateRunningBalance({ commit }, rb) {
    commit("setRunningBalance", rb);
    return true;
  }
};
