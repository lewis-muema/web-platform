<template lang="html">
  <div class="paymethod">
    <router-link
      v-if="getCountryCode === 'KE' && mpesa_valid"
      class="paymethod--link"
      to="/payment/mpesa"
    >
      M-Pesa
    </router-link>
    <router-link class="paymethod--link" to="/payment/card">
      Card
    </router-link>
    <router-link
      v-if="getCountryCode === 'KE' && mpesa_valid && currency === 'KES'"
      class="paymethod--link"
      to="/payment/promo"
    >
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
      mpesa_valid: false,
      currency: 'KES',
    };
  },
  computed: {
    ...mapGetters({
      getCountryCode: 'getCountryCode',
    }),
  },
  created() {
    this.checkUserPhone();
  },
  methods: {
    checkUserPhone() {
      const session = this.$store.getters.getSession;
      const phone = session[session.default].user_phone;
      this.currency = session[session.default].default_currency;
      const intValue = phone.substring(0, 4);
      if (intValue === '+256') {
        this.mpesa_valid = false;
      } else {
        this.mpesa_valid = true;
      }
    },
  },
};
</script>

<style lang="css"></style>
