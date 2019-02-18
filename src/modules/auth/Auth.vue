<template lang="html">
  <div
    id="auth_container"
    class=""
  >
    <external-header />
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input';
import auth_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import ExternalHeader from '../../components/headers/ExternalHeader.vue';

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
  name: 'Auth',
  components: { ExternalHeader },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_auth';
    this.$store.registerModule('$_auth', auth_store);
  },
};
</script>

<style lang="css"></style>
