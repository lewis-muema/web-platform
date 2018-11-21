export default {
    getMpesaLoadingStatus(state) {
        return state.mpesa_loading_status;
    },
    getMpesaFailStatus(state) {
        return state.mpesa_fail_status;
    },
    getMpesaSuccessStatus(state) {
        return state.mpesa_success_status;
    }
};
