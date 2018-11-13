<template lang="html">
  <div class="" id="order_hist_container">
     <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
        </template>
      </el-table-column>
      <el-table-column
        label="Date"
        prop="date">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
  </el-table>

  <!-- <order-details :order={}></order-details> -->s

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
      components: {
      //  'order-details':() =>  import('./OrderDetails.vue')
      },
      methods:{
          ...mapActions([
            '$_transactions/requestOrderHistoryOrders', // map `this.increment()` to `this.$store.dispatch('increment')`

            // `mapActions` also supports payloads:
            //'incrementBy' // map `this.incrementBy(amount)` to `this.$store.dispatch('incrementBy', amount)`
          ]),
      },
      data() {
        return {
        //   tableData: [{
        //   date: '2016-05-03',
        //   name: 'Tom',
        //   state: 'California',
        //   city: 'Los Angeles',
        //   address: 'No. 189, Grove St, Los Angeles',
        //   zip: 'CA 90036'
        }
    },
    computed:{
        ...mapGetters({
          tableData:'$_transactions/getOrderHistoryOrders',
      }),
    },
    mounted(){
        //To Do: Get this from session
        let payload = {
            "values": {
                "email": "faithshop@gmail.com",
                "phone": "0778987789",
                "cop_id": "669",
                "min_order": "1",
                "max_order": "10"
            }
        }
        // this.requestOrderHistoryOrders(payload);
        this.$store.dispatch("$_transactions/requestOrderHistoryOrders", payload).then(response => {
           console.log("Got some data, now lets show something in this component")
        }, error => {
            console.error("Got nothing from server. Prompt user to check internet connection and try again")
        });
    },
}
</script>

<style lang="css">
</style>
