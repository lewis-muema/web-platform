export default {

    /* start mpesa */

    requestMpesaPayment() {
      console.log("requesting mpesa payment");
      let session = this.$store.getters.getSession;
      let referenceNumber = "SENDY";
      let cop_id = 0;
      let user_id = 0;
      let user_email = "";
      let user_phone = "";
      if (session.default == "biz") {
        referenceNumber += session.biz.cop_id;
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_email = session.biz.user_email;
        user_phone = session.biz.user_phone;
      } else {
        referenceNumber = session.peer.user_phone;
        user_id = session.peer.user_id;
        user_email = session.peer.user_email;
        user_phone = session.peer.user_phone;
      }
      //TOOD: add cop_id to refrence if cop account
      //pass the phone no if peer
      let mpesa_payload = {
        amount: this.order_cost,
        sourceMobile: user_phone,
        referenceNumber: referenceNumber,
        user_id: user_id,
        cop_id: cop_id,
        phone: user_phone,
        email: user_email
      };

      console.log(mpesa_payload);

      //TODO: implement the discount bundles if needed

      let full_payload = {
        values: mpesa_payload,
        app: "NODE_PRIVATE_API",
        endpoint: "initiate_mpesa"
      };

      console.log(mpesa_payload);

      this.payment_state = "requesting Mpesa Payment";

      this.requestMpesaPaymentAction(full_payload).then(
        response => {
          console.log(response);
          if (response.status == 200) {
            //request poll here
            this.requestMpesaPaymentPoll();
          }
          this.payment_state = "Mpesa Payment Success";
        },
        error => {
          this.payment_state = "Mpesa Payment Failed";
        }
      );
    },

    requestMpesaPaymentPoll() {
      console.log("mpesa payment poll initiated");
      let session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default == "biz") {
        cop_id = session.biz.cop_id;
      }
      let old_rb = this.$store.getters.getRunningBalance;
      let requested_amount = this.order_cost;

      let running_balance_payload = {
        values: {
          cop_id: cop_id,
          user_phone: session[session.default]["user_phone"]
        }
      };

      let payload = {
        values: running_balance_payload,
        app: "PRIVATE_API",
        endpoint: "running_balance"
      };

      let poll_limit = 6; //10secs * 6  = 60sec = 1min
      //poll the dispatch
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        //wait 10 seconds
         let that = this;
         (function (poll_count) {
          setTimeout(function () {
            let res = that.checkRunningBalance(old_rb, payload);
            if(res){
              poll_count = poll_limit;
              return true;
            }
          }, 10000*poll_count);
        })(poll_count);
      }

    },

    checkRunningBalance(old_rb, payload) {
      this.requestRunningBalanceFromAPI(payload).then(
        response => {
          console.log(response);
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status == 200) {
            //check if rb has changed
            let new_rb = response.data.running_balance;
            console.log(old_rb);
            console.log(new_rb);

            if (new_rb < old_rb) {
              //running balance updated
              //terminate poll
              //update global running balance
              this.completeMpesaPaymentRequest({});
              this.$store.commit(
                "setRunningBalance",
                response.data.running_balance
              );
              return true;
            }
          }
          //commit  to the global store here
          return false;
        },
        error => {
          console.log(error);
          return false;
        }
      );
    },

    /* End mpesa */

}
