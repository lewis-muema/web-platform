<template lang="html">
  <div class="">
    <el-col
      :span="6"
      class="inforbar_order_content"
    >
      <div class="tracking-loader-outer">
        <div class="tracking-loader">
          <div class="">
            <img
              src="https://images.sendyit.com/web_platform/tracking/checkmark.svg"
              alt=""
              class="infobar-truck-img"
            >
            <span class="info-text-transform infor-top-bar-text align-top-bar">
             {{$t('general.type_of_order')}} 
            </span>
          </div>
          <div class="tracking-loader-inner align-inner-bar">
            <img
              :src="getVendorIcon(trackingData.rider.vendor_id)"
              alt=""
              class="infobar-truck-img inforbar-vendor-icon"
            >
            <span class="info-text-transform">
              {{ getTrackVendorName }}
            </span>
          </div>
        </div>
        <div class="tracking-loader">
          <div v-if="scheduled_time">
            <div class="">
              <img
                src="https://images.sendyit.com/web_platform/tracking/calendar.svg"
                alt=""
                class="infobar-truck-img"
              >
              <span class="info-text-transform infor-top-bar-text align-top-bar">
                 {{$t('general.schedule_pick_up_time')}}
              </span>
            </div>
            <div class="tracking-loader-inner align-inner-bar">
              <span class="info-text-transform">
                {{ convertToUTCToLocal(trackingData.date_time) | moment }}
              </span>
            </div>
          </div>

          <div v-if="!scheduled_time">
            <div class="">
              <img
                src="https://images.sendyit.com/web_platform/tracking/calendar.svg"
                alt=""
                class="infobar-truck-img"
              >
              <span class="info-text-transform infor-top-bar-text align-top-bar">
                {{$t('general.pick_up_time')}}
              </span>
            </div>
            <div class="tracking-loader-inner align-inner-bar">
              <span class="info-text-transform">
                {{ convertToUTCToLocal(trackingData.date_time) | moment }}
              </span>
            </div>
          </div>

          <p
            v-if="checkScheduleOption()"
            class="info-scheduled-time align-inner-bar"
            @click="showEditPickUpTime()"
          >
            <i class="el-icon-edit-outline" />
            {{$t('general.Reschedule_pickup_time')}}
          </p>
        </div>

        <!-- Show for truck orders  -->
        <div
          v-if="![1, 2, 3, 23, 21].includes(trackingData.rider.vendor_id)"
          class=""
        >
          <div class="tracking-loader">
            <div class="">
              <img
                src="https://images.sendyit.com/web_platform/tracking/goods.svg"
                alt=""
                class="infobar-truck-img"
              >
              <span class="info-text-transform infor-top-bar-text align-top-bar">
                {{$t('general.goods_to_be_delivered')}}
              </span>
            </div>
            <div
              v-if="'delivery_item' in trackingData.package_details"
              class="tracking-loader-inner align-inner-bar"
            >
              <div v-if="trackingData.package_details.delivery_item === ''">
                {{$t('general.not_indicated')}}
              </div>
              <div v-else>
                {{ trackingData.package_details.delivery_item }}
              </div>
            </div>
            <div
              v-else
              class="tracking-loader-inner align-inner-bar"
            >
              {{$t('general.not_indicated')}}
            </div>
          </div>
          <div class="tracking-loader">
            <div class="">
              <img
                src="https://images.sendyit.com/web_platform/tracking/load_weight.svg"
                alt=""
                class="infobar-truck-img"
              >
              <span class="info-text-transform align-top-bar">
                {{$t('general.weight_of_load')}}
              </span>
            </div>
            <div
              v-if="'load_weight' in trackingData.package_details"
              class="tracking-loader-inner align-inner-bar"
            >
              {{ trackingData.package_details.load_weight }}
              {{ trackingData.package_details.load_units }}
            </div>
            <div
              v-else
              class="tracking-loader-inner align-inner-bar"
            >
             {{$t('general.not_indicated')}}
            </div>
          </div>

          <div class="tracking-loader">
            <div class="">
              <img
                src="https://images.sendyit.com/web_platform/tracking/loader.svg"
                alt=""
                class="infobar-truck-img"
              >
              <span class="info-text-transform infor-top-bar-text align-top-bar">
               {{$t('general.need_loader')}}
              </span>
            </div>
            <div
              v-if="trackingData.package_details.additional_loader"
              class="tracking-loader-inner align-inner-bar"
            >
              {{$t('general.yes')}}, {{ trackingData.package_details.no_of_loaders }}
            </div>
            <div
              v-else
              class="tracking-loader-inner align-inner-bar"
            >
              {{$t('general.no')}}
            </div>
          </div>
        </div>
      </div>
    </el-col>

    <el-col
      :span="6"
      class="notes-scrollable"
    >
      <div class="tracking-notes">
        <div class="info-text-transform infor-top-bar-text">
          {{$t('general.pickup_instructions_at_capital')}} {{ trackingData.path[0].name }}
        </div>
        <div
          v-if="checkPickUpNotes(trackingData.path[0])"
          class="tracking-notes-inner"
        >
          <div
            v-if="displayNotes(trackingData.path[0])"
            class="additional-instructions-content additional-instructions-wrapper"
          >
            <div class="additional-notes-outer">
              <div class="additional-notes-recipient">
                {{ trackingData.path[0].notes }}
              </div>
            </div>
          </div>

          <div
            v-if="trackingData.path[0].recipient_phone !== null"
            class="additional-instructions-content additional-instructions-wrapper"
          >
            <div class="additional-instructions__flex">
              <i
                class="el-icon-phone-outline additional-instructions__imagerecipient_contact-icon"
              />
            </div>
            <div class="additional-notes-outer">
              <div class="additional-notes-recipient">
                {{ trackingData.path[0].recipient_phone }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class=""
        >
          {{$t('general.no_notes_provided')}}
        </div>
        <p
          v-if="checkEditOption()"
          class="infor-top-change-details edit-instructions-align"
          @click="showEditInstructionsDialog(trackingData.path[0])"
        >
          <i class="el-icon-edit-outline" />
          {{$t('general.edit_instructions')}}
        </p>
      </div>

      <div
        v-for="(val, index) in trackingData.path"
        v-if="index > 0"
        :key="index"
        class="tracking-notes"
      >
        <div class="info-text-transform infor-top-bar-text">
          {{$t('general.drop_off_instructions_capital')}} {{ val.name }}
        </div>
        <div
          v-if="checkPickUpNotes(val)"
          class="tracking-notes-inner"
        >
          <div
            v-if="displayNotes(val)"
            class="additional-instructions-content additional-instructions-wrapper"
          >
            <div class="additional-notes-outer">
              <div class="additional-notes-recipient">
                {{ val.notes }}
              </div>
            </div>
          </div>

          <div
            v-if="val.recipient_phone !== null"
            class="additional-instructions-content additional-instructions-wrapper"
          >
            <div class="additional-instructions__flex">
              <i
                class="el-icon-phone-outline additional-instructions__imagerecipient_contact-icon"
              />
            </div>
            <div class="additional-notes-outer">
              <div class="additional-notes-recipient">
                {{ val.recipient_phone }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class=""
        >
         {{$t('general.no_notes_provided')}}
        </div>
        <p
          v-if="checkEditOption()"
          class="infor-top-change-details edit-instructions-align"
          @click="showEditInstructionsDialog(val)"
        >
          <i class="el-icon-edit-outline" />
          {{$t('general.edit_instructions')}}
        </p>
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NotificationMxn from '../../../../../../mixins/notification_mixin';
import EventsMixin from '../../../../../../mixins/events_mixin';
import TimezoneMxn from '../../../../../../mixins/timezone_mixin';

const moment = require('moment');

export default {
  name: 'InfoBarInstructionsComponent',
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
    eta_moment(date) {
      return moment(date).format('hA');
    },
  },
  mixins: [NotificationMxn, TimezoneMxn, EventsMixin],
  props: {
    trackingData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      scheduled_time: false,
      user_state: false,
    };
  },
  computed: {
    ...mapGetters({
      getTrackVendorName: '$_orders/$_tracking/getTrackVendorName',
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler() {
        if (Object.keys(this.$store.getters.getSession).length > 0) {
          this.confirmUser();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.checkScheduler();
    this.confirmUser();
  },
  methods: {
    ...mapMutations({
      showNotesDialog: '$_orders/$_tracking/showNotesDialog',
      updateNotesInStore: '$_orders/$_tracking/updateNotesInStore',
      showScheduleTimeDialog: '$_orders/$_tracking/showScheduleTimeDialog',
      updatePickUpTimeInStore: '$_orders/$_tracking/updatePickUpTimeInStore',
    }),
    confirmUser() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        const sessionUserEmail = session[session.default].user_email;
        const orderUserEmail = this.trackingData.user.email;

        if (sessionUserEmail === orderUserEmail) {
          this.user_state = true;
        } else {
          this.user_state = false;
        }
      }
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/${id}.svg`;
    },
    checkScheduler() {
      const schedulerRange = moment().add(2, 'h');
      const orderPlaced = moment(this.trackingData.date_time);
      const check = orderPlaced.diff(schedulerRange);

      if (check > 0) {
        this.scheduled_time = true;
      } else {
        this.scheduled_time = false;
      }
    },
    checkPickUpNotes(val) {
      let resp = true;
      if (
        val.recipient_phone === null
        && (Object.prototype.hasOwnProperty.call(val, 'notes') === false || val.notes === null)
      ) {
        resp = false;
      }
      return resp;
    },
    displayNotes(val) {
      const resp = true;

      if (val.notes === null || Object.prototype.hasOwnProperty.call(val, 'notes') === false) {
        return false;
      }
      return resp;
    },
    showEditInstructionsDialog(val) {
      this.showNotesDialog(true);
      this.updateNotesInStore(val);
    },
    checkEditOption() {
      let show = false;
      if (
        Object.prototype.hasOwnProperty.call(this.trackingData, 'edit_config')
        && this.user_state
      ) {
        if (this.trackingData.edit_config !== null) {
          show = this.trackingData.edit_config.change_notes;
        }
      }
      return show;
    },
    checkScheduleOption() {
      let show = false;
      if (this.trackingData.delivery_status < 2 && this.user_state) {
        show = true;
      }
      return show;
    },
    showEditPickUpTime() {
      this.showScheduleTimeDialog(true);
      const time = this.convertToUTCToLocal(this.trackingData.date_time);
      this.updatePickUpTimeInStore(time);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css?v=4";
.info-scheduled-time{
  margin: 3% 0px -2% 0px;
  font-style: italic;
  color: #1B7FC3;
  cursor: pointer;
  font-size: 12px;
  padding-left: 19px;
}
.align-top-bar{
  margin-left: 1%;
  margin-top: 2%;
}
.align-inner-bar{
  margin-left: 1%;
}
</style>
