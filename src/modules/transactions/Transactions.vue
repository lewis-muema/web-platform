<template lang="html">
  <div class="">
    <main-header />

    <div id="transactions_container" class="container">
      <div class="section">
        <router-link class="section__link" to="/transactions/order_history">
          {{$t('general.orders')}}
        </router-link>
        <router-link class="section__link" to="/transactions/statement">
          {{$t('general.statement')}}
        </router-link>
        <router-link class="section__link" to="/transactions/payments">
          {{$t('general.payments')}}
        </router-link>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
    <NPSFooter v-if="!nps_status" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import transStore from './_store';
import MainHeader from '../../components/headers/MainHeader.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';

library.add(faStar);

export default {
  name: 'Transactions',
  components: { MainHeader, NPSFooter },
  mixins: [NpsMixin],
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        if (oldVal !== val) {
          this.$router.push('/orders');
        }
      },
      deep: true,
    },
  },
  created() {
    this.$store.registerModule('$_transactions', transStore);
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css?v=1";
@import "../../assets/styles/section_filters.css?v=1";
@import "../../assets/styles/section_pagination.css?v=1";
</style>
