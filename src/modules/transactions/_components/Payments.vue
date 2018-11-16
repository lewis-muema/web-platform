<template lang="html">

  <div class="" id="payments_container">
        <div class="section--filter-wrap">
          <div class="section--filter-input-wrap">
              <el-date-picker class="section--filter-input" type="date" name="from_date" v-model="filterData.from_date" placeholder="From"/>
              <el-date-picker class="section--filter-input" type="date" name="to_date" v-model="filterData.to_date" placeholder="To"/>
              
              <button type="button" :class="inactive_filter?'button-primary section--filter-action align-left':'button-primary section--filter-action-inactive align-left'">Search</button>
    
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
       prop="Txn"
        width="180"
       >
     </el-table-column>
     <el-table-column
       label="Date"
       prop="Date">
     </el-table-column>
     <el-table-column
       label="Method"
       prop="Method"
       >
     </el-table-column>
     <el-table-column
       label="Description"
       prop="Description"
       >
     </el-table-column>
     <el-table-column
       label="Amount"
       prop="Amount"
       >
     </el-table-column>
   </el-table>

     <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="payment_data.length"
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name:'Payments',
  data: function () {
    return {
      empty_payments_state:"Fetching Payments",
      pagination_limit:5,
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

      let payment_payload = {
        "cop_id": 669,
        "user_type": 2
      }
      this.$store.dispatch("$_transactions/requestPayments", payment_payload).then(response => {
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
        let paginated_drivers = this.searched_drivers.slice(from, to);
        console.log(from, to, paginated_drivers);
    },
    
  },
  computed: {
    ...mapGetters({
      paymentData:'$_transactions/getPayments'
    }),
    payment_data() {
      if(this.filterState == true){
        return this.filteredPaymentData;
      }
      return this.paymentData;
    },
    inactive_filter() {
      if(this.filterData.from_date == '' && this.filterData.to_date == ''){
        this.filterState = false;
      }
      return this.filterData.from_date == '' && this.filterData.to_date == '';
    }
  },
}
</script>

<style lang="css">
</style>
