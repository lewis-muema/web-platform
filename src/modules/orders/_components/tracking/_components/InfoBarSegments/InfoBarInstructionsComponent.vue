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
            <span class="info-text-transform infor-top-bar-text">
             {{$t('general.type_of_order')}} 
            </span>
          </div>
          <div class="tracking-loader-inner">
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
        <div
          v-if="scheduled_time"
          class="tracking-loader"
        >
          <div class="">
            <img
              src="https://images.sendyit.com/web_platform/tracking/calendar.svg"
              alt=""
              class="infobar-truck-img"
            >
            <span class="info-text-transform infor-top-bar-text">
              {{$t('general.scheduled_pick_up_time')}}
            </span>
          </div>
          <div class="tracking-loader-inner">
            <span class="info-text-transform">
              {{ convertToUTCToLocal(trackingData.date_time) | moment }}
            </span>
          </div>
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
              <span class="info-text-transform infor-top-bar-text">
                {{$t('general.goods_to_be_delivered')}}
              </span>
            </div>
            <div
              v-if="'delivery_item' in trackingData.package_details"
              class="tracking-loader-inner"
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
              class="tracking-loader-inner"
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
              <span class="info-text-transform">
                {{$t('general.weight_of_load')}}
              </span>
            </div>
            <div
              v-if="'load_weight' in trackingData.package_details"
              class="tracking-loader-inner"
            >
              {{ trackingData.package_details.load_weight }}
              {{ trackingData.package_details.load_units }}
            </div>
            <div
              v-else
              class="tracking-loader-inner"
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
              <span class="info-text-transform infor-top-bar-text">
               {{$t('general.need_loader')}}
              </span>
            </div>
            <div
              v-if="trackingData.package_details.additional_loader"
              class="tracking-loader-inner"
            >
              {{$t('general.yes')}}, {{ trackingData.package_details.no_of_loaders }}
            </div>
            <div
              v-else
              class="tracking-loader-inner"
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
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
    };
  },
  computed: {
    ...mapGetters({
      getTrackVendorName: '$_orders/$_tracking/getTrackVendorName',
    }),
  },
  mounted() {
    this.checkScheduler();
  },
  methods: {
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
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
