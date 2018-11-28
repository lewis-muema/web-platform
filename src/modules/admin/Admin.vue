<template lang="html">
    <div class="">
        <main-header></main-header>
        <div class="container admin-container" id="admin_container">
            <!--<div class="title">-->
                <!--<h3 class="title__text">Admin Settings</h3>-->
            <!--</div>-->
            <div class="section">
                <router-link class="section__link" to="/admin/users">Users</router-link>
                <router-link class="section__link" to="/admin/department">Department</router-link>
                <!--<router-link class="section__link" to="/admin/preferences">Preferences</router-link>-->
                <router-link class="section__link" to="/admin/api">API</router-link>
            </div>
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>

<script>
import admin_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'

export default {
  name:'admin',
  components : {MainHeader},
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_admin';
    this.$store.registerModule(STORE_KEY, admin_store);
  },
  destroyed(){
      // TO DO:  destroy store?
  }
}
</script>

<style lang="css">
    @import "../../assets/styles/section_headers.css";
    @import "../../assets/styles/section_filters.css";
    @import "../../assets/styles/section_pagination.css";

</style>
