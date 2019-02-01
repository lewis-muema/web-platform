<template lang="html">
    <div class="">
        <main-header></main-header>
        <div class="container admin-container" id="admin_container">
            <!--<div class="title">-->
                <!--<h3 class="title__text">Admin Settings</h3>-->
            <!--</div>-->
            <div class="section">
                <router-link class="section__link" to="/admin/users">Users</router-link>
                <router-link class="section__link" to="/admin/department">Department</router-link>
                <!--<router-link class="section__link" to="/admin/preferences">Preferences</router-link>-->
                <router-link class="section__link" to="/admin/api">API</router-link>
                <router-link class="section__link" to="/admin/company_details">Company details</router-link>
            </div>
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>

<script>
import admin_store from './_store';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input';

Vue.use(VueTelInput);
Vue.use(VeeValidate);

Validator.extend('check_phone', {
       getMessage: field => `The phone number not valid`,
       validate: value => {
         let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
         let validity = false
         try {

           let number = phoneUtil.parse(value);
           validity = (phoneUtil.isValidNumber(number));
         } catch (e) {
           console.log(e) ;
           validity = false ;
         }
         return validity;
       }
   });

export default {
  name:'admin',
  components : {MainHeader},
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_admin';
    this.$store.registerModule(STORE_KEY, admin_store);
  },
  computed: {
    ...mapGetters({
      getSession : 'getSession'
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal){
        this.$router.push('/orders');
      },
      deep: true
    }
  },
  destroyed(){
      // TO DO:  destroy store?
  }
}
</script>

<style lang="css">
    @import "../../assets/styles/section_headers.css";
    @import "../../assets/styles/section_filters.css";
    @import "../../assets/styles/section_pagination.css";

</style>
