<template lang="html">
  <div
    id="auth_container"
    class=""
  >
    <external-header />
    <freight-background v-if="freightPages.includes(route_path)" />
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import freightAuthStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import ExternalHeader from '../../components/headers/freight/ExternalHeader.vue';
import FreightBackground from './components/FreightBackground.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => 'The phone number not valid',
  validate: (value) => {
    let validity = false;
    try {
      const rawNumber = phoneUtil.parseAndKeepRawInput(value);
      const numberCode = phoneUtil.getRegionCodeForNumber(rawNumber);
      const number = phoneUtil.parse(value, numberCode);
      validity = phoneUtil.isValidNumber(number);
    } catch (e) {
      validity = false;
    }
    return validity;
  },
});

export default {
  name: 'FreightAuth',
  components: { ExternalHeader, FreightBackground },
  mixins: [RegisterStoreModule],
  data() {
    return {
      freightPages: [
        '/freight/sign_up',
        '/freight/sign_up/verification',
        '/freight/sign_up/congratulations',
        '/freight/forgot_password',
      ],
    };
  },
  computed: {
    route_path() {
      return this.$route.path;
    },
  },
  created() {
    this.$store.registerModule('$_freightAuth', freightAuthStore);
  },
};
</script>

<style lang="css"></style>
