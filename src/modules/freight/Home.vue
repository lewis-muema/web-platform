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
import { mapGetters, mapActions } from 'vuex';
import VeeValidate, { Validator } from 'vee-validate';
import freightStore from './_store';
import ordersModuleStore from '../orders/_store';
import transactionsModuleStore from '../transactions/_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import SessionMxn from '../../mixins/session_mixin';
import MainHeader from '../../components/headers/MainHeader.vue';

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
  name: 'FreightHome',
  components: { MainHeader, SessionMxn },
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
  watch: {},
  mounted() {
    this.checkSessionData();
  },
  created() {
    const STORE_KEY = '$_freight';
    this.$store.registerModule(STORE_KEY, freightStore);
    this.registerOrderModule();
    this.registerTransactionsModule();
  },
  methods: {
    ...mapActions({
      requestFreightStatus: '$_freight/requestFreightStatus',
    }),
    checkSessionData() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.sessionData = true;
        this.checkFreightStatus();
      }
    },
    registerOrderModule() {
      const STORE_KEY = '$_orders';
      this.$store.registerModule(STORE_KEY, ordersModuleStore);
    },
    registerTransactionsModule() {
      const STORE_KEY = '$_transactions';
      this.$store.registerModule(STORE_KEY, transactionsModuleStore);
    },
    checkFreightStatus() {
      const session = this.$store.getters.getSession;
      let values = '';
      if (session.default === 'biz') {
        values = `copId=${session[session.default].cop_id}`;
      } else {
        values = `userId=${session[session.default].user_id}`;
      }
      const fullPayload = {
        values,
        app: 'ADONIS_PRIVATE_API',
        endpoint: `freight-status?${values}`,
      };
      this.requestFreightStatus(fullPayload).then(
        (response) => {
          let status = 0;

          if (response.length === undefined || response.length === 'undefined') {
            status = response.freight_status;
          } else {
            const arrLength = response.length;
            status = response[arrLength - 1].freight_status;
          }
          if (status === 0) {
            this.$router.push('/freight');
          } else if (status === 1) {
            this.$router.push('/freight/verify');
          }
          const updatedSession = session;
          updatedSession[session.default].freight_status = status;
          const newSession = JSON.stringify(updatedSession);
          this.setSession(newSession);
        },
        () => {
          // error
        },
      );
    },
  },
};
</script>

<style lang="css"></style>
