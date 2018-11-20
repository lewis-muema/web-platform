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
import { mapActions, mapGetters } from "vuex";

export default {
  name: "mpesa-component",

  data() {
    return {
      mpesa_payment_data: {
        amount: "",
        phone_number: ""
      },
      payment_state: "Mpesa Payment Not Initiated"
    };
  },
  methods: {
    ...mapActions(["$_payment/requestMpesaPayment"]),
    requestMpesaPayment() {
      console.log("requesting mpesa payment");
      let session = this.$store.getters.getSession;
      let referenceNumber = "SENDY";
      let cop_id = 0;
      let user_id = 0;
      let user_email = "";
      if (session.default == "biz") {
        referenceNumber += session.biz.cop_id;
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_email = session.biz.user_email;
      } else {
        referenceNumber = session.peer.user_phone;
        user_id = session.peer.user_id;
        user_email = session.peer.user_email;
      }
      //TOOD: add cop_id to refrence if cop account
      //pass the phone no if peer
      let mpesa_payload = {
        amount: this.mpesa_payment_data.amount,
        sourceMobile: this.mpesa_payment_data.phone_number,
        referenceNumber: referenceNumber,
        user_id: user_id,
        cop_id: cop_id,
        phone: this.mpesa_payment_data.phone_number, //confirm about this later
        email: user_email
	  };
	  
	  console.log(mpesa_payload);

      //TODO: implement the discount bundles if needed

      let full_payload = {
        values: mpesa_payload,
        vm: this,
        app: "BACKEND_CUSTOMERS_APP",
        endpoint: "mpesacheckout"
      };

      console.log(mpesa_payload);

      this.payment_state = "requesting Mpesa Payment";

      this.$store.dispatch("$_payment/requestMpesaPayment", full_payload).then(
        response => {
          console.log(response);
          this.payment_state = "Mpesa Payment Success";
        },
        error => {
          this.payment_state = "Mpesa Payment Failed";
        }
      );
    }
  },
  computed: {
    valid_payment() {
      //validate amount
      //validate mpesa number
      return (
        this.mpesa_payment_data.amount !== "" &&
        this.mpesa_payment_data.phone_number !== ""
      );
    }
  }
};
</script>

<style lang="css">
</style>
