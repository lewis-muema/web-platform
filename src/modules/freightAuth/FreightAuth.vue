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
import VeeValidate, { Validator } from 'vee-validate';
import freightAuthStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import ExternalHeader from '../../components/headers/freight/ExternalHeader.vue';

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
  components: { ExternalHeader },
  mixins: [RegisterStoreModule],
  created() {
    this.$store.registerModule('$_freightAuth', freightAuthStore);
  },
};
</script>

<style lang="css"></style>
