/* eslint no-param-reassign: "error" */
export default {
  setENV(state, ENV) {
    state.ENV = ENV;
  },
  setSession(state, session) {
    state.session = session;
  },
  setRunningBalance(state, runningBalance) {
    state.running_balance = runningBalance;
  },
  setNotification(state, notification) {
    state.notification = notification;
  },
  setNotificationStatus(state, notificationStatus) {
    state.notification_status = notificationStatus;
  },
  setSessDefault(state, type) {
    state.session.default = type;
  },
  setCountryCode(state, code) {
    state.country_code = code;
  },
  setDefaultCurrency(state, defaultCurrency) {
    state.default_currency = defaultCurrency;
  },
  deleteSession(state) {
    state.session = {};
  },
};
