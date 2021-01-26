<template lang="html">
  <div>
    <div v-if="tracking_data !== undefined">
      <div v-if="interCountyInforBar()">
        <inter-county-window />
      </div>
      <div v-else>
        <div>

          <transition name="fade" mode="out-in">
            <div v-if="!getTrackMoreInfo && tracking_data !== undefined">
              <div v-if="!loading" class="infobar--outer">
                <div class="infobar--content infobar--content-padded">
                  <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
                    <img class="rimg" :src="tracking_data.rider.rider_photo" />
                  </div>
                  <div class="infobar--content infobar--item infobar--driver infobar--item-bordered">
                    <div v-if="tracking_data.confirm_status > 0" class="infobar--driver-details">
                      <div class="">
                        {{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}
                      </div>
                      <div class="">
                        {{ tracking_data.rider.vehicle_name }} {{ tracking_data.rider.number_plate }}
                      </div>
                    </div>
                    <div v-else class="infobar--driver-details">
                      <div class="" v-if="!tracking_data.eta_data.delayed">
                        {{ tracking_data.description_head }}
                      </div>
                      <div class="marketing-message-align">
                        {{ tracking_data.marketing_message }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="infobar--content infobar--item infobar--order infobar--item-bordered infobar--order-align"
                    v-if="!externalTracking"
                  >
                    <div v-if="getStatus === 'Pending'" class="">
                      <div
                        v-if="
                          [20, 25].includes(tracking_data.rider.vendor_id) &&
                            'customer_min_amount' in tracking_data.package_details &&
                            !tracking_data.fixed_cost
                        "
                      >
                        Minimum Amount : {{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }}
                        {{ tracking_data.package_details.customer_min_amount }}
                      </div>
                      <div v-else>
                        {{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }} {{ tracking_data.amount }}
                      </div>
                    </div>
                    <div v-else>{{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }} {{ tracking_data.amount }}</div>
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
                    <div v-if="false">
                      <div class="infobar--actions-icon">
                        <i class="el-icon-sold-out" />
                      </div>
                      <div class="infobar--actions-text">
                        Free delivery
                      </div>
                    </div>
                    <div v-if="false">
                      <div class="infobar--actions-icon">
                        <i class="el-icon-share" />
                      </div>
                      <div class="infobar--actions-text">
                        Share Status
                      </div>
                    </div>
                    <div class="infobar--actions-hover" @click="maximiseInfoDetails()">
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

        <div v-if="getTrackMoreInfo && tracking_data !== undefined" class="truck-info-component">
          <transition name="fade" mode="out-in">
            <div v-if="!loading" class="infobar--outer">
              <div key="prime" class="infobar-content infobar--content-padded">

                <!-- Tracking more Info top bar -->

                <HeaderSection :trackingData="tracking_data" />


                <el-row
                  :gutter="20"
                  class="infobar-content infobar--truck-cont-item infobar--truck-cont-padding"
                >
                  <LocationsSection :trackingData="tracking_data" />
                  <InstructionsSection :trackingData="tracking_data" />
                  <OrderTimelineSection :trackingData="tracking_data" />

                </el-row>

                <FooterSection v-if="getStatus !== 'Pending'" :trackingData="tracking_data" />
              </div>
            </div>
          </transition>
        </div>

        <div>
          <transition name="fade" mode="out-in">
            <div class="">

              <!-- Order Cancellation Dialog -->

              <el-dialog :visible.sync="cancelOption" class="cancelOptions">
                <div class="cancelOptions--content-wrap" v-if="extendedDialog()">
                  <div class="">
                    <div class="cancel-reason-title" id="cancel-reason-title">
                      Are you sure you want to cancel?
                    </div>
                    <div class="cancellation-info--outer">
                      <div class="cancellation-info--inner">
                        <div
                          v-if="!cancellation_fee"
                          class="cancel-reason-subtitle"
                          id="cancel-reason-subtitle"
                        >
                          You may incur cost on cancellation. Please confirm order details in future
                          before placing an order
                        </div>
                        <div v-else class="cancel-reason-subtitle" id="cancel-reason-subtitle">
                          <i class="el-icon-warning warning-cancellation-icon"></i>
                          {{ getCancellationInfo() }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-for="reasons in cancellation_reasons">
                    <div class="cancel-reason-text" id="cancel-reason-text">
                      <div class="">
                        <el-radio v-model="cancel_reason" :label="reasons.cancel_reason_id">
                          {{ reasons.cancel_reason }}
                        </el-radio>
                      </div>
                    </div>
                  </div>
                  <div class="cancel-reason-input" v-if="cancel_reason === 0">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="Tell us why you want to cancel"
                      v-model="cancel_desc">
                    </el-input>
                  </div>
                  <div class="cancel-reason-input">
                    <input type="text" v-model="inputCancelReason" class="cancel-reason-text-input" name="" placeholder="Enter cancel reason" />
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
                <div class="cancelOptions--content-wrap" v-if="cancel_reason === 4">
                  <div class="cancelOptions--content-message">
                    Did you know after your order is confirmed you can call your rider and give him
                    the right destination? We will recalculate the cost and deliver your item.
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
                <div class="cancelOptions--content-wrap" v-if="pop_state === 5">
                  <div class="warning-icon-pstn">
                    <i class="el-icon-warning warning-icon"></i>
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
                <div class="cancelOptions--content-wrap" v-if="pop_state === 13">
                  <div class="warning-icon-pstn">
                    <i class="el-icon-warning warning-icon"></i>
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

              <!-- Share ETA Dialog -->

              <el-dialog :visible.sync="shareOption" class="cancelOptions">
                <div class="">
                  <div class="share-text-option share-order-option share-notification-extend">
                    Share ETA via SMS
                  </div>
                  <div class="share-eta-divider"></div>
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
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters ,mapMutations} from 'vuex';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';
import InterCountyWindow from './InterCountyWindow.vue';
import FooterSection from './InfoBarSegments/InfoBarFooterComponent.vue';
import HeaderSection from './InfoBarSegments/InfoBarHeaderComponent.vue';
import LocationsSection from './InfoBarSegments/InfoBarLocationsComponent.vue';
import InstructionsSection from './InfoBarSegments/InfoBarInstructionsComponent.vue';
import OrderTimelineSection from './InfoBarSegments/InfoBarOrderTimelineComponent.vue';


const moment = require('moment');

export default {
  name: 'InfoWindow',
  components: { InterCountyWindow , FooterSection ,HeaderSection ,LocationsSection ,InstructionsSection,OrderTimelineSection},
  mixins: [TimezoneMxn, EventsMixin,NotificationMxn],
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
    eta_moment(date) {
      return moment(date).format('hA');
    },
  },
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
      scheduled_time: false,
      user_state: false,
      isSaved: false,
      shareOption: false,
      recipientPhone: '',
      externalTracking: false,
      small_vendors: [1],
      setScheduled: false,
      hubspotStatus: true,
      cancellation_reasons : [],
      cancellation_state : false,
      more_info : false ,
      other_notes : '',
      pop_state : -1 ,
      cancellation_fee : false,
      cancellation_amount : 0 ,
      cancellation_message : '',
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      vendors: '$_orders/getVendors',
      getShareOption: '$_orders/$_tracking/getShareOption',
      getTrackMoreInfo: '$_orders/$_tracking/getTrackMoreInfo',
      getTrackVendorName: '$_orders/$_tracking/getTrackVendorName',
      getConfirmEta: '$_orders/$_tracking/getConfirmEta',
      getPickUpEta: '$_orders/$_tracking/getPickUpEta',
      getDeliveryEta: '$_orders/$_tracking/getDeliveryEta',
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
    deliveryStatus(name) {
      let status = this.tracking_data.delivery_status;
      let text = '';
      if (status < 3) {
        text = `Your package is on the way to ${name}`;
      } else {
        text = 'Your package has been delivered';
      }
      return text;
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
        let eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
    },
    shareOption(val){
      if (!val) {
        this.setShareOption(false);
      }
    },
    tracking_data(data) {
      if (data !== undefined) {
        if (Object.prototype.hasOwnProperty.call(data, 'confirm_status')) {
          if (data.confirm_status === 1) {
            this.reCheckMQTTConnection();
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
    cancel_reason(value){
      if (value !== '') {
        this.cancelChange(value);
      }

    },
    getShareOption(value){
      this.shareOption = value
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/setTrackedOrder', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.initiateOrderData();
  },
  created() {
    this.order_number = this.$route.params.order_no;
    this.checkPreviousRoute();
  },
  methods: {
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      setShareOption: '$_orders/$_tracking/setShareOption',
      setTrackMoreInfo: '$_orders/$_tracking/setTrackMoreInfo',
      setTrackVendorName: '$_orders/$_tracking/setTrackVendorName',
      setTrackPartnerName: '$_orders/$_tracking/setTrackPartnerName',
      setTrackPackageName: '$_orders/$_tracking/setTrackPackageName',
      setConfirmEta: '$_orders/$_tracking/setConfirmEta',
      setPickUpEta: '$_orders/$_tracking/setPickUpEta',
      setDeliveryEta: '$_orders/$_tracking/setDeliveryEta',
    }),
    moment() {
      return moment();
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
      this.more_info = false ;
      this.cancel_desc = '';
      const data = this.cancellation_reasons.find(position => position.cancel_reason_id === reason);
      if (reason === 0) {
        this.more_info = true ;
      }
      else {
        this.cancel_desc = data.cancel_reason;
      }
    },
    initiateOrderData() {
      if (this.tracking_data !== undefined) {
        if (Object.keys(this.tracking_data).length > 0) {
          if (this.tracking_data.rider.vendor_id !== 26) {
            this.setRiderLocationToStore();
          }
          this.checkVendorName();
          this.orderETA();
          this.confirmUser();
        }
      }
    },
    checkPreviousRoute() {
      if (this.$route.path === `/external/tracking/${this.$route.params.order_no}`) {
        this.setTrackMoreInfo(false);
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
                }, 30000);
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
        let eventPayload = {
             eventCategory: 'Order Cancellation',
              eventAction: 'Click',
              eventLabel: 'No Button - Order Cancellation Page - WebApp',
          }
          this.fireGAEvent(eventPayload);

      }
      if(cancelReason === '4') {
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
        let eventPayload = {
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
      this.setTrackMoreInfo(true);
    },
    checkVendorName() {
      if (
        Object.keys(this.tracking_data).length > 0 &&
        Object.prototype.hasOwnProperty.call(this.tracking_data.rider, 'vendor_name')
      ) {
        if (this.tracking_data.rider.vendor_name === 'Bike') {
          this.setTrackPartnerName('rider');
          this.setTrackPackageName('package');
          if (this.tracking_data.price_type === 3) {
            this.setTrackVendorName('Standard');
          } else {
            this.setTrackVendorName('Express');
          }
        } else if (this.tracking_data.rider.vendor_name === 'Economy Bike') {
          this.setTrackVendorName('Standard');
          this.setTrackPartnerName('rider');
          this.setTrackPackageName('package');
        } else {
          this.setTrackVendorName(this.tracking_data.rider.vendor_name);
          this.setTrackPartnerName('driver');
          this.setTrackPackageName('load');
        }
      }
    },
    confirmUser() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0 &&
        Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        let sessionUserEmail = session[session.default].user_email;
        let orderUserEmail = this.tracking_data.user.email;

        if (sessionUserEmail === orderUserEmail) {
          this.user_state = true;
          this.retrieveCancellationReasons();
        } else {
          this.user_state = false;
        }
      }
    },
    canceldialog() {

      const payload = {
        "order_no" : this.tracking_data.order_no
      };
      this.$store.dispatch('$_orders/$_tracking/computeCancellationFee', payload).then(
        (response) => {
          if (response.data.cancellation_fee === 0) {
            this.cancellation_fee = false ;
            this.cancellation_amount = 0 ;
            this.cancellation_message = '';
          }
          else {
            this.cancellation_fee = true ;
            this.cancellation_amount = response.data.cancellation_fee ;
            this.cancellation_message = response.data.description ;
          }
          this.cancelOption = true;
          this.cancel_reason = '';
        },
        () => {
          this.cancellation_fee = false ;
          this.cancelOption = false;
          this.cancel_reason = '';
        }
      );
    },
    getCancellationInfo(){

      let text = `You will incur a cancellation fee of ${this.tracking_data.currency} ${this.cancellation_amount} , please ensure you check order details and your order is ready before placing an order`;

      if (this.getStatus === 'Confirmed') {
        text = `Please note you will be charged ${this.tracking_data.currency} ${this.cancellation_amount} for cancelling this order`;
      }

      return text ;
    },
    place() {
      this.pop_state = false ;
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
    cancelPromocode () {
      const session = this.$store.getters.getSession;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const payload = {
          cop_id : copID,
          individual_id : individualID,
          coupon_code :"",
          coupon_amount :0,
          is_cancelled :true,
          coupon_type :0
      };

      this.$store.dispatch('$_orders/$_tracking/cancelCoupon', payload).then(
        (response) => {
          return response.status;
        },
        (error) => {
          return error;
        },
      );
    },

    cancelOrder() {
      if (this.cancel_reason !== '' && Object.keys(this.$store.getters.getSession).length > 0) {
        if (this.cancel_reason === 0 && this.cancel_desc === '') {
          this.doNotification(3, 'Order cancellation failed', 'Please provide reason for cancellation');
        }
        else {
          this.pop_state = this.cancel_reason;
          setTimeout(() => {
           this.pop_state = false ;
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
          let eventPayload = {
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
              this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload2).then((response2) => {
                if (response2.status) {
                  that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
                  that.cancelToggle();
                  this.$store.dispatch('$_orders/fetchOngoingOrders');
                  that.place();
                } else {
                  that.doNotification(
                    2,
                    'Order cancellation failed',
                    'Could not cancel the order. Please contact Customer Care at 0709779779.'
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
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Price Request',
          //   eventLabel: name,
          //   eventValue: 14,
          // });
        }
      } catch (er) {
        // ...
      }
    },
    saveDetails() {
      let sessionData = this.$store.getters.getSession;
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
        }
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

    reCheckMQTTConnection() {
      if (!this.isMQTTConnected) {
        this.initiateMQTT();
      }
    },
    initiateMQTT(){
      if (this.tracking_data.rider.vendor_id !== 26) {
        this.$store.dispatch('$_orders/$_tracking/trackMQTT');
      }
      else {
        this.hide_vendors();
        this.clearVendorMarkers();
      }

    },
    shareETASms() {
      if (this.recipientPhone !== '' && this.recipientPhone.length > 9) {
        const payload = {};
        const track = `${window.location.origin}/external/tracking/${this.$route.params.order_no}`;
        const session = this.$store.getters.getSession;
        let userName = session[session.default].user_name;
        payload.phone = this.recipientPhone;
        payload.message = `Hi! ${userName} wants you to track their Sendy order here: ${track}`;

        this.$store.dispatch('$_orders/$_tracking/requestETASms', payload).then(
          (response) => {
            if (response.status === 200) {
              this.doNotification(1, 'Share ETA', 'SMS sent successfully.');
              this.setShareOption(false);
            } else {
              this.doNotification(2, 'Share ETA failed', 'Could not send ETA sms. Kindly retry.');
            }
          },
          (error) => {
            this.doNotification(2, 'Share ETA Error ', 'Check Internet connection and retry');
          }
        );
      } else {
        this.doNotification(2, 'Share ETA failed !', 'Please enter a valid phone number');
      }
    },
    setRiderLocationToStore() {
      if (Object.prototype.hasOwnProperty.call(this.tracking_data, 'rider')) {
        const payload = {};

        payload.rider_id = [this.tracking_data.rider.rider_id];
        this.$store.dispatch('$_orders/$_tracking/requestRiderLastPosition', payload).then(
          (response) => {
            if (response.status === 'true') {
              let riderOnlineData = response.partnerArray[0];
              const size = Object.keys(this.vendors).length;
              if (size > 0) {
                this.initiateMQTT();
              } else {
                riderOnlineData.overide_visible = true;
                this.$store.commit('$_orders/setVendorMarkers', riderOnlineData);
              }
            } else {
              this.initiateMQTT();
            }
          },
          (error) => {
            // ...
          }
        );
      }
    },
    orderETA() {
      if (Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id !== 26) {
          if (this.tracking_data.confirm_status === 0) {
            const confirmEta = this.tracking_data.eta_data.etc;
            const etaSplit = confirmEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(`${startEta} - ${endEta}`);
            this.setPickUpEta('');
            this.setDeliveryEta('');
          } else if (
            this.tracking_data.confirm_status === 1 &&
            this.tracking_data.delivery_status === 0
          ) {
            const pickUpEta = this.tracking_data.eta_data.etp;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const etaSplit = pickUpEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(`${startEta}-${endEta}`);
          } else if (this.tracking_data.delivery_status === 2) {
            const deliveryEta = this.tracking_data.eta_data.etd;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const pickedEta = this.tracking_data.eta_data.picked;
            const etaSplit = deliveryEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(moment(pickedEta, moment.ISO_8601).format('h:mm a'));
            this.setDeliveryEta(`${startEta}-${endEta}`);
          } else if (this.tracking_data.delivery_status === 3) {
            const deliveryEta = this.tracking_data.eta_data.delivered;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const pickedEta = this.tracking_data.eta_data.picked;


            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(moment(pickedEta, moment.ISO_8601).format('h:mm a'));
            this.setDeliveryEta(moment(deliveryEta, moment.ISO_8601).format('h:mm a'));
          } else {
            // ...
          }
        }
      }
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
    retrieveCancellationReasons(){
      this.$store.dispatch('$_orders/$_tracking/requestCancellationReasons').then(
        (response) => {
         if (response.status) {
           this.cancellation_reasons  = response.data ;
           this.cancellation_state = true ;
         }
         else {
            this.cancellation_state = false ;
         }
        },
        (error) => {
          this.cancellation_state = false ;
        }
      );
    },
    cancelBtnState(){
      if (this.tracking_data.delivery_status < 2 && this.user_state &&  this.cancellation_state) {
        return true ;
      }
      else {
        return false ;
      }
    },
    disablePop(){
      this.cancelToggle();
      this.pop_state = false ;
    },
    extendedDialog(){
      if (this.cancel_reason === 4 || this.pop_state === 5 ||this.pop_state === 13) {
        return false ;
      }
      else {
        return true ;
      }
    },
    interCountyInforBar(){
      let resp = false ;
      if (this.tracking_data !== undefined && Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id === 26) {
          resp = true ;
        }

      }
      return resp ;
    }
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/styles/info_window_component.css";
</style>
