<template lang="html">
  <div class="" id="auth_container">
      <main-header></main-header>
      <div class="container">
        <div class="new-card" style="margin-top:5%;margin-left:10%;border-right:5px solid #1782C5;height:400px;">
          <a class="my-profile__menu">
              <router-link class="profile--link" to="/profile/personal_information">Personal Information</router-link>
          </a>
          <div class="my-profile__menu">
              <router-link class="profile--link" to="/profile/change_password">Change Password</router-link>
          </div>
        </div>

   <div class="">
      <router-view></router-view>
  </div>
</div>
  </div>
</template>

<script>
import profile_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'

export default {
  name:'Profile',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    const STORE_KEY = '$_profile';
    this.$store.registerModule(STORE_KEY, profile_store);
  },
}
</script>

<style lang="css">
.menu{
  -webkit-box-flex: 2;
  flex: 2;
  padding-right: 40px;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  margin-left: 0%;
  margin-top: 15%;
}
.my-profile__menu{
  font-size: 22px;
  padding-bottom: 0px;
  /* border-bottom: 1px solid #ccc; */
  border-bottom: none !important;
  color: #999;
  padding-top: 15px;
  margin-bottom: 30px;
}
.panel-card{
  -webkit-box-flex: 2;
  flex: 2;
  padding-right: 40px;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
}
.new-card{
  -webkit-box-flex: 1;
  flex: 0.3;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 3px ! important;

}
.container{
  display: flex;
}
.profile--link
{
  color: #555;
  font-family: Slack-Lato,appleLogo,sans-serif;
  font-size: 15px;
  text-align: center;
  padding: 2px;
  text-decoration: none;
  flex: 1;
  letter-spacing: 0;
  font-size: 22px !important;
  font-weight: 300 !important;
}
.profile--link.router-link-active
{
  font-weight: bold !important;
  border-bottom: none!important;
  /* background-color: red; */
}
/* .new-card .my-profile__menu .router-link-active{
  background-color: red !important;
} */

</style>
