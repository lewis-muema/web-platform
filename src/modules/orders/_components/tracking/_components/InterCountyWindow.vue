<template lang="html">
  <div>
    <div
      v-if="truckMoreInfo && tracking_data !== undefined"
      class="truck-info-component"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="!loading"
          class="infobar--outer"
        >
          <div
            key="prime"
            class="infobar-content infobar--content-padded"
          >
            <!-- Tracking more Info top bar -->
            <el-row
              :gutter="20"
              class="infobar-content infobar--truck-item  infobar--item-truck-bordered infobar-truck-pstn "
            >
              <el-col :span="6">
                <div class="info-text-transform">
                  <img
                    src="https://images.sendyit.com/web_platform/tracking/checkmark.svg"
                    alt=""
                    class="infobar-truck-img"
                  >
                  <span class="infor-top-bar-text">
                    Order Number :
                  </span>
                  <span>
                    {{ tracking_data.order_no }}
                  </span>
                </div>
              </el-col>
              <el-col
                :span="6"
                class="status-text"
              >
                <div class="info-text-transform">
                  <img
                    src="https://images.sendyit.com/web_platform/tracking/status.svg"
                    alt=""
                    class="top-bar-img infobar-truck-img"
                  >
                  <span class="infor-top-bar-text"> Status :</span>
                  <span> {{ getStatus }} </span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-text-transform">
                  <div class="topbar-text">
                    <font-awesome-icon
                      icon="wallet"
                      class="top-bar-info infobar-truck-img"
                    />
                    <span>
                      <span class="infor-top-bar-text">
                        Cost :
                      </span>
                      <span>
                        {{
                          tracking_data.price_tier.currency
                            ? tracking_data.price_tier.currency
                            : tracking_data.currency
                        }}
                        {{ tracking_data.inter_county_order_details.total_cost }}
                      </span>
                    </span>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="info-text-transform">
                  <div class="topbar-text infor-top-bar-text">
                    Order Timeline
                  </div>
                </div>
              </el-col>
              <el-col
                :span="1"
                class="minimise-icon"
              >
                <div
                  v-if="truckMoreInfo"
                  class="infobar--actions-hover"
                  @click="minimiseInfoDetails()"
                >
                  <div class="infobar--actions-icon">
                    <i class="el-icon-remove-outline" />
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- end of tracking more info top bar  -->

            <el-row
              :gutter="20"
              class="infobar-content infobar--truck-cont-item infobar--truck-cont-padding"
            >
              <el-col
                :span="4"
                class="inforbar_left_scrollable"
              >
                <div class="locations--item-scrollable">
                  <ul class="timeline inforbar_route_timeline">
                    <li>
                      <p class="info-text-transform infor-top-bar-text">
                        Pickup Location
                      </p>
                      <p>{{ tracking_data.path[0].name }}</p>
                    </li>

                    <li
                      v-for="(val, index) in tracking_data.path"
                      v-if="index > 0"
                      :class="
                        Object.prototype.hasOwnProperty.call(val, 'notes') && val.notes
                          ? 'infor-top-bar-notes-section'
                          : ''
                      "
                    >
                      <p class="info-text-transform infor-top-bar-text">
                        {{
                          tracking_data.path[index].waypoint_type
                            ? tracking_data.path[index].waypoint_type
                            : `Destination`
                        }}
                      </p>
                      <p>
                        {{ val.name }}
                      </p>
                      <p
                        v-if="Object.prototype.hasOwnProperty.call(val, 'notes') && val.notes"
                        class="infor-top-bar-text-notes"
                      >
                        Notes: {{ val.notes }}
                      </p>
                    </li>
                  </ul>
                </div>
              </el-col>
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
                        Type of order
                      </span>
                    </div>
                    <div class="tracking-loader-inner">
                      <img
                        :src="getVendorIcon(tracking_data.rider.vendor_id)"
                        alt=""
                        class="infobar-truck-img inforbar-vendor-icon"
                      >
                      <span class="info-text-transform">
                        {{ vendorName }}
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
                        Scheduled pick up time
                      </span>
                    </div>
                    <div class="tracking-loader-inner">
                      <span class="info-text-transform">
                        {{ convertToUTCToLocal(tracking_data.date_time) | moment }}
                      </span>
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
                    RECIPIENT’S CONTACT INFORMATION
                  </div>
                  <div class="tracking-notes-inner">
                    <div class="additional-instructions-content additional-instructions-wrapper">
                      <div class="additional-notes-outer">
                        <div class="additional-notes-recipient">
                          {{ tracking_data.inter_county_order_details.recipient_info.name }}
                        </div>
                        <div class="additional-notes-recipient">
                          {{ tracking_data.inter_county_order_details.recipient_info.phone_number }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col
                :span="6"
                class=""
              >
                <div class="">
                  <!-- Tracking Timeline for Small Vendors  -->

                  <div class="inforbar--item-scrollable">
                    <ul class="timeline inforbar_order_timeline">
                      <li
                        v-for="(vendor_timeline, index) in tracking_data.order_timeline"
                        id="timeline_right"
                        :key="index"
                        :class="orderTimelineClass(vendor_timeline)"
                      >
                        <div :class="orderTimelineText(vendor_timeline)">
                          <p class="">
                            {{ vendor_timeline.message }}
                          </p>
                          <div
                            v-if="Object.prototype.hasOwnProperty.call(vendor_timeline, 'action')"
                          >
                            <div
                              v-if="showPaymentBtn(vendor_timeline)"
                              class="info-payment-button"
                            >
                              <input
                                type="submit"
                                class="button-primary button-tracking-payment"
                                value="Make Payment"
                                @click="takeMeToPayment()"
                              >
                            </div>
                            <div
                              v-if="showChildOrder(vendor_timeline)"
                              class="info-payment-button"
                            >
                              <input
                                type="submit"
                                class="button-primary button-tracking-payment"
                                value="Track Rider"
                                @click="trackOrder(vendor_timeline.order_no)"
                              >
                            </div>
                          </div>
                          <p
                            v-if="vendor_timeline.timestamp !== ''"
                            class="eta_data"
                          >
                            {{ convertToLocalTime(vendor_timeline.timestamp) | moment }}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </transition>
    </div>

    <div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div v-if="!truckMoreInfo && tracking_data !== undefined">
          <div
            v-if="!loading"
            class="infobar--outer"
          >
            <div class="infobar--content infobar--content-padded">
              <div
                class="inter-county-infobar--photo infobar--content infobar--item infobar--item-bordered"
              >
                <img
                  class="inter-county-img"
                  src="https://images.sendyit.com/web_platform/vendor_type/side/v2/26.svg"
                >
              </div>
              <div class="infobar--content infobar--item infobar--driver infobar--item-bordered">
                <div class="infobar--driver-details">
                  <div class="marketing-message-align">
                    {{ checkOrderMessage }}
                  </div>
                </div>
              </div>
              <div
                v-if="!externalTracking"
                class="infobar--content infobar--item infobar--order infobar--item-bordered infobar--order-align"
              >
                <div>
                  {{
                    tracking_data.price_tier.currency
                      ? tracking_data.price_tier.currency
                      : tracking_data.currency
                  }}
                  {{ tracking_data.inter_county_order_details.total_cost }}
                </div>
                <div class="">
                  <div class="">
                    {{ tracking_data.order_no }}
                  </div>
                </div>
              </div>

              <div
                v-if="this.$route.name !== 'tracking_external'"
                class="infobar--content infobar--item infobar--actions"
              >
                <div
                  class="infobar--actions-hover"
                  @click="maximiseInfoDetails()"
                >
                  <div class="infobar--actions-icon">
                    <i class="el-icon-circle-plus-outline" />
                  </div>
                  <div class="infobar--actions-text">
                    Expand Info
                  </div>
                </div>
                <div
                  v-if="cancelBtnState()"
                  class="infobar--actions-hover"
                  @click="canceldialog()"
                >
                  <div class="infobar--actions-icon">
                    <i class="el-icon-circle-close-outline" />
                  </div>
                  <div class="infobar--actions-text">
                    Cancel Order
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="">
          <el-dialog
            :visible.sync="cancelOption"
            class="cancelOptions"
          >
            <div
              v-if="extendedDialog()"
              class="cancelOptions--content-wrap"
            >
              <div class="">
                <div
                  id="cancel-reason-title"
                  class="cancel-reason-title"
                >
                  Are you sure you want to cancel?
                </div>
                <div
                  id="cancel-reason-subtitle"
                  class="cancel-reason-subtitle"
                >
                  You may incur cost on cancellation. Please confirm order details in future before
                  placing an order
                </div>
              </div>
              <div v-for="reasons in cancellation_reasons">
                <div
                  id="cancel-reason-text"
                  class="cancel-reason-text"
                >
                  <div class="">
                    <el-radio
                      v-model="cancel_reason"
                      :label="reasons.cancel_reason_id"
                    >
                      {{ reasons.cancel_reason }}
                    </el-radio>
                  </div>
                </div>
              </div>
              <div
                v-if="cancel_reason === 0"
                class="cancel-reason-input"
              >
                <el-input
                  v-model="cancel_desc"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="Tell us why you want to cancel"
                />
              </div>
              <div class="cancel-reason-input">
                <input
                  v-model="inputCancelReason"
                  type="text"
                  class="cancel-reason-text-input"
                  name=""
                  placeholder="Enter cancel reason"
                >
              </div>
              <div class="action--slide-desc">
                <button
                  type="button"
                  name="button"
                  class="action--slide-button cancellation-submit accept-cancell-btn"
                  @click="cancelOrder()"
                >
                  YES , CANCEL
                </button>
                <button
                  type="button"
                  name="button"
                  class="action--slide-button cancellation-submit"
                  @click="cancelToggle(true)"
                >
                  NO , DON'T CANCEL
                </button>
              </div>
            </div>
            <div
              v-if="cancel_reason === 4"
              class="cancelOptions--content-wrap"
            >
              <div class="cancelOptions--content-message">
                Did you know after your order is confirmed you can call your rider and give him the
                right destination? We will recalculate the cost and deliver your item.
              </div>
              <div class="cancelOptions--content-buttons">
                <button
                  type="button"
                  name="button"
                  class="action--slide-button"
                  @click="cancelToggle(cancel_reason)"
                >
                  Okay, I'll call the rider
                </button>
                <button
                  type="button"
                  name="button"
                  class="default action--slide-button"
                  @click="cancelOrder()"
                >
                  Cancel Order
                </button>
              </div>
            </div>
            <div
              v-if="pop_state === 5"
              class="cancelOptions--content-wrap"
            >
              <div class="warning-icon-pstn">
                <i class="el-icon-warning warning-icon" />
              </div>
              <div class="cancelOptions--content-message pop-message">
                In the future, ensure your order is ready
              </div>
              <div class="cancelOptions--content-buttons">
                <button
                  type="button"
                  name="button"
                  class="action--slide-button pop_btn"
                  @click="disablePop()"
                >
                  OK
                </button>
              </div>
            </div>
            <div
              v-if="pop_state === 13"
              class="cancelOptions--content-wrap"
            >
              <div class="warning-icon-pstn">
                <i class="el-icon-warning warning-icon" />
              </div>
              <div class="cancelOptions--content-message pop-message">
                Your preferred rider is either offline or already busy
              </div>
              <div class="cancelOptions--content-buttons">
                <button
                  type="button"
                  name="button"
                  class="action--slide-button pop_btn"
                  @click="disablePop()"
                >
                  OK
                </button>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            :visible.sync="showPaymentTab"
            class="cancelOptions"
          >
            <div class="cancelOptions--content-wrap payments-wrap">
              <div class="cancelOptions--content-message payments-headline">
                Awaiting Payment
              </div>

              <div class="cancelOptions--content-message">
                The cost of your cross county order to Nyeri is
                <span class="payments-headline">{{
                  tracking_data.inter_county_order_details.total_cost
                }}</span>
              </div>
              <div class="cancelOptions--content-message">
                <div class="">
                  <div
                    class="payments-cursor"
                    @click="do_set_payment_option()"
                  >
                    <a>
                      <span class="">
                        Payment options
                      </span>
                      <font-awesome-icon
                        icon="chevron-down"
                        :class="revertIcon"
                        width="15px"
                      />
                    </a>
                  </div>
                  <div
                    v-if="payment_check === 'payment'"
                    class="show-options"
                  >
                    <div class="options-section">
                      <el-radio
                        v-model="paymentOption"
                        label="1"
                      >
                        M-Pesa
                      </el-radio>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cancelOptions--content-buttons">
                <div
                  v-if="loading_payment"
                  v-loading="loading_payment"
                  class="orders-loading-container orders-loading-container--completion"
                />
                <div v-if="!loading_payment && payment_state === 0">
                  <button
                    type="button"
                    name="button"
                    class="action--slide-button"
                    @click="initiatePayment()"
                  >
                    Make Payment
                  </button>
                </div>
                <div
                  v-if="loading_payment && payment_state === 1"
                  class="home-view-place-order--mpesa-cancel"
                >
                  <button
                    type="button"
                    class="button-primary home-view--place-order"
                    name="button"
                    @click="cancelMpesaPaymentRequest()"
                  >
                    Cancel Payment
                  </button>
                </div>
              </div>
            </div>
          </el-dialog>

          <el-dialog
            :visible.sync="shareOption"
            class="cancelOptions"
          >
            <div class="">
              <div class="share-text-option share-order-option share-notification-extend">
                Share ETA via SMS
              </div>
              <div class="share-eta-divider" />
              <div class="share-text-option share-notification-extend share-eta-input-header">
                Recipient Phone Number
              </div>
            </div>
            <div class="share-notification-extend share-eta-input">
              <el-input
                v-model.trim="recipientPhone"
                :min="0"
                type="number"
                autocomplete="true"
                class="share-input-layout"
              />
            </div>

            <div class="share-notification-extend eta-button-align">
              <button
                type="button"
                name="button"
                class="action--slide-button input-phone"
                @click="shareETASms()"
              >
                Submit
              </button>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faPlusCircle,
  faArrowLeft,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';

library.add(faChevronDown, faPlusCircle, faArrowLeft, faTrashAlt);

const moment = require('moment');

export default {
  name: 'InterCountyWindow',
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
    eta_moment(date) {
      return moment(date).format('hA');
    },
  },
  mixins: [TimezoneMxn, EventsMixin, NotificationMxn],
  data() {
    return {
      loading: true,
      order_number: '',
      cancel_popup: 0,
      cancel_reason: -1,
      cancel_desc: '',
      maximiseInfo: 0,
      cancelOption: false,
      inputCancelReason: '',
      paymentOption: '',
      truckMoreInfo: false,
      myRb: '',
      accType: '',
      pickUpEta: '',
      deliveryEta: '',
      confirmEta: '',
      scheduled_time: false,
      isConfirmed: false,
      isPicked: false,
      isDelivered: false,
      setConfirmed: false,
      setPicked: false,
      setDelivered: false,
      setPayed: false,
      vendorName: '',
      truck_orders: [20, 25],
      user_state: false,
      isSaved: false,
      shareOption: false,
      recipientPhone: '',
      externalTracking: false,
      setComplete: false,
      small_vendors: [1],
      setScheduled: false,
      partnerName: '',
      packageName: '',
      hubspotStatus: true,
      cancellation_reasons: [],
      cancellation_state: false,
      more_info: false,
      other_notes: '',
      pop_state: -1,
      showPaymentTab: false,
      payment_check: '',
      payment_state: 0, // 0- initial 1- loading 2- success 3- cancelled
      loading_payment: false,
      mpesa_poll_timer_id: null,
      mpesa_valid: false,
      mpesa_payment: false,
      mpesa_payment_state: false,
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      vendors: '$_orders/getVendors',
    }),
    getStatus() {
      if (!this.loading) {
        switch (this.tracking_data.delivery_status) {
          case 3: {
            return 'Delivered';
          }
          case 2: {
            return 'In Transit';
          }
          default: {
            switch (this.tracking_data.confirm_status) {
              case 1: {
                return 'Confirmed';
              }
              default: {
                return 'Pending';
              }
            }
          }
        }
      } else {
        return '';
      }
    },
    getStatusCode() {
      if (!this.loading) {
        switch (this.tracking_data.delivery_status) {
          case 3: {
            return 3;
          }
          case 2: {
            return 2;
          }
          default: {
            switch (this.tracking_data.confirm_status) {
              case 1: {
                return 1;
              }
              default: {
                return 0;
              }
            }
          }
        }
      } else {
        return '';
      }
    },
    revertIcon() {
      return {
        'sendy-blue': true,
        'rotate-transform': true,
        rotate: this.payment_check === 'payment',
      };
    },
    orderPlaced() {
      const text = 'Your order has been received';

      return text;
    },
    deliveryStatus(name) {
      const status = this.tracking_data.delivery_status;
      let text = '';
      if (status < 3) {
        text = `Your package is on the way to ${name}`;
      } else {
        text = 'Your package has been delivered';
      }
      return text;
    },
    delayState() {
      if (this.tracking_data !== undefined) {
        if (
          Object.prototype.hasOwnProperty.call(this.tracking_data.eta_data, 'cancelled')
          && this.tracking_data.eta_data.cancelled
        ) {
          return this.tracking_data.eta_data.cancelled_message;
        }
        if (this.tracking_data.eta_data.delayed) {
          return this.tracking_data.eta_data.delayed_message;
        }
        return this.confirmEta;
      }
      return this.confirmEta;
    },
    checkOrderMessage() {
      let resp = '';
      if (this.tracking_data !== undefined) {
        const data = this.tracking_data.order_timeline;
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].status === 'ongoing') {
              resp = data[i].message;
            }
          }
        }
      }
      return resp;
    },
  },
  watch: {
    '$route.params.order_no': function trackedOrder(from) {
      this.order_number = from;
      this.loading = true;
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', from);
      this.poll(from);
      this.initiateOrderData();
    },
    cancelOption: function cancelOption() {
      if (this.cancelOption === false) {
        const eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
    },
    tracking_data(data) {
      if (data !== undefined) {
        if (Object.prototype.hasOwnProperty.call(data, 'confirm_status')) {
          if (data.confirm_status === 1) {
            // this.reCheckMQTTConnection();
          }
        }
      }
      this.initiateOrderData();
    },
    inputCancelReason(data) {
      if (data) {
        this.cancel_reason = 11;
        this.cancel_desc = data;
        this.debounceCancelReason(data);
      } else {
        this.cancel_reason = -1;
        this.cancel_desc = '';
      }
    },
    cancel_reason(value) {
      if (value !== '') {
        this.cancelChange(value);
      }
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/setTrackedOrder', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.checkRunningBalance();
    this.initiateOrderData();
    this.hide_vendors();
    this.clearVendorMarkers();
  },
  created() {
    this.order_number = this.$route.params.order_no;
    this.checkPreviousRoute();
  },
  methods: {
    ...mapActions({
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
    }),
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      change_page: '$_orders/setPage',
    }),
    moment() {
      return moment();
    },
    do_set_payment_option() {
      let status = '';
      if (this.payment_check === '') {
        status = 'payment';
      }
      this.payment_check = status;
    },

    get_current_active_order_option_class(name) {
      return {
        'options-link-active': name === this.payment_check,
      };
    },
    // eslint-disable-next-line func-names
    debounceCancelReason: _.debounce(function (data) {
      this.fireGAEvent({
        eventCategory: 'Order Cancellation',
        eventAction: 'Click',
        eventLabel: 'Enter cancel reason input - Order Cancellation Page - WebApp',
      });
    }, 500),
    cancelChange(reason) {
      this.more_info = false;
      this.cancel_desc = '';
      const data = this.cancellation_reasons.find(
        position => position.cancel_reason_id === reason,
      );
      if (reason === 0) {
        this.more_info = true;
      } else {
        this.cancel_desc = data.cancel_reason;
      }
    },
    initiateOrderData() {
      if (this.tracking_data !== undefined) {
        if (Object.keys(this.tracking_data).length > 0) {
          this.setTimeLineIconState();
          this.checkVendorName();
          this.checkScheduler();
          this.confirmUser();
        }
      }
    },
    checkPreviousRoute() {
      if (this.$route.path === `/external/tracking/${this.$route.params.order_no}`) {
        this.truckMoreInfo = false;
        this.externalTracking = true;
      }
    },
    poll(from) {
      if (this.tracking_data !== undefined) {
        const that = this;
        this.$store
          .dispatch('$_orders/$_tracking/getTrackingData', { order_no: from })
          .then((response) => {
            if (response) {
              if (this.tracking_data.delivery_status === 3) {
                that.doNotification('1', 'Order delivered', 'Your order has been delivered.');
                if (that.$route.name !== 'tracking_external') {
                  that.$router.push(`/orders/rating/${from}`);
                } else {
                  that.$router.push(`/external/rating/${from}`);
                }
              } else if (this.tracking_data.main_status === 2) {
                that.doNotification('2', 'Order cancelled', 'Your order has been cancelled.');
                that.place();
              } else if (this.tracked_order === from) {
                setTimeout(() => {
                  that.poll(from);
                }, 20000);
              }
            } else {
              that.place();
            }
            that.loading = false;
          });
      }
    },
    cancelToggle(cancelReason = 0) {
      if (cancelReason === true) {
        const eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
      if (cancelReason === '4') {
        this.trackMixpanelEvent('Dissuaded Cancellation ', {
          'Order No': this.tracking_data.order_no,
        });
      }
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
      this.cancel_reason = '';
      if (cancelReason === true) {
        const eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
      if (cancelReason === '4') {
        this.trackMixpanelEvent('Dissuaded Cancellation ', {
          'Order No': this.tracking_data.order_no,
        });
      }
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
      this.cancel_reason = '';
    },
    maximiseInfoDetails() {
      this.truckMoreInfo = true;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/${id}.svg`;
    },
    checkVendorName() {
      if (
        Object.keys(this.tracking_data).length > 0
        && Object.prototype.hasOwnProperty.call(this.tracking_data.rider, 'vendor_name')
      ) {
        if (this.tracking_data.rider.vendor_name === 'Bike') {
          this.partnerName = 'rider';
          this.packageName = 'package';
          if (this.tracking_data.price_type === 3) {
            this.vendorName = 'Standard';
          } else {
            this.vendorName = 'Express';
          }
        } else if (this.tracking_data.rider.vendor_name === 'Economy Bike') {
          this.vendorName = 'Standard';
          this.partnerName = 'rider';
          this.packageName = 'package';
        } else {
          this.vendorName = this.tracking_data.rider.vendor_name;
          this.partnerName = 'driver';
          this.packageName = 'load';
        }
      }
    },
    checkScheduler() {
      const schedulerRange = moment().add(2, 'h');
      const orderPlaced = moment(this.tracking_data.date_time);
      const check = orderPlaced.diff(schedulerRange);

      if (check > 0) {
        this.scheduled_time = true;
      } else {
        this.scheduled_time = false;
      }
    },
    setTimeLineIconState() {
      if (
        Object.prototype.hasOwnProperty.call(this.tracking_data.eta_data, 'scheduled')
        && this.tracking_data.eta_data.scheduled
      ) {
        this.isPayed = false;
        this.setDelivered = false;
        this.isDelivered = false;
        this.isPicked = false;
        this.setPicked = false;
        this.setConfirmed = false;
        this.setPayed = false;
        this.setComplete = false;
        this.setScheduled = true;
        this.isPayed = false;
        this.isConfirmed = false;
      } else if (this.tracking_data.confirm_status === 0) {
        this.isPayed = false;
        this.setDelivered = false;
        this.isDelivered = false;
        this.isPicked = false;
        this.setPicked = false;
        this.setConfirmed = true;
        this.setPayed = true;
        this.setComplete = false;
        this.setScheduled = false;
        this.isConfirmed = false;
      } else if (
        this.tracking_data.confirm_status === 1
        && this.tracking_data.delivery_status === 0
      ) {
        this.setConfirmed = false;
        this.setPayed = false;
        this.setDelivered = false;
        this.isDelivered = false;
        this.setPicked = true;
        this.isConfirmed = true;
        this.isPayed = true;
        this.setComplete = false;
        this.setScheduled = false;
        this.isPicked = false;
      } else if (this.tracking_data.delivery_status === 2) {
        this.setConfirmed = false;
        this.setPayed = false;
        this.setPicked = false;
        this.isDelivered = false;
        this.setDelivered = true;
        this.isConfirmed = true;
        this.isPayed = true;
        this.isPicked = true;
        this.setComplete = false;
        this.setScheduled = false;
      } else if (this.tracking_data.delivery_status === 3) {
        this.setDelivered = false;
        this.isDelivered = true;
        this.isConfirmed = true;
        this.isPayed = true;
        this.isPicked = true;
        this.setComplete = true;
        this.setScheduled = false;
        this.setConfirmed = false;
        this.setPayed = false;
        this.setPicked = false;
      } else {
      }
    },
    confirmUser() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        const sessionUserEmail = session[session.default].user_email;
        const orderUserEmail = this.tracking_data.user.email;

        if (sessionUserEmail === orderUserEmail) {
          this.user_state = true;
          this.retrieveCancellationReasons();
        } else {
          this.user_state = false;
        }
      }
    },
    minimiseInfoDetails() {
      this.truckMoreInfo = false;
    },
    checkRunningBalance() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        const payload = {
          cop_id: session[session.default].cop_id,
          user_phone: session[session.default].user_phone,
        };
        this.$store.dispatch('$_orders/$_tracking/runningBalance', payload).then((response) => {
          if (response.status) {
            this.myRb = response.running_balance;
            this.accType = response.payment_plan;
          }
        });
      }
    },
    takeMeToPayment() {
      this.showPaymentTab = true;
    },
    canceldialog() {
      this.cancelOption = true;
      this.cancel_reason = '';
    },
    place() {
      this.pop_state = false;
      if (this.$route.name !== 'tracking_external') {
        this.$router.push('/orders');
      } else {
        this.$router.push('/');
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
    cancelPromocode() {
      const session = this.$store.getters.getSession;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const payload = {
        cop_id: copID,
        individual_id: individualID,
        coupon_code: '',
        coupon_amount: 0,
        is_cancelled: true,
        coupon_type: 0,
      };

      this.$store.dispatch('$_orders/$_tracking/cancelCoupon', payload).then(
        response => response.status,
        error => error,
      );
    },

    cancelOrder() {
      if (this.cancel_reason !== '' && Object.keys(this.$store.getters.getSession).length > 0) {
        if (this.cancel_reason === 0 && this.cancel_desc === '') {
          this.doNotification(
            3,
            'Order cancellation failed',
            'Please provide reason for cancellation',
          );
        } else {
          this.pop_state = this.cancel_reason;
          setTimeout(() => {
            this.pop_state = false;
          }, 3000);
          const payload = {
            order_no: this.tracking_data.order_no,
            cancel_reason_id: this.cancel_reason,
            reason_description: this.cancel_desc,
            client_type: this.$store.getters.getSession.default,
          };
          const that = this;
          if (this.inputCancelReason && this.hubspotStatus) {
            this.submitHubspotCancelReason();
            this.fireGAEvent({
              eventCategory: 'Order Cancellation',
              eventAction: 'Click',
              eventLabel: 'Submit cancel reason input - Order Cancellation Page - WebApp',
            });
          }
          const eventPayload = {
            eventCategory: 'Order Cancellation',
            eventAction: 'Click',
            eventLabel: 'Yes Button - Order Cancellation Page - WebApp',
          };
          this.fireGAEvent(eventPayload);

          this.cancelPromocode();

          this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then((response) => {
            if (response.status) {
              that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
              that.cancelToggle();
              this.$store.dispatch('$_orders/fetchOngoingOrders');
              that.place();
            } else {
              const payload2 = {
                order_no: that.$route.params.order_no,
                cancel_reason_id: 4,
                reason_description: 'I placed the wrong locations',
                client_type: that.$store.getters.getSession.default,
              };
              this.$store
                .dispatch('$_orders/$_tracking/cancelOrder', payload2)
                .then((response2) => {
                  if (response2.status) {
                    that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
                    that.cancelToggle();
                    this.$store.dispatch('$_orders/fetchOngoingOrders');
                    that.place();
                  } else {
                    that.doNotification(
                      2,
                      'Order cancellation failed',
                      'Could not cancel the order. Please contact Customer Care at 0709779779.',
                    );
                  }
                });
            }
          });
        }
      } else {
        this.doNotification(3, 'Order cancellation failed', 'Please select cancellation reason.');
      }
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
    saveDetails() {
      const sessionData = this.$store.getters.getSession;
      let params = {};

      if (sessionData.default === 'biz') {
        // create cop payload
        params = {
          cop_id: sessionData.biz.cop_id,
          order_no: this.$route.params.order_no,
          user_id: sessionData.biz.user_id,
        };
      } else {
        // create peer payload
        params = {
          cop_id: 0,
          order_no: this.$route.params.order_no,
          user_id: sessionData.biz.user_id,
        };
      }

      this.$store.dispatch('$_orders/$_tracking/saveOrderDetails', params).then(
        (response) => {
          if (response.status) {
            this.doNotification(1, 'Save Details', 'Order Details saved successfully.');
            this.isSaved = true;
          } else {
            this.doNotification(3, 'Save Details failed', 'Could not save details. Kindly retry.');
          }
        },
        (error) => {
          this.doNotification(2, 'Save Details Error ', 'Check Internet connection and retry');
        },
      );
    },
    dateFormat(date) {
      return this.moment(date).calendar(null, {
        lastWeek: 'MMM-D hh:mm a',
        sameDay: '[Today] hh:mm a',
        nextDay: '[Tomorrow] hh:mm a',
        nextWeek: 'ddd',
        sameElse() {
          return 'MMM D, hh:mm a';
        },
      });
    },
    sharedialog() {
      this.shareOption = true;
    },
    shareETASms() {
      if (this.recipientPhone !== '' && this.recipientPhone.length > 9) {
        const payload = {};
        const track = `${window.location.origin}/external/tracking/${this.$route.params.order_no}`;
        const session = this.$store.getters.getSession;
        const userName = session[session.default].user_name;
        payload.phone = this.recipientPhone;
        payload.message = `Hi! ${userName} wants you to track their Sendy order here: ${track}`;

        this.$store.dispatch('$_orders/$_tracking/requestETASms', payload).then(
          (response) => {
            if (response.status === 200) {
              this.doNotification(1, 'Share ETA', 'SMS sent successfully.');
              this.shareOption = false;
            } else {
              this.doNotification(2, 'Share ETA failed', 'Could not send ETA sms. Kindly retry.');
            }
          },
          (error) => {
            this.doNotification(2, 'Share ETA Error ', 'Check Internet connection and retry');
          },
        );
      } else {
        this.doNotification(2, 'Share ETA failed !', 'Please enter a valid phone number');
      }
    },
    toDeliveryTypeClass(val, index) {
      const nextPoint = this.tracking_data.path[index - 1].visited;
      if (this.tracking_data.delivery_status >= 2) {
        if (val.visited) {
          return ['timelineDeliveredExpress'];
        }
        if (nextPoint) {
          return ['deliveryEnrouteReached'];
        }
      }
      return '';
    },
    toConfirmationStateClass() {
      if (this.tracking_data.eta_data.delayed) {
        return ['confirmationDelayActive'];
      }
      return '';
    },
    orderTimelineClass(val) {
      if (val.status === 'visited') {
        return ['timelineDeliveredExpress'];
      }
      if (val.status === 'ongoing') {
        return ['deliveryEnrouteReached'];
      }
      return '';
    },
    orderTimelineText(val) {
      if (val.status === 'visited') {
        return ['stagePassed'];
      }
      if (val.status === 'ongoing') {
        return ['deliveredActive'];
      }
      return ['infor-top-bar-text'];
    },
    submitHubspotCancelReason() {
      this.hubspotStatus = false;
      const session = this.$store.getters.getSession;
      // eslint-disable-next-line global-require
      const portalId = '4951975';
      const formId = '396e6fb7-2bb9-4bae-a5e7-623983ecd97e';
      const fields = {
        fields: [
          {
            name: 'firstname',
            value: session[session.default].user_name,
          },
          {
            name: 'email',
            value: session[session.default].user_email,
          },
          {
            name: 'phone',
            value: session[session.default].user_phone,
          },
          {
            name: 'cancel_reason',
            value: this.inputCancelReason,
          },
        ],
      };
      const payload = {
        values: fields,
        app: 'HUBSPOT_URL',
        vm: this,
        endpoint: `${portalId}/${formId}`,
      };

      this.$store
        .dispatch('requestAxiosPost', payload)
        .then(response => response)
        .catch(err => err);
    },
    retrieveCancellationReasons() {
      this.$store.dispatch('$_orders/$_tracking/requestCancellationReasons').then(
        (response) => {
          if (response.status) {
            this.cancellation_reasons = response.data;
            this.cancellation_state = true;
          } else {
            this.cancellation_state = false;
          }
        },
        (error) => {
          this.cancellation_state = false;
        },
      );
    },
    cancelBtnState() {
      if (
        Object.prototype.hasOwnProperty.call(
          this.tracking_data.inter_county_order_details,
          'cancellable',
        )
      ) {
        return this.tracking_data.inter_county_order_details.cancellable;
      }
      return false;
    },
    disablePop() {
      this.cancelToggle();
      this.pop_state = false;
    },
    extendedDialog() {
      if (this.cancel_reason === 4 || this.pop_state === 5 || this.pop_state === 13) {
        return false;
      }
      return true;
    },
    cancellationState() {
      if (this.getStatus === 'Delivered' || this.getStatus === 'In Transit') {
        return false;
      }
      return true;
    },
    checkPickUpNotes(val) {
      let resp = true;
      if (
        val.recipient_phone === null
        && (val.hasOwnProperty('notes') === false || val.notes === null)
      ) {
        resp = false;
      }
      return resp;
    },
    displayNotes(val) {
      const resp = true;
      if (val.notes === null || val.hasOwnProperty('notes') === false) {
        return false;
      }
      return resp;
    },
    initiatePayment() {
      if (this.paymentOption === '') {
        this.doNotification(
          '2',
          'Choose a payment method',
          'Please select a payment method and try again.',
        );
      } else if (Number(this.paymentOption) === 1) {
        this.requestMpesaPayment();
      }
    },
    showPaymentBtn(timeline) {
      const resp = timeline.action === 'payment'
        && this.tracking_data.inter_county_order_details.status === 'pending_payment';

      return resp;
    },
    showChildOrder(timeline) {
      const resp = timeline.action === 'track' && timeline.status === 'ongoing';

      return resp;
    },
    trackOrder(order) {
      this.hide_vendors();
      this.clearVendorMarkers();
      this.$router.push({ path: `/orders/tracking/${order}` });
      this.change_page(1);
    },
    requestMpesaPayment() {
      const session = this.$store.getters.getSession;
      let referenceNumber = 'SENDY';
      let copId = 0;
      let userId = 0;
      let userEmail = '';
      let userPhone = '';
      if (session.default === 'biz') {
        referenceNumber = this.tracking_data.order_no;
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
        userEmail = session.biz.user_email;
        userPhone = session.biz.user_phone;
      } else {
        referenceNumber = this.tracking_data.order_no;
        userId = session.peer.user_id;
        userPhone = session.peer.user_phone;
        userEmail = session.peer.user_email;
      }

      const mpesaPayload = {
        amount: this.tracking_data.inter_county_order_details.total_cost,
        sourceMobile: userPhone,
        referenceNumber,
        user_id: userId,
        cop_id: copId,
        phone: userPhone,
        email: userEmail,
        currency: this.tracking_data.price_tier.currency
          ? this.tracking_data.price_tier.currency
          : this.tracking_data.currency,
        vendorType: this.tracking_data.rider.vendor_id,
      };
      const fullPayload = {
        values: mpesaPayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };
      this.payment_state = 1;
      this.loading_payment = true;

      this.requestMpesaPaymentAction(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            // eslint-disable-next-line no-param-reassign
            response = response[0];
          }

          if (response.status === 200) {
            this.doNotification('0', 'M-Pesa Payment', `Request for payment sent to ${userPhone}.`);
            this.requestMpesaPaymentPoll();
          } else {
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${userPhone} amount KES ${
                this.tracking_data.amount
              }.`,
            );
            this.payment_state = 0;
            this.loading_payment = false;
          }
        },
        () => {
          this.doNotification(
            '0',
            'M-Pesa Payment',
            `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
              this.pending_amount
            }.`,
          );
          this.payment_state = 0;
          this.loading_payment = false;
        },
      );
    },
    cancelMpesaPaymentRequest() {
      this.payment_state = 0;
      this.loading_payment = false;
      this.doNotification(
        '2',
        'M-Pesa Payment cancelled',
        'M-Pesa payment has been cancelled, please try again.',
      );
      this.requestMpesaPaymentPoll(60);
    },
    clearMpesaPollCounter() {
      // fails silently if the id is not found
      window.clearTimeout(this.mpesa_poll_timer_id);
    },
    requestMpesaPaymentPoll(pollLimitValue = 6) {
      this.clearMpesaPollCounter();

      const pollLimit = pollLimitValue; // 10secs * 6  = 60sec = 1min
      // poll the dispatch
      for (let pollCount = 0; pollCount < pollLimit; pollCount++) {
        // wait 10 seconds
        const that = this;
        // eslint-disable-next-line func-names,no-shadow
        (function (pollCount) {
          // eslint-disable-next-line consistent-return
          that.mpesa_poll_timer_id = window.setTimeout(() => {
            if (!that.mpesa_payment_state) {
              that.checkOrderStatus(that.tracking_data.order_no);
            }
            if (that.mpesa_payment) {
              // eslint-disable-next-line no-param-reassign
              pollCount = pollLimit;
              that.payment_state = 0;
              that.loading_payment = false;
              that.showPaymentTab = false;
              that.doNotification('1', 'Order Payment', 'Payment was successful');
              that.payment_check = '';
              that.mpesa_payment = false;
              that.mpesa_payment_state = true;
              return true;
            }

            if (pollLimitValue === 6) {
              if (pollCount === 5 && !that.mpesa_payment_state) {
                that.doNotification(
                  '0',
                  'Payment not received',
                  "We'll keep retrying to check your payment status and complete your order once the payment is received.",
                );
                that.payment_state = 0;
                that.loading_payment = false;
                that.requestMpesaPaymentPoll(60);
                that.mpesa_payment_state = false;
                that.mpesa_payment = false;
              }
            }
          }, 10000 * pollCount);
        }(pollCount));
      }
    },
    checkOrderStatus(from) {
      if (this.tracking_data !== undefined) {
        const that = this;
        this.$store
          .dispatch('$_orders/$_tracking/getTrackingData', { order_no: from })
          .then((response) => {
            if (response) {
              if (!that.mpesa_payment_state) {
                if (that.tracking_data.inter_county_order_details.status === 'approved') {
                  that.completeMpesaPaymentRequest({});
                  that.mpesa_payment = true;
                } else {
                  that.mpesa_payment = false;
                }
              } else {
                that.requestMpesaPaymentPoll(60);
              }
            } else {
              that.mpesa_payment = false;
              that.place();
            }
          });
      }
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/styles/info_window_component.css";
@import '../../../../../assets/styles/orders_order_placement_options.css?v=1';
</style>
