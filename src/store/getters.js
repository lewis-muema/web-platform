/* eslint no-param-reassign: "error" */
/* eslint no-use-before-define: ["error", { "functions": false }] */
/* eslint no-restricted-syntax: ["error","WithStatement"] */
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
  getCountryCode(state) {
    return state.country_code;
  },
  getDefaultCurrency(state) {
    return state.default_currency;
  },
  getFCMToken(state) {
    return state.fcm_token;
  },
};

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
  }

  return true;
}
