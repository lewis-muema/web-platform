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
.paymentbody--input-control
{
  height: 42px;
  width: 100%;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  padding: 6px 12px;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.paymentbody--input
{
  display: flex;
  min-height: 4rem;
  margin: .5em;
}
.paymentbody--input-spaced
{
  justify-content: space-between;
}
.paymentbody--input-button
{
  cursor: pointer;
  height: 42px;
  width: 100%;
  color: #fff;
  text-transform: uppercase;
  font-size: medium;
  letter-spacing: 1.1px;
  background-color: #1782c5;
}
</style>
