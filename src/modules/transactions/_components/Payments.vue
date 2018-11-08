<template lang="html">
  <div class="" id="payments_container">
    <div class="" id="table_div">

    </div>
  </div>
</template>

<script>
import DatatableMixin from '../../../mixins/datatable_mixin.js'
export default {
  name:'Payments',
  mixins: [ DatatableMixin ],
  mounted() {
    var el = "table_div";
    var data = [
        {
            "Txn": "CASH-AC29TZ828-T4W",
            "Date": "Computer Architecture",
            "Method": "Computers",
            "Description": "125.60",
            "Amount": "24"
        },
        {
            "Txn": "CASH-AC29TZ828-T4W",
            "Date": "Asp.Net 4 Blue Book",
            "Method": "Programming",
            "Description": "56.00",
            "Amount": "24"
        },
        {
            "Txn": "CASH-AC29TZ828-T4W",
            "Date": "Popular Science",
            "Method": "Science",
            "Description": "210.40",
            "Amount": "27"
        }
    ];
    this.create_datatable(el, data,
    {
      title : "Payments Test",
      count: true,
      custom_col:[
        {
          key: "Custom test",
          render: '<a href="#" class="mdshow" onclick="#">Test Custom</a>'
        },
        {
          key: "Custom test2",
          render: '<a href="#" class="mdshow" onclick="#">Test Custom2</a>'
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
</style>
