/* eslint-disable max-len */
<template lang="html">
  <paymentLoading v-if="show_loading" />
  <paymentSuccess v-else-if="show_mpesa_success" />
  <paymentFail v-else-if="show_mpesa_fail" />

  <div
    v-else
    class="paymentbody--form"
  >
    <div class="paymentbody--input-wrap">
      <input
        v-model="mpesa_payment_data.amount"
        type="number"
        name="amount"
        :placeholder="$t('general.amount')"
        class="input-control paymentbody--input"
      >
    </div>
    <div class="paymentbody--input-wrap">
      <input
        v-model="mpesa_payment_data.phone_number"
        type="text"
        disabled
        name="phone_no"
        :placeholder="$t('general.safaricon_phone_number')"
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
        {{$t('general.pay')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import paymentLoading from './LoadingComponent.vue';
import paymentSuccess from './SuccessComponent.vue';
import paymentFail from './FailComponent.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'MpesaComponent',
  components: { paymentLoading, paymentSuccess, paymentFail },
  data() {
    return {
      mpesa_payment_data: {
        amount: '',
        phone_number: 0,
      },
      payment_state: this.$t('general.mpesa_payment_not_inititated'),
      mpesa_number_invalid: false,
    };
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
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
    prepareMpesaPayment() {
      const session = this.$store.getters.getSession;
      const { user_phone } = session[session.default];

      this.mpesa_payment_data.phone_number = user_phone;
      // pass amount here
    },
    empty(value) {
      return value == null || value.length === 0 || Object.getOwnPropertyNames(value).length === 0;
    },
    validatePhone(phone) {
      if (this.empty(phone)) {
        return false;
      }
      if (isNaN(phone) && phone.startsWith('+') == false) {
        this.mpesa_number_invalid = true;
        return false;
      }
      try {
        const number = phoneUtil.parseAndKeepRawInput(phone, 'KE');
        const res = phoneUtil.isValidNumberForRegion(number, 'KE');
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
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }
      const oldRb = Math.abs(this.$store.getters.getRunningBalance);

      const runningBalancePayload = {
        values: {
          cop_id,
          user_phone: session[session.default].user_phone,
        },
      };

      const payload = {
        params: runningBalancePayload,
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
            const res = that.checkRunningBalance(oldRb, payload);

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

    checkRunningBalance(oldRb, payload) {
      const that = this;
      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status === 200) {
            // check if rb has changed
            const newRb = Math.abs(response.data.running_balance);

            if (newRb > oldRb) {
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
      if (session.default == 'biz') {
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
      const mpesaPayload = {
        amount: this.mpesa_payment_data.amount,
        sourceMobile: this.mpesa_payment_data.phone_number,
        referenceNumber,
        user_id,
        cop_id,
        phone: this.mpesa_payment_data.phone_number, // confirm about this later
        email: user_email,
        currency: session[session.default].default_currency,
        vendorType: 1,
      };

      // TODO: implement the discount bundles if needed

      const fullPayload = {
        values: mpesaPayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };

      this.payment_state = this.$t('general.requesting_mpesa_payment');

      this._requestMpesaPayment(fullPayload).then(
        (response) => {
          if (response.status === 200 && response.data.status) {
            // request poll here
            this.requestMpesaPaymentPoll();
          }
          this.payment_state = this.$t('general.mpesa_payment_success');
          const acc = this.$store.getters.getSession;

          this.trackMixpanelEvent('Mpesa Payment', {
            'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
            'Client Type': 'Web Platform',
          });
        },
        (error) => {
          this.payment_state = this.$t('general.mpesa_payment_failed');
        },
      );
    },
  },
};
</script>

<style lang="css"></style>
