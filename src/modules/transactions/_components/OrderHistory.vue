<template lang="html">
  <div
    id="order_hist_container"
    class=""
  >
    <div class="section--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-select
          v-if="sessionData.default === 'biz'"
          v-model="filterData.user"
          class="section--filter-input"
          :placeholder="$t('general.users')"
          filterable
        >
          <el-option
            :label="$t('general.all_users')"
            value="-1"
          />
          <el-option
            v-for="user in copUsers"
            :key="user.cop_user_id"
            :label="user.name"
            :value="user.cop_user_id"
          />
          <!-- {{this.session.default}} -->
        </el-select>
        <el-date-picker
          v-model="filterData.from_date"
          class="section--filter-input"
          type="date"
          name="from_date"
          value=""
          :placeholder="$t('general.from')"
        />
        <el-date-picker
          v-model="filterData.to_date"
          class="section--filter-input"
          type="date"
          name="to_date"
          value=""
          :placeholder="$t('general.to')"
        />
      </div>
      <div class="section--filter-action-wrap">
        <button
          type="button"
          :class="
            inactive_filter
              ? 'button-primary section--filter-action-inactive btn-order-hstry'
              : 'button-primary section--filter-action btn-order-hstry'
          "
          name="order_history_text"
          :disabled="inactive_filter ? true : false"
          @click="filterTableData"
        >
          {{ order_history_text }}
        </button>
      </div>
    </div>
    <div class="currencies-section">
      <div
        v-for="(currency, index) in currencies"
        :key="index"
        class="currency-selectors"
        :class="activeCurrency === currency ? 'active-currency' : ''"
        @click="activeCurrency = currency"
      >
        {{ currency }}
      </div>
    </div>
    <div class="bg-grey">
      <div class="download_history">
        <el-dropdown
          align="right"
          @command="handleCommand"
        >
          <el-button
            class="download_history"
            type="primary"
            size="mini"
          >
            {{$t('general.download')}}<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu
            id="order_hist"
            slot="dropdown"
            class="export_dropdown"
          >
            <el-dropdown-item command="a">
              {{$t('general.excel')}}
            </el-dropdown-item>
            <el-dropdown-item command="b">
              {{$t('general.pdf')}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-table
      id="save-pdf"
      v-loading="loading"
      :data="order_history_data"
      style="width: 100%;"
      :border="true"
      :stripe="true"
      :row-key="getRowKey"
      :expand-row-keys="expand_keys"
      @row-click="expandTableRow"
      @expand-change="handleRowExpand"
    >
      <template slot="empty">
        {{ empty_orders_state }}
      </template>
      <el-table-column type="expand">
        <template slot-scope="props">
          <router-view />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('general.txn')"
        prop="order_no"
        width="180"
      />
      <el-table-column
        :label="$t('general.date')"
        prop="order_date"
      >
        <template slot-scope="props">
          {{ convertToUTCToLocal(order_history_data[props.$index]['order_date']) | moment }}
        </template>
      </el-table-column>

      <el-table-column
        v-if="sessionData.default === 'biz'"
        key="1"
        :label="$t('general.user')"
        prop="user_details.name"
        width="120"
      />
      <el-table-column
        :label="$t('general.amount')"
        width="150"
        header-align="center"
        align="center"
        :formatter="formatAmount"
      >
        <template
          slot-scope="scope"
          class="order_cost_amount"
        >
          <div class="order_cost_amount">
            <span
              v-if="order_history_data[scope.$index]['fixed_cost']"
              class=""
            >
              {{ order_history_data[scope.$index]['order_currency'] }}
              {{ formatCurrency(order_history_data[scope.$index]['order_cost']) }}
            </span>
            <span v-else>
              <span
                v-if="
                  order_history_data[scope.$index]['confirm_status'] === 0 &&
                    order_history_data[scope.$index]['customer_min_amount']
                "
              >
                {{ order_history_data[scope.$index]['order_currency'] }}
                {{ formatCurrency(order_history_data[scope.$index]['customer_min_amount']) }}
              </span>
              <span v-else>
                {{ order_history_data[scope.$index]['order_currency'] }}
                {{ formatCurrency(order_history_data[scope.$index]['order_cost']) }}
              </span>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('general.deliveries')"
        prop="path"
        width="80"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['path'].length - 1 }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('general.from')"
        prop="path"
      >
        <template slot-scope="scope">
          {{ getOrderFromName(order_history_data[scope.$index]['path']) }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('general.to')"
        prop="path"
      >
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
import { Printd } from 'printd';
import * as _ from 'lodash';
import exportFromJSON from 'export-from-json';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import numeral from 'numeral';
import TimezoneMxn from '../../../mixins/timezone_mixin';
import EventsMixin from '../../../mixins/events_mixin';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const moment = require('moment');

// some styles for the element (optional)
const cssText = `
  table {
    font-size: 85%;
    font-family: 'Nunito', sans-serif;
    border-spacing: 0;
    border-collapse: collapse;
    text-align: center;
    width: 600px;
    position: relative;
    left: -90px;
    top: 10px;
    empty-cells: hide;
  }
  td {
    height: 30px;
    empty-cells: hide;
  }
  tr {
    height: 30px;
    empty-cells: hide;
  }
  .el-table__expanded-cell{
    display:none;
    border-style: none;
  }
  .expanded + tr{
    display: none;
  }
`;

export default {
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
  },
  mixins: [TimezoneMxn, EventsMixin],
  data() {
    return {
      empty_orders_state: this.$t('general.fetching_order_history'),
      empty_users_state: this.$t('general.fetching_cop_users'),
      expand_id: 0,
      expand_keys: [],
      pagination_limit: 10,
      pagination_page: 1,
      order_history_text: this.$t('general.search'),
      filterData: {
        user: '',
        from_date: '',
        to_date: '',
      },
      filteredData: [],
      loading: false,
      savepdf: 'save-pdf',
      sessionData: {},
      default_currency: '',
      currencies: [],
      activeCurrency: '',
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      unfilteredOrderHistoryData: '$_transactions/getOrderHistoryOrders',
      copUsers: '$_transactions/getCopUsers',
      getUserCurrencies: '$_transactions/getUserCurrencies',
    }),
    inactive_filter() {
      return (
        this.filterData.user === ''
        && (this.filterData.from_date === '' || this.filterData.to_date === '')
      );
    },
    order_history_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.orderHistoryData.slice(from, to);
    },
    order_history_total() {
      return this.orderHistoryData.length;
    },
    orderHistoryData() {
      const orderHistory = [];
      this.unfilteredOrderHistoryData.forEach((row) => {
        if (row.order_currency === this.activeCurrency) {
          orderHistory.push(row);
        }
      });
      return orderHistory;
    },
  },
  watch: {
    getSess: {
      handler() {
        this.populateOrders();
      },
      deep: true,
    },
    orderHistoryData() {
      this.currencies = this.getUserCurrencies;
    },
  },
  beforeDestroy() {
    this.sendGA4Events('exit_order_history');
  },
  mounted() {
    this.populateOrders();
    this.setUserDefaultCurrency();
    this.currencies = this.getUserCurrencies;
    this.trackMixpanelEvent('Opened Order History Page');
  },
  methods: {
    ...mapMutations({
      setOrderHistoryOrders: '$_transactions/setOrderHistoryOrders',
    }),

    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },

    populateOrders() {
      const sessionData = this.$store.getters.getSession;

      if (Object.keys(sessionData).length > 0) {
        this.sessionData = sessionData;

        let ordersPayload = {};

        if (sessionData.default === 'biz' && sessionData.biz.user_type === 2) {
          // create cop admin payload

          ordersPayload = {
            cop_id: sessionData.biz.cop_id,
            user_type: sessionData.biz.user_type,
            user_id: '-1',
          };
        } else if (sessionData.default === 'biz') {
          ordersPayload = {
            cop_id: sessionData.biz.cop_id,
            user_type: sessionData.biz.user_type,
            user_id: sessionData.biz.user_id,
          };
        } else {
          // create peer payload
          ordersPayload = {
            user_id: sessionData[sessionData.default].user_id,
          };
        }

        this.requestOrderHistory(ordersPayload);
        if (sessionData.default === 'biz') {
          this.requestCopUsers();
        }
      }
    },
    setUserDefaultCurrency() {
      const sessionData = this.$store.getters.getSession;
      this.default_currency = sessionData[sessionData.default].default_currency;
      this.activeCurrency = this.default_currency;
    },
    filterTableData() {
      this.loading = true;

      // reset filter
      this.empty_orders_state = this.$t('general.searching_orders');

      const { user } = this.filterData;
      let { from_date: fromDate, to_date: toDate } = this.filterData;
      // let from_date = this.filterData.from_date;
      // let to_date = this.filterData.to_date;

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = moment(toDate).format('YYYY-MM-DD');

      const session = this.$store.getters.getSession;

      let payload = {};

      if (session.default === 'biz') {
        const { cop_id: copId, user_type: userType } = session.biz;
        // const cop_id = session.biz.cop_id;
        const userId = this.filterData.user;
        // const user_type = session.biz.user_type;

        payload = {
          cop_id: copId,
          user_id: '-1',
          user_type: userType,
          from: fromDate,
          to: toDate,
        };

        if (user && user !== 0) {
          payload = {
            cop_id: copId,
            user_id: userId,
            from: fromDate,
            to: toDate,
          };
        }
      } else {
        const userId = session[session.default].user_id;

        payload = {
          user_id: userId,
          from: fromDate,
          to: toDate,
        };
      }
      this.order_history_text = this.$t('general.searching');
      this.requestOrderHistory(payload);
      this.loading = false;
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
    ...mapActions(['$_transactions/requestOrderHistoryOrders', '$_transactions/requestCopUsers']),
    moment() {
      return moment();
    },
    getOrderFromName(path) {
      const splittedName = path[0].name.split(',', 2);
      return splittedName[0];
    },
    getOrderToName(path) {
      const pathLength = path.length;
      const splittedName = path[pathLength - 1].name.split(',', 2);
      return splittedName[0];
    },
    getRowKey(row) {
      return row.order_id;
    },
    expandTableRow(row) {
      // check if expand keys contains the same order_id
      // if so do not push the key again
      if (this.expand_keys.includes(row.order_id)) {
        this.expand_keys = [];
      } else {
        this.expand_id = row.order_id;
        this.expand_keys = [];
        this.expand_keys.push(row.order_id);
        this.$router.push({
          name: 'order-details',
          params: { id: row.order_id },
        });
      }
      this.sendGA4Events('select_order', {order_number: row.order_no});
    },
    handleRowExpand(row) {
      // check if expand keys contains the same order_id
      // if so do not push the key again
      if (this.expand_keys.includes(row.order_id)) {
        this.expand_keys = [];
      } else {
        this.expand_id = row.order_id;
        this.expand_keys = [];
        this.expand_keys.push(row.order_id);
        this.$router.push({
          name: 'order-details',
          params: { id: row.order_id },
        });
      }
    },
    formatAmount(row) {
      if (typeof row.order_cost !== 'undefined') {
        let value = row.order_cost.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        value = value.split('.');
        return value[0];
      }
      return '';
    },
    requestOrderHistory(payload) {
      const fullPayload = {
        values: payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'order_history',
      };
      this.$store.dispatch('$_transactions/requestOrderHistoryOrders', fullPayload).then(
        () => {
          this.order_history_text = this.$t('general.search');
          this.empty_orders_state = this.$t('general.order_history_not_found');
        },
        (error) => {
          this.setOrderHistoryOrders([]);
          this.order_history_text = this.$t('general.search');

          if (Object.prototype.hasOwnProperty.call(error.response.data, 'data')) {
            this.empty_orders_state = this.$t('general.no_order_history_for_user')
          } else {
            this.empty_orders_state = this.$t('general.order_history_failed');
          }
        },
      );
    },
    requestCopUsers() {
      // let cop_id = 0;
      const userPayload = {
        cop_id: this.sessionData.biz.cop_id,
      };

      const fullUsersPayload = {
        values: userPayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'cop_users',
      };
      this.$store.dispatch('$_transactions/requestCopUsers', fullUsersPayload).then(
        () => {
          this.empty_users_state = this.$t('general.cop_user_not_found');
        },
        () => {
          this.empty_users_state = this.$t('general.cop_user_failed_to_fetch');
        },
      );
    },
    handleCommand(command) {
      if (command === 'a') {
        let data;
        const data2 = [];

        for (let i = 0; i < this.orderHistoryData.length; i++) {
          const arr = {};
          arr.OrderNumber = this.orderHistoryData[i].order_no;
          arr.OrderAmount = this.orderHistoryData[i].order_cost;
          arr.OrderDate = this.orderHistoryData[i].order_date;
          arr.OrderDistanceKM = this.orderHistoryData[i].order_details.distance;
          arr.User = this.orderHistoryData[i].user_details.name;
          arr.From = this.orderHistoryData[i].path[0].name;
          arr.To = this.orderHistoryData[i].path[1].name;
          arr.RiderName = this.orderHistoryData[i].rider.rider_name;
          arr.RiderPhone = this.orderHistoryData[i].rider.rider_phone;
          data2.push(arr);
        }
        data = _.map(data2, row => _.pick(
          row,
          'OrderNumber',
          'OrderAmount',
          'OrderDate',
          'User',
          'OrderDistanceKM',
          'From',
          'To',
          'RiderName',
          'RiderPhone',
        ));
        const fileName = 'Order History';
        const exportType = 'csv';

        exportFromJSON({ data, fileName, exportType });
      } else {
        const pdfBdy = [
          [
            this.$t('general.order_number'),
            this.$t('general.order_amount'),
            this.$t('general.order_date'),
            this.$t('general.order_distance_in_km'),
            this.$t('general.user'),
            this.$t('general.from'),
            this.$t('general.to'),
            this.$t('general.riders_name'),
            this.$t('general.riders_phone'),
          ],
        ];
        this.orderHistoryData.forEach((item) => {
          pdfBdy.push([
            item.order_no,
            item.order_cost,
            item.order_date,
            item.order_details.distance,
            item.user_details.name,
            item.path[0].name,
            item.path[1].name,
            item.rider.rider_name,
            item.rider.rider_phone,
          ]);
        });
        const docDefinition = {
          pageSize: 'A3',
          widths: ['*', 'auto', 100, '*'],
          footer(currentPage, pageCount) {
            return `${currentPage.toString()} of ${pageCount}`;
          },

          content: [
            {
              table: {
                body: pdfBdy,
              },
            },
          ],
        };
        pdfMake.createPdf(docDefinition).download('Order History.pdf');
      }
    },
    formatCurrency(currency) {
      return numeral(currency).format('0,0');
    },
  },
};
</script>

<style lang="css">
.btn-order-hstry{
  border-width:0px !important;
}
.el-dropdown{
  float: right;
}
.body > div.el-picker-panel.el-date-picker.el-popper{
background-color: #fff !important;
}
#order_hist{
  color: #ecf0f1 !important;
  background-color: #ffffff !important;
  font-size: 13px;
  width: 10.5% !important;
}

.body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > ul > li{
background-color: #fff !important;
color:dimgray !important;
}
</style>
