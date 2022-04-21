<template lang="html">
  <payment_loading
    v-if="card_loading_status"
    pay_method="add_card"
  />
  <div
    v-else
    class="paymentbody--form"
  >
    <div class="paymentbody--input-wrap">
      <input
        v-model="add_card_payment_data.card_no"
        type="text"
        name="card_payment_card_no"
        :placeholder = "$t('general.card_number')"
        class="input-control paymentbody--input"
        @change="creditCardMask()"
        @keyup="creditCardMask()"
      >
    </div>

    <div class="paymentbody--input-wrap paymentbody--input-spaced">
      <div class="input-control-big">
        <input
          v-model="add_card_payment_data.card_expiry"
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
          v-model="add_card_payment_data.cvv"
          :placeholder="$t('general.cvv')"
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
            {{$t('general.cvv')}}
          </div>
          <div class="sendy_payments_form_cvv_description">
            {{$t('general.three_or_four_card_digit_code')}}
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

    <div class="paymentbody--input-wrap">
      <button
        type="button"
        name="button"
        :class="
          valid_card
            ? 'button-primary paymentbody--input-button'
            : 'paymentbody--input-button button--primary-inactive'
        "
        @click="handleAddCard"
      >
      {{$t('general.add_card')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import payment_loading from './LoadingComponent.vue';
import payment_success from './SuccessComponent.vue';
import payment_fail from './FailComponent.vue';
import Mcrypt from '../../../mixins/mcrypt_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'AddCard',
  components: { payment_loading, payment_success, payment_fail },
  mixins: [Mcrypt, NotificationMxn],
  data() {
    return {
      add_card_payment_data: {
        card_expiry: '',
        cvv: '',
        card_no: '',
      },
      payment_state: this.$t('general.adding_new_card'),
      show_cvv: false,
    };
  },
  computed: {
    ...mapGetters({
      card_loading_status: '$_payment/getCardLoadingStatus',
    }),
    show_loading() {
      return this.card_loading_status;
    },
    valid_card() {
      return (
        this.add_card_payment_data.card_expiry !== ''
        && this.add_card_payment_data.card_no !== ''
        && this.add_card_payment_data.cvv !== ''
      );
    },
    cvv_state() {
      return this.show_cvv;
    },
    card_expiry_month() {
      const exp = this.add_card_payment_data.card_expiry;
      if (exp.length === 5) {
        return exp.slice(0, 2);
      }
      return '';
    },
    card_expiry_year() {
      const exp = this.add_card_payment_data.card_expiry;
      if (exp.length === 5) {
        return exp.slice(3);
      }
    },
  },
  methods: {
    showCvv() {
      if (this.show_cvv) {
        this.show_cvv = false;
      } else {
        this.show_cvv = true;
      }
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
    ...mapActions({ requestAddNewCardAction: '$_payment/requestAddNewCard' }),

    handleAddCard() {
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
        user_id = session.peer.user_id;
        user_name = session.peer.user_name;
        user_email = session.peer.user_email;
        user_phone = session.peer.user_phone;
      }

      user_name = user_name.toString().split(' ');

      const user_fname = user_name[0];
      const user_lname = user_name[user_name.length - 1];
      let cardPayload = {
        exp_month: this.card_expiry_month,
        exp_year: this.card_expiry_year,
        card_no: this.add_card_payment_data.card_no,
        cvc: this.add_card_payment_data.cvv,
        user_email,
        cop_id,
        user_id,
        user_phone,
        user_lname,
        user_fname,
      };

      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'add_card',
      };
      this.requestAddNewCardAction(fullPayload).then(
        (response) => {
          response.data = Mcrypt.decrypt(response.data);
          response.data = response.data
            .replace(/\\n/g, '\\n')
            .replace(/\\'/g, "\\'")
            .replace(/\\"/g, '\\"')
            .replace(/\\&/g, '\\&')
            .replace(/\\r/g, '\\r')
            .replace(/\\t/g, '\\t')
            .replace(/\\b/g, '\\b')
            .replace(/\\f/g, '\\f');
          // remove non-printable and other non-valid JSON chars
          response.data = response.data.replace(/[\u0000-\u0019]+/g, '');
          response.data = JSON.parse(response.data);
          const that = this;

          if (response.data.status) {
            const notification = {
              title: this.$t('general.add_card_success'),
              level: 1,
              message: this.$t('general.card_was_added_successfully'),
            };
            this.$router.push({
              name: 'order_placement',
              query: {
                action: 'add_card',
              },
            });
            this.payment_state = this.$t('general.payment_success');
            const acc = this.$store.getters.getSession;

            this.trackMixpanelEvent('Card Payment', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
            });
            this.displayNotification(notification);
          } else {
            const notification = {
              // eslint-disable-next-line no-undef
              title: $t('general.add_card_failed'),
              level: 2,
              message: response.data.message,
            };
            this.displayNotification(notification);
          }
        },
        (error) => {
          const notification = {
            title: this.$t('general.add_card_failed'),
            level: 2,
            message: this.$t('general.something_went_wrong_while_adding_new_card'),
          };
          this.displayNotification(notification);
        },
      );
    },

    creditCardMask() {
      const currentVal = this.add_card_payment_data.card_no;
      const newCur = currentVal.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      this.add_card_payment_data.card_no = newCur.trim();
    },
    creditCExpiryMask($event) {
      const currentVal = this.add_card_payment_data.card_expiry;
      let newCur = currentVal;
      if ($event.code !== 'Backspace') {
        newCur = currentVal.replace(/\W/gi, '').replace(/(.{2})/g, '$1/');
        if (newCur.length > 5) {
          newCur = newCur.slice(0, 5);
        }
      }
      this.add_card_payment_data.card_expiry = newCur.trim();
    },
  },
};
</script>
<style lang="css"></style>
