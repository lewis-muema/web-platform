<template lang="html">
  <div id="auth_container" class="">
    <main-header />
    <div class="container">
      <div class="new-card new-card__inner">
        <a class="my-profile__adj">
          <router-link class="profile--link" to="/profile/personal_information">
            {{$t('general.personal_info')}}
          </router-link>
        </a>
        <div class="my-profile__adj">
          <router-link class="profile--link" to="/profile/change_password">
            {{$t('general.change_password')}}
          </router-link>
        </div>
      </div>

      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import profile_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

export default {
  name: 'Profile',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_profile';
    this.$store.registerModule(STORE_KEY, profile_store);
  },
};
</script>

<style lang="css" scoped>
/* .profile-menu{
  -webkit-box-flex: 2;
  flex: 2;
  padding-right: 40px;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  margin-left: 0%;
  margin-top: 15%;
} */
.my-profile__adj{
  font-size: 22px;
  padding-bottom: 0px;
  /* border-bottom: 1px solid #ccc; */
  border-bottom: none !important;
  color: #999;
  /*padding-top: 15px;*/
  /*margin-bottom: 30px; */
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
  font-family: 'Nunito', sans-serif;
  /* font-size: 1rem !important; */
  text-align: center;
  padding: 2px;
  text-decoration: none;
  flex: 1;
  letter-spacing: 0;
  font-size: 16px !important;
  font-weight: 200 !important;
  display: block;
  padding: 20px;
}
.profile--link.router-link-active
{
  /* font-weight: bold !important; */
  font-weight: 500 !important;
  border-bottom: none!important;


  background-color: #4186c2;
  color: #fff;

  /* background-color: red; */
}
.new-card__inner{
  margin-top:5%;
  margin-left:20%;
  border-right:5px solid #007FFF;
  height:400px;
}
</style>
