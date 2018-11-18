<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="sendy_coupon" v-model="promocode_payment_data.sendy_coupon" placeholder="Promo Code" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment? 'button-primary paymentbody--input-button':'paymentbody--input-button button--primary-inactive'">Redeem</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      promocode_payment_data : {
        sendy_coupon:""
      }
    }
  },
  computed: {
    valid_payment() {
      return this.promocode_payment_data.sendy_coupon !== '';
    }
  },
  methods: {
     ...mapActions([
      '$_payment/requestPromoCodePayment',
    ]),
    requestPromoCodePayment() {
        let session = this.$store.getters.getSession;
        let cop_id = 0;
        if(session.default == 'biz'){
          cop_id = session[session.default]['cop_id'];
        }
        let payload = {
          "user_email": session[session.default]['user_email'],
          "user_phone": session[session.default]['user_phone'],
          "sendy_coupon": this.promocode_payment_data.sendy_coupon,
          "cop_id": cop_id,
          "client_type": session.default
        }

        let full_payload = {
          "values" : card_payload,
          "vm":this,
          "app":"PRIVATE_API",
          "endpoint":"redeem_promocode"
        }
        this.$store.dispatch("$_payment/requestPromoCodePayment", full_payload).then(response => {
          this.payment_state = "Promocode Redeem Success";
        }, error => {
          this.payment_state = "Promocode Redeeem Failed";
        });

        
    }
  }
}
</script>

<style lang="css">
</style>
