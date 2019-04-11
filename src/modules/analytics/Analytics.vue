<template lang="html">
  <div class="body--grey">
    <main-header />
    <div
      id="analytics_container"
      class="module-container"
    >
      <!-- <div class="title">
                <h3 class="title__text">Analytics</h3>
            </div> -->
      <div class="section">
        <router-link
          class="section__link"
          to="/analytics/weekly"
        >
          Weekly
        </router-link>
        <router-link
          class="section__link"
          to="/analytics/monthly"
        >
          Monthly
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
import analytics_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';

export default {
  name: 'Analytics',
  components: { MainHeader },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_analytics';
    this.register_store_module(STORE_KEY, analytics_store);
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        this.$router.push('/orders');
      },
      deep: true,
    },
  },
  destroyed() {
    // TO DO:  destroy store?
  },
};
</script>

<style lang="css" scoped>
@import '../../assets/styles/section_headers.css';
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
