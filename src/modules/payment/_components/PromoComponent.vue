<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="sendy_coupon" v-model="promocode_payment_data.sendy_coupon" placeholder="Promo Code" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment? 'button-primary paymentbody--input-button':'paymentbody--input-button button--primary-inactive'" @click="requestPromoPayment">Redeem</button>
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
    requestPromoPayment() {
        let session = this.$store.getters.getSession;
        let cop_id = 0;
        if(session.default == 'biz'){
          cop_id = session[session.default]['cop_id'];
        }
        let promo_payload = {
          values:{
             user_email: session[session.default]['user_email'],
             user_phone: session[session.default]['user_phone'],
             sendy_coupon: this.promocode_payment_data.sendy_coupon,
             cop_id: cop_id,
             client_type: session.default
          }
        }

        let full_payload = {
          "values" : promo_payload,
          "vm":this,
          "app":"PRIVATE_API",
          "endpoint":"redeem_promocode"
        }
        console.log('promocode redeem request');

        this.$store.dispatch("$_payment/requestPromoCodePayment", full_payload).then(response => {
          
          console.log(response);
          
          if(response.length > 0){
            response = response[0];
          }

          this.$store.commit('setNotificationStatus', true);
          let level = 0;
          let messsage = response.data.msg;
          if(response.data.status == false){
            level = 2;
          } else {
            level = 1;
          }
          let notification = {"title":"redeem promocode", "level":level, "messsage":messsage};
          this.$store.commit('setNotification', notification);
          
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
