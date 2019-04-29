<template lang="html">
  <div class="paymethod">
    <router-link v-if="getCountryCode === 'KE'" class="paymethod--link" to="/payment/mpesa">
      M-Pesa
    </router-link>
    <router-link class="paymethod--link" to="/payment/card">
      Card
    </router-link>
    <router-link class="paymethod--link" to="/payment/promo">
      Promo Code
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PayMethod',
  computed: {
    ...mapGetters({
      getCountryCode: 'getCountryCode',
    }),
  },
};
</script>

<style lang="css"></style>
