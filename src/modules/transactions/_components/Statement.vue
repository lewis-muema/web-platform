<template lang="html">
  <div class="" id="statement_container">
    <el-table
     :data="get_statement"
     style="width: 100%"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name:'Statement',
  data: function () {
    return {
      empty_statement_state:"Fetching Statement"
    }
  },
  computed: {
    ...mapGetters({
      get_statement:'$_transactions/get_statement'
    }),
  },
}
</script>

<style lang="css">
</style>
