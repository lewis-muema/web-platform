import Mcrypt from './mcrypt_mixin.js';

const PaymentMxn = {
  methods: {
    sanitizeCardDualResponses(response) {
      let repsonseData;
      let i;
      if (response.length > 0) {
        for (i = 0; i < response.length; i++) {
          repsonseData = Mcrypt.decrypt(response[i].data);
          repsonseData = JSON.parse(responseData);
        
          if (repsonseData.status) {
            // this is the correct one
            return repsonseData;
          }
        }
      } else {
        repsonseData = Mcrypt.decrypt(response.data);
        repsonseData = JSON.parse(repsonseData);
        return repsonseData;
      }
      return repsonseData;
    },
    // this function will complete transactions for card payments already in the system
    handleSavedCard(card) {
      let cardPayload = {
        amount: Mcrypt.encrypt(this.card_payment_data.amount),
        last4: Mcrypt.encrypt(card.last4),
        stripe_user_id: this.get_stripe_user_id,
        complete_payment: true,
      };
      // encrypt the card payload
      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        app: 'PRIVATE_API',
        endpoint: 'charge_customer_card',
      };
      this.requestCardPaymentAction(fullPayload).then(
        (response) => {
          response.data = this.sanitizeCardDualResponses(response);
          console.log(response.data);

          if (response.data.status) {
            const cardTransId = response.data.id;

            // this.completeCardPayment(card_trans_id);
            // complete payment here
            // show success message here
            const notification = {
              title: 'card payment success',
              level: 1,
              message: 'card payment was processed successfully',
            };
            this.payment_state = 'Payment Success';
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
          } else {
            const notification = {
              title: 'Card Payment Failed',
              level: 2,
              message: 'Card payment failed, please try again.',
            };
            this.payment_state = 'Payment Failed';
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
            this.payment_state = 0;
            this.loading = 0;
          }
        },
        (error) => {
          const notification = {
            title: 'card payment failed',
            level: 2,
            message: 'card payment did not go through',
          };
          this.$store.dispatch('show_notification', notification, {
            root: true,
          });
          this.payment_state = 0;
          this.loading = 0;
        },
      );
      return true;
    },
    handleNewCardPayment() {
      // sort encryption
      const session = this.$store.getters.getSession;

      let user_id = 0;
      let cop_id = 0;
      let user_name = '';
      let user_email = '';
      let user_phone = '';

      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_name = session.biz.user_name;
        user_email = session.biz.user_email;
        user_phone = session.biz.user_phone;
      } else {
        cop_id = session.peer.cop_id;
        user_id = session.peer.user_id;
        user_name = session.peer.user_name;
        user_email = session.peer.user_email;
        user_phone = session.peer.user_phone;
      }

      let cardPayload = {
        amount: this.card_payment_data.amount,
        exp_month: this.card_expiry_month,
        exp_year: this.card_expiry_year,
        card_no: this.card_payment_data.card_no,
        cvv: this.card_payment_data.cvv,
        is_save: this.card_payment_data.is_save,
        cop_id,
        user_id,
        user_email,
        user_phone,
        user_name,
        complete_payment: true,
      };

      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'card_payment',
      };
      this.requestCardPaymentAction(fullPayload).then(
        (response) => {
          response.data = this.sanitizeCardDualResponses(response);
          const that = this;

          if (response.data.status === true) {
            const notification = {
              title: 'card payment success',
              level: 1,
              message: 'card payment was processed successfully',
            };
            this.payment_state = 'Payment Success';
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });

            const card_trans_id = response.data.values.card_trans_id;
            // this.completeCardPayment(card_trans_id);
            // complete payment here
          } else {
            this.payment_state = 'Payment Failed';
            const notification = {
              title: 'card payment failed',
              level: 2,
              message: response.data.message,
            };
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
          }
        },
        (error) => {
          this.payment_state = 'Payment Failed';
          const notification = {
            title: 'card payment failed',
            level: 2,
            message: 'card payment did not go through',
          };
          this.$store.dispatch('show_notification', notification, {
            root: true,
          });
        },
      );
    },
  },
};
export default PaymentMxn;
