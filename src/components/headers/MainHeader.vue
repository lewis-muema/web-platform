<template lang="html">
    <div class="header">
        <div class="header--item">
            <div class="header--item__left">
                <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" alt="logo" class="logo">
            </div>
        </div>
        <div class="header--item__right">
            <nav>
               <ul>
                   <li class="nav--menu-inactive"><a>  0709 779 779</a></li>
                   <li class="nav--menu-inactive"><a>Hi Faith</a></li>
                    <li class="nav--menu-dropdown">
                       <a>Menu</a>
                       <ul class="nav--menu-dropdown-list">
                            <li><a  @click="linkRoute('/orders')">New Delivery</a></li>
                            <li><a  @click="linkRoute('/payment')">Payment</a></li>
                            <li><a  @click="linkRoute('/transactions/order_history')">Order History</a></li>
                            <li><a  @click="linkRoute('/user/free_deliveries')">Free Deliveries</a></li>
                            <li><a  @click="linkRoute('/payment/promo')">Promotions</a></li>
                            <li><a  @click="linkRoute('/admin/users')">Admin Settings</a></li>
                            <li><a  @click="linkRoute('/analytics')">Analytics</a></li>
                            <li><a  @click="linkRoute('/user/profile/personal_information')">Profile</a></li>
                            <li class="menu--last-child"><a @click="logOut">Log Out</a></li>
                       </ul>
                </li>
               </ul>
              </nav>
        </div>
    </div>

</template>

<script>
import {mapGetters} from 'Vuex'
export default {
    name : 'main-header',
    methods : {
        logOut(){
            console.log('attempt to log out');
            this.$store.commit('setSession', {});
            this.eraseCookie('_sessionSnack');
            this.$router.push({name:'sign_in'});
        },
        eraseCookie(name){
            document.cookie = name+'=; Max-Age=-99999999;'; 
        },
        linkRoute(route){
            console.log('attempt route'+route);
            this.$router.push(route);
        },
        showNotification(){
            console.log('somebody is trying to show a notification');

            let notification = this.$store.getters.getNotification;
            if(notification.level == 1) {
                //success
                this.$notify.success({
                    title: notification.title,
                    message: notification.message,
                    offset: 20
                });
            } else if (notification.level == 2) {
                //warning
                this.$notify.warning({
                    title: notification.title,
                    message: notification.message,
                    offset: 20
                });
            } else if (notification.level == 3) {
                //error
                this.$notify.error({
                    title: notification.title,
                    message: notification.message,
                    offset: 20
                });
            } else {
                //default
                this.$notify({
                    title: notification.title,
                    message: notification.message,
                    offset:20
                });
                
            }
            //reset notification status
            this.$store.commit('setNotificationStatus', false);
        }
    },
    computed: {
       notification_status() {
           return this.$store.notification_status;
       }
    },
    watch: {
        notification_status(val, oldVal) {
          console.log(val);

          if(val == true){
              this.showNotification();
          }
        }
    }
}
</script>

<style lang="css">
    @import '../../assets/styles/internal_header.css';
</style>
