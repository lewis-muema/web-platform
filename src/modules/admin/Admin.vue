<template lang="html">
  <div class="">
    <main-header />
    <div
      id="admin_container"
      class="container admin-container"
    >
      <!--<div class="title">-->
      <!--<h3 class="title__text">Admin Settings</h3>-->
      <!--</div>-->
      <div class="section">
        <router-link
          class="section__link"
          to="/admin/users"
        >
          Users
        </router-link>
        <router-link
          class="section__link"
          to="/admin/department"
        >
          Department
        </router-link>
        <!--<router-link class="section__link" to="/admin/preferences">Preferences</router-link>-->
        <router-link
          class="section__link"
          to="/admin/api"
        >
          API
        </router-link>
        <router-link
          class="section__link"
          to="/admin/company_details"
        >
          Company details
        </router-link>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input';
import MainHeader from '../../components/headers/MainHeader.vue';
import RegisterStoreModule from '../../mixins/register_store_module';
import admin_store from './_store';

Vue.use(VueTelInput);
Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => 'The phone number not valid',
  validate: (value) => {
    const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    let validity = false;
    try {
      const numb = phoneUtil.format(value);
      const number = phoneUtil.parse(numb);
      validity = phoneUtil.isValidNumber(number);
    } catch (e) {
      console.log(e);
      validity = false;
    }
    return validity;
  },
});

export default {
  name: 'Admin',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_admin';
    this.$store.registerModule(STORE_KEY, admin_store);
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        this.$router.push('/orders');
      },
      deep: true,
    },
  },
  destroyed() {
    // TO DO:  destroy store?
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css";
@import "../../assets/styles/section_filters.css";
@import "../../assets/styles/section_pagination.css";
</style>
