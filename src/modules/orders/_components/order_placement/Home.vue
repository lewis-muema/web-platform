<template lang="html">
  <div class="homeview--outer">
    <order-placement />
  </div>
</template>

<script>
import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import OrderPlacement from './OrderPlacement.vue';
import EventsMixin from '../../../../mixins/events_mixin';

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
  name: 'Home',
  components: { OrderPlacement },
};
</script>

<style lang="css">
@import "../../../../assets/styles/orders_order_placement.css?v=2";
</style>
