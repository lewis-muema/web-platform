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
  setDedicatedAccessStatus(state, data) {
    state.dedicated_access_status = data;
  },
  setDefaultCurrency(state, defaultCurrency) {
    state.default_currency = defaultCurrency;
  },
  deleteSession(state) {
    state.session = {};
  },
  setFCMToken(state, token) {
    state.fcm_token = token;
  },
  setFCMData(state, data) {
    state.fcm_data = data;
  },
  setRedirectStatus(state, status) {
    state.redirect_status = status;
  },
  setRedirectOrder(state, order) {
    state.redirect_order = order;
  },
  setNPSStatus(state, status) {
    state.nps_status = status;
  },
  setSecondaryProfile(state, status) {
    state.secondary_profile = status;
  },
  setPickUpFilledStatus(state, status) {
    state.pick_up_filled_status = status;
  },
  setLanguage(state, status) {
    state.language = status;
  },
  setScheduleStatus(state, status) {
    state.schedule_status = status;
  },
};
