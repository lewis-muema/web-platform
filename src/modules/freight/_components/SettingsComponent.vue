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

export default {
  name: 'Settings',
  mixins: [NotificationMxn],
  data() {
    return {
      showApproverDialog: false,
      approver: '',
      users: [],
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {},
  mounted() {
    this.fetchUsers();
  },
  methods: {
    ...mapActions({}),
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
            this.users = workingResponse.data;
          } else {
            this.users = [];
          }
        },
        (error) => {
          this.users = [];
        },
      );
    },
    addApprover() {
      this.showApproverDialog = true;
    },
    submitApproval() {
      if (this.approver !== '') {
        const payload = {
          freightApprover: true,
        };
        const fullPayload = {
          values: payload,
          app: 'ADONIS_PRIVATE_API',
          endpoint: `cop-freight-approvers/1${this.approver}`,
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
@import '../../../assets/styles/transporters_component.css?v=1';
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
</style>
