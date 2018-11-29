<template lang="html">
  <div class="paymethod">
    <router-link class="paymethod--link" to="/payment/mpesa">Mpesa</router-link>
    <router-link class="paymethod--link" to="/payment/card">Card</router-link>
    <router-link class="paymethod--link" to="/payment/promo">Promo Code</router-link>
  </div>
</template>

<script>
export default {
  name: "pay-method"
};
</script>

<style lang="css">
</style>
