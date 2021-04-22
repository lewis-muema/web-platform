<template lang="html">
  <div
    v-if="sessionData"
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
import RegisterStoreModule from '../../mixins/register_store_module';
import SessionMxn from '../../mixins/session_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';
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
  name: 'FreightHome',
  components: {
    MainHeader,
  },
  mixins: [RegisterStoreModule, SessionMxn, MixpanelMixin],
  data() {
    return {
      sessionData: false,
      status: '',
    };
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
  mounted() {
    this.checkSessionData();
  },
  created() {
    const moduleIsRegistered = this.$store._modules.root._children.$_freight !== undefined;
    if (!moduleIsRegistered) {
      this.$store.registerModule('$_freight', freightStore);
    }
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
      let val = '';
      if (session.default === 'biz') {
        val = `copId=${session[session.default].cop_id}`;
      } else {
        val = `userId=${session[session.default].user_id}`;
      }
      const fullPayload = {
        values: val,
        app: 'ADONIS_PRIVATE_API',
        endpoint: `freight-status?${val}`,
      };
      const status = session[session.default].freight_status;
      this.handleFreightRoute(status);

      this.requestFreightStatus(fullPayload).then(
        (response) => {
          let newStatus = '';
          if (response.length === undefined || response.length === 'undefined') {
            newStatus = response.freight_status;
          } else {
            const arrLength = response.length;
            newStatus = response[arrLength - 1].freight_status;
          }

          if (newStatus !== status) {
            this.handleFreightRoute(newStatus);
            const updatedSession = session;
            updatedSession[session.default].freight_status = newStatus;
            const newSession = JSON.stringify(updatedSession);
            this.setSession(newSession);
          }
        },
        () => {
          // error
        },
      );
    },
    handleFreightRoute(val) {
      if (val === 0) {
        this.$router.push('/freight/set-up');
      } else if (val === 1) {
        this.$router.push('/freight/verify');
      } else if (val === 2) {
        this.$router.push('/freight/transporters');
      } else {
        this.$router.push('/orders');
      }
    },
  },
};
</script>

<style lang="css"></style>
