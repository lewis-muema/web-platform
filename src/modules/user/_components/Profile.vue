<template>
  <div
    id="auth_container"
    class=""
  >
    <!-- <main-header></main-header> -->
    <div class="profile-container">
      <div
        class="new-card"
        style="margin-top:5%;margin-left:20%;border-right:5px solid #1782C5;height:400px;"
      >
        <a class="my-profile__adj">
          <router-link
            class="profile--link"
            to="/user/profile/personal_information"
          >
            {{$t('general.personal_info')}}
          </router-link>
        </a>
        <div class="my-profile__adj">
          <router-link
            class="profile--link"
            to="/user/profile/change_password"
          >
            {{$t('general.change_password')}}
          </router-link>
        </div>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
    <NPSFooter v-if="!nps_status" />
  </div>
</template>

<script>
import NPSFooter from '../../../components/footers/NPSFooter.vue';
import NpsMixin from '../../../mixins/nps_mixin';

export default {
  name: 'Profile',
  components: { NPSFooter },
  mixins: [NpsMixin],
};
</script>

<style lang="css" scoped>
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
.profile-container{
  display: flex;
}
.profile--link
{
  color: #555;
  font-family: Slack-Lato,appleLogo,sans-serif;
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
  background-color: #1782C5;;
  color: #fff !important;

  /* background-color: red; */
}
</style>
