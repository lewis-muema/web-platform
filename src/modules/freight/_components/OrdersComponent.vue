<template lang="html">
  <div class="transporters-main">
    <div class="freight-orders--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-input
          v-model="search"
          :placeholder="$t('ordersComponent.search')"
          class="freight-orders-search"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
          />
        </el-input>
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
        :label="$t('ordersComponent.pickup_location')"
        prop="order_date"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['pickup'] }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('ordersComponent.destination')"
        prop="order_date"
      >
        <template slot-scope="scope">
          {{ order_history_data[scope.$index]['destination'] }}
        </template>
      </el-table-column>

      <el-table-column
        key="1"
        :label="$t('ordersComponent.type_of_load')"
        prop="cargo_type"
        width="200"
      />
      <el-table-column
        :label="$t('ordersComponent.type_of_truck')"
        prop="carrier_type"
        width="200"
      />
      <el-table-column
        :label="$t('ordersComponent.pickup_date')"
        prop="order_date"
      >
        <template slot-scope="props">
          {{ getFormattedDate(order_history_data[props.$index]['pickup_time']) }}
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('ordersComponent.status')"
        prop="path"
        header-align="center"
        align="center"
      >
        <template slot-scope="props">
          <div
            class="view-orders-transporter-info"
            @click="viewOrdersInfo(order_history_data[props.$index]['id'])"
          >
            {{ $t('ordersComponent.view') }} <i class="el-icon-arrow-right view-transporter-info" />
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
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';

const moment = require('moment');

export default {
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
  },
  mixins: [TimezoneMxn, MixpanelMixin],
  data() {
    return {
      empty_orders_state: this.$t('ordersComponent.freight_shipments'),
      search: '',
      pagination_limit: 10,
      pagination_page: 1,
      create_order_text: this.$t('ordersComponent.create_order'),
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
    const session = this.$store.getters.getSession;
    this.populateFreightOrders();

    this.trackMixpanelEvent('Shipments Page Viewed', {
      userId: session[session.default].user_id,
      email: session[session.default].user_email,
      phone: session[session.default].user_phone,
      name: session[session.default].user_name,
      clientType: 'Web',
      clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
      device: 'Desktop',
    });
  },
  methods: {
    ...mapMutations({
      setFreightOrders: '$_freight/setFreightOrders',
    }),
    getOrderFromName(path) {
      const splittedName = path[0].name.split(',', 2);
      return splittedName[0];
    },
    getFormattedDate(data) {
      return moment(data, 'MM-DD-YYYY HH:mm:ss').format('MMMM Do YYYY, HH:mm');
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

        let label = `peer_id=${sessionData[sessionData.default].user_id}`;

        if (sessionData.default === 'biz') {
          label = `cop_id=${sessionData.biz.cop_id}&cop_user_id=${sessionData.biz.user_id}`;
        }

        this.requestFreightOrders(label);
      }
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.freightOrdersData.slice(from, to);
    },
    ...mapActions(['$_freight/requestFreightOrders']),
    moment() {
      return moment();
    },
    formatCurrency(currency) {
      return numeral(currency).format('0,0');
    },
    getRowKey(row) {
      return row.id;
    },
    requestFreightOrders(label) {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '&',
        endpoint: `shipments?${label}`,
      };
      this.$store.dispatch('$_freight/requestFreightOrders', fullPayload).then(
        () => {
          this.empty_orders_state = this.$t('ordersComponent.not_available');
        },
        (error) => {
          this.setFreightOrders([]);

          if (Object.prototype.hasOwnProperty.call(error.response.data, 'data')) {
            this.empty_orders_state = this.$t('ordersComponent.not_available');
          } else {
            this.empty_orders_state = this.$t('ordersComponent.not_available');
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
@import '../../../assets/styles/transporters_component.css';

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
