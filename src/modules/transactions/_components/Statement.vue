<template lang="html">
  <div class="" id="statement_container">

     <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
            <el-date-picker class="section--filter-input" type="date" v-model="filterData.from_date" name="from_date" placeholder="From"/>
            <el-date-picker class="section--filter-input" type="date" v-model="filterData.to_date" name="to_date" placeholder="To"/>
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" :class="valid_filter ? 'button-primary section--filter-action':  'button-primary section--filter-action-inactive'" @click="filterStatementData"> Search </button>
        </div>
    </div>

    <el-table
     :data="statement_data"
     style="width: 100%"
     :border="true"
     :stripe="true"
     >
     <template slot="empty">
       {{empty_statement_state}}
     </template>
     <el-table-column
       label="Txn"
       prop="txn"
        width="180"
       >
     </el-table-column>
     <el-table-column
       label="Date"
       prop="date_time"
       :formatter="formatDate">
     </el-table-column>
     <el-table-column
       label="Description"
       prop="description"
       >
     </el-table-column>
     <el-table-column
       label="Debit"
       prop="amount"
       :formatter="formatDebitAmount"
       class-name="amount--table-format"
       >
     </el-table-column>
     <el-table-column
       label="Credit"
       prop="amount"
       :formatter="formatCreditAmount"
       class-name="amount--table-format"
       >
     </el-table-column>
     <el-table-column
       label="Running Balance"
       prop="running_balance"
       :formatter="formatRunningBalance"
       class-name="amount--table-format"
       >
     </el-table-column>
   </el-table>

    <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="statement_total"
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
import { mapActions, mapGetters } from 'vuex'
const moment = require('moment');

export default {
  name:'Statement',
  data: function () {
    return {
      empty_statement_state:"Fetching Statement",
      pagination_limit:10,
      pagination_page:1,
      filterState: false,
      filterData: {
        "from_date":"",
        "to_date":""
      },
      filteredStatementData:[]

    }
  },
  mounted(){ 
      let session_data = this.$store.getters.getSession;
      let statement_payload = {
        "cop_id": session_data.cop_id,
      }

      let full_payload = {
        "values" : statement_payload,
        "vm":this,
        "app":"NODE_PRIVATE_API",
        "endpoint":"statement"
      }

      this.$store.dispatch("$_transactions/requestStatement", full_payload).then(response => {
          console.log(response);
          this.empty_statement_state = "Statement Not Found";
      }, error => {
          console.log(error);
          this.empty_statement_state = "Statement Failed to Fetch";
      });
  },
  methods:{
       ...mapActions([
            '$_transactions/requestStatement',
     ]),
     changeSize(val) {
          this.pagination_page = 1;
          this.pagination_limit = val;
      },
      changePage() {
          console.log('Page changed to', this.pagination_page);
          let from = (this.pagination_page - 1) * this.pagination_limit;
          let to = this.pagination_page * this.pagination_limit;
          this.statementData.slice(from, to);
      },
      formatDate(row, column, cellValue) {
        return moment(row.date_time).format('MMM Do YYYY, h:mm a');
      },
      formatRunningBalance(row, column, cellValue) {
         let value = (row.running_balance).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
         value = value.split(".");
         return value[0];
      },
      formatDebitAmount(row, column, cellValue) {
         if(Math.sign(row.amount) > 0){

            let value = (row.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            value = value.split(".");
            return value[0];

         }
      },
      formatCreditAmount(row, column, cellValue) {
          if(Math.sign(row.amount) < 0){

            let value = (row.amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            value = value.split(".");
            return value[0];

         }
      },
      filterStatementData() {
            //reset filter
            this.filterState  = false;
            this.empty_statement_state = "Searching Payments";

            let from_date = this.filterData.from_date;
            let to_date = this.filterData.to_date;

            let payload = {
              "cop_id": 669,
              "user_type":2,
              "from":from_date,
              "to":to_date
            };


            from_date = moment(from_date).format('YYYY-MM-DD');
            to_date = moment(to_date).format('YYYY-MM-DD');

            this.requestStatement(payload);

            // this.filteredStatementData = this.statement_data;
            //
            // console.log(this.filteredStatementData);
            // console.log(to_date);
            // if (from_date !== '' && to_date !== '') {
            //
            //   this.filteredStatementData = this.filteredStatementData.filter(function (statement) {
            //     return moment(statement.date_time).isSameOrAfter(from_date) && moment(statement.date_time).isSameOrBefore(to_date);
            //   });
            //   this.filterState = true;
            //
            // }
            // this.empty_statement_state = "Statement Not Found";
      },

      requestStatement(payload){
          let full_payload = {
            "values" : payload,
            "vm":this,
            "app":"NODE_PRIVATE_API",
            "endpoint":"statement"
          }
          this.$store.dispatch("$_transactions/requestStatement", full_payload).then(response => {
             console.log("Got some data, now lets show something in this component")
             console.log(response);
             this.empty_statement_state = "Order Statement Not Found";
          }, error => {
              console.error("Got nothing from server. Prompt user to check internet connection and try again")
              console.log(error);
              this.empty_statement_state = "Order Statement Failed to Fetch";
          });
      }


  },
  computed: {
    ...mapGetters({
      statementData:'$_transactions/getStatement'
    }),
    valid_filter(){
      return this.filterData.from_date !== '' && this.filterData.to_date !== '';
    },
    statement_data() {
      let from = (this.pagination_page - 1) * this.pagination_limit;
      let to = this.pagination_page * this.pagination_limit;

      // if(this.filterState == true){
      //   return this.filteredStatementData.slice(from, to);
      // }
      return this.statementData.slice(from, to);
    },
    statement_total() {
      // if(this.filterState == true){
      //   return this.filteredData.length;
      // }
     return this.statementData.length;
    }
  },
}
</script>

<style lang="css">
</style>
