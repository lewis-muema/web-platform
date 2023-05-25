<template lang="html">
  <div
    id="statement_container"
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
      </div>
      <div class="section--filter-action-wrap">
        <button
          type="button"
          :class="
            valid_filter
              ? 'button-primary section--filter-action btn-statement'
              : 'button-primary section--filter-action-inactive btn-statement'
          "
          name="order_statement_text"
          :disabled="valid_filter === true ? false : true"
          @click="filterStatementData"
        >
          {{ order_statement_text }}
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
      :data="statement_data"
      style="width: 100%"
      :border="true"
      :stripe="true"
    />

    <el-table
      :data="statement_data"
      style="width: 100%"
      :border="true"
      :stripe="true"
    >
      <template slot="empty">
        {{ empty_statement_state }}
      </template>
      <el-table-column
        :label="$t('general.txn')"
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
        :label="$t('general.description')"
        prop="description"
        min-width="80"
      />
      <el-table-column
        :label="$t('general.debit')"
        prop="amount"
        width="110"
        :formatter="formatDebitAmount"
        class-name="amount--table-format"
      />
      <el-table-column
        :label="$t('general.credit')"
        prop="amount"
        width="110"
        :formatter="formatCreditAmount"
        class-name="amount--table-format"
      />
      <el-table-column
        :label="$t('general.running_balance')"
        prop="running_balance"
        width="125"
        :formatter="formatRunningBalance"
        class-name="amount--table-format"
      />
    </el-table>

    <div class="section--pagination-wrap">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="statement_total"
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
import { Printd } from 'printd';
import * as _ from 'lodash';
import exportFromJSON from 'export-from-json';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import TimezoneMxn from '../../../mixins/timezone_mixin';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const moment = require('moment');

export default {
  name: 'Statement',
  mixins: [TimezoneMxn],
  data() {
    return {
      empty_statement_state: this.$t('general.fetching_statement'),
      pagination_limit: 10,
      pagination_page: 1,
      order_statement_text: this.$t('general.search'),
      filterState: false,
      filterData: {
        from_date: '',
        to_date: '',
      },
      filteredStatementData: [],
      currencies: [],
      activeCurrency: '',
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      unfilteredStatementData: '$_transactions/getStatement',
      getUserCurrencies: '$_transactions/getUserCurrencies',
    }),
    valid_filter() {
      return this.filterData.from_date !== '' && this.filterData.to_date !== '';
    },
    statement_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;

      return this.statementData.slice(from, to);
    },
    statement_total() {
      if (this.statementData != null) {
        return this.statementData.length;
      }
      return 0;
    },
    statementData() {
      const orderHistory = [];
      this.unfilteredStatementData.forEach((row) => {
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
        this.populateStatement();
      },
      deep: true,
    },
    statementData() {
      this.currencies = this.getUserCurrencies;
    },
  },
  mounted() {
    this.populateStatement();
    this.currencies = this.getUserCurrencies;
    const sessionData = this.$store.getters.getSession;
    this.activeCurrency = sessionData[sessionData.default].default_currency;
  },
  methods: {
    populateStatement() {
      const sessionData = this.$store.getters.getSession;

      if (Object.keys(sessionData).length > 0) {
        let statementPayload = {};

        if (sessionData.default === 'biz') {
          statementPayload = {
            cop_id: sessionData.biz.cop_id,
            user_type: sessionData.biz.user_type,
            user_id: sessionData.biz.user_id,
          };
        } else {
          // create peer payload
          statementPayload = {
            user_id: sessionData[sessionData.default].user_id,
          };
        }

        const fullPayload = {
          values: statementPayload,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'statement',
        };

        this.$store.dispatch('$_transactions/requestStatement', fullPayload).then(
          () => {
            this.empty_statement_state = this.$t('general.statement_not_found');
          },
          () => {
            this.empty_statement_state = this.$t('general.statement_failed_to_fetch');
          },
        );
      }
    },
    ...mapActions(['$_transactions/requestStatement']),
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.statementData.slice(from, to);
    },
    formatDate(row) {
      const localTime = this.convertToUTCToLocal(row.date_time);
      return moment(localTime).format('MMM Do YYYY, h:mm a');
    },
    formatRunningBalance(row) {
      let value = row.running_balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      value = value.split('.');
      const updatedRunningBalance = Number(value[0].replace(/,/g, '')) * -1;
      const formattedRunningBalance = updatedRunningBalance
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return formattedRunningBalance;
    },
    formatDebitAmount(row) {
      if (Math.sign(row.amount) > 0) {
        let value = row.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        value = value.split('.');
        return value[0];
      }
      return '';
    },
    formatCreditAmount(row) {
      if (Math.sign(row.amount) < 0) {
        let value = row.amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        value = value.split('.');
        return value[0].replace('-', '');
      }
      return '';
    },
    filterStatementData() {
      // reset filter
      const sessionData = this.$store.getters.getSession;

      this.filterState = false;
      this.empty_statement_state = this.$t('general.searching_payments');

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

      this.order_statement_text = this.$t('general.searching');
      this.requestStatement(payload);
      // console.log(this.statementData);

      this.filteredStatementData = this.statementData;

      this.filterState = true;
    },

    requestStatement(payload) {
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'statement',
      };
      this.$store.dispatch('$_transactions/requestStatement', fullPayload).then(
        () => {
          this.order_statement_text = this.$t('general.search');
          this.empty_statement_state = this.$t('general.statement_not_found');
        },
        () => {
          this.order_statement_text = this.$t('general.search');
          this.empty_statement_state = this.$t('general.statement_failed_to_fetch');
        },
      );
    },
    handleCommand(command) {
      if (command === 'a') {
        let data;
        const data2 = [];

        for (let i = 0; i < this.statementData.length; i++) {
          const arr = {};
          arr.Date = this.statementData[i].date_time;
          arr.Description = this.statementData[i].description;
          arr.PaymentMethod = this.statementData[i].pay_method_name;
          arr.Debit = this.formatDebitAmount(this.statementData[i]);
          arr.Credit = this.formatCreditAmount(this.statementData[i]);
          arr.RunningBalance = this.formatRunningBalance(this.statementData[i]);
          arr.Transaction = this.statementData[i].txn;
          data2.push(arr);
        }
        data = _.map(data2, row => _.pick(
          row,
          'Date',
          'Description',
          'PaymentMethod',
          'Debit',
          'Credit',
          'RunningBalance',
          'Transaction',
        ));
        const fileName = 'Statement';
        const exportType = 'csv';

        exportFromJSON({ data, fileName, exportType });
      } else {
        const pdfBody = [
          [
            this.$t('general.date'),
            this.$t('general.description'),
            this.$t('general.payment_method'),
            this.$t('general.debit'),
            this.$t('general.credit'),
            this.$t('general.running_balance'),
            this.$t('general.transaction'),
          ],
        ];

        this.statementData.forEach((item) => {
          pdfBody.push([
            item.date_time,
            item.description,
            item.pay_method_name,
            this.formatDebitAmount(item),
            this.formatCreditAmount(item),
            this.formatRunningBalance(item),
            item.txn,
          ]);
        });

        const docDefinition = {
          pageSize: 'A3',
          widths: ['*', 'auto', 100, '*'],

          content: [
            {
              table: {
                body: pdfBody,
              },
            },
          ],
        };
        pdfMake.createPdf(docDefinition).download('Statement.pdf');
      }
    },
  },
};
</script>

<style lang="css">
.btn-statement{
  border-width:0px !important;
}
.btn-order-hstry{
  border-width:0px !important;
}
.el-dropdown{
  float: right;
}
</style>
