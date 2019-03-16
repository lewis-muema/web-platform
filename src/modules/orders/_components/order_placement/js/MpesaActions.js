/* eslint no-param-reassign: "error" */
export default {
  /* start mpesa */

  requestMpesaPayment() {
    const session = this.$store.getters.getSession;
    let referenceNumber = 'SENDY';
    let copId = 0;
    let userId = 0;
    let userEmail = '';
    let userPhone = '';
    if (session.default === 'biz') {
      referenceNumber += session.biz.cop_id;
      copId = session.biz.cop_id;
      userId = session.biz.user_id;
      userEmail = session.biz.user_email;
      userPhone = session.biz.user_phone;
    } else {
      referenceNumber = session.peer.user_phone;
      userId = session.peer.user_id;
      userEmail = session.peer.user_email;
      userPhone = session.peer.user_phone;
    }
    // TOOD: add cop_id to refrence if cop account
    // pass the phone no if peer
    const mpesaPayload = {
      amount: this.order_cost,
      sourceMobile: userPhone,
      referenceNumber,
      userId,
      copId,
      phone: userPhone,
      email: userEmail,
    };

    // TODO: implement the discount bundles if needed

    const fullPayload = {
      values: mpesaPayload,
      app: 'NODE_PRIVATE_API',
      endpoint: 'initiate_mpesa',
    };

    this.payment_state = 'requesting Mpesa Payment';

    this.requestMpesaPaymentAction(fullPayload).then(
      (response) => {
        if (response.status === 200) {
          // request poll here
          this.requestMpesaPaymentPoll();
        }
        this.payment_state = 'Mpesa Payment Success';
      },
      () => {
        this.payment_state = 'Mpesa Payment Failed';
      },
    );
  },

  requestMpesaPaymentPoll() {
    const session = this.$store.getters.getSession;
    let copId = 0;
    if (session.default === 'biz') {
      copId = session.biz.cop_id;
    }
    const oldRb = this.$store.getters.getRunningBalance;
    // const requestedAmount = this.order_cost;

    const runningBalancePayload = {
      values: {
        copId,
        user_phone: session[session.default].user_phone,
      },
    };

    const payload = {
      values: runningBalancePayload,
      app: 'PRIVATE_API',
      endpoint: 'running_balance',
    };

    const pollLimit = 6; // 10secs * 6  = 60sec = 1min
    // poll the dispatch
    for (let pollCount = 0; pollCount < pollLimit; pollCount += 1) {
      // wait 10 seconds
      const that = this;
      const loopCount = function () {};

      (function loopCount(pollCount) {
        setTimeout(() => {
          const res = that.checkRunningBalance(oldRb, payload);
          if (res) {
            pollCount = pollLimit;
            return true;
          }
        }, 10000 * pollCount);
      }(pollCount));
    }
  },

  checkRunningBalance(oldRb, payload) {
    this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
      (response) => {
        if (response.length > 0) {
          response = response[0];
        }
        if (response.status === 200) {
          // check if rb has changed
          const newRb = response.data.running_balance;
          if (newRb < oldRb) {
            // running balance updated
            // terminate poll
            // update global running balance
            this.completeMpesaPaymentRequest({});
            this.$store.commit('setRunningBalance', response.data.running_balance);
            return true;
          }
        }
        // commit  to the global store here
        return false;
      },
      // error => false,
    );
  },

  /* End mpesa */
};
