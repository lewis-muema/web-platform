/* eslint no-param-reassign: "error" */
export default {
  setPassword(state, val) {
    state.password = val;
  },
  setPhone(state, val) {
    state.phone = val;
  },
  setEmail(state, val) {
    state.email = val;
  },
  setName(state, val) {
    state.name = val;
  },
  setUserCountryCode(state, val) {
    state.country_code = val;
  },
  setVerificationRequestId(state, val) {
    state.request_id = val;
  },
  setActiveTab(state, val) {
    state.activeTab = val;
  },
  setViewState(state, val) {
    state.view_state = val;
  },
};
