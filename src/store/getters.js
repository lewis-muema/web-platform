export default {
  getSession(state) {
    let session = state.session;
    if (process.browser) {
      if (isEmpty(session) == true) {
        //try and get from the cookie
        session = getSessionCookie();
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

function getSessionCookie() {
  var nameEQ = "_sessionSnack" + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
    }
    return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}
