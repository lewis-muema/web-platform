<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="number" name="amount" v-model="mpesa_payment_data.amount" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="number" name="phone_no" v-model="mpesa_payment_data.phone_number" placeholder="Safaricom Phone Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment ? 'button-primary paymentbody--input-button':'button--primary-inactive paymentbody--input-button'" @click="requestMpesaPayment">Pay</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'mpesa-component',

  data() {
    return {
      mpesa_payment_data: {
        "amount":"",
        "phone_number":""
      },
      payment_state: "Mpesa Payment Not Initiated"
    }
  },
  methods: {
    ...mapActions([
      '$_payment/requestMpesaPayment',
    ]),
    requestMpesaPayment() {
        let session = this.$store.getters.getSession;
        let refrenceNumber = 'SENDY';
        //TOOD: add cop_id to refrence if cop account
        //pass the phone 
        let mpesa_payload = {
          "amount": this.mpesa_payment_data.amount,
          "sourceMobile": this.mpesa_payment_data.phone_number,
          "refrenceNumber":refrenceNumber,
          "user_id": "",
          "cop_id": "669",
          "phone": "0702990800",
          "email":"griffin@sendy.co.ke"
        }
        //TODO: implement the discount bundles if needed

        let full_payload = {
          "values" : mpesa_payload,
          "vm":this,
          "app":"BACKEND_CUSTOMERS_APP",
          "endpoint":"mpesacheckout"
        }

        console.log(mpesa_payload);
        
        this.payment_state = "requesting Mpesa Payment";

        this.$store.dispatch("$_payment/requestCardPayment", full_payload).then(response => {
          
          console.log(response);

          this.payment_state = "Mpesa Payment Success";
        }, error => {
          this.payment_state = "Mpesa Payment Failed";
        });


        
    }
  },
  computed: {
    valid_payment() {
      //validate amount
      //validate mpesa number
      return (this.mpesa_payment_data.amount  !== '' && this.mpesa_payment_data.phone_number !== '');
    }
  }
}
</script>

<style lang="css">

</style>
