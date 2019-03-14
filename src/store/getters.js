/* eslint no-param-reassign: "error" */
/* eslint no-use-before-define: ["error", { "functions": false }] */
export default {
  getSession(state) {
    let { session } = state;
    if (process.browser) {
      if (isEmpty(session)) {
        // try and get from the ls
        session = localStorage.getItem('_sessionSnack');
        if (session !== null && session !== '') {
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
  },
};

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
  }

  return true;
}
