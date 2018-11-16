<template lang="html">
    <div class="body--grey">
        <main-header></main-header>
        <div class="module-container" id="analytics_container">
            <!-- <div class="title">
                <h3 class="title__text">Analytics</h3>
            </div> -->
            <div class="section">
                <router-link class="section__link" to="/analytics/weekly">Weekly</router-link>
                <router-link class="section__link" to="/analytics/monthly">Monthly</router-link>
            </div>
            <div class="">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import analytics_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'


export default {
  name:'Analytics',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    const STORE_KEY = '$_analytics';
    this.register_store_module(STORE_KEY, analytics_store);
  },
  destroyed(){
      // TO DO:  destroy store?
  }
}
</script>

<style lang="css" scoped>
    @import '../../assets/styles/section_headers.css';
    .body--grey
    {
      background-color: #F9FBFC;
    }
</style>
