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
import VeeValidate, { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input';
import userStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VueTelInput);
Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => 'The phone number not valid',
  validate: (value) => {
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
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        if (oldVal !== val) {
          this.$router.push('/orders');
        }
      },
      deep: true,
    },
  },
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, userStore);
  },
};
</script>

<style lang="css"></style>
