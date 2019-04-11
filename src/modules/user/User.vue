<template lang="html">
  <div
    id="user_container"
    class=""
  >
    <main-header />
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input';
import user_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

Vue.use(VueTelInput);
Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => 'The phone number not valid',
  validate: (value) => {
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    let validity = false;
    try {
      const number = phoneUtil.parse(value);
      validity = phoneUtil.isValidNumber(number);
    } catch (e) {
      validity = false;
    }
    return validity;
  },
});

export default {
  name: 'User',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, user_store);
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        if (oldVal != val) {
          this.$router.push('/orders');
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="css"></style>
