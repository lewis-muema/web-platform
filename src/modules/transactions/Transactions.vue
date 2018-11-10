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
    const STORE_KEY = '$_transactions';
    this.register_store_module(STORE_KEY, trans_store);
  },
}
</script>

<style lang="css">
/* shared consider moving to outer scope */
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
