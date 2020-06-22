<template lang="html">
  <payment_loading
    v-if="card_loading_status"
    pay_method="card"
  />
  <addCard v-else-if="card_add_status" />
  <div
    v-else
    class="paymentbody--form"
  >
    <div
      v-if="Array.isArray(get_saved_cards) && get_saved_cards.length > 0"
      class=""
    >
      <div class="paymentbody--input-wrap-saved-cards">
        <div
          v-for="card in get_saved_cards"
          class="card--saved-card-width"
        >
          <el-radio
            v-model="payment_card"
            class="card--saved-card"
            :label="getCardValue(card.last4)"
            border
            @change="isHidden = true"
          >
            <font-awesome-icon
              :icon="getCardIcon(card)"
              class="payments-orange"
            />
            **** **** **** {{ card.last4 }}
            <div
              class="card--delete"
              @click="deleteSavedCard(card)"
            >
              <font-awesome-icon icon="trash" /> Remove
            </div>
          </el-radio>
        </div>
      </div>
      <div class="paymentbody--input-wrap">
        <el-radio
          v-model="payment_card"
          class="card--new-card"
          label="1"
          border
          @change="isHidden = false"
        >
          New Card
        </el-radio>
      </div>
    </div>
    <div v-show="!isHidden">
      <div class="paymentbody--input-wrap">
        <input
          v-model="card_payment_data.card_no"
          type="text"
          name="card_payment_card_no"
          placeholder="Card Number"
          class="input-control paymentbody--input"
          @change="creditCardMask()"
          @keyup="creditCardMask()"
        >
      </div>

      <div class="paymentbody--input-wrap paymentbody--input-spaced">
        <div class="input-control-big">
          <input
            v-model="card_payment_data.card_expiry"
            type="text"
            name="card_payment_month"
            value=""
            placeholder="MM/YY"
            class="input-control paymentbody--input"
            @change="creditCExpiryMask"
            @keyup="creditCExpiryMask"
          >
        </div>
        <div class="input-control-small">
          <el-input
            v-model="card_payment_data.cvv"
            placeholder="CVV"
            type="number"
            name="card_payment_cvv"
            class="paymentbody--input"
          >
            <el-button
              slot="append"
              icon="el-icon-info"
              class="input--append-button"
              @click="showCvv"
              @mouseover.native="showCvv"
              @mouseleave.native="showCvv"
            />
          </el-input>
          <div
            v-show="cvv_state"
            class="payment--cvv-info-wrap"
          >
            <div class="sendy_payments_form_cvv_title">
              CVV
            </div>
            <div class="sendy_payments_form_cvv_description">
              A three or four digit code on your credit or debit card. You can find this at the back
              of your card.
            </div>
            <div class="sendy_payments_form_cvv_body">
              <img
                src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/cvv.png"
                alt="CVV"
              >
            </div>
          </div>
        </div>
      </div>

      <div class="paymentbody--input-wrap savecard--desc-wrap">
        <input
          v-model="card_payment_data.is_save"
          type="checkbox"
          name="card_payment_save"
          class="input-checkbox paymentbody--input-checkbox"
        >
        <div class="savecard--desc-title">
          Save your card details for easier payment in future
        </div>
      </div>
    </div>
    <div class="paymentbody--input-wrap">
      <input
        v-model="card_payment_data.amount"
        type="number"
        name="card_payment_amount"
        placeholder="Amount"
        class="card--input input-control paymentbody--input"
      >
    </div>
    <div class="paymentbody--input-wrap">
      <button
        type="button"
        name="button"
        :class="
          valid_payment
            ? 'button-primary paymentbody--input-button'
            : 'paymentbody--input-button card--input button--primary-inactive'
        "
        @click="getPaymentCard"
      >
        Pay
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import payment_loading from './LoadingComponent.vue';
import payment_success from './SuccessComponent.vue';
import payment_fail from './FailComponent.vue';
import addCard from './AddCard.vue';
import Mcrypt from '../../../mixins/mcrypt_mixin';
import PaymentMxn from '../../../mixins/payment_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'CardComponent',
  components: {
    payment_loading,
    payment_success,
    payment_fail,
    addCard,
  },
  mixins: [Mcrypt, PaymentMxn, NotificationMxn],
  data() {
    return {
      card_payment_data: {
        card_expiry: '',
        cvv: '',
        card_no: '',
        amount: '',
        is_save: true,
      },
      payment_card: '',
      activeNames: ['1'],
      isHidden: false,
      payment_state: 'Attempting Payment',
      show_cvv: false,
    };
  },
  computed: {
    ...mapGetters({
      card_fail_status: '$_payment/getCardFailStatus',
      card_loading_status: '$_payment/getCardLoadingStatus',
      card_success_status: '$_payment/getCardSuccessStatus',
      get_saved_cards: '$_payment/getSavedCards',
      get_stripe_user_id: '$_payment/getStripeUserId',
    }),
    valid_payment() {
      if (this.payment_card.startsWith('2_')) {
        return this.card_payment_data.amount !== '';
      }
      if (this.payment_card === 1) {
        return (
          this.card_payment_data.card_expiry !== ''
          && this.card_payment_data.amount !== ''
          && this.card_payment_data.card_no !== ''
          && this.card_payment_data.cvv !== ''
        );
      }
      return (
        this.card_payment_data.card_expiry !== ''
        && this.card_payment_data.amount !== ''
        && this.card_payment_data.card_no !== ''
        && this.card_payment_data.cvv !== ''
      );
    },
    cvv_state() {
      return this.show_cvv;
    },
    card_expiry_month() {
      const exp = this.card_payment_data.card_expiry;
      if (exp.length === 5) {
        return exp.slice(0, 2);
      }
      return '';
    },
    card_expiry_year() {
      const exp = this.card_payment_data.card_expiry;
      if (exp.length === 5) {
        return exp.slice(3);
      }
    },
    card_add_status() {
      if (typeof this.$route.query.action !== 'undefined') {
        const { action } = this.$route.query;
        if (action === 'add') {
          return true;
        }
      } else {
        return false;
      }
    },
  },
  watch: {
    get_saved_cards() {
      if (this.get_saved_cards.length === 0) {
        this.isHidden = false;
      } else {
        this.isHidden = true;
      }
    },
  },
  mounted() {
    this.getUserCards();
  },
  created() {
    if (this.get_saved_cards.length === 0) {
      this.isHidden = false;
    } else {
      this.isHidden = true;
    }
  },
  methods: {
    showCvv() {
      if (this.show_cvv) {
        this.show_cvv = false;
      } else {
        this.show_cvv = true;
      }
    },
    ...mapActions({
      requestSavedCards: '$_payment/requestSavedCards',
      removeSavedCard: '$_payment/deleteSavedCard',
    }),
    ...mapMutations({
      setSavedCards: '$_payment/setSavedCards',
      setStripeUserId: '$_payment/setStripeUserId',
    }),
    getPaymentCard() {
      const session = this.$store.getters.getSession;
      const setCurrency = session[session.default].default_currency;
      const vendorId = 1;
      if (this.payment_card.startsWith('2_')) {
        const card = this.get_saved_cards.find(
          card_details => card_details.last4 === this.payment_card.slice(2),
        );
        this.handleSavedCard(vendorId, setCurrency, card);
      } else {
        this.handleNewCardPayment(vendorId, setCurrency);
      }
    },

    creditCardMask() {
      const currentVal = this.card_payment_data.card_no;
      const newCur = currentVal.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      this.card_payment_data.card_no = newCur.trim();
    },
    creditCExpiryMask($event) {
      const currentVal = this.card_payment_data.card_expiry;
      let newCur = currentVal;
      if ($event.code !== 'Backspace') {
        newCur = currentVal.replace(/\W/gi, '').replace(/(.{2})/g, '$1/');
        if (newCur.length > 5) {
          newCur = newCur.slice(0, 5);
        }
      }
      this.card_payment_data.card_expiry = newCur.trim();
    },
    getUserCards() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      let user_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
      } else {
        cop_id = 0;
        user_id = session.peer.user_id;
      }

      let cardPayload = {
        user_id,
        cop_id,
      };

      // encrypt card payload here
      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        app: 'PRIVATE_API',
        endpoint: 'get_card',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          // decrypt response here
          response = JSON.parse(Mcrypt.decrypt(response));
          if (response.status) {
            this.setSavedCards(response.cards);
            this.setStripeUserId(response.stripe_user_id);
          } else {
          }
        },
        error => false,
      );
    },
    getCardValue(last4digits) {
      return `2_${last4digits}`;
    },
    getCardIcon(card) {
      const name = `cc-${card.type.toLowerCase()}`;
      return ['fab', name];
    },
    getCardYear(year) {
      return year.slice(-2);
    },
    deleteSavedCard(card) {
      let cardPayload = {
        card_id: card.card_id,
        stripe_user_id: this.get_stripe_user_id,
      };
      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        app: 'PRIVATE_API',
        endpoint: 'remove_card',
      };
      this.removeSavedCard(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            this.isHidden = false;
            const notification = {
              title: 'Remove Card success',
              level: 1,
              message: 'card deleted successfully.',
            };
            this.displayNotification(notification);
            this.getUserCards();
          } else {
            const notification = {
              title: 'Remove Card Failed',
              level: 2,
              message: 'delete card failed, please try again.',
            };
            this.displayNotification(notification);
          }
        },
        (error) => {
          const notification = {
            title: 'delete card failed',
            level: 2,
            message: 'delete card did not go through',
          };
          this.displayNotification(notification);
        },
      );
    },
    clearCardData() {
      this.card_payment_data.card_no = '';
      this.card_payment_data.card_expiry = '';
      this.card_payment_data.cvv = '';
      this.card_payment_data.amount = '';
    },
  },
};
</script>
<style lang="css">
.card--new-card {
  margin-top: 20px;
  width: 100%;
  padding: 16px 15px !important;
  height: 50px !important;
}
.card--saved-card {
  margin-top: 20px;
  width: 100%;
  padding: 16px 15px !important;
  height: 50px !important;
}
.card--saved-card-width {
  width: 100%;
}
.payments-orange {
  color: #f57f20;
}
.card--saved-expiry {
  margin-left: 43px;
}
.card--input {
  height: 50px !important;
}
.card--delete {
  float: right;
}
.paymentbody--input-wrap-saved-cards{
  min-height: 4rem;
  margin: .5em;
}
.el-radio.is-bordered{
  width:100%;
}
</style>
