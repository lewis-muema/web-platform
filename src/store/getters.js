export default {
  getSession(state) {
    let session = state.session;
    if (process.browser) {
      if (isEmpty(session) == true) {
        //try and get from the ls
        session = localStorage.getItem("_sessionSnack");
        if (session !== null && session !== "") {
          state.session = JSON.parse(session);
        }
      }
    }
    return state.session;
  },
  getRunningBalance(state) {
    return state.running_balance;
  },
  getNotificationStatus(state) {
    return state.notification_status;
  },
  getNotification(state) {
    return state.notification;
  },
  getENV(state) {
    return state.ENV;
  }
};

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}
