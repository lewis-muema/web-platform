<template lang="html">
  <div class="" id="order_hist_container">
     <el-table
      :data="tableData"
      style="width: 100%"
      @expand-change="handleRowExpand"
      >
      <template slot="empty">
            {{empty_orders_state}}
      </template>
      <el-table-column type="expand">
        <template slot-scope="props">
          <router-view></router-view>
        </template>
      </el-table-column>
      <el-table-column
        label="Txn"
        prop="order_no"
         width="180"
        >
      </el-table-column>
      <el-table-column
        label="Date"
        prop="order_date">
      </el-table-column>
      <el-table-column
        label="User"
        prop="full_order_details.values.user_id"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="Amount"
        prop="order_cost"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="Deliveries"
        prop="full_order_details.values.way_points"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="From"
        prop="from_name">
      </el-table-column>
      <el-table-column
        label="To"
        prop="to_name">
      </el-table-column>
  </el-table>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
      data() {
        return {
          empty_orders_state:"Fetching Order History"
        }
      },
      methods:{
         ...mapActions([
            '$_transactions/requestOrderHistoryOrders',
        ]),
        handleRowExpand(row, expanded) {
          console.log(row);

          if(expanded.length > 0){
              console.log('handling row expand');
              if(expanded.length > 1){
                //now we have more than one open
                //therefore close one
                	document.getElementsByClassName('el-table__expand-icon--expanded')[0].click()
				      }
              //trigger router action here
              this.$router.push({name:'order-details', params: {id : row.order_no}});
          }

      },
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
             console.log(response);
             this.empty_orders_state = "Order History Not Found";
          }, error => {
              console.error("Got nothing from server. Prompt user to check internet connection and try again")
              console.log(error);
              this.empty_orders_state = "Order History Failed to Fetch";
          });
      },
    }
</script>

<style lang="css">
</style>
