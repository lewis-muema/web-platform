<template lang="html">
  <div class="body--grey">
    <main-header />
    <div
      id="analytics_container"
      class="module-container"
    >
      <div class="section">
        <router-link
          class="section__link"
          to="/analytics/report"
        >
          Report
        </router-link>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import analyticsStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

export default {
  name: 'Analytics',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler() {
        this.$router.push('/orders');
      },
      deep: true,
    },
  },
  created() {
    const STORE_KEY = '$_analytics';
    this.register_store_module(STORE_KEY, analyticsStore);
  },
  destroyed() {
    // TO DO:  destroy store?
  },
};
</script>

<style lang="css" scoped>
@import '../../assets/styles/section_headers.css?v=4';
.body--grey
{
  background-color: #F9FBFC;
}
.module-container
{
  width: 90%;
  margin: 0px auto;
  padding-top: 60px;
}
</style>
