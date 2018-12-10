<template lang="html">
  <div class="" id="user_container">
      <main-header></main-header>
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from "vue"
import user_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'
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
  name:'User',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, user_store);
  },
}
</script>

<style lang="css">
</style>
