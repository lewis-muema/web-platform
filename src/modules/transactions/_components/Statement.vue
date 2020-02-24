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
          placeholder="From"
        />
        <el-date-picker
          v-model="filterData.to_date"
          class="section--filter-input"
          type="date"
          name="to_date"
          placeholder="To"
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
            Download<i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            class="export_dropdown"
          >
            <el-dropdown-item command="a">
              Excel
            </el-dropdown-item>
            <el-dropdown-item command="b">
              PDF
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
        label="Txn"
        prop="txn"
        min-width="80"
      />
      <el-table-column
        label="Date"
        prop="date_time"
        :formatter="formatDate"
        width="170"
      />
      <el-table-column
        label="Description"
        prop="description"
        min-width="80"
      />
      <el-table-column
        label="Debit"
        prop="amount"
        width="110"
        :formatter="formatDebitAmount"
        class-name="amount--table-format"
      />
      <el-table-column
        label="Credit"
        prop="amount"
        width="110"
        :formatter="formatCreditAmount"
        class-name="amount--table-format"
      />
      <el-table-column
        label="Running Balance"
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
      empty_statement_state: 'Fetching Statement',
      pagination_limit: 10,
      pagination_page: 1,
      order_statement_text: 'Search',
      filterState: false,
      filterData: {
        from_date: '',
        to_date: '',
      },
      filteredStatementData: [],
    };
  },
  computed: {
    ...mapGetters({
      getSess: 'getSession',
      statementData: '$_transactions/getStatement',
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
  },
  watch: {
    getSess: {
      handler() {
        this.populateStatement();
      },
      deep: true,
    },
  },
  mounted() {
    this.populateStatement();
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
            this.empty_statement_state = 'Statement Not Found';
          },
          () => {
            this.empty_statement_state = 'Statement Failed to Fetch';
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
      this.empty_statement_state = 'Searching Payments';

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

      this.order_statement_text = 'Searching...';
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
          this.order_statement_text = 'Search';
          this.empty_statement_state = 'Statement Not Found';
        },
        () => {
          this.order_statement_text = 'Search';
          this.empty_statement_state = 'Statement Failed to Fetch';
        },
      );
    },
    handleCommand(command) {
      if (command === 'a') {
        let data;
        const data2 = [];

        for (let i = 0; i < this.statementData.length; i++) {
          const arr = {};
          arr.Amount = this.statementData[i].amount;
          arr.Date = this.statementData[i].date_time;
          arr.Description = this.statementData[i].description;
          arr.PaymentMethod = this.statementData[i].pay_method_name;
          arr.RunningBalance = this.statementData[i].running_balance;
          arr.Transaction = this.statementData[i].txn;
          data2.push(arr);
        }
        data = _.map(data2, row => _.pick(
          row,
          'Amount',
          'Date',
          'Description',
          'PaymentMethod',
          'RunningBalance',
          'Transaction',
        ));
        const fileName = 'Statement';
        const exportType = 'csv';

        exportFromJSON({ data, fileName, exportType });
      } else {
        const pdfBody = [
          ['Amount', 'Date', 'Description', 'Payment Method', 'Running Balance', 'Transaction'],
        ];

        this.statementData.forEach((item) => {
          pdfBody.push([
            item.amount,
            item.date_time,
            item.description,
            item.pay_method_name,
            item.running_balance,
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
