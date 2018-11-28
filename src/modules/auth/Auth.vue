<template lang="html">
  <div class="" id="auth_container">
      <external-header></external-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue"
import auth_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import ExternalHeader from '../../components/headers/ExternalHeader.vue'
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput)
Vue.use(VeeValidate);

Validator.extend('check_phone', {
       getMessage: field => `The phone number not valid`,
       validate: value => {
         const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
         var validity = false
         try {

           var number = phoneUtil.parse(value);
           validity = (phoneUtil.isValidNumber(number));
         } catch (e) {
           console.log(e)
           validity = false
         }
         return validity;
       }
   });


export default {
  name:'Auth',
  mixins: [ RegisterStoreModule ],
  components : {ExternalHeader},
  created() {
    const STORE_KEY = '$_auth';
    this.$store.registerModule('$_auth', auth_store);
  },
}
</script>

<style lang="css">
</style>
