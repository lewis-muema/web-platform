<template lang="html">
  <div class="paymethod">
    <router-link class="paymethod--link" to="/payment/mpesa">Mpesa</router-link>
    <router-link class="paymethod--link" to="/payment/card">Card</router-link>
    <router-link class="paymethod--link" to="/payment/promo">Promo Code</router-link>
  </div>
</template>

<script>
export default {
  name: 'pay-method',
}
</script>

<style lang="css">
.paymethod
{
  margin: 40px 0px 20px 0px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.paymethod--link
{
  color: #555;
  text-transform: uppercase;
  font-size: 16px;
  text-align: center;
  padding: 2px;
  text-decoration: none;
  flex: 1;
}
.paymethod--link.router-link-active
{
  color: #1782c5;
  font-weight: normal;
  border-bottom: 3px solid #1782c5;
}
</style>
