<template lang="html">

  <div class="" id="payments_container">
        <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="From Date"/>
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="To Date"/>
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" class="button-primary section--filter-action">Search</button>
          <button type="button" class="button-primary section--filter-action">New Payment</button>
        </div>
    </div>

    <el-table
     :data="tableData"
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
import { mapGetters } from 'vuex';

export default {
  name:'Payments',
  data: function () {
    return {
      empty_payments_state:"Fetching Payments",
      pagination_limit:5,
      pagination_page:1,
    }
  },
  computed: {
    ...mapGetters({
      tableData:'$_transactions/get_payments'
    }),
  },
  methods: {
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
  }
}
</script>

<style lang="css">
  @import "../../../assets/styles/datatable.css";
</style>
