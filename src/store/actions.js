import axios from "axios";

export default {
  requestAxiosPost({ state }, payload) {
    let url = state.ENV[payload.app];
    //add api key - if request is going to the backend
    if (payload.app == "BACKEND_CUSTOMERS_APP") {
      payload.endpoint =
        payload.endpoint + "?apikey=" + state.ENV["BACKEND_API_KEY"];
    }

    return new Promise((resolve, reject) => {
      axios
        .post(url + payload.endpoint, payload.values)
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
  }
};
