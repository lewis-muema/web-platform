<template lang="html">
  <div>
    <div v-if="truckMoreInfo" class="truck-info-component">
      <transition name="fade" mode="out-in">
        <div v-if="!loading" class="infobar--outer">
          <div key="prime" class="infobar-content infobar--content-padded">
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
                  />
                  <span class="infor-top-bar-text">
                    Order Number :
                  </span>
                  <span>
                    {{ tracking_data.order_no }}
                  </span>
                </div>
              </el-col>
              <el-col :span="6" class="status-text">
                <div class="info-text-transform">
                  <img
                    src="https://images.sendyit.com/web_platform/tracking/status.svg"
                    alt=""
                    class="top-bar-img infobar-truck-img"
                  />
                  <span class="infor-top-bar-text"> Status :</span>
                  <span> {{ getStatus }} </span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-text-transform">
                  <div class="topbar-text">
                    <font-awesome-icon icon="wallet" class="top-bar-info infobar-truck-img" />
                    <span v-if="getStatus === 'Pending'">
                      <span
                        v-if="
                          'customer_min_amount' in tracking_data.package_details &&
                            !tracking_data.fixed_cost
                        "
                      >
                        <span class="infor-top-bar-text">
                          Minimum Cost :
                        </span>
                        <span>
                          {{ tracking_data.price_tier.currency }}
                          {{ tracking_data.package_details.customer_min_amount }}
                        </span>
                      </span>
                      <span v-else>
                        <span class="infor-top-bar-text">
                          Cost :
                        </span>
                        <span>
                          {{ tracking_data.price_tier.currency }} {{ tracking_data.amount }}
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span class="infor-top-bar-text">
                        Cost :
                      </span>
                      <span>
                        {{ tracking_data.price_tier.currency }} {{ tracking_data.amount }}
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
              <el-col :span="1" class="minimise-icon">
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
              <el-col :span="4" class="inforbar_left_scrollable">
                <div class="locations--item-scrollable">
                  <ul class="timeline inforbar_route_timeline">
                    <li>
                      <p class="info-text-transform infor-top-bar-text">
                        Pickup Location
                      </p>
                      <p>{{ tracking_data.path[0].name }}</p>
                    </li>

                    <li v-for="(val, index) in tracking_data.path" v-if="index > 0">
                      <p class="info-text-transform infor-top-bar-text">
                        Destination
                      </p>
                      <p>
                        {{ val.name }}
                      </p>
                    </li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="6" class="inforbar_order_content">
                <div class="tracking-loader-outer">
                  <div class="tracking-loader">
                    <div class="">
                      <img
                        src="https://images.sendyit.com/web_platform/tracking/checkmark.svg"
                        alt=""
                        class="infobar-truck-img"
                      />
                      <span class="info-text-transform infor-top-bar-text">
                        Type of order
                      </span>
                    </div>
                    <div class="tracking-loader-inner">
                      <img
                        :src="getVendorIcon(tracking_data.rider.vendor_id)"
                        alt=""
                        class="infobar-truck-img inforbar-vendor-icon"
                      />
                      <span class="info-text-transform">
                        {{ vendorName }}
                      </span>
                    </div>
                  </div>
                  <div class="tracking-loader" v-if="scheduled_time">
                    <div class="">
                      <img
                        src="https://images.sendyit.com/web_platform/tracking/calendar.svg"
                        alt=""
                        class="infobar-truck-img"
                      />
                      <span class="info-text-transform infor-top-bar-text">
                        Scheduled pick up time
                      </span>
                    </div>
                    <div class="tracking-loader-inner">
                      <span class="info-text-transform">
                        {{ tracking_data.date_time | moment }}
                      </span>
                    </div>
                  </div>

                  <!-- Show for truck orders  -->
                  <div class="" v-if="![1, 2, 3, 23, 21].includes(tracking_data.rider.vendor_id)">
                    <div class="tracking-loader">
                      <div class="">
                        <img
                          src="https://images.sendyit.com/web_platform/tracking/goods.svg"
                          alt=""
                          class="infobar-truck-img"
                        />
                        <span class="info-text-transform infor-top-bar-text">
                          Goods to be delivered
                        </span>
                      </div>
                      <div
                        v-if="'delivery_item' in tracking_data.package_details"
                        class="tracking-loader-inner"
                      >
                        <div v-if="tracking_data.package_details.delivery_item === ''">
                          Not Indicated
                        </div>
                        <div v-else>
                          {{ tracking_data.package_details.delivery_item }}
                        </div>
                      </div>
                      <div v-else class="tracking-loader-inner">
                        Not Indicated
                      </div>
                    </div>
                    <div class="tracking-loader">
                      <div class="">
                        <img
                          src="https://images.sendyit.com/web_platform/tracking/load_weight.svg"
                          alt=""
                          class="infobar-truck-img"
                        />
                        <span class="info-text-transform">
                          Weight of Load
                        </span>
                      </div>
                      <div
                        v-if="'load_weight' in tracking_data.package_details"
                        class="tracking-loader-inner"
                      >
                        {{ tracking_data.package_details.load_weight }}
                        {{ tracking_data.package_details.load_units }}
                      </div>
                      <div v-else class="tracking-loader-inner">
                        Not Indicated
                      </div>
                    </div>

                    <div class="tracking-loader">
                      <div class="">
                        <img
                          src="https://images.sendyit.com/web_platform/tracking/loader.svg"
                          alt=""
                          class="infobar-truck-img"
                        />
                        <span class="info-text-transform infor-top-bar-text">
                          Do you need a loader?
                        </span>
                      </div>
                      <div
                        v-if="tracking_data.package_details.additional_loader"
                        class="tracking-loader-inner"
                      >
                        Yes, {{ tracking_data.package_details.no_of_loaders }}
                      </div>
                      <div v-else class="tracking-loader-inner">
                        No
                      </div>
                    </div>
                  </div>

                  <!-- End for truck orders  -->
                </div>
              </el-col>
              <el-col :span="6">
                <div class="tracking-notes">
                  <div class="info-text-transform infor-top-bar-text">
                    <img
                      src="https://images.sendyit.com/web_platform/tracking/edit.svg"
                      alt=""
                      class="infobar-truck-img"
                    />
                    Notes
                  </div>
                  <div v-if="tracking_data.order_notes.length > 0" class="tracking-notes-inner">
                    <div v-for="(val, index) in tracking_data.order_notes" v-if="index >= 0">
                      <div v-if="val.msg === ''">
                        No notes provided.
                      </div>
                      <div v-else>
                        {{ val.msg }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="tracking-notes-inner">
                    No notes provided.
                  </div>
                </div>
              </el-col>
              <el-col :span="6" class="">
                <div class="">
                  <!-- Tracking Timeline for Small Vendors  -->

                  <div class="inforbar--item-scrollable">
                    <ul class="timeline inforbar_order_timeline">
                      <li>
                        <div class="">
                          <p class="infor-top-bar-text stagePassed">
                            {{ orderPlaced }}
                          </p>
                          <p class="eta_data">{{ tracking_data.eta_data.placed | moment }}</p>
                        </div>
                      </li>

                      <!-- Order Scheduled State -->

                      <li
                        id="timeline_right"
                        v-if="tracking_data.eta_data.scheduled"
                        v-bind:class="{
                          confirmedScheduled: true,
                        }"
                      >
                        <div class="">
                          <p class="infor-top-bar-text stagePassed">
                            Your Order has been scheduled
                          </p>
                          <p class="eta_data">{{ tracking_data.date_time | moment }}</p>
                        </div>
                      </li>

                      <!-- Pricing check for Truck Orders-->
                      <li
                        v-if="truck_orders.includes(tracking_data.rider.vendor_id)"
                        id="timeline_right"
                        v-bind:class="{ timelinePay: isPayed, payedReached: setPayed }"
                      >
                        <div class="">
                          <p class="infor-top-bar-text" v-bind:class="{ payedActive: setPayed }">
                            Price Confirmation
                          </p>
                          <div class="" v-if="getStatus === 'Pending'"></div>
                          <div v-else>
                            <div class="">
                              <div v-if="accType === 1" class="">
                                <p>
                                  Price has been confirmed to be
                                  {{ tracking_data.price_tier.currency }} {{ tracking_data.amount }}
                                </p>
                              </div>
                              <div v-else class="">
                                <div v-if="myRb <= 0">
                                  <p>
                                    Price has been confirmed to be
                                    {{ tracking_data.price_tier.currency }}
                                    {{ tracking_data.amount }}
                                  </p>
                                </div>
                                <div v-else>
                                  <p>
                                    Price has been confirmed to be
                                    {{ tracking_data.price_tier.currency }}
                                    {{ tracking_data.amount }}.Choose payment option below
                                  </p>
                                  <div class="">
                                    <el-radio v-model="paymentOption" label="1">
                                      M-Pesa
                                    </el-radio>
                                  </div>
                                  <div class="">
                                    <el-radio v-model="paymentOption" label="2">
                                      Card
                                    </el-radio>
                                  </div>
                                  <div class="info-payment-button">
                                    <input
                                      type="submit"
                                      class="button-primary button-tracking-payment"
                                      value="Make Payment"
                                      @click="takeMeToPayment()"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>

                      <!-- Order Confirmation State -->

                      <li
                        id="timeline_right"
                        v-bind:class="{
                          timelineConfirmed: isConfirmed,
                          confirmedExpressReached: setConfirmed,
                        }"
                      >
                        <div
                          class="infor-top-bar-text"
                          v-bind:class="{ confirmedActive: setConfirmed }"
                        >
                          <span v-if="tracking_data.confirm_status > 0">
                            <p class="stagePassed">
                              We have matched a {{ partnerName }} to your {{ packageName }}
                            </p>
                            <p class="eta_data">{{ confirmEta }}</p>
                          </span>
                          <span v-else>
                            <p class="stagePending">
                              We are finding a {{ partnerName }} for your {{ packageName }}
                            </p>
                            <p class="eta_data" :class="toConfirmationStateClass()">
                              {{ delayState }}
                            </p>
                          </span>
                        </div>
                      </li>

                      <!-- Order In-Transit State  -->
                      <li
                        id="timeline_right"
                        v-bind:class="{
                          timelinePicked: isPicked,
                          pickedExpressReached: setPicked,
                        }"
                      >
                        <div class="infor-top-bar-text" v-bind:class="{ pickedActive: setPicked }">
                          <span v-if="tracking_data.delivery_status > 0">
                            <p class="stagePassed">
                              Your {{ partnerName }} {{ tracking_data.rider.rider_name }} has picked
                              your
                              {{ packageName }}
                            </p>
                            <p class="eta_data">{{ pickUpEta }}</p>
                          </span>
                          <span v-else>
                            <p class="stagePending">
                              Your {{ partnerName }} is on the way to pick your {{ packageName }}
                            </p>
                            <p class="eta_data">{{ pickUpEta }}</p>
                          </span>
                        </div>
                      </li>

                      <!-- Order towards Delivery Points State -->
                      <li
                        id="timeline_right"
                        v-for="(val, index) in tracking_data.path"
                        v-if="index > 0"
                        :class="toDeliveryTypeClass(val, index)"
                      >
                        <div
                          class="infor-top-bar-text"
                          v-bind:class="{ deliveredActive: setDelivered }"
                        >
                          <span v-if="tracking_data.delivery_status < 3 && !val.visited">
                            <p class="stagePending">
                              Your {{ packageName }} is on the way to {{ val.name }}
                            </p>
                          </span>
                          <span v-else>
                            <p class="stagePassed">
                              Your {{ packageName }} has been delivered to {{ val.name }}
                            </p>
                          </span>
                        </div>
                      </li>

                      <!-- Order Delivery State-->
                      <li
                        id="timeline_right"
                        v-bind:class="{
                          timelineDeliveredExpress: setComplete,
                        }"
                      >
                        <div
                          class="infor-top-bar-text"
                          v-bind:class="{ deliveredActive: setComplete }"
                        >
                          <span>
                            <p v-bind:class="{ stagePassed: setComplete }">
                              Delivery complete
                            </p>
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div v-if="getStatus === 'Pending'" class="save-option">
              <el-row
                :gutter="20"
                class="infobar-content infobar--truck-item  infobar--item-truck-bordered-top infobar--item-truck-cancel"
              >
                <!-- <el-col :span="6" v-bind:class="{ saveDetailsDisable: isSaved}">
                <div class="info-text-transform info-text-cursor " @click="saveDetails()">
                  <img src="https://images.sendyit.com/web_platform/tracking/save.svg" alt="" class="infobar-truck-img">
                  <span> Save Details</span>
                </div>
              </el-col> -->
                <el-col :span="6" class="cancel-text-option">
                  <div
                    v-if="tracking_data.delivery_status < 2 && user_state"
                    class="info-text-transform info-text-cursor "
                    @click="canceldialog()"
                  >
                    <i class="el-icon-circle-close top-bar-info" />
                    Cancel Order
                  </div>
                </el-col>
              </el-row>
            </div>

            <div v-if="getStatus !== 'Pending'" class="rider-info infobar--item-truck-bordered-top">
              <el-row
                :gutter="20"
                class="infobar-content infobar--truck-item   infobar--item-truck-options"
              >
                <el-col :span="8">
                  <div class="">
                    <img class="rimg rimg-disp" :src="tracking_data.rider.rider_photo" />
                    <span>
                      {{ tracking_data.rider.rider_name }} {{ tracking_data.rider.rider_phone }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="share-option">
                    <!-- <img
                      class="rimg rimg-disp"
                      :src="tracking_data.rider.rider_photo"
                    > -->
                    <span>
                      {{ tracking_data.rider.vehicle_name }} {{ tracking_data.rider.number_plate }}
                    </span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="share-option" @click="sharedialog()">
                    <i class="el-icon-share top-bar-info" />
                    SHARE
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div>
      <transition name="fade" mode="out-in">
        <div v-if="!truckMoreInfo">
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
                    Minimum Amount : {{ tracking_data.price_tier.currency }}
                    {{ tracking_data.package_details.customer_min_amount }}
                  </div>
                  <div v-else>
                    {{ tracking_data.price_tier.currency }} {{ tracking_data.amount }}
                  </div>
                </div>
                <div v-else>{{ tracking_data.price_tier.currency }} {{ tracking_data.amount }}</div>
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
                  v-if="tracking_data.delivery_status < 2 && user_state"
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
      <transition name="fade" mode="out-in">
        <div class="">
          <el-dialog :visible.sync="cancelOption" class="cancelOptions">
            <div class="">
              <div class="cancel-reason-option">
                Cancel this order?
              </div>
              <div class="cancel-reason-option">
                You can place another one at any time.
              </div>
            </div>
            <div class="cancel-reason-text">
              <div class="">
                <el-radio v-model="cancel_reason" label="4">
                  I placed the wrong locations
                </el-radio>
              </div>
              <div class="">
                <el-radio v-model="cancel_reason" label="5">
                  My order is not ready
                </el-radio>
              </div>
              <div class="">
                <el-radio v-model="cancel_reason" label="7">
                  No driver has been allocated
                </el-radio>
              </div>
              <div class="">
                <el-radio v-model="cancel_reason" label="8">
                  I placed this order twice
                </el-radio>
              </div>
            </div>
            <div class="action--slide-desc">
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelOrder()"
              >
                Yes
              </button>
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelToggle()"
              >
                No
              </button>
            </div>
          </el-dialog>

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
</template>

<script>
import { mapGetters } from 'vuex';

const moment = require('moment');

export default {
  name: 'InfoWindow',
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
      paymentOption: '',
      truckMoreInfo: true,
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
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      vendors: '$_orders/getVendors',
    }),
    initiateOrderData() {
      this.setRiderLocationToStore();
      this.checkVendorName();
      this.checkScheduler();
      this.setTimeLineIconState();
      this.confirmUser();
      this.orderETA();
    },
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
    orderPlaced() {
      let text = 'Your order has been received';

      return text;
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
    delayState() {
      let deliveryState = this.tracking_data.eta_data.delayed;
      if (deliveryState) {
        return `Sorry, we haven't found a ${this.partnerName} for your ${
          this.packageName
        }. We are working to find you one as soon as possible`;
      }
      return this.confirmEta;
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

    tracking_data(data) {
      if (data.confirm_status === 1) {
        this.reCheckMQTTConnection();
      }
      this.initiateOrderData();
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/setTrackedOrder', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.checkRunningBalance();
    this.initiateOrderData();
  },
  created() {
    this.order_number = this.$route.params.order_no;
    this.checkPreviousRoute();
  },
  methods: {
    moment() {
      return moment();
    },
    cancelChange(reason) {
      switch (reason) {
        case 4: {
          this.cancel_desc = 'I placed the wrong locations';
          break;
        }
        case 5: {
          this.cancel_desc = 'My order is not ready';
          break;
        }
        case 7: {
          this.cancel_desc = 'No driver has been allocated';
          break;
        }
        case 8: {
          this.cancel_desc = 'I placed this order twice';
          break;
        }
        default:
      }
    },
    checkPreviousRoute() {
      if (this.$route.path === `/external/tracking/${this.$route.params.order_no}`) {
        this.truckMoreInfo = false;
        this.externalTracking = true;
      }
    },
    poll(from) {
      const that = this;
      this.$store
        .dispatch('$_orders/$_tracking/getTrackingData', { order_no: from })
        .then(response => {
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
              }, 15000);
            }
          } else {
            that.place();
          }
          that.loading = false;
        });
    },
    cancelToggle() {
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
    },
    maximiseInfoDetails() {
      this.truckMoreInfo = true;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/${id}.svg`;
    },
    checkVendorName() {
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
    },
    checkScheduler() {
      let schedulerRange = moment().add(2, 'h');
      let orderPlaced = moment(this.tracking_data.date_time);
      let check = orderPlaced.diff(schedulerRange);

      if (check > 0) {
        this.scheduled_time = true;
      } else {
        this.scheduled_time = false;
      }
    },
    setTimeLineIconState() {
      if (
        Object.prototype.hasOwnProperty.call(this.tracking_data.eta_data, 'scheduled') &&
        this.tracking_data.eta_data.scheduled
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
      } else {
        if (this.tracking_data.confirm_status === 0) {
          this.isPayed = false;
          this.setDelivered = false;
          this.isDelivered = false;
          this.isPicked = false;
          this.setPicked = false;
          this.setConfirmed = true;
          this.setPayed = true;
          this.setComplete = false;
          this.setScheduled = false;
        } else if (
          this.tracking_data.confirm_status === 1 &&
          this.tracking_data.delivery_status === 0
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
        } else if (this.tracking_data.delivery_status === 2) {
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
        } else {
        }
      }
    },
    confirmUser() {
      const session = this.$store.getters.getSession;
      let sessionUserEmail = session[session.default].user_email;
      let orderUserEmail = this.tracking_data.user.email;

      if (sessionUserEmail === orderUserEmail) {
        this.user_state = true;
      } else {
        this.user_state = false;
      }
    },
    minimiseInfoDetails() {
      this.truckMoreInfo = false;
    },
    checkRunningBalance() {
      const session = this.$store.getters.getSession;
      const payload = {
        cop_id: session[session.default].cop_id,
        user_phone: session[session.default].user_phone,
      };
      this.$store.dispatch('$_orders/$_tracking/runningBalance', payload).then(response => {
        if (response.status) {
          this.myRb = response.running_balance;
          this.accType = response.payment_plan;
        }
      });
    },
    takeMeToPayment() {
      if (this.paymentOption === 1) {
        this.$router.push('/payment/mpesa');
      } else if (this.paymentOption === 2) {
        this.$router.push('/payment/card');
      } else {
        this.doNotification('2', 'Payment Failure', 'Choose a Payment Option.');
      }
    },
    canceldialog() {
      this.cancelOption = true;
    },
    place() {
      if (this.$route.name !== 'tracking_external') {
        this.$router.push('/orders');
      } else {
        this.$router.push('/');
      }
    },
    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },
    cancelOrder() {
      if (this.cancel_reason !== '') {
        const payload = {
          order_no: this.tracking_data.order_no,
          cancel_reason_id: this.cancel_reason,
          reason_description: this.cancel_desc,
          client_type: this.$store.getters.getSession.default,
        };
        const that = this;
        this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then(response => {
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
            this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload2).then(response2 => {
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
      } else {
        this.doNotification(3, 'Order cancellation failed', 'Please select cancellation reason.');
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
        response => {
          if (response.status) {
            this.doNotification(1, 'Save Details', 'Order Details saved successfully.');
            this.isSaved = true;
          } else {
            this.doNotification(3, 'Save Details failed', 'Could not save details. Kindly retry.');
          }
        },
        error => {
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
        this.$store.dispatch('$_orders/$_tracking/trackMQTT');
      }
    },
    sharedialog() {
      this.shareOption = true;
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
          response => {
            if (response.status === 200) {
              this.doNotification(1, 'Share ETA', 'SMS sent successfully.');
              this.shareOption = false;
            } else {
              this.doNotification(2, 'Share ETA failed', 'Could not send ETA sms. Kindly retry.');
            }
          },
          error => {
            this.doNotification(2, 'Share ETA Error ', 'Check Internet connection and retry');
          }
        );
      } else {
        this.doNotification(2, 'Share ETA failed !', 'Please enter a valid phone number');
      }
    },
    setRiderLocationToStore() {
      const payload = {};
      payload.rider_id = [this.tracking_data.rider.rider_id];
      this.$store.dispatch('$_orders/$_tracking/requestRiderLastPosition', payload).then(
        response => {
          if (response.status === 'true') {
            let riderOnlineData = response.partnerArray[0];
            const size = Object.keys(this.vendors).length;
            if (size > 0) {
              this.$store.dispatch('$_orders/$_tracking/trackMQTT');
            } else {
              riderOnlineData.overide_visible = true;
              this.$store.commit('$_orders/setVendorMarkers', riderOnlineData);
            }
          } else {
            this.$store.dispatch('$_orders/$_tracking/trackMQTT');
          }
        },
        error => {
          // ...
        }
      );
    },
    orderETA() {
      if (this.tracking_data.confirm_status === 0) {
        const confirmEta = this.tracking_data.eta_data.etc;
        const etaSplit = confirmEta.split('to');
        const start = etaSplit[0].replace(/\s+/g, '');
        const end = etaSplit[1].replace(/\s+/g, '');

        const startEta = moment(start, moment.ISO_8601).format('h:mm a');
        const endEta = moment(end, moment.ISO_8601).format('h:mm a');

        this.confirmEta = `${startEta} - ${endEta}`;

        this.pickUpEta = '';
        this.deliveryEta = '';
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

        this.pickUpEta = `${startEta}-${endEta}`;
        this.confirmEta = moment(confirmedEta, moment.ISO_8601).format('h:mm a');
      } else if (this.tracking_data.delivery_status === 2) {
        const deliveryEta = this.tracking_data.eta_data.etd;
        const confirmedEta = this.tracking_data.eta_data.confirmed;
        const pickedEta = this.tracking_data.eta_data.picked;
        const etaSplit = deliveryEta.split('to');
        const start = etaSplit[0].replace(/\s+/g, '');
        const end = etaSplit[1].replace(/\s+/g, '');

        const startEta = moment(start, moment.ISO_8601).format('h:mm a');
        const endEta = moment(end, moment.ISO_8601).format('h:mm a');

        this.deliveryEta = `${startEta}-${endEta}`;
        this.confirmEta = moment(confirmedEta, moment.ISO_8601).format('h:mm a');
        this.pickUpEta = moment(pickedEta, moment.ISO_8601).format('h:mm a');
      } else if (this.tracking_data.delivery_status === 3) {
        const deliveryEta = this.tracking_data.eta_data.delivered;
        const confirmedEta = this.tracking_data.eta_data.confirmed;
        const pickedEta = this.tracking_data.eta_data.picked;

        this.deliveryEta = moment(deliveryEta, moment.ISO_8601).format('h:mm a');
        this.confirmEta = moment(confirmedEta, moment.ISO_8601).format('h:mm a');
        this.pickUpEta = moment(pickedEta, moment.ISO_8601).format('h:mm a');
      } else {
        // ...
      }
    },
    toDeliveryTypeClass(val, index) {
      let nextPoint = this.tracking_data.path[index - 1].visited;
      if (this.tracking_data.delivery_status >= 2) {
        if (val.visited) {
          return ['timelineDeliveredExpress'];
        } else {
          if (nextPoint) {
            return ['deliveryEnrouteReached'];
          }
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
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/styles/info_window_component.css";
</style>
