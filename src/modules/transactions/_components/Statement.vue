<template lang="html">
  <div class="" id="statement_container">

     <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="From"/>
            <el-date-picker class="section--filter-input" type="date" name="name" value="" placeholder="To"/>
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" class="button-primary section--filter-action">Search</button>
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
       prop="Txn"
        width="180"
       >
     </el-table-column>
     <el-table-column
       label="Date"
       prop="Date">
     </el-table-column>
     <el-table-column
       label="Description"
       prop="Description"
       >
     </el-table-column>
     <el-table-column
       label="Debit"
       prop="Amount"
       >
     </el-table-column>
     <el-table-column
       label="Credit"
       prop="Amount"
       >
     </el-table-column>
     <el-table-column
       label="Running Balance"
       prop="Amount"
       >
     </el-table-column>
   </el-table>

    <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="statement_data.length"
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
  name:'Statement',
  data: function () {
    return {
      empty_statement_state:"Fetching Statement",
      pagination_limit:10,
      pagination_page:1,
      filterState: false,
      
    }
  },
  mounted(){ 
      let statement_payload = {
        "cop_id": 669
      }
      this.$store.dispatch("$_transactions/requestStatement", statement_payload).then(response => {
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
          let paginated_drivers = this.searched_drivers.slice(from, to);
          console.log(from, to, paginated_drivers);
      },

  },
  computed: {
    ...mapGetters({
      statementData:'$_transactions/getStatement'
    }),
    statement_data() {
      return this.statementData;
    }
  },
}
</script>

<style lang="css">
</style>
