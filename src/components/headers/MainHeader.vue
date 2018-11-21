<template lang="html">
    <div class="header">
        <div class="header--item">
            <div class="header--item__left">
                <img src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" alt="logo" class="logo">
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
import { mapGetters } from 'vuex';
export default {
  name: "main-header",
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
      console.log("attempt to log out");
      this.$store.commit("setSession", {});
      this.eraseCookie("_sessionSnack");
      this.$router.push({ name: "sign_in" });
      try{
          //clear orders to avoid marker persistance
          this.$store.unregisterModule('$_orders');
      }
      catch(er){
          // orders was not registered
      }
    },
    data: function () {
        return {
            admin_user: false,
            logged_user: "Friend"
        }
    },

    eraseCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    isEmpty(obj) {
      for(var prop in obj) {
          if(obj.hasOwnProperty(prop))
              return false;
      }
      return true;
    },
    getSessionCookie(){
      var nameEQ = "_sessionSnack" + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0){

          }
          return c.substring(nameEQ.length,c.length);
      }
      return null;
    },

    linkRoute(route) {
      console.log("attempt route" + route);
      this.$router.push(route);
    },
    showNotification() {
      console.log("somebody is trying to show a notification");

      let notification = this.$store.getters.getNotification;

      console.log(notification);
      if (notification.level == 1) {
        //success
        this.$notify({
          type: "success",
          title: notification.title,
          message: notification.message,
          offset: 20
        });
      } else if (notification.level == 2) {
        //warning
        this.$notify({
          title: notification.title,
          message: notification.message,
          type: "warning",
          offset: 20
        });
      } else if (notification.level == 3) {
        //error
        title: notification.title,
          this.$notify({
            type: "error",
            message: notification.message,
            offset: 20
          });
      } else {
        //default
        //check to make sure that either title or message is set
        //reset notification status

        if(notification.title !== '' || notification.message !== ''){
          this.$notify({
          title: notification.title,
          message: notification.message
          });
          offset: 20;

        }
      }
      this.$store.commit("setNotificationStatus", false);
    }
  },
  computed: {
    notification_status() {
      return this.$store.getters.getNotificationStatus;
    }
  },
  watch: {
    notification_status(val, oldVal) {
      console.log(val);

      if (val == true) {
        this.showNotification();
      }
    }
  }
};
</script>

<style lang="css">
@import "../../assets/styles/internal_header.css";
</style>
