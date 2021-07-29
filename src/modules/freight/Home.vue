<template lang="html">
  <div
    v-if="sessionData"
    class=""
  >
    <div class="">
      <freight-business-verification v-if="getVerificationStage === 'active'" />
      <freight-business-final-setup v-if="getVerificationStage === 'success'" />
    </div>
    <main-header />
    <div
      id="transactions_container"
      class="container"
    >
      <div class="section">
        <router-link
          class="section__link"
          to="/freight/transporters"
        >
          {{ $t('mainComponent.transporters') }}
        </router-link>
        <router-link
          class="section__link"
          to="/freight/orders"
        >
          {{ $t('mainComponent.shipment') }}
        </router-link>
        <router-link
          class="section__link"
          to="/freight/dashboard"
        >
          {{ $t('mainComponent.activity_log') }}
        </router-link>
        <router-link
          v-if="copAcc"
          class="section__link"
          to="/freight/settings"
        >
          {{ $t('mainComponent.settings') }}
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
import { mapGetters, mapActions, mapMutations } from 'vuex';
import VeeValidate, { Validator } from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import freightStore from './_store';
import ordersModuleStore from '../orders/_store';
import transactionsModuleStore from '../transactions/_store';
import freightAuthStore from '../freightAuth/_store';
import authModuleStore from '../auth/_store';
import userModuleStore from '../user/_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';
import MainHeader from '../../components/headers/freight/MainHeader.vue';
import FreightBusinessVerification from './FreightBusinessVerification.vue';
import FreightBusinessFinalSetup from './FreightBusinessFinalSetup.vue';

library.add(faStar);

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
    FreightBusinessVerification,
    FreightBusinessFinalSetup,
  },
  mixins: [RegisterStoreModule, SessionMxn, MixpanelMixin, NotificationMxn],
  data() {
    return {
      sessionData: false,
      status: '',
    };
  },
  computed: {
    ...mapGetters({
      getVerificationStage: '$_freight/getVerificationStage',
    }),
    copAcc() {
      const session = this.$store.getters.getSession;
      let resp = false;
      if (session.default === 'biz') {
        // Admin
        if (session[session.default].user_type === 2) {
          resp = true;
        }
      }
      return resp;
    },
  },
  watch: {
    $route(to) {
      if (to.name !== 'freight_orders_info') {
        this.clearTruckMarkers();
        this.clearTruckId();
        this.clearTrackingVehicles();
        this.clearTruckDetailsToStore();
      }
    },
  },
  mounted() {
    this.checkSessionData();
  },
  created() {
    const moduleIsRegistered = this.$store._modules.root._children.$_freight !== undefined;
    if (!moduleIsRegistered) {
      this.$store.registerModule('$_freight', freightStore);
    }
    this.registerFreightAuthModule();
    this.registerAuthModule();
    this.registerUserModule();
  },
  methods: {
    ...mapActions({
      requestFreightStatus: '$_freight/requestFreightStatus',
    }),
    ...mapMutations({
      clearTruckMarkers: '$_freight/clearTruckMarkers',
      clearTruckId: '$_freight/clearTruckId',
      clearTrackingVehicles: '$_freight/clearTrackingVehicles',
      clearTruckDetailsToStore: '$_freight/clearTruckDetailsToStore',
      setVerificationStep: '$_freight/setVerificationStep',
      setVerificationStage: '$_freight/setVerificationStage',
    }),
    checkSessionData() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.sessionData = true;
        const { params } = this.$route;
        if (Object.prototype.hasOwnProperty.call(params, 'token')) {
          this.verification_stage = 'success';
        }
        this.checkFreightVerificationStages();
      } else {
        this.$router.push('/freight');
      }
    },
    checkFreightVerificationStages() {
      const session = this.$store.getters.getSession;
      if (session.default === 'biz') {
        this.verifyBusinessDetails(session);
      }
    },
    verifyBusinessDetails(session) {
      if ('freight_user' in session && 'director_details' in session[session.default]) {
        if (session.freight_user) {
          this.handleFreightBusinessUpdate(session);
        } else {
          this.notFreightUser();
        }
      } else {
        this.notFreightUser();
      }
    },
    notFreightUser() {
      this.doNotification(
        2,
        'Freight Redirect',
        'Unable to access freight customer service . Kindly login again',
      );
      this.clearFreightToken();
    },
    handleFreightBusinessUpdate(session) {
      if (
        session[session.default].country_code === ''
        || session[session.default].company_reg_no === ''
        || session[session.default].tax_authority_pin === ''
      ) {
        this.setVerificationStep(1);
        this.setVerificationStage('active');
      } else if (Object.keys(session[session.default].director_details).length === 0) {
        this.setVerificationStep(2);
        this.setVerificationStage('active');
      } else if (session[session.default].user_phone === '') {
        this.setVerificationStep(3);
        this.setVerificationStage('active');
      } else {
        this.setVerificationStep(0);
        this.setVerificationStage('');
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
    registerFreightAuthModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_freightAuth !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_freightAuth', freightAuthStore);
      }
    },
    registerAuthModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_auth !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_auth', authModuleStore);
      }
    },
    registerUserModule() {
      const moduleIsRegistered = this.$store._modules.root._children.$_user !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_user', userModuleStore);
      }
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
    clearFreightToken() {
      try {
        localStorage.removeItem('request_id');
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        this.$store.commit('deleteSession');

        this.$store.unregisterModule('$_freight');
        this.$store.unregisterModule('$_freightAuth');
      } catch (er) {
        // freight was not registered
      } finally {
        this.$router.push('/freight/login');
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
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

<style lang="css">
@import "../../assets/styles/section_headers.css";
@import "../../assets/styles/section_filters.css";
@import "../../assets/styles/section_pagination.css";
</style>
