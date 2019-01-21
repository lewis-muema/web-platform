<template lang="html">
  <div class="">
    <main-header></main-header>
    <div class="tracking-back-button">
        <i class="el-icon-back edit-back" v-on:click="go_back()"></i>
    </div>
    <div class="container-small" id="payment_container">
      <component v-bind:is="currentPageHeader" class="payment--header"></component>
      <payment-body/>
    </div>
  </div>
</template>

<script>
import payment_store from './_store';
import { mapGetters } from 'vuex';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import AccountBalance from './_components/AccountBalance.vue';
import OrderCost from './_components/OrderCost.vue';
import PaymentBody from './_components/PaymentBody.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
library.add(faWallet);

export default {
  name: 'Payment',
  components: { MainHeader, AccountBalance, OrderCost, PaymentBody },
  mixins: [RegisterStoreModule],
  created() {
    this.registerPaymentModule();
  },
  computed: {
    ...mapGetters({
      getSession : 'getSession'
    }),
    currentPageHeader: function() {
      return "account-balance";
    }
  },
  methods: {
    go_back() {
      this.$router.go(-1);
    },

    registerPaymentModule(){
      const moduleIsRegistered = this.$store._modules.root._children['$_payment'] !== undefined;
       if (!moduleIsRegistered) {
        this.$store.registerModule('$_payment', payment_store);
      }
    },
  },
  watch: {
    getSession: {
      handler(val, oldVal){
        if (oldVal != val) {
          this.$router.push('/orders');
        }
      },
      deep: true
    }
  },
};
</script>

<style lang="css">
@import "../../assets/styles/payment.css";
</style>
