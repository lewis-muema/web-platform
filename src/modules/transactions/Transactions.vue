<template lang="html">
  <div class="">
    <main-header />

    <div
      id="transactions_container"
      class="container"
    >
      <div class="section">
        <router-link
          class="section__link"
          to="/transactions/order_history"
        >
          Orders
        </router-link>
        <router-link
          class="section__link"
          to="/transactions/statement"
        >
          Statement
        </router-link>
        <router-link
          class="section__link"
          to="/transactions/payments"
        >
          Payments
        </router-link>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import trans_store from './_store';
import MainHeader from '../../components/headers/MainHeader.vue';

library.add(faStar);

export default {
  name: 'Transactions',
  // mixins: [ RegisterStoreModule ],
  components: { MainHeader },
  created() {
    this.$store.registerModule('$_transactions', trans_store);
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        if (oldVal != val) {
          this.$router.push('/orders');
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css";
@import "../../assets/styles/section_filters.css";
@import "../../assets/styles/section_pagination.css";
</style>
