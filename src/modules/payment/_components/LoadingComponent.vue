<template lang="html">
  <div>
    <div class="payment--loading-title">
      {{ payment_loading_title }}
    </div>
    <div class="payment--mpesa-loader"/>

    <div v-if="count" class="text-center timer"> 
      <span>
        {{ formatedCountdown }}
      </span> 
    </div>
    <div v-if="transactionText" class="text-center"> 
      <span>
        {{ transactionText}}
      </span> 
    </div>
    <div class="paymemt--mpesa-loader-actions" v-if="payMethod !== 'card'">
      <button
        type="button"
        class="button-primary paymentbody--input-button"
        @click="cancelPaymentRequest"
      >
        {{$t('general.cancel')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as moment from "moment";
import "moment-duration-format";

export default {
  name: 'PaymentLoading',
  props: {
    payMethod: {
      type: String,
      default: 'mpesa',
    },
    transactionText: {
      type: String,
      default: null,
    },
    count: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: true,
      countdown: 300,
    };
  },
  computed: {
    payment_loading_title() {
      if (this.pay_method === 'mpesa') {
        return this.$t('general.please_follow_mpesa_instructions');
      }
      if (this.pay_method === 'card') {
        return this.$t('general.processing_your_card_operation');
      }
    },
    formatedCountdown() {
        return moment.duration(this.countdown, "seconds").format("mm:ss");
    },
  },
  watch: {
    count(val) {
      if (val) {
        this.startCount();
      }
    }
  },
  mounted() {
    if (this.count) {
      this.startCount();
    }
  },
  methods: {
    ...mapActions(['$_payment/resetMpesaPaymentRequest', '$_payment/resetCardPaymentRequest']),
    cancelPaymentRequest() {
      const payload = {};
      if (this.pay_method === 'mpesa') {
        this.$store
          .dispatch('$_payment/resetMpesaPaymentRequest', payload)
          .then((response) => {}, (error) => {});
      } else {
        this.$store
          .dispatch('$_payment/resetCardPaymentRequest', payload)
          .then((response) => {}, (error) => {});
      }
    },
    startCount() {
        const stopCountdown = setInterval(() => {
        this.countdown -= 1;
        if (!this.countdown) {
          clearInterval(stopCountdown);
          this.$emit('close');
        } 
      }, 1000);

    }
  },
};
</script>

<style lang="css">
.text-center {
  text-align: center;
}
.timer {
  margin-top: -20px;
  text-align: center;
}
</style>
