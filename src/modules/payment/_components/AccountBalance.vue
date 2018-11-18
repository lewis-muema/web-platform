<template lang="html">
  <div class="">
    <div class="paytitle">
      Top up your sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon">
        <!-- <font-awesome-icon icon="wallet" /> -->
      </div>
      <div class="payinfo--balance">
        Balance <span class="payinfo--balance-el">{{running_balance}}</span>Ksh
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'account-balance',
  mounted() {
    this.requestRunningBalance(); 
  },
  methods:{
    ...mapActions([
      '$_payment/requestRunningBalance',
    ]),
    requestRunningBalance(){
      //this will request from the api and update the store
      let session = this.$store.getters.getSession;

      let running_balance_payload = {
        values:{
          cop_id: session.biz.cop_id,
          user_phone: session[session.default]['user_phone']
        }
      }

       let payload  = {
          "values" : running_balance_payload,
          "vm":this,
          "app":"PRIVATE_API",
          "endpoint":"running_balance"
        }

        this.$store.dispatch("$_payment/requestRunningBalance", payload).then(response => {
          if(response.status == 200){
            console.log('commit running balance to the global store');

            this.$store.commit('setRunningBalance', response.data.running_balance);
          }
          console.log(response);
           //commit  to the global store here

        }, error => {
          console.log(error);

        });



    }
  },
  computed: {
    //this just gets what is on the store
    running_balance(){
      return this.$store.getters.getRunningBalance;
    }
  }
  
}
</script>

<style lang="css">
.payinfo
{
  display: flex;
}
.paytitle
{
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 16px;
}
.payinfo
{
  display: flex;
  justify-content: space-between;
  flex: 1;
  color: rgb(85, 85, 85);
  font-size: 14px;
}
.payinfo--icon
{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.payinfo--icon img
{
  width: 25px;
}
.payinfo--balance
{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
}
.payinfo--balance-el
{
  padding: 0px 5px;
}
</style>
