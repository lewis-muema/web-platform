const promocode = {
  data() {
    return {
      promoCodes: null,
      processing: false,
      loading: false,
      requested: false,
      notification: null,
    };
  },
  methods: {
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },
    useCoupon(couponData) {
      const session = this.$store.getters.getSession;
      this.processing = true;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;
      const promoPayload = {
        cop_id: copID,
        individual_id: individualID,
        email: session[session.default].user_email,
        coupon_code: couponData.coupon_code,
        coupon_amount: couponData.coupon_amount,
        is_cancelled: couponData.is_cancelled,
        coupon_type: couponData.coupon_type,
      };
      const fullPayload = {
        values: promoPayload,
        vm: this,
        app: 'CUSTOMERS_APP',
        endpoint: 'use_coupon',
      };
      let valid = false;
      this.$store.dispatch('requestPromoCodePayment', fullPayload).then(
        (response) => {
          let level = 0;
          const { message } = response.data;
          if (response.data.status === true) {
            level = 1;
            valid = true;
          } else {
            valid = false;
            level = 2;
          }
          const notification = {
            title: 'Use promocode',
            level,
            message: `${message}`,
            valid,
          };
          this.processing = false;
          this.notification = notification;
        },
        (error) => {
          const message = typeof error.response.data.reason === 'undefined' ? error.response.data.message : error.response.data.reason;

          const level = 2;
          valid = false;
          const notification = {
            title: 'Use promocode',
            level,
            message: `${message}`,
            valid,
          };
          this.processing = false;
          this.notification = notification;
        },

      );
    },
    requestPromoCodes() {
      this.loading = true;
      this.promoCodes = null;
      const session = this.$store.getters.getSession;
      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const promoPayload = {
        cop_id: copID,
        individual_id: individualID,
      };
      const fullPayload = {
        values: promoPayload,
        vm: this,
        app: 'CUSTOMERS_APP',
        endpoint: 'get_customer_coupon',
      };

      this.$store.dispatch('requestPromoCodePayment', fullPayload).then(
        (response) => {
          if (response.data.message.length > 0) {
            this.promoCodes = response.data.message;
          }
          this.loading = false;
          this.requested = true;
        },
        (error) => {
          this.payment_state = error;
          this.loading = false;
          this.requested = true;
        },

      );
    },

    requestPromoPayment(coupon) {
      const session = this.$store.getters.getSession;
      this.processing = true;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const promoPayload = {
        cop_id: copID,
        individual_id: individualID,
        email: session[session.default].user_email,
        coupon_code: coupon,
      };

      const fullPayload = {
        values: promoPayload,
        vm: this,
        app: 'CUSTOMERS_APP',
        endpoint: 'redeem_coupon_code',
      };
      let valid = false;
      let couponBalance = null;

      this.$store.dispatch('requestPromoCodePayment', fullPayload).then(
        (response) => {
          let level = 0;
          let { message } = response.data;
          if (response.data.status === true) {
            level = 1;
            valid = true;
            couponBalance = message;
            this.requestPromoCodes();
          } else {
            valid = false;
            message = 'Unable to redeem promocode';
            level = 2;
          }
          const notification = {
            title: 'Redeem promocode',
            level,
            message: `${message}`,
            valid,
            couponBalance,
          };
          this.processing = false;
          this.notification = notification;
        },
        (error) => {
          const message = typeof error.response.data.reason === 'undefined' ? error.response.data.message : error.response.data.reason;

          const level = 2;
          valid = false;
          const notification = {
            title: 'Redeem promocode',
            level,
            message: `${message}`,
            valid,
            couponBalance,
          };
          this.processing = false;
          this.notification = notification;
        },
      );
    },

  },
};
export default promocode;
