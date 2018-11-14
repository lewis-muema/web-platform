
const getViewState = state => state.view_state;
const getDepartments = state => state.departments;
const getCopID = state => state.cop_id;
const getBaseUrl = state => state.base_url;
const getBizName = state => state.biz_name;
const getAdds = state => state.adds;
const getInviteLink = state => state.invite_link;
const getInvites = state => state.invites;
const getAddedStatus = state => state.added_status;
export default {
    getViewState,
    getCopID,
    getBaseUrl,
    getBizName,
    getDepartments,
    getAdds,
    getInviteLink,
    getInvites,
    getAddedStatus
};
