<template lang="html">
  <div class="header">
    <div class="header--item">
      <div class="header--item__left">
        <a
          class="header--item__left"
          @click="linkRoute('/orders')"
        >
          <img
            src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png"
            alt="logo"
            class="logo"
          >
        </a>
      </div>
    </div>
    <div class="header--item__right">
      <nav>
        <ul>
          <li class="nav--menu-inactive">
            <a> Helpline : {{ helpline_contact }}</a>
          </li>
          <li class="nav--menu-inactive">
            <a>Hi {{ logged_user }}</a>
          </li>
          <li class="nav--menu-dropdown">
            <a class="nav--menu-dropdown-link">
              Menu
            </a>
            <ul class="nav--menu-dropdown-list">
              <li v-if="switchValid">
                <a @click="switchAccount()">
                  Switch to
                  <span v-if="this.$store.getters.getSession.default === 'peer'"> Business </span><span v-else>
                    Personal
                  </span>
                  account
                </a>
              </li>
              <li>
                <a @click="linkRoute('/orders')">
                  New Delivery
                </a>
              </li>
              <li>
                <a @click="linkPayments()">
                  Payment
                </a>
              </li>
              <li>
                <a @click="linkRoute('/transactions/order_history')">
                  Orders
                </a>
              </li>
              <!--<li><a  @click="linkRoute('/user/free_deliveries')">Free Deliveries</a></li>-->
              <!--<li><a  @click="linkRoute('/payment/promo')">Promotions</a></li>-->
              <li v-if="admin_user">
                <a @click="linkRoute('/admin/users')">
                  Settings
                </a>
              </li>
              <li v-if="admin_user">
                <a @click="linkRoute('/analytics/weekly')">
                  Analytics
                </a>
              </li>
              <li>
                <a @click="linkRoute('/user/profile/personal_information')">
                  Profile
                </a>
              </li>
              <li class="menu--last-child">
                <a
                  class="menu--last-child-link"
                  @click="logOut"
                >
                  Log Out
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
import SessionMxn from '../../mixins/session_mixin';

export default {
  name: 'MainHeader',
  mixins: [SessionMxn],
  data() {
    return {
      switchValid: false,
      admin_user: false,
      logged_user: '',
      mpesa_valid: false,
      helpline_contact: '',
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      getCountryCode: 'getCountryCode',
    }),
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
    this.switchOption();
    this.loggedUser();
  },
  methods: {
    loggedUser() {
      const session = this.$store.getters.getSession;
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
    },
    logOut() {
      try {
        this.$store.commit('deleteSession');
        // clear orders to avoid marker persistance
        this.$store.unregisterModule('$_orders');
      } catch (er) {
        // orders was not registered
      } finally {
        this.$router.replace({ name: 'sign_in' });
      }
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
    },
    linkPayments() {
      let session = this.$store.getters.getSession;
      let phone = session[session.default]['user_phone'];
      let int_value = phone.substring(0, 4);
      if (int_value === '+254') {
        this.mpesa_valid = true;
      } else {
        this.mpesa_valid = false;
      }
      if (this.getCountryCode === 'KE' && this.mpesa_valid) {
        this.$router.push('/payment/mpesa');
      } else {
        this.$router.push('/payment/card');
      }
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/internal_header.css";
</style>
