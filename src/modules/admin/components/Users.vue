    <template lang="html">
    <div class="">
        <div class="menu">
            <p class="button">
                <a class="button__element"> Add User </a>
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
import DatatableMixin from '../../../mixins/datatable_mixin.js'
export default {
    // components:{Vuetify},
    name:"Users",
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
        title : "Users",
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
    /* @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    @import '~vuetify/dist/vuetify.min.css'; */
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
