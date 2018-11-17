

export default {
  setViewState(state, val){
      state.view_state= val;
    },
    updateViewStep(state, val){
        state.view_step= val;
      },
    updateName(state, val){
        state.name= val;
      },
    updatePhone(state, val){
        state.phone= val;
      },
    updateBizEmail(state, val){
          state.biz_email= val;
        },
    updatePerEmail(state, val){
          state.personal_email= val;
        },
    updatePassPlain(state, val){
          state.password_plain= val;
        }
};
