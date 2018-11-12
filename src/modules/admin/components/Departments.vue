<template lang="html">
    <div class="departments_container" id="departments_container">
    <div class="menu">
        <p class="button">
            <a class="button__element"> Add Department </a>
            <br> <br>
        </p>
    </div>
      <div class="" id="table_div">

      </div>
    </div>
</template>

<script>
import DatatableMixin from '../../../mixins/datatable_mixin.js'

export default {
    name : "Departments",
    mixins: [ DatatableMixin ],
    mounted() {
      var el = "table_div";
      var data = [
          {
              "Name": "CASH-AC29TZ828-T4W",
              "Approver": "Computer Architecture",
          },
          {
              "Name": "CASH-AC29TZ828-T4W",
              "Approver": "Asp.Net 4 Blue Book",
          },
          {
              "Name": "CASH-AC29TZ828-T4W",
              "Approver": "Popular Science",
          }
      ];
      this.create_datatable(el, data,
      {
        title : "Departments",
        count: true,
        custom_col:[
          {
            key: "Actions",
            render: '<a href="" class="mdshow" onclick="">Edit</a> | <a href="" class="mdshow" onclick="">Delete</a>'
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

<style lang="css">
    @import "../../../styles/datatable.css";
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
