<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="amount" value="" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="text" name="phone_no" value="" placeholder="Safaricom Phone Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <button type="button" name="button" class="button-primary paymentbody--input-button">Pay</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mpesa-component',
}
</script>

<style lang="css">

</style>
