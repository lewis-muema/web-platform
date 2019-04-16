/* eslint no-param-reassign: "error" */
export default {
  setViewState(state, val) {
    state.view_state = val;
  },
  updateBaseUrl(state, n) {
    state.base_url = n;
  },
  updateCopID(state, n) {
    state.cop_id = n;
  },
  updateViewState(state, n) {
    state.view_state = n;
  },
  updateBizName(state, n) {
    state.biz_name = n;
  },
  updateAdds(state, n) {
    if (n === 1) {
      state.adds += 1;
    } else {
      state.adds -= 1;
    }
  },
  newAdds(state, n) {
    state.adds = n;
  },
  updateInviteLink(state, n) {
    state.invite_link = n;
  },
  updateInvites(state, n) {
    state.invites = n;
  },
  updateAddedStatus(state, n) {
    state.added_status = n;
  },
  updateUsersList(state, users) {
    state.users_list = users;
  },
  updateDepartmentsList(state, departments) {
    state.departments_list = departments;
  },
  updateKeysList(state, keys) {
    state.keys_list = keys;
  },
  updateCopUserId(state, n) {
    state.cop_user_id = n;
  },
  updateUserName(state, n) {
    state.user_name = n;
  },
  updateUserEmail(state, n) {
    state.user_email = n;
  },
  updateUserPhone(state, n) {
    state.user_phone = n;
  },
  updateType(state, n) {
    state.type = n;
  },
};
