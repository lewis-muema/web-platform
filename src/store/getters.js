export default {
    getSession(state){
        return state.session;
    },
    getRunningBalance(state) {
        return state.running_balance;
    },
    getNotificationStatus(state) {
        return state.notification_status;
    },
    getNotification(state) {
        return state.notification;
    }
};