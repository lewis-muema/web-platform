<template lang="html">
    <div class="">
               <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
        </div>
        <div class="section--filter-action-wrap">
          
          <button type="button" class="button-primary section--filter-action">Update Api Key</button>
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
     <el-table-column type="index">
     </el-table-column>
     
     <el-table-column
       label="Username"
       prop="username"
        width="180"
       >
     </el-table-column>
     <el-table-column
       label="API Key"
       prop="api_key">
     </el-table-column>
     <el-table-column
       label="Created"
       prop="created"
       >
     </el-table-column>
     <el-table-column
       label="API Status"
       prop="api_status"
       >
     </el-table-column>
     <el-table-column
       label="Account Status"
       prop="account_status"
       >
     </el-table-column>
   </el-table>
   
    <div class="content">
        <p><span class="content--bold">Ready to start using the Sendy API?</span> Head over to the <a href="http://docs.sendypublicapi.apiary.io/#" target="_blank">developer site</a>&nbsp;for complete documentation.</p>
    </div>
    </div>
</template>

<script>
export default {
    name:"API",
     mounted() {
    
    },
    data:function () {
      return {
        empty_payments_state:"Fetching API Credetials",
        pagination_limit:5,
        pagination_page:1,
        tableData:[
          {
              "username": "faithshop",
              "api_key": "zcHUVkH9GtxZmrUyZ6HY",
              "created": "Oct 30, 2018",
              "api_status": "Activated",
              "account_status": "Activated",
              "key_enviroment": "Live",
          },
          {
              "username": "faithshop",
              "api_key": "ALVvNhD8d7PVcnadsRSV",
              "created": "Oct 30, 2018",
              "api_status": "Activated",
              "account_status": "Activated",
              "key_enviroment": "Sandbox",
          },
      ]

      }
    },
    methods: {
      updateApiKey() {
      },
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

</style>
