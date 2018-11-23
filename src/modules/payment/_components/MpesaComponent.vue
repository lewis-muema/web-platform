<template lang="html">
  
  <payment_loading v-if="show_loading"></payment_loading>
  <payment_success v-else-if="show_mpesa_success"></payment_success>
  <payment_fail v-else-if="show_mpesa_fail"></payment_fail>
  
  <div class="paymentbody--form" v-else>
    <div class="paymentbody--input-wrap">
      <input type="number" name="amount" v-model="mpesa_payment_data.amount" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="number" name="phone_no" v-model="mpesa_payment_data.phone_number" placeholder="Safaricom Phone Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment ? 'button-primary paymentbody--input-button':'button--primary-inactive paymentbody--input-button'" @click="requestMpesaPayment">Pay</button>
    </div>
  </div>
</template>

<script>
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();
import { mapActions, mapGetters } from "vuex";
import payment_loading from "./LoadingComponent.vue";
import payment_success from "./SuccessComponent.vue";
import payment_fail from "./FailComponent.vue";

export default {
  name: "mpesa-component",
  components: { payment_loading, payment_success, payment_fail },
  data() {
    return {
      mpesa_payment_data: {
        amount: "",
        phone_number: 0
      },
      payment_state: "Mpesa Payment Not Initiated",
      mpesa_number_invalid: false
    };
  },
  mounted() {
    this.prepareMpesaPayment();
  },
  methods: {
    ...mapActions(["$_payment/requestMpesaPayment"]),
    prepareMpesaPayment() {
      let session = this.$store.getters.getSession;
      let user_phone = session[session.default]["user_phone"];
      console.log(user_phone);
      this.mpesa_payment_data.phone_number = user_phone;
      //pass amount here
    },
    empty: function(value) {
      return (
        value == null ||
        value.length === 0 ||
        Object.getOwnPropertyNames(value).length === 0
      );
    },
    validatePhone(phone) {
      if (this.empty(phone)) {
        return false;
      }
      if (isNaN(phone) && phone.startsWith("+") == false) {
        this.mpesa_number_invalid = true;
        return false;
      }
      try {
        let number = phoneUtil.parseAndKeepRawInput(phone, "KE");
        let res = phoneUtil.isValidNumberForRegion(number, "KE");
        if (res == true) {
          this.mpesa_number_invalid = false;
        } else {
          this.mpesa_number_invalid = true;
        }
        return res;
      } catch (error) {
        this.mpesa_number_invalid = true;
        return false;
      }
    },
    requestMpesaPaymentPoll() {
      console.log("mpesa payment poll initiated");
      let session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default == "biz") {
        cop_id = session.biz.cop_id;
      }
      let old_rb = this.$store.getters.getRunningBalance;
      let requested_amount = this.mpesa_payment_data.amount;

      let running_balance_payload = {
        values: {
          cop_id: cop_id,
          user_phone: session[session.default]["user_phone"]
        }
      };

      let payload = {
        values: running_balance_payload,
        vm: this,
        app: "PRIVATE_API",
        endpoint: "running_balance"
      };

      let poll_limit = 6; //10secs * 6  = 60sec = 1min
      //poll the dispatch
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        //wait 10 seconds
        let that = this;
        (function(poll_count) {
          setTimeout(function() {
            let res = that.runMpesaPaymentPoll(old_rb, payload);
            if (res) {
              poll_count = poll_limit;
              return true;
            }
          }, 10000 * poll_count);
        })(poll_count);
      }

      //loop did not resolve in anything
      //so trigger fail
      //this.$store.dispatch("$_payment/terminateMpesaPaymentRequest", {});
    },
    runMpesaPaymentPoll(old_rb, payload) {
      this.$store.dispatch("$_payment/requestRunningBalance", payload).then(
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
              this.$store.dispatch("$_payment/completeMpesaPaymentRequest", {});
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

    requestMpesaPayment() {
      console.log("requesting mpesa payment");
      let session = this.$store.getters.getSession;
      let referenceNumber = "SENDY";
      let cop_id = 0;
      let user_id = 0;
      let user_email = "";
      if (session.default == "biz") {
        referenceNumber += session.biz.cop_id;
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_email = session.biz.user_email;
      } else {
        referenceNumber = session.peer.user_phone;
        user_id = session.peer.user_id;
        user_email = session.peer.user_email;
      }
      //TOOD: add cop_id to refrence if cop account
      //pass the phone no if peer
      let mpesa_payload = {
        amount: this.mpesa_payment_data.amount,
        sourceMobile: this.mpesa_payment_data.phone_number,
        referenceNumber: referenceNumber,
        user_id: user_id,
        cop_id: cop_id,
        phone: this.mpesa_payment_data.phone_number, //confirm about this later
        email: user_email
      };

      console.log(mpesa_payload);

      //TODO: implement the discount bundles if needed

      let full_payload = {
        values: mpesa_payload,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "initiate_mpesa"
      };

      console.log(mpesa_payload);

      this.payment_state = "requesting Mpesa Payment";

      this.$store.dispatch("$_payment/requestMpesaPayment", full_payload).then(
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
    }
  },
  computed: {
    ...mapGetters({
      mpesa_fail_status: "$_payment/getMpesaFailStatus",
      mpesa_loading_status: "$_payment/getMpesaLoadingStatus",
      mpesa_success_status: "$_payment/getMpesaSuccessStatus"
    }),
    show_loading() {
      return this.mpesa_loading_status;
    },
    show_mpesa_success() {
      return this.mpesa_success_status;
    },
    show_mpesa_fail() {
      return this.mpesa_fail_status;
    },
    valid_payment() {
      //validate amount
      //validate mpesa number
      return (
        this.mpesa_payment_data.amount !== "" &&
        this.mpesa_payment_data.amount !== 0 &&
        this.mpesa_payment_data.phone_number !== "" &&
        this.valid_phone
      );
    },
    valid_phone: function() {
      return this.validatePhone(this.mpesa_payment_data.phone_number);
    }
  }
};
</script>

<style lang="css">
</style>
