<template lang="html">
  <div class="paymethod">
    <router-link v-if="!country_code" class="paymethod--link" to="/payment/mpesa">
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
  data() {
    return {
      country_code: false,
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
    }),
  },
  watch: {
    getSess: {
      handler() {
        this.getCountryCode();
      },
      deep: true,
    },
  },
  mounted() {
    this.getCountryCode();
  },
  computed: {
    getCountryCode() {
      const session = this.$store.getters.getSession;
      const countryCode = session[session.default].country_code;
      if (countryCode === 'UG') {
        this.country_code = true;
      } else {
        this.country_code = false;
      }
    },
  },
};
</script>

<style lang="css"></style>
