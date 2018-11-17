<template lang="html">

  <div class="" id="payments_container">
        <div class="section--filter-wrap">
          <div class="section--filter-input-wrap">
              <el-date-picker class="section--filter-input" type="date" name="from_date" v-model="filterData.from_date" placeholder="From"/>
              <el-date-picker class="section--filter-input" type="date" name="to_date" v-model="filterData.to_date" placeholder="To"/>
              
              <button type="button" @click="filterPaymentData":class="active_filter?'button-primary section--filter-action align-left':'button-primary section--filter-action-inactive align-left'">Search</button>
    
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" class="button-primary section--filter-action">Pay</button>
          
        </div>
    </div>
  
    <el-table
     :data="payment_data"
     style="width: 100%"
     :border="true"
     :stripe="true"
     >
     <template slot="empty">
           {{empty_payments_state}}
     </template>
     <el-table-column
       label="Reciept Number"
       prop="txn"
        width="180"
       >
     </el-table-column>
     <el-table-column
       label="Date"
       prop="date_time"
       :formatter="formatDate"
       >
     </el-table-column>
     <el-table-column
       label="Method"
       prop="pay_method_name"
       >
     </el-table-column>
     <el-table-column
       label="Description"
       prop="description"
       >
     </el-table-column>
     <el-table-column
       label="Amount"
       prop="amount"
       :formatter="formatAmount"
       class-name="amount--table-format"
       >
     </el-table-column>
   </el-table>

     <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="paymentData.length"
            :page-size="pagination_limit"
            :current-page.sync="pagination_page"
            @current-change="changePage"
            :page-sizes="[5,10, 20, 50, 100]"
            @size-change="changeSize"
            class="section--pagination-item"
            >
        </el-pagination>
    </div>


  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
const moment = require('moment');

export default {
  name:'Payments',
  data: function () {
    return {
      empty_payments_state:"Fetching Payments",
      pagination_limit:10,
      pagination_page:1,
      filterState: false,
      filterData: {
        "from_date": "",
        "to_date": ""
      },
      filteredPaymentData:[]
    }
  },
  mounted(){
      //TODO: Get this from session
      //TODO: also create payload depending on session

      let session_data = this.$store.getters.getSession;
      let payment_payload = {
        "cop_id": session_data.cop_id,
        "user_type":session_data.user_type
      }

      let full_payload = {
        "values" : payment_payload,
        "vm":this,
        "app":"NODE_PRIVATE_API",
        "endpoint":"payments"
      }
      this.$store.dispatch("$_transactions/requestPayments", full_payload).then(response => {
          console.log(response);
          this.empty_orders_state = "Payments Not Found";
      }, error => {
          console.log(error);
          this.empty_orders_state = "Payments Failed to Fetch";
      });
  },
  methods: {
    ...mapActions([
            '$_transactions/requestPayments',
     ]),
    changeSize(val) {
        this.pagination_page = 1;
        this.pagination_limit = val;
    },
    changePage() {
        console.log('Page changed to', this.pagination_page);
        let from = (this.pagination_page - 1) * this.pagination_limit;
        let to = this.pagination_page * this.pagination_limit;
        this.paymentData.slice(from, to);
    },
    filterPaymentData(){
       //reset filter
        this.filterState  = false;
        this.empty_payments_state = "Searching Payments";

        let from_date = this.filterData.from_date;
        let to_date = this.filterData.to_date;
        this.filteredPaymentData = this.payment_data;
        this.filteredPaymentData = this.filteredPaymentData.filter(function (payment) {
          return moment(payment.date_time).isSameOrAfter(from_date) && moment(payment.date_time).isSameOrBefore(to_date);
        });
        this.filterState = true;
        this.empty_orders_state = "Payments Not Found";
    },
    formatDate(row, column, cellValue) {
        return moment(row.date_time).format('MMM Do YYYY, h:mm a');
    },
    formatAmount(row, column, cellValue) {
        let value = (row.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
        value = value.split(".");
        return value[0];
     },
  },
  computed: {
    ...mapGetters({
      paymentData:'$_transactions/getPayments'
    }),
    payment_data() {
      let from = (this.pagination_page - 1) * this.pagination_limit;
      let to = this.pagination_page * this.pagination_limit;
      
      if(this.filterState == true){
        return this.filteredPaymentData.slice(from, to);
      }
      return this.paymentData.slice(from, to);
    },
    active_filter() {
      if(this.filterData.from_date !== '' && this.filterData.to_date !== ''){
        this.filterState = false;
      }
      return this.filterData.from_date !== '' && this.filterData.to_date !== '';
    }
  },
}
</script>

<style lang="css">
</style>
