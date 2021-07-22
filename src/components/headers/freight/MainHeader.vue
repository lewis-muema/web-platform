<template lang="html">
  <div class="header freight-header">
    <div class="header--icon">
      <div class="header--item__left">
        <a
          class="header--item__left"
          @click="linkRoute('/freight/transporters')"
        >
          <img
            src="https://images.sendyit.com/web_platform/logo/freight_logo.png"
            alt="logo"
            class="logo"
          >
        </a>
      </div>
    </div>
    <div class="header--item segmentation-align">
      <div class="header--item__left segmentation-header" />
    </div>
    <div class="header--item__right">
      <nav>
        <ul class="nav--menu-section-right">
          <li class="nav--menu-inactive helpline-contact">
            <a> {{ $t('mainHeader.helpline') }} : {{ helpline_contact }}</a>
          </li>
          <li class="nav--menu-inactive account-type">
            <a> {{ $t('mainHeader.hi') }} {{ logged_user }}</a>
          </li>
          <li class="nav--menu-dropdown">
            <a class="nav--menu-dropdown-link">
              {{ $t('mainHeader.menu') }}
              <i class="el-icon-arrow-down" />
            </a>
            <ul class="nav--menu-dropdown-list">
              <div v-if="!admin_details">
                <li>
                  <a @click="linkRoute('/freight/transporters')">
                    New Shipment
                  </a>
                </li>
                <li>
                  <a @click="linkRoute('/freight/orders')">
                    Shipments
                  </a>
                </li>
                <!-- <li>
                  <a @click="linkRoute('/user/profile/personal_information')">
                    {{ $t('mainHeader.profile') }}
                  </a>
                </li> -->
              </div>
              <li class="menu--last-child">
                <a
                  class="menu--last-child-link"
                  @click="logOut"
                >
                  {{ $t('mainHeader.logout') }}
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
import SessionMxn from '../../../mixins/session_mixin';
import EventsMixin from '../../../mixins/events_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';

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
      this.loggedUser();
      this.superUserCheck();
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

        this.$store.unregisterModule('$_freight');
        this.$store.unregisterModule('$_freightAuth');
      } catch (er) {
        // freight was not registered
      } finally {
        this.$router.push('/freight/login');
      }
    },
    clearAuthToken() {
      const auth = process.env.CONFIGS_ENV.AUTH;
      const payload = { refresh_token: localStorage.getItem('refreshToken') };
      axios.post(`${auth}logout`, payload);
    },
    isEmpty(obj) {
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      }
      return false;
    },
    linkRoute(route) {
      this.$router.push(route);
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
  },
};
</script>

<style lang="css">
@import '../../../assets/styles/internal_header.css';
</style>
