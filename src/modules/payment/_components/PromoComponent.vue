<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input
        v-model="promocode_payment_data.sendy_coupon"
        type="text"
        name="sendy_coupon"
        placeholder="Promo Code"
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
            : 'paymentbody--input-button button--primary-inactive'
        "
        @click="requestPromoPayment"
      >
        Redeem
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  mixins: [NotificationMxn],
  data() {
    return {
      promocode_payment_data: {
        sendy_coupon: '',
      },
    };
  },
  computed: {
    valid_payment() {
      return this.promocode_payment_data.sendy_coupon !== '';
    },
  },
  methods: {
    ...mapActions(['$_payment/requestPromoCodePayment']),
    requestPromoPayment() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session[session.default].cop_id;
      }
      const promo_payload = {
        values: {
          user_email: session[session.default].user_email,
          user_phone: session[session.default].user_phone,
          sendy_coupon: this.promocode_payment_data.sendy_coupon,
          cop_id,
          client_type: session.default,
        },
      };

      const full_payload = {
        values: promo_payload,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'redeem_promocode',
      };

      this.$store.dispatch('$_payment/requestPromoCodePayment', full_payload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          let level = 0;
          let message = response.data.msg;
          if (response.data.status === true) {
            // update running balance with new value
            const running_balance = parseFloat(response.data.running_balance);
            this.$store.commit('setRunningBalance', running_balance);
            this.payment_state = 'Promocode Redeem Success';
            level = 1;
          } else {
            this.payment_state = 'Promocode Redeem Failed';
            message = 'Unable to redeem promocode';
            level = 2;
          }
          const notification = {
            title: 'Redeem promocode',
            level,
            message: `${message}`,
          };
          this.displayNotification(notification);
        },
        (error) => {
          this.payment_state = 'Promocode Redeeem Failed';
        },
      );
    },
  },
};
</script>

<style lang="css"></style>
