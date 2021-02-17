<template lang="html">
  <div class="">
    <div v-if="loading">
      <loading-component />
    </div>
    <div v-else>
      <div v-if="logs.length === 0">
        <img
          src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/unavailable.svg"
          class="no-activity-img"
        >
        <div class="no-activity-label">
          {{$t('dashboardComponent.no_activity')}}
        </div>
      </div>
      <div
        v-else
        class="freight-dashboard-outer"
      >
        <div
          v-for="(val, index) in logs"
          :key="index"
          class="dashboard-detail transporters-segment"
        >
          <div
            v-if="index === 0"
            class="dashboard-name"
          >
            {{$t('dashboardComponent.recent_activity')}}
          </div>
          <div class="transporters-filters transporters-highlight">
            <div class="truck-add-info dashboard-align-inner">
              {{ val.message }}
            </div>
          </div>
          <div
            v-if="val.actionable"
            class="transporters-filters transporters-highlight"
          >
            <div
              class="truck-add-info dashboard-align-inner view-document"
              @click="viewDocument(val.data.url, val.data.document_name)"
            >
              {{$t('dashboardComponent.view_document')}} >
            </div>
          </div>
          <div
            v-if="checkActionableBtnState(val.actionable)"
            class="transporters-filters transporters-highlight dashboard-approvals"
          >
            <div
              class="truck-add-info view-document"
              style="display : flex"
            >
              <button
                type="button"
                class="section--filter-action dashboard-approve-doc"
                name="create_order_text"
                @click="approveThisDocument(val)"
              >
                {{$t('dashboardComponent.approve')}}
              </button>
              <button
                type="button"
                class="section--filter-action dashboard-decline-doc"
                name="create_order_text"
                @click="declineDialog(val)"
              >
                {{$t('dashboardComponent.decline')}}
              </button>
            </div>
          </div>
          <div class="transporters-filters transporters-highlight">
            <div class="truck-add-info dashboard-align-inner">
              {{ formatTime(val.date_time) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="">
        <el-dialog
          :visible.sync="viewDocumentOption"
          class="documentOptions"
        >
          <div class="">
            <div class="document-text-option ">
              {{$t('dashboardComponent.name_doc', {src_name: src_name})}}
            </div>
            <div class="document-divider" />
            <div class="document-view-inner">
              <iframe
                :src="src_link"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </el-dialog>
        <el-dialog
          :visible.sync="showDeclineDialog"
          class="declineDocumentOptions"
        >
          <div class="">
            <div class="decline-text-option decline-documemt-extend">
              {{$t('dashboardComponent.decline_document')}}
            </div>
          </div>
          <div class="decline-documemt-extend decline-documemt-input">
            <el-input
              v-model.trim="reason"
              :min="0"
              type="textarea"
              autocomplete="true"
            />
          </div>

          <div class="decline-documemt-extend decline-button-align">
            <button
              type="button"
              name="button"
              class="decline-action--slide-button"
              @click="declineDocument()"
            >
              {{$t('dashboardComponent.decline')}}
            </button>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import TimeZoneMxn from '../../../mixins/timezone_mixin';
import LoadingComponent from './LoadingComponent.vue';

export default {
  name: 'Dashboard',
  components: { LoadingComponent },
  mixins: [SessionMxn, NotificationMxn, TimeZoneMxn],
  data() {
    return {
      logs: [],
      loading: false,
      src_link: '',
      src_name: '',
      viewDocumentOption: false,
      showDeclineDialog: false,
      decline_doc: {},
      reason: '',
    };
  },
  watch: {
    viewDocumentOption(val) {
      if (!val) {
        this.src_link = '';
        this.src_name = '';
      }
    },
    showDeclineDialog(val) {
      if (!val) {
        this.closeDeclineDialog();
      }
    },
  },
  mounted() {
    this.loading = true;
    this.fetchDashboardData();
  },
  methods: {
    ...mapActions({
      requestActivity: '$_freight/requestActivity',
      approveDocument: '$_freight/approveDocument',
    }),
    fetchDashboardData() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }
      const payload = {
        user_id: 'cop_id' in acc ? acc.cop_id : acc.user_id,
        user_type: session.default === 'biz' ? 1 : 3,
      };
      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/activity_log',
      };
      this.requestActivity(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
            workingResponse = response[0];
          }
          if (workingResponse.status) {
            this.logs = workingResponse.log;
          } else {
            this.logs = [];
          }
          this.loading = false;
        },
        (error) => {
          this.log = [];
          this.loading = false;
        },
      );
    },
    viewDocument(url, name) {
      this.src_link = url;
      this.src_name = name;
      this.viewDocumentOption = true;
    },
    closeDeclineDialog() {
      this.decline_doc = {};
      this.showDeclineDialog = false;
      this.reason = '';
    },
    declineDialog(val) {
      this.decline_doc = val;
      this.showDeclineDialog = true;
    },
    declineDocument() {
      if (this.reason !== '') {
        let acc = {};
        const session = this.$store.getters.getSession;
        if ('default' in session) {
          acc = session[session.default];
        }

        const payload = {
          order_id: this.decline_doc.data.order_id,
          document_id: this.decline_doc.data.document_id,
          status: 3,
          reason: this.reason,
          owner_id: this.decline_doc.data.owner_id,
        };

        if (session.default === 'biz') {
          payload.cop_id = acc.cop_id;
          payload.cop_user_id = acc.user_id;
          payload.created_by = 1;
        } else {
          payload.peer_id = acc.user_id;
          payload.created_by = 3;
        }

        const fullPayload = {
          values: payload,
          app: 'ORDERS_APP',
          endpoint: 'v2/freight/order/documents',
        };

        this.approveDocument(fullPayload).then(
          (response) => {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

            let workingResponse = response;
            if (response.length > 1) {
              workingResponse = response[0];
            }
            if (workingResponse.status) {
              this.doNotification(1, `${this.$t('dashboardComponent.decline_document')}!`, this.$t('dashboardComponent.doc_declined_successfully'));
              this.fetchDashboardData();
            } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
              this.doNotification(2, this.$t('dashboardComponent.decline_document_title'), workingResponse.message);
            } else {
              this.doNotification(2, this.$t('dashboardComponent.decline_document_title'), workingResponse.reason);
            }
            this.closeDeclineDialog();
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
              this.doNotification(2, this.$t('dashboardComponent.decline_document_title'), error.response.data.reason);
            } else {
              this.doNotification(
                2,
                this.$t('dashboardComponent.decline_document_title'),
                this.$t('dashboardComponent.decline_doc_text'),
              );
            }
            this.closeDeclineDialog();
          },
        );
      } else {
        this.doNotification(
          2,
          this.$t('dashboardComponent.decline_document_title'),
          this.$t('dashboardComponent.reason_decline'),
        );
      }
    },
    formatTime(time) {
      return this.dashboardTimer(time);
    },
    approveThisDocument(val) {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        order_id: val.data.order_id,
        document_id: val.data.document_id,
        owner_id: val.data.owner_id,
        status: 2,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
        payload.created_by = 1;
      } else {
        payload.peer_id = acc.user_id;
        payload.created_by = 3;
      }

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order/documents',
      };

      this.approveDocument(fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('dashboardComponent.doc_approval'), this.$t('dashboardComponent.doc_approved'));
            this.fetchDashboardData();
          } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
            this.doNotification(2, this.$t('dashboardComponent.failed_approve'), workingResponse.message);
          } else {
            this.doNotification(2, this.$t('dashboardComponent.failed_approve'), workingResponse.reason);
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
            this.doNotification(2, this.$t('dashboardComponent.failed_approve'), error.response.data.reason);
          } else {
            this.doNotification(
              2,
              this.$t('dashboardComponent.failed_approve'),
              this.$t('dashboardComponent.failed_approve_text'),
            );
          }
        },
      );
    },
    checkActionableBtnState(val) {
      const session = this.$store.getters.getSession;
      if (session.default === 'biz') {
        if (session[session.default].freight_approver === 1 && val) {
          return true;
        }
        return false;
      }
      return val;
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/transporters_component.css?v=4';
@import '../../../assets/styles/nav.css?v=4';
.no-activity-img {
  width: 35%;
  display: block;
  margin: auto;
}
.no-activity-label{
  text-align: center;
}
.freight-dashboard-outer{
  width: 64%;
  margin-top: 3%;
  height: 587px;
  margin: 0em;
  overflow-y: auto;
  margin-top: 4%;
}
.dashboard-align-inner {
  margin-left: 5.3%;
}
.view-document{
  color: #1B7FC3;
  font-weight: 400;
  cursor: pointer;
}
.dashboard-name{
  color: #000000;
  margin-left: 5%;
}
.dashboard-decline-doc{
  color:#EA7125;
  width: 80%;
  border-width: 1px !important;
  background: #FFFFFF;
  cursor: pointer;
  position: relative;
  display: block;
  border-radius: 4px;
  height: 40px;
  transition: background-color 0.3s;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  border-color: #EA7125;
}
.dashboard-approve-doc{
  color: #fff;
  width: 80%;
  border-width: 1px !important;
  background-color: #EA7125;
  cursor: pointer;
  position: relative;
  display: block;
  border-radius: 4px;
  height: 40px;
  transition: background-color 0.3s;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  border-color: #EA7125;
}
.dashboard-approvals{
  margin-bottom: 3%;
}
.dashboard-detail{
  border: 1px solid #d8dfe6;
  padding: 1rem;
}
</style>
