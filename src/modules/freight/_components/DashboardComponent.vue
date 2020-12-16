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
          No Activity at the moment
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
            Recent Activity
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
            <div class="truck-add-info dashboard-align-inner view-document">
              View document >
            </div>
          </div>
          <div
            v-if="val.actionable"
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
              >
                Approve
              </button>
              <button
                type="button"
                class="section--filter-action dashboard-decline-doc"
                name="create_order_text"
              >
                Decline
              </button>
            </div>
          </div>
          <div class="transporters-filters transporters-highlight">
            <div class="truck-add-info dashboard-align-inner">
              {{ moment(val.date_time).fromNow() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import LoadingComponent from './LoadingComponent.vue';

export default {
  name: 'Dashboard',
  components: { LoadingComponent },
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      logs: [],
      loading: false,
    };
  },
  mounted() {
    this.loading = true;
    this.fetchDashboardData();
  },
  methods: {
    ...mapActions({
      requestActivity: '$_freight/requestActivity',
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
          if (response.status) {
            this.logs = response.log;
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
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/transporters_component.css?v=1';
@import '../../../assets/styles/nav.css?v=1';
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
