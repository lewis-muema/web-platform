/* eslint-disable max-len */
<template lang="html">
  <payment_loading v-if="show_loading" />
  <payment_success v-else-if="show_mpesa_success" />
  <payment_fail v-else-if="show_mpesa_fail" />

  <div
    v-else
    class="paymentbody--form"
  >
    <div class="paymentbody--input-wrap">
      <input
        v-model="mpesa_payment_data.amount"
        type="number"
        name="amount"
        placeholder="Amount"
        class="input-control paymentbody--input"
      >
    </div>
    <div class="paymentbody--input-wrap">
      <input
        v-model="mpesa_payment_data.phone_number"
        type="text"
        disabled
        name="phone_no"
        placeholder="Safaricom Phone Number"
        class="input-control paymentbody--input"
      >
    </div>
    <div class="paymentbody--input-wrap">
      <button
        type="button"
        name="button"
        :class="
          valid_payment
            ? 'button-primary paymentbody--input-button'
            : 'button--primary-inactive paymentbody--input-button'
        "
        @click="requestMpesaPayment"
      >
        Pay
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import payment_loading from './LoadingComponent.vue';
import payment_success from './SuccessComponent.vue';
import payment_fail from './FailComponent.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'MpesaComponent',
  components: { payment_loading, payment_success, payment_fail },
  data() {
    return {
      mpesa_payment_data: {
        amount: '',
        phone_number: 0,
      },
      payment_state: 'Mpesa Payment Not Initiated',
      mpesa_number_invalid: false,
    };
  },
  mounted() {
    this.prepareMpesaPayment();
  },
  methods: {
    ...mapActions({
      _requestMpesaPayment: '$_payment/requestMpesaPayment',
      _requestRunningBalance: '$_payment/requestRunningBalance',
      _completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      _terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
    }),
    prepareMpesaPayment() {
      const session = this.$store.getters.getSession;
      const { user_phone } = session[session.default];

      this.mpesa_payment_data.phone_number = user_phone;
      // pass amount here
    },
    empty(value) {
      return value === null || value.length === 0 || Object.getOwnPropertyNames(value).length === 0;
    },
    validatePhone(phone) {
      if (this.empty(phone)) {
        return false;
      }
      if (isNaN(phone) && !phone.startsWith('+')) {
        this.mpesa_number_invalid = true;
        return false;
      }
      try {
        const number = phoneUtil.parseAndKeepRawInput(phone, 'KE');
        const res = phoneUtil.isValidNumberForRegion(number, 'KE');
        if (res) {
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
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }
      const old_rb = this.$store.getters.getRunningBalance;
      const requested_amount = this.order_cost;

      const running_balance_payload = {
        values: {
          cop_id,
          user_phone: session[session.default].user_phone,
        },
      };

      const payload = {
        params: running_balance_payload,
        app: 'PRIVATE_API',
        endpoint: 'running_balance',
      };

      const poll_limit = 6; // 10secs * 6  = 60sec = 1min
      // poll the dispatch
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        // wait 10 seconds
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            const res = that.checkRunningBalance(old_rb, payload);

            if (res) {
              poll_count = poll_limit;
              // let notification = {
              //   level: 1,
              //   title: "Payment successful",
              //   message: "M-Pesa payment was successful."
              // };
              // that.$store.dispatch("show_notification", notification, {
              //   root: true
              // });
              that._completeMpesaPaymentRequest({});
              return true;
            }
            if (poll_count === 5) {
              // let notification = {
              //   level: 2,
              //   title: "Payment failed",
              //   message:
              //     "Please select your preferred payment method and try again."
              // };
              // that.$store.dispatch("show_notification", notification, {
              //   root: true
              // });
              that._terminateMpesaPaymentRequest({});
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    checkRunningBalance(old_rb, payload) {
      const that = this;
      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status === 200) {
            // check if rb has changed
            const new_rb = response.data.running_balance;

            if (new_rb < old_rb) {
              that._completeMpesaPaymentRequest({});
              return true;
            }
          }
          // commit  to the global store here
          return false;
        },
        error => false,
      );
    },

    requestMpesaPayment() {
      const session = this.$store.getters.getSession;
      let referenceNumber = 'SENDY';
      let cop_id = 0;
      let user_id = 0;
      let user_email = '';
      if (session.default === 'biz') {
        referenceNumber += session.biz.cop_id;
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_email = session.biz.user_email;
      } else {
        referenceNumber = session.peer.user_phone;
        user_id = session.peer.user_id;
        user_email = session.peer.user_email;
      }
      // TOOD: add cop_id to refrence if cop account
      // pass the phone no if peer
      const mpesa_payload = {
        amount: this.mpesa_payment_data.amount,
        sourceMobile: this.mpesa_payment_data.phone_number,
        referenceNumber,
        user_id,
        cop_id,
        phone: this.mpesa_payment_data.phone_number, // confirm about this later
        email: user_email,
      };

      // TODO: implement the discount bundles if needed

      const full_payload = {
        values: mpesa_payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };

      this.payment_state = 'requesting Mpesa Payment';

      this._requestMpesaPayment(full_payload).then(
        (response) => {
          if (response.status === 200) {
            // request poll here
            this.requestMpesaPaymentPoll();
          }
          this.payment_state = 'Mpesa Payment Success';
        },
        (error) => {
          this.payment_state = 'Mpesa Payment Failed';
        },
      );
    },
  },
  computed: {
    ...mapGetters({
      mpesa_fail_status: '$_payment/getMpesaFailStatus',
      mpesa_loading_status: '$_payment/getMpesaLoadingStatus',
      mpesa_success_status: '$_payment/getMpesaSuccessStatus',
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
      // validate amount
      // validate mpesa number
      return (
        this.mpesa_payment_data.amount !== ''
        && this.mpesa_payment_data.amount !== 0
        && this.mpesa_payment_data.phone_number !== ''
        && this.valid_phone
      );
    },
    valid_phone() {
      return this.validatePhone(this.mpesa_payment_data.phone_number);
    },
  },
};
</script>

<style lang="css"></style>
