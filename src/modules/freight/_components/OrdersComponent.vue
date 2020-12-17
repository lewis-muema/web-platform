<template lang="html">
  <div class="transporters-main">
    <div class="freight-orders--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-input
          v-model="search"
          placeholder="Search"
          class="freight-orders-search"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
          />
        </el-input>
      </div>
      <div class="section--filter-action-wrap">
        <button
          type="button"
          class="button-primary section--filter-action freight-create-order"
          name="create_order_text"
          @click="createNewOrder"
        >
          {{ create_order_text }}
        </button>
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="order_history_data"
      style="width: 100%;"
      :border="true"
      :stripe="true"
      :row-key="getRowKey"
    >
      <template slot="empty">
        {{ empty_orders_state }}
      </template>
      <el-table-column
        label="Pick up location"
        prop="order_date"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['pick_up_name'] }}
        </template>
      </el-table-column>
      <el-table-column
        label="Destination"
        prop="order_date"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['destination_name'] }}
        </template>
      </el-table-column>

      <el-table-column
        key="1"
        label="Transporter"
        prop="transporter_name"
        width="200"
      />

      <el-table-column
        label="Amount"
        prop="path"
        width="150"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['currency'] }}
          {{ formatCurrency(order_history_data[scope.$index]['amount']) }}
        </template>
      </el-table-column>

      <el-table-column
        label="Date"
        prop="order_date"
      >
        <template slot-scope="props">
          {{ convertToUTCToLocal(order_history_data[props.$index]['date_created']) | moment }}
        </template>
      </el-table-column>

      <el-table-column
        label="Status"
        prop="path"
        header-align="center"
        align="center"
      >
        <template slot-scope="props">
          <div
            class="view-orders-transporter-info"
            @click="viewOrdersInfo(order_history_data[props.$index]['order_id'])"
          >
            View <i class="el-icon-arrow-right view-transporter-info" />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="section--pagination-wrap">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="order_history_total"
        :page-size="pagination_limit"
        :current-page.sync="pagination_page"
        :page-sizes="[5, 10, 20, 50, 100]"
        class="section--pagination-item"
        @current-change="changePage"
        @size-change="changeSize"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import numeral from 'numeral';
import TimezoneMxn from '../../../mixins/timezone_mixin';

const moment = require('moment');

export default {
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
  },
  mixins: [TimezoneMxn],
  data() {
    return {
      empty_orders_state: 'Fetching freight Orders',
      search: '',
      pagination_limit: 10,
      pagination_page: 1,
      create_order_text: 'Create an order',
      loading: false,
      sessionData: {},
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      getFreightOrdersData: '$_freight/getFreightOrders',
    }),
    order_history_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.freightOrdersData.slice(from, to);
    },
    order_history_total() {
      return this.freightOrdersData.length;
    },
    freightOrdersData() {
      const freightOrders = [];
      this.getFreightOrdersData.forEach((row) => {
        freightOrders.push(row);
      });
      return freightOrders;
    },
  },
  watch: {
    getSess: {
      handler() {
        this.populateFreightOrders();
      },
      deep: true,
    },
  },
  mounted() {
    this.populateFreightOrders();
  },
  methods: {
    ...mapMutations({
      setFreightOrders: '$_freight/setFreightOrders',
    }),
    getOrderFromName(path) {
      const splittedName = path[0].name.split(',', 2);
      return splittedName[0];
    },
    getOrderToName(path) {
      const pathLength = path.length;
      const splittedName = path[pathLength - 1].name.split(',', 2);
      return splittedName[0];
    },
    populateFreightOrders() {
      const sessionData = this.$store.getters.getSession;

      if (Object.keys(sessionData).length > 0) {
        this.sessionData = sessionData;

        const ordersPayload = {
          user_id:
            sessionData.default === 'biz'
              ? sessionData.biz.cop_id
              : sessionData[sessionData.default].user_id,
          user_type: sessionData.default === 'biz' ? 1 : 3,
        };

        this.requestFreightOrders(ordersPayload);
      }
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.orderHistoryData.slice(from, to);
    },
    ...mapActions(['$_freight/requestFreightOrders']),
    moment() {
      return moment();
    },
    formatCurrency(currency) {
      return numeral(currency).format('0,0');
    },
    getRowKey(row) {
      return row.order_id;
    },
    requestFreightOrders(payload) {
      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/list',
      };
      this.$store.dispatch('$_freight/requestFreightOrders', fullPayload).then(
        () => {
          this.empty_orders_state = 'No available freight orders';
        },
        (error) => {
          this.setFreightOrders([]);

          if (Object.prototype.hasOwnProperty.call(error.response.data, 'data')) {
            this.empty_orders_state = 'No available freight orders';
          } else {
            this.empty_orders_state = 'Orders failed to fetch';
          }
        },
      );
    },
    viewOrdersInfo(val) {
      this.$router.push(`/freight/orders/info/${val}`);
    },
    createNewOrder() {
      this.$router.push('/freight/orders/create');
    },
  },
};
</script>

<style lang="css">
@import '../../../assets/styles/transporters_component.css?v=1';

.freight-orders-search{
  width: 37% !important;
}
.freight-create-order{
  border-width: 0px !important;
  width: 50%;
}
.freight-orders--filter-wrap{
  margin-bottom: 8px;
  background: #fff;
  padding-top: 20px;
  padding-bottom: 38px;
  border: none;
  display: block;
  position: relative;
  width: 100%;
  float: left;
}
div > button > span{
  padding: 0 !important
}
.freight-status{
  padding: 0 !important;
  width: 43%;
  height: 23px;
  font-size: 12px;
  cursor: default;
}
.view-orders-transporter-info{
  cursor: pointer;
}
.freight-orders-status{
  display: flex;
}
</style>
