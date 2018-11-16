<template lang="html">
    <div class="">
        <main-header></main-header>

        <div class="container" id="transactions_container">
          <div class="section">
              <router-link class="section__link" to="/transactions/order_history">Orders</router-link>
              <router-link class="section__link" to="/transactions/statement">Statement</router-link>
              <router-link class="section__link" to="/transactions/payments">Payments</router-link>
          </div>
          <div class="">
            <router-view></router-view>
          </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import trans_store from './_store';
import MainHeader from '../../components/headers/MainHeader.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faStar } from '@fortawesome/free-solid-svg-icons'
library.add(faStar)

export default {
  name:'Transactions',
  //mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    this.$store.registerModule('$_transactions', trans_store);
  },
}
</script>

<style lang="css">
@import "../../assets/styles/section_headers.css";
@import "../../assets/styles/section_filters.css";
@import "../../assets/styles/section_pagination.css";
</style>
