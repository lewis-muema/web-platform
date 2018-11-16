<template lang="html">

  <div class="" id="payments_container">
    <div class="table--header">
        <div class="table--header-filter-wrap">
            <el-select class="table--header-filter-input" v-model="value" placeholder="Users">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input class="input-control table--header-filter-input" type="date" name="name" value="" placeholder="From Date"/>
            <el-input class="input-control table--header-filter-input" type="date" name="name" value="" placeholder="To Date"/>
        </div>
        <div class="table--header-action-wrap">

        </div>
    </div>
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
