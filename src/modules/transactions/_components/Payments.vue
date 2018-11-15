<template lang="html">
  <div class="" id="payments_container">
    <el-table
     :data="get_payments"
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name:'Payments',
  data: function () {
    return {
      empty_payments_state:"Fetching Payments"
    }
  },
  computed: {
    ...mapGetters({
      get_payments:'$_transactions/get_payments'
    }),
  },
  methods: {
    handleRowExpand(row, expanded) {
      console.log(row);
      if(expanded.length > 0){
          console.log('handling row expand');
      }

  },
  }
}
</script>

<style lang="css">
  @import "../../../assets/styles/datatable.css";
</style>
