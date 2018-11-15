<template lang="html">
  <div class="paymentbody--form">
    <div class="paymentbody--input-wrap">
      <input type="text" name="amount" value="" placeholder="Amount" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap">
      <input type="text" name="phone_no" value="" placeholder="Card Number" class="input-control paymentbody--input">
    </div>
    <div class="paymentbody--input-wrap paymentbody--input-spaced">
      <input type="text" name="phone_no" value="" placeholder="MM/YY" class="input-control paymentbody--input input-control-big">
      <input type="text" name="phone_no" value="" placeholder="CVV" class="input-control paymentbody--input input-control-small">
    </div>
    
    <div class="paymentbody--input-wrap savecard--desc-wrap">
      <input type="checkbox" name="save_card" value="" class="input-checkbox paymentbody--input-checkbox">
      <div class="savecard--desc-title">Save your card details for easier payment in future</div>
    </div>

    <div class="paymentbody--input-wrap">
      <button type="button" name="button" class="button-primary paymentbody--input-button">Pay</button>
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
