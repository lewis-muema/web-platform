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
      mpesa_valid: false,
    };
  },
  computed: {
    ...mapGetters({
      getCountryCode: 'getCountryCode',
    }),
  },
  methods: {
    checkUserPhone() {
      let session = this.$store.getters.getSession;
      let phone = session[session.default]['user_phone'];
      let int_value = phone.substring(0, 4);
      if (int_value === '+254') {
        this.mpesa_valid = true;
      } else {
        this.mpesa_valid = false;
      }
    },
  },
  created() {
    this.checkUserPhone();
  },
};
</script>

<style lang="css"></style>
