import { mapActions, mapGetters } from 'vuex';
import Mcrypt from './mcrypt_mixin';

const PaymentMxn = {
  computed: {
    ...mapGetters({
      getSecondaryProfile: 'getSecondaryProfile',
    }),
  },
  methods: {
    ...mapActions({
      requestRunningBalanceFromAPI: '$_payment/requestRunningBalance',
      requestCardPaymentAction: '$_payment/requestCardPayment',
    }),
    sanitizeCardDualResponses(response) {
      let repsonseData = '';
      let i;
      if (response.length > 0) {
        for (i = 0; i < response.length; i += 1) {
          repsonseData = Mcrypt.decrypt(response[i].data);
          repsonseData = JSON.parse(repsonseData);

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
    handleSavedCard(vendorId, setCurrency, card, orderOptions = false) {
      const session = this.$store.getters.getSession;
      let userId = 0;
      let copId = 0;
      let userPhone = '';

      if (session.default === 'biz') {
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
        userPhone = session.biz.user_phone;
      } else {
        userId = session.peer.user_id;
        userPhone = session.peer.user_phone;
      }
      let cardPayload = {
        amount: orderOptions
          ? Mcrypt.encrypt(this.raw_pending_amount.replace(/,/g, ''))
          : Mcrypt.encrypt(this.card_payment_data.amount),
        last4: Mcrypt.encrypt(card.last4),
        stripe_user_id: this.get_stripe_user_id,
        card_id: Mcrypt.encrypt(card.card_id),
        complete_payment: true,
        user_id: userId,
        cop_id: copId,
        user_phone: userPhone,
        currency: setCurrency,
        vendorType: vendorId,
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

          if (response.data.status) {
            const notification = {
              title: this.$t('general.card_payment_success'),
              level: 1,
              message: this.$t('general.card_payment_processed_successfully'),
            };
            this.payment_state = this.$t('general.payment_success');
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
            // request running balance here
            const runningBalancePayload = {
              values: {
                cop_id: copId,
                user_phone: userPhone,
              },
            };

            if (this.getSecondaryProfile !== '') {
              runningBalancePayload.values.secondary_profile = this.getSecondaryProfile;
            }

            const payload = {
              values: runningBalancePayload,
              app: 'PRIVATE_API',
              endpoint: 'running_balance',
            };

            const self = this;

            this.requestRunningBalanceFromAPI(payload).then(() => {
              this.payment_state = 0;
              this.loading = 0;
              if (orderOptions) {
                self.doCompleteOrder();
              }
            });
          } else {
            const notification = {
              title: this.$t('general.card_payment_failed'),
              level: 2,
              message: this.$t('general.card_payment_failed_text'),
            };
            this.payment_state = this.$t('general.payment_failed');
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
            this.payment_state = 0;
            this.loading = 0;
          }
        },
        () => {
          const notification = {
            title: this.$t('general.card_payment_failed'),
            level: 2,
            message: this.$t('general.card_payment_did_not_go_through'),
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
    handleNewCardPayment(vendorId, setCurrency) {
      // sort encryption
      const session = this.$store.getters.getSession;

      let userId = 0;
      let copId = 0;
      let userName = '';
      let userEmail = '';
      let userPhone = '';

      if (session.default === 'biz') {
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
        userName = session.biz.user_name;
        userEmail = session.biz.user_email;
        userPhone = session.biz.user_phone;
      } else {
        copId = session.peer.cop_id;
        userId = session.peer.user_id;
        userName = session.peer.user_name;
        userEmail = session.peer.user_email;
        userPhone = session.peer.user_phone;
      }

      let cardPayload = {
        amount: this.card_payment_data.amount,
        exp_month: this.card_expiry_month,
        exp_year: this.card_expiry_year,
        card_no: this.card_payment_data.card_no,
        cvv: this.card_payment_data.cvv,
        is_save: this.card_payment_data.is_save,
        cop_id: copId,
        user_id: userId,
        user_email: userEmail,
        user_phone: userPhone,
        user_name: userName,
        complete_payment: true,
        currency: setCurrency,
        vendorType: vendorId,
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

          if (response.data.status) {
            const notification = {
              title: this.$t('general.card_payment_success'),
              level: 1,
              message: this.$t('general.card_payment_processed_successfully'),
            };
            this.payment_state = 'Payment Success';
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
            this.getUserCards();
            this.clearCardData();
            // request running balance
            const runningBalancePayload = {
              values: {
                cop_id: copId,
                user_phone: userPhone,
              },
            };

            if (this.getSecondaryProfile !== '') {
              runningBalancePayload.values.secondary_profile = this.getSecondaryProfile;
            }

            const payload = {
              values: runningBalancePayload,
              app: 'PRIVATE_API',
              endpoint: 'running_balance',
            };
            this.requestRunningBalanceFromAPI(payload).then(() => {
              this.payment_state = 0;
              this.loading = 0;
            });
          } else {
            this.payment_state = this.$t('general.payment_failed');
            const notification = {
              title: this.$t('general.card_payment_failed'),
              level: 2,
              message: response.data.message,
            };
            this.$store.dispatch('show_notification', notification, {
              root: true,
            });
          }
        },
        () => {
          this.payment_state = this.$t('general.payment_failed');
          const notification = {
            title: this.$t('general.card_payment_failed'),
            level: 2,
            message: this.$t('general.card_payment_did_not_go_through'),
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
