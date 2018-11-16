<template lang="html">
  <div class="" id="order_hist_container">
    
    <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
            <el-select class="section--filter-input" v-model="value" placeholder="Users">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="From"/>
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="To"/>
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" class="button-primary section--filter-action">Search</button>
        </div>
    </div>

     <el-table
      :data="tableData"
      style="width: 100%"
      :border="true"
      :stripe="true"
      :row-key="getRowKey"
      :expand-row-keys="expand_keys"
      @row-click="expandTableRow"
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
        <template slot-scope="props">
          {{tableData[props.$index]['order_date'] | moment }}
        </template>
      </el-table-column>
      
      <el-table-column
        label="User"
        prop="user_details.name"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="Amount"
        prop="order_cost"
        width="120"
        :formatter="formatAmount"
        class-name="amount--table-format"
        >
      </el-table-column>
      <el-table-column
        label="Deliveries"
        prop="path"
        width="120"
        >
        <template slot-scope="scope">
          {{tableData[scope.$index]['path'].length-1}}
        </template>
      </el-table-column>
      <el-table-column
        label="From"
        prop="path">
        <template slot-scope="scope">
          {{ getOrderFromName(tableData[scope.$index]['path']) }}
        </template>
      </el-table-column>
      <el-table-column
        label="To"
        prop="path">
         <template slot-scope="scope">
          {{ getOrderToName(tableData[scope.$index]['path']) }}
        </template>
      </el-table-column>
  </el-table>

  <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length"
            :page-size="pagination_limit"
            :current-page.sync="pagination_page"
            @current-change="changePage"
            :page-sizes="[10, 20, 50, 100]"
            @size-change="changeSize"
            class="section--pagination-item"
            >
        </el-pagination>
    </div>
  
  </div>
</template>

<script>
const moment = require('moment');
import { mapActions, mapGetters } from 'vuex'
export default {
      data() {
        return {
          empty_orders_state:"Fetching Order History",
          expand_id: 0,
          expand_keys:[],
          pagination_limit:5,
          pagination_page:1,

        }
      },
      filters: {
        moment: function (date) {
          return moment(date).format('MMM Do YYYY, h:mm a');
        },

      },
      methods:{
        changeSize(val) {
            this.pagination_page = 1;
            this.pagination_limit = val;
        },
        changePage() {
            console.log('Page changed to', this.pagination_page);
            let from = (this.pagination_page - 1) * this.pagination_limit;
            let to = this.pagination_page * this.pagination_limit;
            let paginated_drivers = this.searched_drivers.slice(from, to);
            console.log(from, to, paginated_drivers);
        },
         ...mapActions([
            '$_transactions/requestOrderHistoryOrders',
        ]),
        moment: function () {
          return moment();
        },
        getOrderFromName(path) {
          let name = path[0].name;
          let splitted_name = name.split(",", 2);
          return splitted_name[0];


        },
        getOrderToName(path) {
          let path_length = path.length;
          let name = path[path_length-1].name;
          let splitted_name = name.split(",", 2);
          return splitted_name[0];
          
        },
        getRowKey(row){
          return row.order_id;
        },
        expandTableRow(row, event, column){
          this.expand_id = row.order_id;
          this.expand_keys = []
          this.expand_keys.push(row.order_id)
          this.$router.push({name:'order-details', params: {id : row.order_id}});
        },
        handleRowExpand(row, expanded) {
          
          this.expand_id = row.order_id;
          this.expand_keys = []
          this.expand_keys.push(row.order_id)
          this.$router.push({name:'order-details', params: {id : row.order_id}});
      },
      formatAmount(row, column, cellValue) {
        return (row.order_cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
      },
    },  
    computed:{
        ...mapGetters({
          tableData:'$_transactions/getOrderHistoryOrders',
      }),
     },
      mounted(){
          //TODO: Get this from session
          //TODO: also create payload depending on session

          let payload = {
            "cop_id": 669,
            "user_type":2
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
