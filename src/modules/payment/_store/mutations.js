export default {
    setMpesaFailStatus(state, status) {
        state.mpesa_fail_status = status;
    },
    setMpesaSuccessStatus(state, status) {
        state.mpesa_success_status = status;
    },
    setMpesaLoadingStatus(state, status) {
        state.mpesa_loading_status = status;
    },
};
