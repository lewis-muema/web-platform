<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="card_payment_amount" v-model="card_payment_data.amount" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="text" name="card_payment_card_no" v-model="card_payment_data.card_no" placeholder="Card Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap paymentbody--input-spaced">
      <input type="text" name="card_payment_month" v-model="card_payment_data.month" value="" placeholder="MM/YY" class="input-control paymentbody--input input-control-big">
      <input type="text" name="card_payment_cvv"  v-model="card_payment_data.cvv" placeholder="CVV" class="input-control paymentbody--input input-control-small">
    </div>
    
    <div class="paymentbody--input-wrap savecard--desc-wrap">
      <input type="checkbox" name="card_payment_save" v-model="card_payment_data.is_save" class="input-checkbox paymentbody--input-checkbox">
      <div class="savecard--desc-title">Save your card details for easier payment in future</div>
    </div>

    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment ? 'button-primary paymentbody--input-button':'paymentbody--input-button button--primary-inactive'" @click="requestCardPayment">Pay</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      card_payment_data : {
        "month":"",
        "year":"",
        "cvc":"",
        "card_no":"",
        "amount":"",
        "is_save":true
      },
      payment_state: "Attempting Payment"
    }
  },
  computed: {
    valid_payment() {
      return (this.card_payment_data.month !== '' && this.card_payment_data.year !== '' && this.card_payment_data.month !== '' && this.card_payment_data.cvv  !== '') ;
     }
  },
  methods: {
    ...mapActions([
      '$_payment/requestCardPayment',
    ]),
    requestCardPayment() {
        
        //sort encryption

      let card_payload = {
          "BambaMID":7 , //this should be encrypted
          "command":"ChargeCard",
          "Amount": this.card_payment_data.amount,
          "expryMonth": this.card_payment_data.month,
          "expryYear": this.card_payment_data.year,
          "Cardnumber": this.card_payment_data.card_no,
          "CardCvv": this.card_payment_data.cvv,
          "is_save": this.card_payment_data.is_save,
          "cop_id": session.cop_id,
          "user_id": session.user_id
        }

        let full_payload = {
          "values" : card_payload,
          "vm":this,
          "app":"BACKEND_CUSTOMERS_APP",
          "endpoint":"cardapi"
        }
        this.$store.dispatch("$_payment/requestCardPayment", full_payload).then(response => {
          this.payment_state = "Payment Success";
        }, error => {
          this.payment_state = "Payment Failed";
        });
    }
  }
}
</script>

<style lang="css">
.paymentbody--input-small
{
  min-height: 2rem;
}
.paymentbody .input-control-small
{
  width: 30%;
}
.paymentbody .input-control-big
{
  width: 60%;
}
.paymentbody--input-checkbox
{
  margin-right: 10px;
}

.savecard--desc-wrap {
    margin-top: 30px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: -35px;
}
.savecard--desc-title {
    margin-left: 10px;
    font-size: 14px;
    margin-top: 5px;
    height: auto;
    line-height: 15px;
}

</style>
