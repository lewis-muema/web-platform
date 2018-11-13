<template lang="html">
  <div class="" id="order_hist_container">
     <el-table
      :data="tableData"
      style="width: 100%"
      @expand-change="handleRowExpand"
      >
      <el-table-column type="expand">
        <template slot-scope="props">
          <router-view></router-view>
        </template>
      </el-table-column>
      <el-table-column
        label="Date"
        prop="date">
      </el-table-column>
      <el-table-column
        label="Name"
        prop="name">
      </el-table-column>
  </el-table>
 
  </div>
</template>

<script>
export default {
      data() {
        return {
          tableData: [{
          date: '2016-05-03',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-02',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-04',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-01',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-08',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-06',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }, {
          date: '2016-05-07',
          name: 'Tom',
          state: 'California',
          city: 'Los Angeles',
          address: 'No. 189, Grove St, Los Angeles',
          zip: 'CA 90036'
        }]
        }
      },
      methods:{
        handleRowExpand(row, expanded) {
          if(expanded.length > 0){
              console.log('handling row expand');
              //trigger router action here
              this.$router.push('/transactions/order_history/details');
          }
        
        }
      }
    }
</script>

<style lang="css">
</style>
