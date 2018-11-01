<template lang="html">
  <div class="" id="analytics_container">
      <div class="title">
          <h3 class="title__text">Analytics</h3>
      </div>
      <div class="section">
          <router-link class="section__link" to="/analytics/weekly">Weekly Report</router-link>
          <router-link class="section__link" to="/analytics/monthly">Monthly Report</router-link>
      </div>
      <div class="">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
import analytics_store from './_store';
import RegisterStoreModule from '../../mixins/registerStoreModule'

export default {
  name:'Analytics',
  mixins: [ RegisterStoreModule ],
  created() {
    const STORE_KEY = '$_analytics';
    this.registerStoreModule(STORE_KEY, analytics_store);
  },
  destroyed(){
      // TO DO:  destroy store?
  }
}
</script>

<style lang="css">
    .title{
        font-size: 22px;
        padding-bottom: 0px;
        border-bottom: 1px solid #ccc;
        color: #999;
        padding-top: 15px;
        margin-bottom: 30px;
    }
    .title__text{
        font-weight: 300;
    }
    .section{
        padding-top: 20px;
        margin-bottom: 50px;
        padding-bottom: 2px;
        border-bottom: 1px solid #1782c5;
    }
    .section__link{
        color: #1782c5;
        text-transform: uppercase;
        font-size: 15px;
        text-align: center;
        padding: 2px 25px;
        text-decoration: none;
    }
    .router-link-active{
        font-weight: bold;
        border-bottom: 3px solid #1782c5;
    }
</style>
