<template lang="html">
<div class="">
    <div class="menu">
        <p class="button">
            <router-link class="button__element" to="/admin/users/add_user">Add User</router-link>
            <br> <br>
        </p>
    </div>
    <div class="" id="table_div">

    </div>
</div>

</template>

<script>
// import Vue from 'vue'
// import Vuetify from 'vuetify'
// Vue.use(Vuetify)
import DatatableMixin from '../../../../mixins/datatable_mixin.js'
export default {
// components:{Vuetify},
name:"ListUsers",
mixins: [ DatatableMixin ],
mounted() {
  var el = "table_div";
  var data = [
      {
          "Name": "CASH-AC29TZ828-T4W",
          "Phone": "Computer Architecture",
          "Email": "Computers",
          "Department": "125.60",
          "Type": "24",
          "Status": "24",
          "Branch": "24"
      },
      {
          "Name": "CASH-AC29TZ828-T4W",
          "Phone": "Asp.Net 4 Blue Book",
          "Email": "Programming",
          "Department": "56.00",
          "Type": "24",
          "Status": "24",
          "Branch": "24"
      },
      {
          "Name": "CASH-AC29TZ828-T4W",
          "Phone": "Popular Science",
          "Email": "Science",
          "Department": "210.40",
          "Type": "27",
          "Status": "27",
          "Branch": "27"
      }
  ];
  this.create_datatable(el, data,
  {
    title : "Users",
    count: true,
    custom_col:[
      {
        key: "Action",
        render: '<a href="" class="mdshow" onclick="">Edit user</a> | <a href="" class="mdshow" onclick="">Add to branch</a>'
      },
    ],
    col_options: [
      {
        option:'',
        target:''
      },
    ],
  });
},
}
</script>

<style lang="css" scoped>
@import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
/* @import "../../../../assets/styles/datatable.css"; */

.button{
    float:right;
}
.button__element{
    text-transform: uppercase;
    display: inline-block;
    padding: 10px 30px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 3px;
    color: #fff;
    background-color: #1782C5;
    border-color: #357ebd;
    text-decoration: none;
}
.menu{
    display: flow-root;
}

</style>
