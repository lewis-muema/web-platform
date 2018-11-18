export default {
    setENV(state, ENV){
        state.ENV = ENV;
    },
    setSession(state, session) {
        state.session = session;
    },
    setRunningBalance(state, running_balance) {
        state.running_balance = running_balance;
    }
};