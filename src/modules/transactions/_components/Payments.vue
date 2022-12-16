<template lang="html">
  <div
    id="payments_container"
    class=""
  >
    <div class="section--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-date-picker
          v-model="filterData.from_date"
          class="section--filter-input"
          type="date"
          name="from_date"
          :placeholder="$t('general.from')"
        />
        <el-date-picker
          v-model="filterData.to_date"
          class="section--filter-input"
          type="date"
          name="to_date"
          :placeholder="$t('general.to')"
        />

        <button
          type="button"
          :class="
            active_filter
              ? 'button-primary section--filter-action align-left btn-payment'
              : 'button-primary section--filter-action-inactive align-left btn-payment'
          "
          name="order_payments_text"
          :disabled="active_filter === true ? false : true"
          @click="filterPaymentData"
        >
          {{ order_payments_text }}
        </button>
      </div>
      <div class="section--filter-action-wrap">
        <button
          type="button"
          class="button-primary section--filter-action btn-payment"
          @click="take_to_payment"
        >
          {{ $t('general.pay') }}
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
    <el-table
      :data="payment_data"
      style="width: 100%"
      :border="true"
      :stripe="true"
    >
      <template slot="empty">
        {{ empty_payments_state }}
      </template>
      <el-table-column
        :label="$t('general.reciept_number')"
        prop="txn"
        min-width="80"
      />
      <el-table-column
        :label="$t('general.date')"
        prop="date_time"
        :formatter="formatDate"
        width="170"
      />
      <el-table-column
        :label="$t('general.method')"
        prop="pay_method_name"
        width="125"
      />
      <el-table-column
        :label="$t('general.description')"
        prop="description"
        min-width="80"
      />
      <el-table-column
        :label="$t('general.amount')"
        prop="amount"
        width="125"
        :formatter="formatAmount"
        class-name="amount--table-format"
      />
    </el-table>

    <div class="section--pagination-wrap">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="payment_total"
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
import { mapActions, mapGetters } from 'vuex';
import TimezoneMxn from '../../../mixins/timezone_mixin';

const moment = require('moment');

export default {
  name: 'Payments',
  mixins: [TimezoneMxn],
  data() {
    return {
      empty_payments_state: this.$t('general.fetching_payments'),
      pagination_limit: 10,
      pagination_page: 1,
      order_payments_text: this.$t('general.search'),
      filterState: false,
      filterData: {
        from_date: '',
        to_date: '',
      },
      filteredPaymentData: [],
      currencies: [],
      activeCurrency: '',
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      unfilteredPaymentData: '$_transactions/getPayments',
      getUserCurrencies: '$_transactions/getUserCurrencies',
    }),
    payment_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;

      return this.paymentData.slice(from, to);
    },
    active_filter() {
      return (
        this.filterData.from_date !== ''
        && this.filterData.from_date !== null
        && (this.filterData.to_date !== '' && this.filterData.to_date !== null)
      );
    },
    payment_total() {
      return this.paymentData.length;
    },
    paymentData() {
      const orderHistory = [];
      this.unfilteredPaymentData.forEach((row) => {
        if (row.currency === this.activeCurrency) {
          orderHistory.push(row);
        }
      });
      return orderHistory;
    },
  },
  watch: {
    getSess: {
      handler() {
        this.loadPayments();
      },
      deep: true,
    },
    paymentData() {
      this.currencies = this.getUserCurrencies;
    },
  },
  mounted() {
    this.loadPayments();
    this.currencies = this.getUserCurrencies;
    const sessionData = this.$store.getters.getSession;
    this.activeCurrency = sessionData[sessionData.default].default_currency;
  },
  methods: {
    ...mapActions(['$_transactions/requestPayments']),
    loadPayments() {
      const sessionData = this.$store.getters.getSession;
      if (Object.keys(sessionData).length > 0) {
        let paymentPayload = {};

        if (sessionData.default === 'biz') {
          paymentPayload = {
            cop_id: sessionData.biz.cop_id,
            user_type: sessionData.biz.user_type,
            user_id: sessionData.biz.user_id,
          };
        } else {
          // create peer payload
          paymentPayload = {
            user_id: sessionData[sessionData.default].user_id,
          };
        }

        const fullPayload = {
          values: paymentPayload,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'payments',
        };
        this.$store.dispatch('$_transactions/requestPayments', fullPayload).then(
          () => {
            this.empty_payments_state = this.$t('general.payment_not_found');
          },
          () => {
            this.empty_payments_state = this.$t('general.payments_failed_to_fetch');
          },
        );
      }
    },
    take_to_payment() {
      this.$router.push('/payment/mpesa');
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.paymentData.slice(from, to);
    },
    filterPaymentData() {
      // reset filter
      const sessionData = this.$store.getters.getSession;
      this.filterState = false;
      this.empty_payments_state = this.$t('general.searching_payments');

      let { from_date: fromDate, to_date: toDate } = this.filterData;

      fromDate = moment(fromDate).format('YYYY-MM-DD');
      toDate = moment(toDate).format('YYYY-MM-DD');

      let payload = {};
      if (sessionData.default === 'biz') {
        payload = {
          cop_id: sessionData.biz.cop_id,
          user_type: sessionData.biz.user_type,
          from: fromDate,
          to: toDate,
        };
      } else {
        // create peer payload
        payload = {
          user_id: sessionData[sessionData.default].user_id,
          from: fromDate,
          to: toDate,
        };
      }

      this.order_payments_text = this.$t('general.searching');
      this.requestPayments(payload);

      this.filteredPaymentData = this.paymentData;
      this.filterState = true;
    },

    requestPayments(payload) {
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'payments',
      };
      this.$store.dispatch('$_transactions/requestPayments', fullPayload).then(
        () => {
          this.order_payments_text = this.$t('general.search');
          this.empty_payments_state = this.$t('general.payment_statement_not_found');
        },
        () => {
          this.order_payments_text = this.$t('general.search');
          this.empty_payments_state = this.$t('general.payment_statement_failed_to_fetch');
        },
      );
    },

    formatDate(row) {
      const localTime = this.convertToUTCToLocal(row.date_time);
      return moment(localTime).format('MMM Do YYYY, h:mm a');
    },
    formatAmount(row) {
      let value = row.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      value = value.split('.');
      return value[0].replace('-', '');
    },
  },
};
</script>

<style lang="css">
.btn-payment {
  border-width: 0px !important;
}
</style>
