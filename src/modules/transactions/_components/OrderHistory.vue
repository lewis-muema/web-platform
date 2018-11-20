<template lang="html">
  <div class="" id="order_hist_container">
    <div class="section--filter-wrap">
        <div class="section--filter-input-wrap">
            <el-select class="section--filter-input" v-model="filterData.user" placeholder="Users" :v-if="session_data.default == 'biz'">
                <el-option v-for="user in cop_users" :key="user.cop_user_id" :label="user.name" :value="user.cop_user_id">
                </el-option>
            </el-select>
            <el-date-picker class="section--filter-input" type="date" name="from_date" value="" placeholder="From" v-model="filterData.from_date"/>
            <el-date-picker class="section--filter-input" type="date" name="to_date" value="" placeholder="To" v-model="filterData.to_date"/>
        </div>
        <div class="section--filter-action-wrap">
          <button type="button" :class="inactive_filter ? 'button-primary section--filter-action-inactive':'button-primary section--filter-action'"  @click="filterTableData">Search</button>
        </div>
    </div>

     <el-table
      :data="order_history_data"
      style="width: 100%"
      :border="true"
      :stripe="true"
      :row-key="getRowKey"
      :expand-row-keys="expand_keys"
      @row-click="expandTableRow"
      @expand-change="handleRowExpand"
      >
      <template slot="empty">
            {{empty_orders_state}}
      </template>
      <el-table-column type="expand">
        <template slot-scope="props">
          <router-view></router-view>
        </template>
      </el-table-column>
      <el-table-column
        label="Txn"
        prop="order_no"
         width="180"
        >
      </el-table-column>
      <el-table-column
        label="Date"
        prop="order_date">
        <template slot-scope="props">
          {{ order_history_data[props.$index]['order_date'] | moment }}
        </template>
      </el-table-column>

      <el-table-column
        label="User"
        prop="user_details.name"
        width="120"
        >
      </el-table-column>
      <el-table-column
        label="Amount"
        prop="order_cost"
        width="120"
        :formatter="formatAmount"
        class-name="amount--table-format"
        >
      </el-table-column>
      <el-table-column
        label="Deliveries"
        prop="path"
        width="120"
        >
        <template slot-scope="scope">
          {{order_history_data[scope.$index]['path'].length-1}}
        </template>
      </el-table-column>
      <el-table-column
        label="From"
        prop="path">
        <template slot-scope="scope">
          {{ getOrderFromName(order_history_data[scope.$index]['path']) }}
        </template>
      </el-table-column>
      <el-table-column
        label="To"
        prop="path">
         <template slot-scope="scope">
          {{ getOrderToName(order_history_data[scope.$index]['path']) }}
        </template>
      </el-table-column>
  </el-table>

  <div class="section--pagination-wrap">
        <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :total="order_history_total"
            :page-size="pagination_limit"
            :current-page.sync="pagination_page"
            @current-change="changePage"
            :page-sizes="[5,10, 20, 50, 100]"
            @size-change="changeSize"
            class="section--pagination-item"
            >
        </el-pagination>
    </div>

  </div>
</template>

<script>
const moment = require("moment");

import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      empty_orders_state: "Fetching Order History",
      empty_users_state: "Fetching Cop Users",
      expand_id: 0,
      expand_keys: [],
      pagination_limit: 10,
      pagination_page: 1,
      filterData: {
        user: "",
        from_date: "",
        to_date: ""
      },
      filteredData: [],
      filterState: false
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("MMM Do YYYY, h:mm a");
    }
  },
  methods: {
    filterTableData() {
      //reset filter
      this.filterState = false;
      this.empty_orders_state = "Searching Orders";

      let user = this.filterData.user;
      let from_date = this.filterData.from_date;
      let to_date = this.filterData.to_date;

      from_date = moment(from_date).format("YYYY-MM-DD");
      to_date = moment(to_date).format("YYYY-MM-DD");

      //we need to Fetch
      //we use actions
      //we are passing an updated payload
      //the updated payload
      //will have dates
      let payload = {
        cop_id: 669,
        user_type: 2,
        from: from_date,
        to: to_date
      };

      this.requestOrderHistory(payload);

      this.filteredData = this.orderHistoryData;

      console.log(this.filteredData);
      console.log(to_date);

      //check if both are filled
      if (user !== "" && from_date !== "" && to_date !== "") {
        console.log("performing a user and date filter");
        console.log(from_date);
        console.log(to_date);
        from_date = moment(from_date);
        to_date = moment(to_date);

        console.log(from_date);
        let vm = this;

        this.filteredData = this.filteredData.filter(function(order) {
          console.log(order);
          return order.user_details.id == user;
        });
        this.filterState = true;
      } else if (user !== "") {
        //user filter
        console.log("performing a user filter");
        console.log(user);

        this.filteredData = this.filteredData.filter(
          order => order.user_details.id == user
        );
        this.filterState = true;
      } else {
        //date filter
        // console.log('performing a date filter');
        //  this.filteredData = this.filteredData.filter(function (order) {
        //   return moment(order.order_date).isSameOrAfter(from_date) && moment(order.order_date).isSameOrBefore(to_date);
        //  });

        this.filterState = true;
      }

      this.empty_orders_state = "Order History Not Found";
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      console.log("Page changed to", this.pagination_page);
      let from = (this.pagination_page - 1) * this.pagination_limit;
      let to = this.pagination_page * this.pagination_limit;
      this.orderHistoryData.slice(from, to);
    },
    ...mapActions([
      "$_transactions/requestOrderHistoryOrders",
      "$_transactions/requestCopUsers"
    ]),
    moment: function() {
      return moment();
    },
    getOrderFromName(path) {
      let name = path[0].name;
      let splitted_name = name.split(",", 2);
      return splitted_name[0];
    },
    getOrderToName(path) {
      let path_length = path.length;
      let name = path[path_length - 1].name;
      let splitted_name = name.split(",", 2);
      return splitted_name[0];
    },
    getRowKey(row) {
      return row.order_id;
    },
    expandTableRow(row, event, column) {
      this.expand_id = row.order_id;
      this.expand_keys = [];
      this.expand_keys.push(row.order_id);
      this.$router.push({
        name: "order-details",
        params: { id: row.order_id }
      });
    },
    handleRowExpand(row, expanded) {
      this.expand_id = row.order_id;
      this.expand_keys = [];
      this.expand_keys.push(row.order_id);
      this.$router.push({
        name: "order-details",
        params: { id: row.order_id }
      });
    },
    formatAmount(row, column, cellValue) {
      if(typeof row.order_cost != 'undefined'){
        let value = row.order_cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
        value = value.split(".");
        return value[0];
      } else {
        return "";
      }
    },
    requestOrderHistory(payload) {
      let full_payload = {
        values: payload,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "order_history"
      };
      this.$store
        .dispatch("$_transactions/requestOrderHistoryOrders", full_payload)
        .then(
          response => {
            console.log(
              "Got some data, now lets show something in this component"
            );
            console.log(response);
            this.empty_orders_state = "Order History Not Found";
          },
          error => {
            console.error(
              "Got nothing from server. Prompt user to check internet connection and try again"
            );
            console.log(error);
            this.empty_orders_state = "Order History Failed to Fetch";
          }
        );
    },
    requestCopUsers() {
      let cop_id = 0;
      let users_payload = {
        cop_id: this.session_data.biz.cop_id
      };

      let full_users_payload = {
        values: users_payload,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "cop_users"
      };
      this.$store
        .dispatch("$_transactions/requestCopUsers", full_users_payload)
        .then(
          response => {
            console.log(
              "Got some data, now lets show something in this component"
            );
            console.log(response);
            this.empty_users_state = "Cop Users Not Found";
          },
          error => {
            console.error(
              "Got nothing from server. Prompt user to check internet connection and try again"
            );
            console.log(error);
            this.empty_users_state = "Cop Users Failed to Fetch";
          }
        );
    }
  },
  computed: {
    ...mapGetters({
      orderHistoryData: "$_transactions/getOrderHistoryOrders",
      cop_users: "$_transactions/getCopUsers"
    }),
    session_data() {
      return this.$store.getters.getSession;
    },
    inactive_filter() {
      if (
        this.filterData.user == "" &&
        (this.filterData.from_date == "" || this.filterData.to_date == "")
      ) {
        this.filterState = false;
      }
      return (
        this.filterData.user == "" &&
        (this.filterData.from_date == "" || this.filterData.to_date == "")
      );
    },
    order_history_data() {
      let from = (this.pagination_page - 1) * this.pagination_limit;
      let to = this.pagination_page * this.pagination_limit;

      // if(this.filterState == true){
      //   return this.filteredData.slice(from, to);
      // }
      return this.orderHistoryData.slice(from, to);
    },
    order_history_total() {
      // if(this.filterState == true){
      //   return this.filteredData.length;
      // }
      return this.orderHistoryData.length;
    }
  },
  mounted() {
    let session_data = this.session_data;

    let orders_payload = {};

    if (session_data.default == "biz") {
      orders_payload = {
        cop_id: session_data["biz"]["cop_id"],
        user_type: session_data["biz"]["user_type"],
        user_id: session_data["biz"]["user_id"]
      };
    } else {
      //create peer payload
      orders_payload = {
        user_id: session_data[session_data.default]["user_id"]
      };
    }

    this.requestOrderHistory(orders_payload);
    if (session_data.default == "biz") {
      this.requestCopUsers();
    }
  }
};
</script>

<style lang="css">
</style>
