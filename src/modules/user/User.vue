<template lang="html">
  <div
    v-if="sessionData"
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
import userStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => this.$t('general.phone_number_not_valid'),
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
  name: 'User',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  data() {
    return {
      sessionData: false,
    };
  },
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
  mounted() {
    this.checkSessionData();
  },
  created() {
    const STORE_KEY = '$_user';
    this.$store.registerModule(STORE_KEY, userStore);
  },
  methods: {
    checkSessionData() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.sessionData = true;
      } else {
        this.$router.push('/orders');
      }
    },
  },
};
</script>

<style lang="css"></style>
