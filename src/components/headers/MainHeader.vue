<template lang="html">
    <div class="header">
        <div class="header--item">
            <div class="header--item__left">
                <a @click="linkRoute('/orders')">
                  <img src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" alt="logo" class="logo">
                </a>
            </div>
        </div>
        <div class="header--item__right">
            <nav>
               <ul>
                   <li class="nav--menu-inactive"><a> Helpline : 0709 779 779</a></li>
                   <li class="nav--menu-inactive"><a>Hi {{logged_user}}</a></li>
                    <li class="nav--menu-dropdown">
                       <a class="nav--menu-dropdown-link">Menu</a>
                       <ul class="nav--menu-dropdown-list">
                            <li><a  @click="linkRoute('/orders')">New Delivery</a></li>
                            <li><a  @click="linkRoute('/payment/mpesa')">Payment</a></li>
                            <li><a  @click="linkRoute('/transactions/order_history')">Orders</a></li>
                            <!--<li><a  @click="linkRoute('/user/free_deliveries')">Free Deliveries</a></li>-->
                            <!--<li><a  @click="linkRoute('/payment/promo')">Promotions</a></li>-->
                            <li v-if="admin_user"><a  @click="linkRoute('/admin/users')">Settings</a></li>
                            <li v-if="admin_user"><a  @click="linkRoute('/analytics/weekly')">Analytics</a></li>
                            <li><a  @click="linkRoute('/user/profile/personal_information')">Profile</a></li>
                            <li class="menu--last-child"><a @click="logOut" class="menu--last-child-link">Log Out</a></li>
                       </ul>
                </li>
               </ul>
              </nav>
        </div>
    </div>

</template>

<script>
import SessionMxn from "../../mixins/session_mixin.js";
import { mapGetters } from "vuex";
export default {
  name: "main-header",
  mixins: [SessionMxn],
  data: function() {
    return {
      admin_user: false,
      logged_user: ""
    };
  },
  mounted() {
    let session = this.$store.getters.getSession;
    let cop_id = 0;

    if (session.default == "biz") {
      cop_id = session[session.default]["cop_id"];
      this.admin_user = true;
      this.logged_user = session[session.default]["cop_name"];
    } else {
      let user_id = 0;
      user_id = session[session.default]["user_id"];
      this.admin_user = false;
      this.logged_user = session[session.default]["user_name"];
    }
  },
  methods: {
    logOut() {
      try {
        console.log("attempt to log out");
        this.$store.commit("setSession", {});
        this.deleteSession();
        //clear orders to avoid marker persistance
        this.$store.unregisterModule("$_orders");
      } catch (er) {
        // orders was not registered
      } finally {
        this.$router.push({ name: "sign_in" });
      }
    },

    isEmpty(obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
      }
      return true;
    },

    linkRoute(route) {
      console.log("attempt route" + route);
      this.$router.push(route);
    }
  }
};
</script>

<style lang="css">
@import "../../assets/styles/internal_header.css";
</style>
