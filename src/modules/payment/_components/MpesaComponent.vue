<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="amount" v-model="mpesa_payment_data.amount" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="text" name="phone_no" v-model="mpesa_payment_data.phone_number" placeholder="Safaricom Phone Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" :class="valid_payment ? 'button-primary paymentbody--input-button':'paymentbody--input-button button--primary-inactive'">Pay</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mpesa-component',

  data() {
    return {
      mpesa_payment_data: {
        "amount":"",
        "phone_number":""
      }
    }
  },
  computed: {
    valid_payment() {
      return (this.mpesa_payment_data.amount  !== '' && this.mpesa_payment_data.phone_number !== '');
    }
  }
}
</script>

<style lang="css">

</style>
