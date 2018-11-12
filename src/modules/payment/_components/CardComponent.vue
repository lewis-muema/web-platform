<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input">
      <input type="text" name="amount" value="" placeholder="Amount" class="paymentbody--input-control">
    </div>
    <div class="paymentbody--input">
      <input type="text" name="phone_no" value="" placeholder="Card Number" class="paymentbody--input-control">
    </div>
    <div class="paymentbody--input paymentbody--input-spaced">
      <input type="text" name="phone_no" value="" placeholder="MM/YY" class="paymentbody--input-control paymentbody--input-control-big">
      <input type="text" name="phone_no" value="" placeholder="CVV" class="paymentbody--input-control paymentbody--input-control-small">
    </div>
    <div class="paymentbody--input paymentbody--input-small">
      <input type="checkbox" name="save_card" value="" class="paymentbody--input-checkbox">
      <span>Save your card details for easier payment in future</span>
    </div>
    <div class="paymentbody--input-small">
      <button type="button" name="button" class="paymentbody--input-button">Pay</button>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
.paymentbody--input-small
{
  min-height: 2rem;
}
.paymentbody--input-control-small
{
  width: 30%;
}
.paymentbody--input-control-big
{
  width: 60%;
}
.paymentbody--input-checkbox
{
  margin-right: 15px;
}
</style>
