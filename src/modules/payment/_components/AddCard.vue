<template lang="html">
  <payment_loading v-if="card_loading_status" pay_method="add_card"></payment_loading>
  <div class="paymentbody--form" v-else>
    <div class="paymentbody--input-wrap">
      <input
        type="text"
        name="card_payment_card_no"
        @change="creditCardMask()"
        @keyup="creditCardMask()"
        v-model="add_card_payment_data.card_no"
        placeholder="Card Number"
        class="input-control paymentbody--input"
      />
    </div>

    <div class="paymentbody--input-wrap paymentbody--input-spaced">
      <div class="input-control-big">
        <input
          type="text"
          name="card_payment_month"
          v-model="add_card_payment_data.card_expiry"
          value=""
          placeholder="MM/YY"
          class="input-control paymentbody--input"
          @change="creditCExpiryMask"
          @keyup="creditCExpiryMask"
        />
      </div>
      <div class="input-control-small">
        <el-input
          placeholder="CVV"
          v-model="add_card_payment_data.cvv"
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
          ></el-button>
        </el-input>
        <div class="payment--cvv-info-wrap" v-show="cvv_state">
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
            />
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
        Add Card
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import payment_loading from './LoadingComponent.vue';
import payment_success from './SuccessComponent.vue';
import payment_fail from './FailComponent.vue';
import Mcrypt from '../../../mixins/mcrypt_mixin.js';

export default {
  name: 'add_card',
  components: { payment_loading, payment_success, payment_fail },
  mixins: [Mcrypt],
  data() {
    return {
      add_card_payment_data: {
        card_expiry: '',
        cvv: '',
        card_no: '',
      },
      payment_state: 'Adding a new card',
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
        this.add_card_payment_data.card_expiry !== '' &&
        this.add_card_payment_data.card_no !== '' &&
        this.add_card_payment_data.cvv !== ''
      );
    },
    cvv_state() {
      return this.show_cvv;
    },
    card_expiry_month() {
      let exp = this.add_card_payment_data.card_expiry;
      if (exp.length === 5) {
        return exp.slice(0, 2);
      }
      return '';
    },
    card_expiry_year() {
      let exp = this.add_card_payment_data.card_expiry;
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
    trackMixpanelEvent(name){
      let analytics_env = '';
      try {
        analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      }
      catch (er) {

      }

      try{
        if(analytics_env === 'production'){
          mixpanel.track(name);
        }
      }
      catch(er){

      }
    },
    ...mapActions({ requestAddNewCardAction: '$_payment/requestAddNewCard' }),

    handleAddCard() {
      //sort encryption
      let session = this.$store.getters.getSession;

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

      let user_fname = user_name[0];
      let user_lname = user_name[user_name.length - 1];
      let card_payload = {
        exp_month: this.card_expiry_month,
        exp_year: this.card_expiry_year,
        card_no: this.add_card_payment_data.card_no,
        cvc: this.add_card_payment_data.cvv,
        user_email: user_email,
        cop_id: cop_id,
        user_id: user_id,
        user_phone: user_phone,
        user_lname: user_lname,
        user_fname: user_fname,
      };

      card_payload = Mcrypt.encrypt(card_payload);

      let full_payload = {
        values: card_payload,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'add_card',
      };
      this.requestAddNewCardAction(full_payload).then(
        response => {
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
          let that = this;

          if (response.data.status) {
            let notification = {
              title: 'Add Card Success',
              level: 1,
              message: 'card was added successfully',
            };
            this.payment_state = 'Payment Success';
            this.trackMixpanelEvent('Card Payment', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
            });
            that.$store.dispatch('show_notification', notification, {
              root: true,
            });
          } else {
            let notification = {
              title: 'Add Card Failed',
              level: 2,
              message: response.data.message,
            };
            that.$store.dispatch('show_notification', notification, {
              root: true,
            });
          }
        },
        error => {
          console.log(error);
          let notification = {
            title: 'Add Card Failed',
            level: 2,
            message: 'something went wrong while adding new card',
          };
          that.$store.dispatch('show_notification', notification, {
            root: true,
          });
        }
      );
    },

    creditCardMask() {
      let current_val = this.add_card_payment_data.card_no;
      let new_cur = current_val.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ');
      this.add_card_payment_data.card_no = new_cur.trim();
    },
    creditCExpiryMask($event) {
      let current_val = this.add_card_payment_data.card_expiry;
      let new_cur = current_val;
      if ($event.code !== 'Backspace') {
        new_cur = current_val.replace(/\W/gi, '').replace(/(.{2})/g, '$1/');
        if (new_cur.length > 5) {
          new_cur = new_cur.slice(0, 5);
        }
      }
      this.add_card_payment_data.card_expiry = new_cur.trim();
    },
  },
};
</script>
<style lang="css"></style>
