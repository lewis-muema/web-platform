<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input">
      <input type="text" name="amount" value="" placeholder="Amount" class="paymentbody input-control">
    </div>
    <div class="paymentbody--input">
      <input type="text" name="phone_no" value="" placeholder="Safaricom Phone Number" class="paymentbody input-control">
    </div>
    <div class="paymentbody--input">
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
