

export default {
  getViewState(state){
        return state.view_state;
               },

  getViewStep(state){
          return state.view_step;
               },

  getHelpPanel(state){
            return state.help_panel;
               },

  getBizName(state){
              return state.biz_name;
                },

  getBizEmail(state){
                    return state.biz_email;
                },

  getType(state){
                  return state.type;

                },

  getBaseUrl(state){
                  return state.base_url;

                },
   getPerEmail(state){
                   return state.personal_email;

                 },
   getName(state){
                    return state.name;

                  },
   getDeptId(state){
                    return state.dept_id;

                  },

    getCopId(state){
                    return state.cop_id;

                  },
    getCopUserId(state){
                    return state.cop_user_id;

                  },
    getPhone(state){
                      return state.phone;

                  },
    getPass(state){
                        return state.password_plain;

                  }

};
