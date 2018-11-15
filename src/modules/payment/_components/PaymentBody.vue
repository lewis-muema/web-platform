<template lang="html">
  <div class="paymentbody">
    <pay-method/>
    <div class="">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import PayMethod from './PayMethod.vue'

export default {
  name: 'payment-body',
  components: {PayMethod}
}
</script>

<style lang="css">
.paymentbody {
  margin-top: 50px;
}
.paymentbody--input-wrap
{
  display: flex;
  min-height: 4rem;
  margin: .5em;
}
.paymentbody--input {
    height: 45px;
    margin-top: 20px;
}
.paymentbody--input-spaced
{
  justify-content: space-between;
}
.paymentbody--input-button
{
  margin-top: 20px;
  text-transform: uppercase;
  font-size: medium;
  letter-spacing: 1.1px;
  width: 100%;
  height: 45px;
}
</style>
