<template lang="html">
  <div class="freight-settings">
    <div class="">
      Manage Approvers
    </div>
    <div class="">
      <button
        type="button"
        class="button-primary manage-approvers"
        name="create_order_text"
        @click="addApprover"
      >
        Add approver
      </button>
    </div>
    <div class="list-freight-approvers">
      <el-table
        v-loading="loading"
        :data="approvers_list_data"
        style="width: 100%;"
        :border="true"
        :stripe="true"
        :row-key="getRowKey"
      >
        <template slot="empty">
          {{ empty_orders_state }}
        </template>
        <el-table-column label="Name">
          <template slot-scope="scope">
            {{ approvers_list_data[scope.$index]['name'] }}
          </template>
        </el-table-column>
        <el-table-column label="Phone">
          <template slot-scope="scope">
            {{ approvers_list_data[scope.$index]['phone'] }}
          </template>
        </el-table-column>

        <el-table-column
          key="1"
          label="Email"
          prop="email"
        />

        <el-table-column
          label="Status"
          prop="order_date"
        >
          <template slot-scope="props">
            Active
          </template>
        </el-table-column>

        <el-table-column
          label="Action"
          prop="path"
          header-align="center"
          align="center"
        >
          <template slot-scope="props">
            <div
              class="view-orders-transporter-info remove-approver"
              @click="removeApprover(approvers_list_data[props.$index]['copUserId'])"
            >
              Remove
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="section--pagination-wrap">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="approvers_list_total"
          :page-size="pagination_limit"
          :current-page.sync="pagination_page"
          :page-sizes="[5, 10, 20, 50, 100]"
          class="section--pagination-item"
          @current-change="changePage"
          @size-change="changeSize"
        />
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="">
        <el-dialog
          :visible.sync="showApproverDialog"
          class="declineDocumentOptions"
        >
          <div class="">
            <div class="decline-text-option  approver-header">
              Add Approver
            </div>
          </div>
          <div class="">
            <div class="approver-highlight">
              Select user to approve freight orders
            </div>
            <el-select
              v-model="approver"
              placeholder=""
              class="select-approver"
              filterable
            >
              <el-option
                v-for="item in users"
                :key="item.cop_user_id"
                :label="item.name"
                :value="item.cop_user_id"
              />
            </el-select>
          </div>

          <div class="decline-documemt-extend decline-button-align">
            <button
              type="button"
              name="button"
              class="decline-action--slide-button"
              @click="submitApproval"
            >
              Approve
            </button>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';

export default {
  name: 'Settings',
  mixins: [NotificationMxn, MixpanelMixin],
  data() {
    return {
      showApproverDialog: false,
      approver: '',
      users: [],
      approvers_list: [],
      empty_orders_state: 'Fetching approvers list',
      pagination_limit: 10,
      pagination_page: 1,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
    approvers_list_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      return this.approvers_list.slice(from, to);
    },
    approvers_list_total() {
      return this.approvers_list.length;
    },
  },
  watch: {},
  mounted() {
    this.fetchUsers();
    this.fetchApproversList();
  },
  methods: {
    ...mapActions({}),
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.approvers_list.slice(from, to);
    },
    fetchUsers() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session[session.default].cop_id;
      }
      const payload = {
        cop_id,
      };
      const usersFullPayload = {
        values: payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'cop_users',
      };
      this.$store.dispatch('$_freight/requestUsersList', usersFullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
            workingResponse = response[0];
          }
          if (workingResponse.status) {
            this.users = workingResponse.data.filter(c => c.type === 2);
          } else {
            this.users = [];
          }
          this.empty_orders_state = 'No approvers available';
        },
        (error) => {
          this.users = [];
          this.empty_orders_state = 'No approvers available';
        },
      );
    },
    removeApprover(val) {
      const payload = {
        freightApprover: false,
      };
      const fullPayload = {
        values: payload,
        app: 'ADONIS_PRIVATE_API',
        endpoint: `cop-freight-approvers/${val}`,
      };

      this.$store.dispatch('$_freight/requestApproveApprover', fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }
          if (workingResponse.status) {
            this.doNotification(1, 'Approver updated!', 'Approver removed successfully');
            this.fetchApproversList();
          } else {
            this.doNotification(2, 'Failed to remove approver!', '');
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Failed to remove approver!',
            'Failed to remove approver, Kindly retry again or contact customer support ',
          );
        },
      );
    },
    fetchApproversList() {
      const session = this.$store.getters.getSession;
      let copId = 0;
      if (session.default === 'biz') {
        copId = session[session.default].cop_id;
      }

      const fullPayload = {
        values: this,
        app: 'ADONIS_PRIVATE_API',
        endpoint: `cop-freight-approvers/${copId}?freightApprover=1`,
      };
      this.$store.dispatch('$_freight/requestApproversList', fullPayload).then(
        (response) => {
          this.approvers_list = response;
        },
        (error) => {
          this.approvers_list = [];
        },
      );
    },
    addApprover() {
      this.showApproverDialog = true;
    },
    getRowKey(row) {
      return row.copUserId;
    },
    submitApproval() {
      if (this.approver !== '') {
        const payload = {
          freightApprover: true,
        };
        const fullPayload = {
          values: payload,
          app: 'ADONIS_PRIVATE_API',
          endpoint: `cop-freight-approvers/${this.approver}`,
        };

        this.$store.dispatch('$_freight/requestApproveApprover', fullPayload).then(
          (response) => {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

            let workingResponse = response;
            if (response.length > 1) {
              workingResponse = response[0];
            }
            if (workingResponse.status) {
              this.doNotification(1, 'Approver updated!', 'Approver updated successfully');
              this.fetchApproversList();
            } else {
              this.doNotification(2, 'Failed to add approvers!', '');
            }
            this.closeApproversDialog();
          },
          (error) => {
            this.doNotification(
              2,
              'Failed to add approvers!',
              'Failed to add approvers, Kindly retry again or contact customer support ',
            );
            this.closeApproversDialog();
          },
        );
      } else {
        this.doNotification(
          2,
          'Failed to add approvers!',
          'Failed to add approvers, Kindly select a single user',
        );
      }
    },
    closeApproversDialog() {
      this.showApproverDialog = false;
      this.approver = '';
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css">
@import '../../../assets/styles/transporters_component.css';
.manage-approvers {
  font-size: 13px;
  letter-spacing: 0.01em;
  border-width: 0px !important;
  margin-top: 2%;
}
.freight-settings{
  margin-left: 2%;
  margin-top: 3%;
}
.approver-header{
  font-size: 17px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #000000;
}
.select-approver{
  width: 95%;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 8%;
}
.approver-highlight{
  margin-left: 2%;
  margin-bottom: 2%;
  color: #000000;
  font-weight : 200;
}
.list-freight-approvers{
  margin-top: 5%;
  width: 86%;
}
.remove-approver{
  color: #1B7FC3;
  cursor: pointer;
}
</style>
