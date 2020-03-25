export default {
  requestEmail(state) {
    return state.email;
  },
  requestPassword(state) {
    return state.password;
  },
  requestPhone(state) {
    return state.phone;
  },
  requestName(state) {
    return state.name;
  },
  getUserCountryCode(state) {
    return state.country_code;
  },
  getVerificationRequestId(state) {
    return state.request_id;
  },
  getViewState(state) {
    return state.view_state;
  },
  getActiveTab(state) {
    return state.activeTab;
  },
};
