<template lang="html">
  <div class="">
    <main-header />
    <div
      id="admin_container"
      class="container adm
n-container"
    >
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
import VeeValidate, { Validator } from 'vee-validate';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import adminStore from './_store';

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
  name: 'Admin',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler() {
        this.$router.push('/orders');
      },
      deep: true,
    },
  },
  created() {
    const STORE_KEY = '$_admin';
    this.$store.registerModule(STORE_KEY, adminStore);
    this.trackMixpanelEvent('Select Admin Settings Menu');
  },
  destroyed() {
    // TO DO:  destroy store?
  },

  methods: {
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css?v=4";
@import "../../assets/styles/section_filters.css?v=4";
@import "../../assets/styles/section_pagination.css?v=4";
</style>
