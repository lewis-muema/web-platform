

export default {
    setViewState(state, val) {
        state.view_state = val;
    },
    updateBaseUrl(state, n) {
        state.base_url = n
    },
    updateCopID(state, n) {
        state.cop_id = n
    },
    updateViewState(state, n) {
        state.view_state = n
    },
    updateBizName(state, n) {
        state.biz_name = n
    },
    updateDepartments(state, n) {
        state.departments = n
    },
    updateAdds(state, n) {
        if (n === 1) {
            state.adds ++
        }
        else {
            state.adds --
        }
    },
    newAdds(state , n) {
        state.adds = n
    },
    updateInviteLink(state , n)
    {
        state.invite_link = n
    },
    updateInvites(state , n){
        state.invites = n
    },
    updateAddedStatus(state , n){
        state.added_status = n
    }
};
