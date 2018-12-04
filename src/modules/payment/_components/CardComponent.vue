<template lang="html">
  <payment_loading v-if="card_loading_status" pay_method = "card"></payment_loading>
  <add_card v-else-if="card_add_status"></add_card>
  <div class="paymentbody--form" v-else>
    <div class="paymentbody--input-wrap">
        <input type="number" name="card_payment_amount" v-model="card_payment_data.amount" placeholder="Amount" class="input-control paymentbody--input">
    </div>

    <div class="paymentbody--input-wrap">
        <input type="text" name="card_payment_card_no" @change="creditCardMask()" @keyup="creditCardMask()" v-model="card_payment_data.card_no" placeholder="Card Number" class="input-control paymentbody--input">
    </div>
    
    <div class="paymentbody--input-wrap paymentbody--input-spaced">
        <div class="input-control-big">
          <input type="text" name="card_payment_month" v-model="card_payment_data.card_expiry" value="" placeholder="MM/YY" class="input-control paymentbody--input" @change="creditCExpiryMask" @keyup="creditCExpiryMask">
          <span class="sendy_payments_input_info input_info_last" v-show="invalid_expiry != null">
            {{ invalid_expiry }}
          </span>
        </div>
        <div class="input-control-small">
           <el-input placeholder="CVV"  v-model="card_payment_data.cvv" type="number" name="card_payment_cvv" class="paymentbody--input">
            <el-button slot="append" icon="el-icon-info" class="input--append-button" @click="showCvv" @mouseover.native="showCvv" @mouseleave.native="showCvv"></el-button>
           </el-input>
           <div class="payment--cvv-info-wrap" v-show="cvv_state">
              <div class="sendy_payments_form_cvv_title">
                CVV
              </div>
              <div class="sendy_payments_form_cvv_description">
                A three or four digit code on your credit or debit card. You can find this at the back of your card.
              </div>
              <div class="sendy_payments_form_cvv_body">
                <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/cvv.png" alt="CVV">
              </div>
          </div>  
        </div>       
    </div>
    
    <div class="paymentbody--input-wrap savecard--desc-wrap">
        <input type="checkbox" name="card_payment_save" v-model="card_payment_data.is_save" class="input-checkbox paymentbody--input-checkbox">
        <div class="savecard--desc-title">Save your card details for easier payment in future</div>
    </div>

    <div class="paymentbody--input-wrap">
        <button type="button" name="button" :class="valid_payment ? 'button-primary paymentbody--input-button':'paymentbody--input-button button--primary-inactive'" @click="handleCardPayment">Pay</button>
    </div>

   
    
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import payment_loading from "./LoadingComponent.vue";
import payment_success from "./SuccessComponent.vue";
import payment_fail from "./FailComponent.vue";
import add_card from "./AddCard.vue";
import Mcrypt from "../../../mixins/mcrypt_mixin.js";

export default {
  name: "card-component",
  mixins: [Mcrypt],
  components: { payment_loading, payment_success, payment_fail, add_card },
  data() {
    return {
      card_payment_data: {
        card_expiry: "",
        cvv: "",
        card_no: "",
        amount: "",
        is_save: true
      },
      payment_state: "Attempting Payment",
      show_cvv: false
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      card_fail_status: "$_payment/getCardFailStatus",
      card_loading_status: "$_payment/getCardLoadingStatus",
      card_success_status: "$_payment/getCardSuccessStatus"
    }),
    valid_payment() {
      return (
        this.card_payment_data.card_expiry !== "" &&
        this.card_payment_data.amount !== "" &&
        this.card_payment_data.card_no !== "" &&
        this.card_payment_data.cvv !== ""
      );
    },
    cvv_state() {
      return this.show_cvv;
    },
    card_expiry_month() {
      let exp = this.card_payment_data.card_expiry;
      if (exp.length == 5) {
        return exp.slice(0, 2);
      }
      return "";
    },
    card_expiry_year() {
      let exp = this.card_payment_data.card_expiry;
      if (exp.length == 5) {
        return exp.slice(3);
      }
    },
    card_add_status() {
      if (typeof this.$route.query.action !== "undefined") {
        let action = this.$route.query.action;
        if (action == "add") {
          return true;
        }
      } else {
        return false;
      }
    }
  },
  methods: {
    showCvv() {
      if (this.show_cvv == true) {
        this.show_cvv = false;
      } else {
        this.show_cvv = true;
      }
    },
    ...mapActions(["$_payment/requestCardPayment"]),

    handleCardPayment() {
      //sort encryption
      let session = this.$store.getters.getSession;

      let user_id = 0;
      let cop_id = 0;
      let user_name = "";
      let user_email = "";
      let user_phone = "";

      if (session.default == "biz") {
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

      let card_payload = {
        amount: this.card_payment_data.amount,
        exp_month: this.card_expiry_month,
        exp_year: this.card_expiry_year,
        card_no: this.card_payment_data.card_no,
        cvv: this.card_payment_data.cvv,
        is_save: this.card_payment_data.is_save,
        cop_id: cop_id,
        user_id: user_id,
        user_email: user_email,
        user_phone: user_phone,
        user_name: user_name
      };

      card_payload = Mcrypt.encrypt(card_payload);

      let full_payload = {
        values: card_payload,
        vm: this,
        app: "PRIVATE_API",
        endpoint: "card_payment"
      };
      this.$store.dispatch("$_payment/requestCardPayment", full_payload).then(
        response => {
          response.data = Mcrypt.decrypt(response.data);
          let that = this;

          if (response.data.status == false) {
            this.payment_state = "Payment Failed";
            let notification = {
              title: "card payment failed",
              level: 2,
              message: response.data.message
            };
            that.$store.dispatch("show_notification", notification, {
              root: true
            });
          } else {
            let notification = {
              title: "card payment sucess",
              level: 1,
              message: "card payment was processed successfully"
            };
            this.payment_state = "Payment Success";
            that.$store.dispatch("show_notification", notification, {
              root: true
            });

            let card_trans_id = response.data.values.card_trans_id;
            this.completeCardPayment(card_trans_id);
            //complete payment here
          }
        },
        error => {
          console.log(error);
          this.payment_state = "Payment Failed";
        }
      );
    },
    completeCardPayment(card_trans_id) {
      let session = this.$store.getters.getSession;
      let user_id = 0;
      let cop_id = 0;
      let user_name = "";
      let user_email = "";
      let user_phone = "";

      if (session.default == "biz") {
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

      let payload = {
        amount: this.card_payment_data.amount,
        pay_method: 2,
        ref_no: "VISA-" + Math.round(+new Date() / 1000),
        client_id: cop_id,
        account_no: "SENDY" + cop_id,
        phone: user_phone,
        email: user_email,
        name: user_name,
        bill_Ref_Number: user_phone,
        card_trans_id: card_trans_id
      };

      let full_payload = {
        vm: payload.vm,
        values: payload,
        app: "PRIVATE_API",
        endpoint: "payment"
      };

      this.$store.dispatch("$_payment/completeCardPayment", full_payload).then(
        response => {
          if (response.data.status == true) {
            //this will request the new running balance and update the store
            let notification = {
              title: "card payment complete",
              level: 1,
              message: "card payment successfull"
            };
            that.$store.dispatch("show_notification", notification, {
              root: true
            });

            let that = this;
            let payload = {
              values: running_balance_payload,
              vm: this,
              app: "PRIVATE_API",
              endpoint: "running_balance"
            };

            this.$store.dispatch("requestRunningBalance", payload, {root: true})
              .then(response => {
                console.log("running balance response", response);
              });
          } else {
            let notification = {
              title: "card payment failed",
              level: 3,
              message: "card payment failed to complete"
            };
            that.$store.dispatch("show_notification", notification, {
              root: true
            });
          }
        },
        error => {
          console.log(error);
          this.payment_state = "Payment Failed";
        }
      );
    },
    creditCardMask() {
      let current_val = this.card_payment_data.card_no;
      let new_cur = current_val.replace(/\W/gi, "").replace(/(.{4})/g, "$1 ");
      this.card_payment_data.card_no = new_cur.trim();
    },
    creditCExpiryMask($event) {
      let current_val = this.card_payment_data.card_expiry;
      let new_cur = current_val;
      if ($event.code != "Backspace") {
        new_cur = current_val.replace(/\W/gi, "").replace(/(.{2})/g, "$1/");
        if (new_cur.length > 5) {
          new_cur = new_cur.slice(0, 5);
        }
      }
      this.card_payment_data.card_expiry = new_cur.trim();
    }
  }
};
</script>
<style lang="css">
</style>
