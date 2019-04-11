/* eslint no-param-reassign: "error" */
export default {
  setViewState(state, val) {
    state.view_state = val;
  },
  updateViewStep(state, val) {
    state.view_step = val;
  },
  updateName(state, val) {
    state.name = val;
  },
  updatePhone(state, val) {
    state.phone = val;
  },
  updateBizEmail(state, val) {
    state.biz_email = val;
  },
  updateBizName(state, val) {
    state.bizName = val;
  },
  updatePerEmail(state, val) {
    state.personal_email = val;
  },
  updatePassPlain(state, val) {
    state.password_plain = val;
  },
  updateDeptID(state, n) {
    state.dept_id = n;
  },
  updateCopID(state, n) {
    state.cop_id = n;
  },
  updateCopUserID(state, n) {
    state.cop_user_id = n;
  },
  updateInviteType(state, n) {
    state.invite_type = n;
  },
};
