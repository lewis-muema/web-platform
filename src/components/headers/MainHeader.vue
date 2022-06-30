<template lang="html">
  <div class="header">
    <div class="header--icon">
      <div class="header--item__left">
        <a
          class="header--item__left"
          @click="linkRoute('/orders')"
        >
          <img
            src="https://images.sendyit.com/web_platform/logo/rebrand_logo.png"
            alt="logo"
            class="logo"
          >
        </a>
      </div>
    </div>
    <div class="header--item segmentation-align">
      <div class="header--item__left segmentation-header">
        <div class="logistics-tab">
          <a
            class="segmentation-tab"
            @click="linkRoute('/orders')"
          >{{ $t('mainHeader.transportation') }}</a>
          <div
            :class="
              freightPages.includes(route_path)
                ? 'disable_segmentation_menu'
                : 'active_segmentation_menu'
            "
          />
        </div>

        <div
          v-if="checkFreightUser() && enabledFreightCountry"
          class=""
        >
          <a
            class="segmentation-tab"
            @click="redirectFreightUser()"
          >{{
            $t('mainHeader.freight')
          }}</a>
          <div
            :class="
              freightPages.includes(route_path)
                ? 'active_segmentation_menu'
                : 'disable_segmentation_menu'
            "
          />
        </div>
      </div>
    </div>
    <div class="header--item__right">
      <nav>
        <ul class="nav--menu-section-right">
          <li class="nav--menu-inactive helpline-contact">
            <a> {{ $t('mainHeader.helpline') }} : {{ helpline_contact }}</a>
          </li>
          <li class="nav--menu-inactive account-type">
            <a> {{ $t('mainHeader.hi')}} {{ logged_user }}</a>
          </li>
          <li class="nav--menu-dropdown">
            <a class="nav--menu-dropdown-link" @mouseover="sendGA4Events('select_menu')">
              {{$t('mainHeader.menu')}}
              <i class="el-icon-arrow-down" />
            </a>
            <ul class="nav--menu-dropdown-list">
              <div v-if="!admin_details">
                <li v-show="switchValid">
                  <a @click="switchAccount()">
                    {{$t('mainHeader.switch_to')}}
                    <span v-if="this.$store.getters.getSession.default === 'peer'"> {{$t('mainHeader.business' )}} </span>
                    <span v-else>
                      {{$t('mainHeader.personal')}}
                    </span>
                    {{$t('mainHeader.account')}}
                  </a>
                </li>
                <li v-show="isUpgradeValid">
                  <a @click="linkRoute('/user/upgrade_acc')">
                    {{$t('mainHeader.create_business_account' )}}
                  </a>
                </li>
                <li>
                  <a @click="linkRoute('/orders')">
                    {{$t('mainHeader.new_delivery')}}
                  </a>
                </li>
                <li>
                  <a @click="linkPayments()">
                    {{$t('mainHeader.payment')}}
                  </a>
                </li>
                <li>
                  <a @click="linkRoute('/transactions/order_history')">
                    {{$t('mainHeader.orders')}}
                  </a>
                </li>
                <li v-if="enabledFreightCountry">
                  <a @click="linkRoute('/orders/freight')">
                    {{$t('mainHeader.freight_small')}}
                  </a>
                </li>
                <li v-if="admin_user">
                  <a @click="linkRoute('/admin/users')">
                    {{$t('mainHeader.settings')}}
                  </a>
                </li>
                <li v-if="admin_user">
                  <a @click="linkRoute('/analytics/report')">
                    {{ $t('mainHeader.analytics' )}}
                  </a>
                </li>
                <li>
                  <a @click="linkRoute('/user/profile/personal_information')">
                    {{$t('mainHeader.profile')}}
                  </a>
                </li>
              </div>
              <li v-if="admin_details">
                <a @click="linkRoute('/orders/freight')">
                  {{$t('mainHeader.freight' )}}
                </a>
              </li>
              <li class="menu--last-child">
                <a
                  class="menu--last-child-link"
                  @click="logOut"
                >
                  {{$t('mainHeader.logout')}}
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import SessionMxn from '../../mixins/session_mixin';
import EventsMixin from '../../mixins/events_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';

const ENV = process.env.CONFIGS_ENV;

export default {
  name: 'MainHeader',
  mixins: [SessionMxn, EventsMixin, MixpanelMixin],
  data() {
    return {
      switchValid: false,
      admin_user: false,
      logged_user: '',
      mpesa_valid: false,
      helpline_contact: '',
      admin_details: false,
      freightPages: [
        'freight_home',
        'freight_set_up',
        'freight_verify',
        'freight_dashboard',
        'freight_transporters',
        'freight_orders',
        'freight_orders_info',
        'freight_transporters_details',
        'freight_create_orders',
        'freight_settings',
      ],
      enabledFreightCountry: false,
      freightPrefferedCountries: ['KE', 'TZ', 'UG', 'CI'],
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      getCountryCode: 'getCountryCode',
    }),
    route_path() {
      return this.$route.name;
    },
    isUpgradeValid() {
      const session = this.$store.getters.getSession;
      let isValid = false;

      if (!this.switchValid && session.default === 'peer') {
        isValid = true;
      }
      return isValid;
    },
  },
  watch: {
    getSess: {
      handler() {
        this.loggedUser();
      },
      deep: true,
    },
  },
  mounted() {
    const session = this.$store.getters.getSession;
    if (Object.keys(session).length > 0) {
      this.switchOption();
      this.loggedUser();
      this.superUserCheck();
      this.preferredFreightCountries();
    }
  },
  methods: {
    loggedUser() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        const fullName = session[session.default].user_name.split(' ');
        const firstName = fullName[0];
        this.helpline_contact = session.customer_care_number;
        if (session.default === 'biz') {
          // Admin
          if (session[session.default].user_type === 2) {
            this.admin_user = true;
            this.logged_user = `${firstName} (Business Acc)`;
          } else if (session[session.default].user_type === 1) {
            this.logged_user = `${firstName} (Business Acc)`;
          }
        } else {
          this.admin_user = false;
          this.logged_user = `${firstName} (Personal Acc)`;
        }
      }
    },
    superUserCheck() {
      const session = this.$store.getters.getSession;
      if (Object.prototype.hasOwnProperty.call(session, 'admin_details')) {
        this.admin_details = true;
      } else {
        this.admin_details = false;
      }
    },
    checkFreightUser() {
      const session = this.$store.getters.getSession;
      let resp = false;

      if (session.default === 'biz') {
        if (session[session.default].user_type === 2) {
          resp = true;
        }
      } else {
        resp = true;
      }
      return resp;
    },
    logOut() {
      try {
        this.clearAuthToken();
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        this.$store.commit('deleteSession');
        // clear orders to avoid marker persistance
        this.$store.unregisterModule('$_orders');
      } catch (er) {
        // orders was not registered
      } finally {
        if (this.admin_details) {
          this.$router.replace({ name: 'by_pass' });
        } else {
          this.$router.replace({ name: 'sign_in' });
        }
      }
      this.sendGA4Events('select_logout');
    },
    clearAuthToken() {
      const auth = process.env.CONFIGS_ENV.AUTH;
      const payload = { refresh_token: localStorage.getItem('refreshToken') };
      axios.post(`${auth}logout`, payload);
    },
    switchOption() {
      const session = this.$store.getters.getSession;
      if (!this.isEmpty(session.biz) && !this.isEmpty(session.peer)) {
        this.switchValid = true;
      } else {
        this.switchValid = false;
      }
    },
    isEmpty(obj) {
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      }
      return false;
    },
    switchAccount() {
      const session = this.$store.getters.getSession;
      if (session.default === 'peer') {
        this.$store.commit('setSessDefault', 'biz');
      } else {
        this.$store.commit('setSessDefault', 'peer');
      }
    },
    linkRoute(route) {
      this.$router.push(route);
      if (route === '/user/upgrade_acc') {
        const session = this.$store.getters.getSession;
        this.trackMixpanelEvent('Create Business Account Clicked', {
          'Account Type': session.default === 'peer' ? 'Personal' : 'Business',
          'Client Type': 'Web Platform',
          'User Email': session[session.default].user_email,
          'User Phone': session[session.default].user_phone,
        });
      }

      if (route === '/freight/home') {
        const session = this.$store.getters.getSession;
        this.trackMixpanelEvent('Freight Tab Navigated', {
          userId: session[session.default].user_id,
          email: session[session.default].user_email,
          phone: session[session.default].user_phone,
          name: session[session.default].user_name,
          clientType: 'Web',
          clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
          device: 'Desktop',
        });
      }
      let eventLabel;
      switch (route) {
        case '/user/upgrade_acc':
          eventLabel = 'Create Business Account';
          break;
        case '/orders':
          eventLabel = 'New Delivery';
          break;
        case '/transactions/order_history':
          eventLabel = 'Orders';
          break;
        case '/orders/freight':
          eventLabel = 'Freight';
          break;
        case '/admin/users':
          eventLabel = 'Settings';
          break;
        case '/analytics/report':
          eventLabel = 'Analytics';
          break;
        case '/user/profile/personal_information':
          eventLabel = 'Profile';
          break;
        default:
          eventLabel = route;
      }
      const eventPayload = {
        eventCategory: 'Menu Navigation',
        eventAction: 'Click',
        eventLabel,
      };
      this.fireGAEvent(eventPayload);
      if (route === '/transactions/order_history') {
        this.sendGA4Events('select_orders');
      }
      if (route === '/orders/freight') {
        this.sendGA4Events('freight_select_page');
      }
    },
    linkPayments() {
      this.$router.push('/payment/card');
    },
    /* global mixpanel */
    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },
    preferredFreightCountries() {
      const session = this.$store.getters.getSession;
      const country = session[session.default].country_code;

      this.enabledFreightCountry = this.freightPrefferedCountries.includes(country);
    },
    redirectFreightUser() {
      window.open(ENV.FREIGHT_NEW_APP, '_blank');
    }
  },
};
</script>

<style lang="css">
@import '../../assets/styles/internal_header.css';
</style>
