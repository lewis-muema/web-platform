<template lang="html">
    <div class="">
        <main-header></main-header>

        <div class="container" id="transactions_container">
          <div class="title">
              <h3 class="title__text">Transactions</h3>
          </div>
          <div class="section">
              <router-link class="section__link" to="/transactions/order_history">Order History</router-link>
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
import trans_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import MainHeader from '../../components/headers/MainHeader.vue'

export default {
  name:'Transactions',
  mixins: [ RegisterStoreModule ],
  components : {MainHeader},
  created() {
    this.$store.registerModule('$_transactions', trans_store);
    // const STORE_KEY = '$_transactions';
    // this.register_store_module(STORE_KEY, trans_store);
  },
}
</script>

<style lang="css">
@import "../../styles/section_headers.css";
</style>
