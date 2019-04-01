<template lang="html">
  <div>
    <div
      v-if="this.truckMoreInfo"
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
              <el-col :span="6">
                <div class="info-text-transform">
                  <img
                    src="https://images.sendyit.com/web_platform/tracking/status.svg"
                    alt=""
                    class="top-bar-img"
                  >
                  <span class="infor-top-bar-text" > Status :</span>
                  <span> {{ getStatus }} </span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="info-text-transform">
                  <div class="topbar-text">
                    <font-awesome-icon
                      icon="wallet"
                      class="top-bar-info"
                    />
                    <span v-if="this.getStatus === 'Pending'">
                      <span
                        v-if="
                          'customer_min_amount' in this.tracking_data.package_details &&
                            !this.tracking_data.fixed_cost
                        "
                      >
                      <span class="infor-top-bar-text">
                          Minimum Cost :
                      </span>
                      <span>
                        KES  {{ tracking_data.package_details.customer_min_amount }}
                      </span>
                      </span>
                      <span v-else>
                        <span class="infor-top-bar-text">
                          Cost :
                        </span>
                        <span>
                        KES  {{ tracking_data.amount }}
                        </span>
                      </span>
                    </span>
                    <span v-else>
                      <span class="infor-top-bar-text">
                        Cost :
                      </span>
                      <span>
                      KES  {{ tracking_data.amount }}
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
              <el-col :span="1">
                <div
                  v-if="this.truckMoreInfo"
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
              <el-col :span="5">
                <div class="inforbar--item-scrollable">
                  <ul class="timeline inforbar_route_timeline">
                    <li>
                      <p class="info-text-transform infor-top-bar-text">
                        Pickup Location
                      </p>
                      <p>{{ tracking_data.path[0].name }}</p>
                    </li>

                    <li>
                      <p class="info-text-transform infor-top-bar-text">
                        Destination
                      </p>
                      <p
                        v-for="(val, index) in tracking_data.path"
                        v-if="index > 0"
                      >
                        {{ val.name }}
                      </p>
                    </li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="5">
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
                    <div
                      class="tracking-loader-inner"
                    >
                    <img
                      :src="getVendorIcon(this.tracking_data.rider.vendor_id)"
                      alt=""
                      class="infobar-truck-img"
                    >
                    <span class="info-text-transform">
                      {{this.vendorName }}
                    </span>
                    </div>
                  </div>
                  <div class="tracking-loader" v-if = "this.scheduled_time">
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
                    <div
                      class="tracking-loader-inner"
                    >
                    <span class="info-text-transform">
                      {{tracking_data.date_time | moment }}
                    </span>
                    </div>
                  </div>

                  <!-- Show for truck orders  -->
                  <div class="" v-if="! [1,2,3,23].includes(tracking_data.rider.vendor_id)">
                  <div class="tracking-loader">
                    <div class="">
                      <img
                        src="https://images.sendyit.com/web_platform/tracking/goods.svg"
                        alt=""
                        class="infobar-truck-img"
                      >
                      <span class="info-text-transform infor-top-bar-text">
                        Goods to be delivered
                      </span>
                    </div>
                    <div
                      v-if="'delivery_item' in tracking_data.package_details"
                      class="tracking-loader-inner"
                    >
                      {{ tracking_data.package_details.delivery_item }}
                    </div>
                    <div
                      v-else
                      class="tracking-loader-inner"
                    >
                      Not Indicated
                    </div>
                  </div>
                  <div class="tracking-loader">
                    <div class="">
                      <img
                        src="https://images.sendyit.com/web_platform/tracking/load_weight.svg"
                        alt=""
                        class="infobar-truck-img"
                      >
                      <span class="info-text-transform infor-top-bar-text">
                        Load Weight
                      </span>
                    </div>
                    <div
                      v-if="'load_weight' in tracking_data.package_details"
                      class="tracking-loader-inner"
                    >
                      {{ tracking_data.package_details.load_weight }}
                      {{ tracking_data.package_details.load_units }}
                    </div>
                    <div
                      v-else
                      class="tracking-loader-inner"
                    >
                      Not Indicated
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
                        Do you need a loader?
                      </span>
                    </div>
                    <div
                      v-if="tracking_data.package_details.additional_loader"
                      class="tracking-loader-inner"
                    >
                      Yes, {{ tracking_data.package_details.no_of_loaders }}
                    </div>
                    <div
                      v-else
                      class="tracking-loader-inner"
                    >
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
                    >
                    Notes
                  </div>
                  <div
                    v-if="tracking_data.order_notes.length > 0"
                    class="tracking-notes-inner"
                  >
                    <div
                      v-for="(val, index) in tracking_data.order_notes"
                      v-if="index >= 0"
                    >
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
              <el-col :span="6" class="infobar--item-truck-cont-bordered">
                <div class="">
                  <div class="inforbar--item-scrollable">

                    <ul class="timeline inforbar_order_timeline">
                      <li>
                        <div class="">
                          <p class="info-text-transform infor-top-bar-text">
                            Order Placed
                          </p>
                          <div v-if="!this.tracking_data.fixed_cost">
                            <p>
                              Your order has been received and we shall notify you on the actual
                              cost shortly
                            </p>
                          </div>
                          <div v-else>
                            <p>
                              Your order has been received.The Order cost is KES
                              {{ tracking_data.amount}}
                            </p>

                            <p />
                          </div>

                          <p>{{ tracking_data.date_time | moment }}</p>
                        </div>
                      </li>

                      <!-- Pricing check -->
                      <li  v-if="(this.truck_orders.includes(tracking_data.rider.vendor_id))" id="timeline_right" v-bind:class="{timelinePay :isPayed,payedReached :setPayed }">
                        <div class="">
                          <p class="info-text-transform infor-top-bar-text" v-bind:class="{payedActive :setPayed }">
                            Price Confirmation
                          </p>
                          <div class="" v-if="this.getStatus === 'Pending'">

                          </div>
                          <div v-else>
                            <div class="">
                              <div
                                v-if="this.accType === 1"
                                class=""
                              >
                                <p>Price has been confirmed to be Ksh {{ tracking_data.amount }}</p>
                              </div>
                              <div
                                v-else
                                class=""
                              >
                                <div v-if="this.myRb <= 0">
                                  <p>Price has been confirmed to be Ksh {{ tracking_data.amount }}</p>
                                </div>
                                <div v-else>
                                  <p>
                                    Price has been confirmed to be Ksh
                                    {{ tracking_data.amount }}.Choose payment option below
                                  </p>
                                  <div class="">
                                    <el-radio
                                      v-model="paymentOption"
                                      label="1"
                                    >
                                      M-Pesa
                                    </el-radio>
                                  </div>
                                  <div class="">
                                    <el-radio
                                      v-model="paymentOption"
                                      label="2"
                                    >
                                      Card
                                    </el-radio>
                                  </div>
                                  <div class="info-payment-button">
                                    <input
                                      type="submit"
                                      class="button-primary button-tracking-payment"
                                      value="Make Payment"
                                      @click="takeMeToPayment()"
                                    >
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <!-- Confirmed -->

                      <li  id= "timeline_right" v-bind:class="{timelineConfirmed :isConfirmed ,confirmedReached :setConfirmed }">
                        <div class="">
                          <p class="info-text-transform infor-top-bar-text" v-bind:class="{confirmedActive :setConfirmed }">
                            Order Confirmed
                          </p>
                           <div  v-if="tracking_data.delivery_status > 0">
                             <p>
                              Your Order has been confirmed by {{ tracking_data.rider.rider_name  }}
                            </p>
                            <p>{{this.confirm_eta}}</p>
                           </div>
                           <div  v-else>
                             <p>{{this.confirm_eta}}</p>
                           </div>
                        </div>
                      </li>

                      <!-- In Transit  -->
                      <li id="timeline_right" v-bind:class="{ timelinePicked : isPicked , pickedReached :setPicked}">
                        <div class="">
                          <p class="info-text-transform infor-top-bar-text" v-bind:class="{pickedActive :setPicked }">
                            Order Picked
                          </p>
                          <p>{{this.pick_up_eta}} </p>
                        </div>
                      </li>

                      <!-- Delivered -->
                      <li id="timeline_right" v-bind:class="{timelineDelivered :isDelivered ,deliveredReached :setDelivered}">
                        <div class="">
                          <p class="info-text-transform infor-top-bar-text" v-bind:class="{deliveredActive :setDelivered }">
                            Delivered
                          </p>
                          <p>{{this.delivery_eta}}</p>
                        </div>
                      </li>
                    </ul>

                  </div>
                </div>
              </el-col>
            </el-row>
            <div
              v-if="this.getStatus === 'Pending'"
              class="save-option"
            >
              <el-row
                :gutter="20"
                class="infobar-content infobar--truck-item  infobar--item-truck-bordered-top infobar--item-truck-cancel"
              >
                <!-- <el-col :span="6">
                <div class="">
                  <img src="https://images.sendyit.com/web_platform/tracking/save.svg" alt="" class="infobar-truck-img">
                  <span> SAVE DETAILS </span>
                </div>
              </el-col> -->
                <el-col :span="6" class="cancel-text-option">
                  <div
                    v-if="tracking_data.delivery_status < 2"
                    class="info-text-transform info-text-cursor "
                    @click="canceldialog()"
                  >
                    <i class="el-icon-circle-close top-bar-info" />
                    Cancel Order
                  </div>
                </el-col>
              </el-row>
            </div>

            <div
              v-if="this.getStatus !== 'Pending'"
              class="rider-info"
            >
              <el-row
                :gutter="20"
                class="infobar-content infobar--truck-item  infobar--item-truck-bordered-top infobar--item-truck-options"
              >
                <el-col :span="8">
                  <div class="">
                    <img
                      class="rimg rimg-disp"
                      :src="tracking_data.rider.rider_photo"
                    >
                    <span>
                      {{ tracking_data.rider.rider_name }}    {{ tracking_data.rider.rider_phone }}
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
                  <div class="share-option">
                    <i class="el-icon-share top-bar-info" />
                    SHARE
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-dialog
            :visible.sync="cancelOption"
            class="cancelOptions"
          >
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
                <el-radio
                  v-model="cancel_reason"
                  label="4"
                >
                  I placed the wrong locations
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="5"
                >
                  My order is not ready
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="7"
                >
                  No driver has been allocated
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="8"
                >
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
        </div>
      </transition>
    </div>

    <div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div v-if="!this.truckMoreInfo">
          <div
            v-if="!loading"
            class="mobile-inforbar--outer"
          >
            <div class="mobile-inforbar--inner">
              <div class="mobile-inforbar-details">
                <div class="mobile-inforbar-img">
                  <img
                    :src="tracking_data.rider.rider_photo"
                    class="mobile-img"
                  >
                </div>
                <div class="mobile-inforbar-rider-name">
                  <div class="mobile-rider-name-inner">
                    <span class="mobile-rider-name">
                      {{ tracking_data.rider.rider_name }}
                    </span>
                    <span class="">
                      {{ tracking_data.rider.rider_phone }}
                    </span>
                  </div>
                  <div class="">
                    {{ tracking_data.rider.vehicle_name }} {{ tracking_data.rider.number_plate }}
                  </div>
                </div>
              </div>
              <div class="">
                <div class="mobile-order-amount">
                  <div
                    v-if="this.getStatus === 'Pending'"
                    class=""
                  >
                    <div
                      v-if="
                        [20].includes(tracking_data.rider.vendor_id) &&
                          'customer_min_amount' in this.tracking_data.package_details &&
                          !this.tracking_data.fixed_cost
                      "
                    >
                      Minimum Amount : KES
                      {{ tracking_data.package_details.customer_min_amount }}
                    </div>
                    <div v-else>
                      Cost : KES {{ tracking_data.amount }}
                    </div>
                  </div>
                  <div v-else>
                    Cost: KES {{ tracking_data.amount }}
                  </div>
                </div>
                <div class="mobile-order-status">
                  Status : {{ getStatus }}
                </div>
                <div class="">
                  <div
                    v-if=""
                    class="infobar--actions-hover"
                    @click="canceldialog()"
                  >
                    <div class="infobar--actions-icon">
                      <i class="el-icon-circle-close-outline" />
                      <span class="infobar--actions-text">
                        Cancel Order
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!loading"
            class="infobar--outer exceed_mobile"
          >
            <div class="infobar--content infobar--content-padded">
              <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
                <img
                  class="rimg"
                  :src="tracking_data.rider.rider_photo"
                >
              </div>
              <div class="infobar--content infobar--item infobar--driver infobar--item-bordered">
                <div
                  v-if="tracking_data.confirm_status > 0"
                  class="infobar--driver-details"
                >
                  <div class="">
                    {{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}
                  </div>
                  <div class="">
                    {{ tracking_data.rider.vehicle_name }} {{ tracking_data.rider.number_plate }}
                  </div>
                </div>
                <div
                  v-else
                  class="infobar--driver-details"
                >
                  <div class="">
                    {{ tracking_data.description_head }}
                  </div>
                  <div class="">
                    {{ tracking_data.marketing_message }}
                  </div>
                </div>
              </div>
              <div
                class="infobar--content infobar--item infobar--order infobar--item-bordered infobar--order-align"
              >
                <div
                  v-if="this.getStatus === 'Pending'"
                  class=""
                >
                  <div
                    v-if="
                      [20].includes(tracking_data.rider.vendor_id) &&
                        'customer_min_amount' in this.tracking_data.package_details &&
                        !this.tracking_data.fixed_cost
                    "
                  >
                    Minimum Amount : KES
                    {{ tracking_data.package_details.customer_min_amount }}
                  </div>
                  <div v-else>
                    KES {{ tracking_data.amount }}
                  </div>
                </div>
                <div v-else>
                  KES {{ tracking_data.amount }}
                </div>
                <div class="">
                  <div class="">
                    {{ tracking_data.order_no }}
                  </div>
                </div>
              </div>

              <div
                v-if="[1, 23].includes(tracking_data.rider.vendor_id)"
                class="infobar--content infobar--item infobar--status infobar--item-bordered"
              >
                <el-steps
                  :space="200"
                  :active="this.getStatusCode"
                  finish-status="success"
                  style="font-size:10px !important"
                >
                  <el-step
                    title="Rider allocation"
                    :description="this.confirm_eta"
                  />
                  <el-step
                    title="Pick up"
                    :description="this.pick_up_eta"
                  />
                  <el-step
                    title="Delivery"
                    :description="this.delivery_eta"
                  />
                </el-steps>
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
                  v-if="tracking_data.delivery_status < 2"
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
          <el-dialog
            :visible.sync="cancelOption"
            class="cancelOptions"
          >
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
                <el-radio
                  v-model="cancel_reason"
                  label="4"
                >
                  I placed the wrong locations
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="5"
                >
                  My order is not ready
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="7"
                >
                  No driver has been allocated
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="8"
                >
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
      pick_up_eta: 'Awaiting Confirmation',
      delivery_eta: 'Awaiting Pickup',
      confirm_eta: '',
      scheduled_time : false,
      isConfirmed : false ,
      isPicked : false ,
      isDelivered : false ,
      setConfirmed: false,
      setPicked:false,
      setDelivered:false,
      setPayed : false ,
      vendorName : '',
      truck_orders : [20],
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/get_tracking_data',
      tracked_order: '$_orders/$_tracking/get_tracked_order',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
    }),
    order_eta() {
      this.checkVendorName();
      if (this.tracking_data.confirm_status === 0) {
        this.setPayed = false ;
        this.isPayed = true ;
        this.setConfirmed = true ;
        const confirm_eta = this.tracking_data.eta_data.etc;
        const eta_split = confirm_eta.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const start_eta = moment(start, moment.ISO_8601).format('h:mm a');
        const end_eta = moment(end, moment.ISO_8601).format('h:mm a');

        this.confirm_eta = `${start_eta}-${end_eta}`;
        this.pick_up_eta = 'Awaiting Confirmation';
        this.delivery_eta = 'Awaiting Pickup';

      } else if (this.tracking_data.confirm_status === 1) {
        this.setConfirmed = false;
        this.setPicked = true ;
        this.isConfirmed = true ;
        this.isPayed = true ;
        const pick_up_eta = this.tracking_data.eta_data.etp;
        const confirmed_eta = this.tracking_data.eta_data.confirmed;
        const eta_split = pick_up_eta.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const start_eta = moment(start, moment.ISO_8601).format('h:mm a');
        const end_eta = moment(end, moment.ISO_8601).format('h:mm a');

        this.pick_up_eta = `${start_eta}-${end_eta}`;
        this.confirm_eta = moment(confirmed_eta, moment.ISO_8601).format('h:mm a');
      } else if (this.tracking_data.delivery_status === 2) {
        this.setPicked = false;
        this.setDelivered = true ;
        this.isConfirmed = true ;
        this.isPayed = true ;
        this.isPicked = true ;
        const delivery_eta = this.tracking_data.eta_data.etd;
        const confirmed_eta = this.tracking_data.eta_data.confirmed;
        const picked_eta = this.tracking_data.eta_data.picked;
        const eta_split = delivery_eta.split('to');
        const start = eta_split[0].replace(/\s+/g, '');
        const end = eta_split[1].replace(/\s+/g, '');

        const start_eta = moment(start, moment.ISO_8601).format('h:mm a');
        const end_eta = moment(end, moment.ISO_8601).format('h:mm a');

        this.delivery_eta = `${start_eta}-${end_eta}`;
        this.confirm_eta = moment(confirmed_eta, moment.ISO_8601).format('h:mm a');
        this.pick_up_eta = moment(picked_eta, moment.ISO_8601).format('h:mm a');
      } else if (this.tracking_data.delivery_status === 3){
        this.setDelivered = false;
        this.isDelivered = true ;
        this.isConfirmed = true ;
        this.isPayed = true ;
        this.isPicked = true ;
      }
       else {
      }
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
  },
  watch: {
    '$route.params.order_no': function trackedOrder(from) {
      this.order_number = from;
      this.loading = true;
      this.$store.commit('$_orders/$_tracking/set_tracked_order', from);
      this.poll(from);
      this.order_eta();
    },

    tracking_data(data) {
      if (data.confirm_status === 1) {
        this.reCheckMQTTConnection();
      }
      this.order_eta();
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/set_tracked_order', this.$route.params.order_no);
    this.$store.dispatch('$_orders/$_tracking/trackMQTT');
    this.poll(this.$route.params.order_no);
    this.checkRunningBalance();
    this.order_eta();
  },
  created() {
    this.order_number = this.$route.params.order_no;
    console.log('Tracking',this.tracking_data);
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
    poll(from) {
      const that = this;
      this.$store
        .dispatch('$_orders/$_tracking/get_tracking_data', { order_no: from })
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
      this.checkScheduler();
    },
    getVendorIcon(id){
      return `https://images.sendyit.com/web_platform/vendor_type/side/${id}.svg`;

    },
    checkVendorName(){
      if(this.tracking_data.rider.vendor_name === 'Bike' ){
          this.vendorName = 'Express';
      }
      else if (this.tracking_data.rider.vendor_name === 'Economy Bike' ) {
          this.vendorName = 'Standard';
      }
      else{
        this.vendorName = this.tracking_data.rider.vendor_name;
      }
    },
    checkScheduler(){
      let schedulerRange = moment().add(2, 'h');
      let orderPlaced = moment(this.tracking_data.date_time);
      let check = orderPlaced.diff(schedulerRange);

      if(check > 0){
        this.scheduled_time = true ;

      }else{
        this.scheduled_time = false ;
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
      this.$store.dispatch('$_orders/$_tracking/running_balance', payload).then((response) => {
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
      const payload = {
        order_no: this.tracking_data.order_no,
        cancel_reason_id: this.cancel_reason,
        reason_description: this.cancel_desc,
        client_type: this.$store.getters.getSession.default,
      };
      const that = this;
      this.$store.dispatch('$_orders/$_tracking/cancel_order', payload).then((response) => {
        if (response.status) {
          that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
          that.cancelToggle();
          this.$store.dispatch('$_orders/fetch_ongoing_orders');
          that.place();
        } else {
          const payload2 = {
            order_no: that.$route.params.order_no,
            cancel_reason_id: 4,
            reason_description: 'I placed the wrong locations',
            client_type: that.$store.getters.getSession.default,
          };
          this.$store.dispatch('$_orders/$_tracking/cancel_order', payload2).then((response2) => {
            if (response2.status) {
              that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
              that.cancelToggle();
              this.$store.dispatch('$_orders/fetch_ongoing_orders');
              that.place();
            } else {
              that.doNotification(
                '3',
                'Order cancellation failed',
                'Could not cancel the order. Please contact Customer Care at 0709779779.',
              );
            }
          });
        }
      });
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
  },
};
</script>

<style lang="css">
@media only screen and (max-width: 599px){
  .exceed_mobile{
    display: none !important;
  }
  .mobile-inforbar--outer{
    display: flex !important;
  }
  .cancelOptions > div {
    margin-top: 6em !important;
    width: 95% !important;
  }
  .cancel-reason-text{
    padding-left: 25% !important;
  }
}
.mobile-inforbar--outer
{
  display: none;
  position: fixed;
  bottom: 5px;
  width: 90%;
  margin: 0 5%;
  background-color: #fff;
  color: #555;
  font-size: 13px;
  max-height: 100px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  border-radius: 3px;
  overflow: scroll;
}
.infobar--outer
{
  display: flex;
  position: fixed;
  bottom: 20px;
  width: 90%;
  margin: 0 5%;
  background-color: #fff;
  color: #555;
  font-size: 13px;
  min-height: 90px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  border-radius: 3px;

}
.infobar--content
{
  display: flex;
  flex: 1 1 auto;
}
.infobar--content-padded
{
  padding: 15px 0;
}
.infobar--item
{
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.infobar--item-bordered
{
  border-right: 1px solid #74696942;
}
.infobar--item-start
{
  align-items: flex-start;
}
.infobar--photo img
{
  margin-top: -29px;
  height: 72px;
  width: auto !important;
  margin-bottom: -29px;
  border-radius: 9px;
}
.infobar--driver-details
{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
}
.infobar--driver a
{
  color: #1782c5;
  text-decoration: none;
  font-size: 80%;
}
.infobar--actions
{
  flex-direction: row;
  padding: 0 1rem;
  text-transform: capitalize;
  justify-content: space-around;
  text-align: center;
  position: relative;
}
.infobar--actions img
{
  display: block;
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
.infobar--actions-hover:hover
{
  cursor: pointer;
  color:#1782C5;
}
.infobar--action-slide
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #74696929;
  position: absolute;
  background-color: #fff;
  top: -255px;
  width: 100%;
  min-width: 215px;
  border-radius: 3px;
}
.actions--caret
{
  width: 20px;
  height: 20px;
  z-index: 50;
  background-color: #fff;
  position: absolute;
  bottom: -11px;
  border-bottom: 1px solid #74696942;
  border-right: 1px solid #74696942;
  transform: rotate(45deg);
}
.infobar--terms
{
  display: flex;
  flex: 1;
}
.infobar--actions-text
{
  font-size: 13px;
  font-weight: 400;
  padding-top: 11px;
}
.action--slide-text
{
  padding: 10px 0px;
  line-height: 1.5;
  text-transform: none;
}
.action--slide-text:hover
{
  color: #333;
  cursor: auto;
}
.action--slide-desc
{
  display: flex;
  justify-content: center;
  width: 100%;
}
.action--slide-button
{
  margin: 0px 10px 10px 10px;
    text-transform: capitalize;
    font-size: 14px;
    letter-spacing: 1.1px;
    background-color: #1782c5;
    color: #fff;
    width: 100%;
    height: 30px;
    cursor: pointer;
    border: 0px solid;
    border-radius: 2px;
}
.infobar--actions-icon
{
  font-size: 23px;
  margin-bottom: -10px;

}

.carets
{
  width: 10px;
  margin-right: 4px;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
.infobar--action-slide .el-radio
{
  padding: 10px 0px;
  margin: 0px;
}
.infobar--action-slide .el-radio-group
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.infobar--truck-content{
  display: flex;
  flex: 1 1 auto;
}
.infobar--truck-content-padded{
  padding: 15px 0;
}
.infobar--truck-item{
  flex-direction: row;
  justify-content: space-evenly;
  padding-left: 8%;
}
.infobar-content{
  flex: 1 1 auto;
}
.infobar--item-truck-bordered{
  border-bottom: 1px solid #74696942;
}
.infobar--item-truck-bordered-top{
  border-top: 1px solid #74696942;
}
.infobar-content{
  flex: 1 1 auto;
}
.infobar--truck-cont-item{
  flex-direction: row;
  justify-content: space-evenly;
  padding-left: 8%;
}
.infobar--item-truck-cont-bordered{
  border-left: 1px solid #74696942;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
ul.timeline {
    list-style-type: none;
    position: relative;
}
ul.timeline:before {
    content: ' ';
    background: #d4d9df;
    display: inline-block;
    position: absolute;
    left: 29px;
    width: 2px;
    height: 100%;
    z-index: 400;
}
ul.timeline > li {
    margin: 20px 0;
    padding-left: 20px;
    max-height: 300px;
}
ul.timeline > li:before {
    /* content: ' '; */
    background: #1B7FC3;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    border: 3px solid #1B7FC3;
    left: 20px;
    width: 14px;
    height: 14px;
    z-index: 400;
    content: '';
    font-size: 16px;
    color: white ;

}
ul.timeline > li#timeline_right:before{
  content : '';
  background: #8A8A8A;
  border: 3px solid #8A8A8A;
}
ul.timeline > li#timeline_right.timelineConfirmed:before{
  background: #51A65B;
  border: 3px solid #51A65B;
  content: '✓';
}
ul.timeline > li#timeline_right.timelinePicked:before{
  background: #51A65B;
  border: 3px solid #51A65B;
  content: '✓';
}
ul.timeline > li#timeline_right.timelineDelivered:before{
  background: #51A65B;
  border: 3px solid #51A65B;
  content: '✓';
}
ul.timeline > li#timeline_right.timelinePay:before{
  background: #51A65B;
  border: 3px solid #51A65B;
  content: '✓';
}
ul.timeline > li#timeline_right.confirmedReached:before{
  background: #F57F20;
  border: 3px solid #F57F20;
  content: '';
}
ul.timeline > li#timeline_right.pickedReached:before{
  background: #F57F20;
  border: 3px solid #F57F20;
  content: '';
}
ul.timeline > li#timeline_right.deliveredReached:before{
  background: #F57F20;
  border: 3px solid #F57F20;
  content: '';
}
ul.timeline > li#timeline_right.payedReached:before{
  background: #F57F20;
  border: 3px solid #F57F20;
  content: '';
}
.inforbar_route_timeline li:first-child:before {
    background: #F57F20;
    border: 3px solid #F57F20;
    content : '';
}
.inforbar_order_timeline li:first-child:before {
    background: #51A65B;
    border: 3px solid #51A65B;
    content: '✓';
}
.cancelOptions > div
{
  margin-top: 16em;
  width: 30%;
}
.v-modal{
  opacity: 0 !important;
}
.infobar-truck-pstn{
  padding-bottom: 15px;
  margin-left: 13px !important;
  margin-right: 13px !important;
}
.topbar-text{
  padding-bottom: 10px;
}
.top-bar-info{
  color: #1782C5;
  font-size: 15px;
}
.top-bar-img{
  height:15px;
  vertical-align:middle;
}
.inforbar--item-scrollable{
  overflow-y: scroll;
  height: 190px;
}
.infobar-truck-img{
  height:20px;
  vertical-align:middle;
}
.timeline-date-disp{
  padding-left: 30px;
}
.info-text-transform{
  text-transform: uppercase;
}
.info-text-cursor{
  padding-top:4px;
  cursor:pointer;
}
.infobar--truck-cont-item{
  padding-bottom: 5px;
}
.cancel-reason-option{
  text-align:center;
}
.cancel-reason-text{
  padding-left: 30%;
  margin-bottom: 10px;
  margin-top: 10px;
}
.share-option{
  padding-top: 20px;
}
.rimg-disp{
  height: 55px;
  vertical-align: middle;
}
.infobar--item-truck-options{
  padding-bottom: 5px;
  padding-top: 10px;
  text-align:center;
  max-width:85%
}
.infobar--item-truck-cancel{
  padding-bottom: 5px;
  padding-top: 10px;
  text-align:center;
  max-width:70%;
  margin-left: -35px;
}
.info-payment-button{
  padding-left: 5px;
  padding-top: 10px;
}
.button-tracking-payment{
  width:200px;
}
.tracking-notes{
  padding-bottom: 10px;
  padding-left: 30px;
}
.tracking-notes-inner{
  max-width: 80%!important;
}
.tracking-loader{
  padding-bottom: 10px;
}
.tracking-loader-inner{
  padding-left:35px;
}
.tracking-loader-outer{
  padding-left: 20px;
}
.tracking-notes-inner{
  padding-left: 30px;
  padding-top: 5px;
}
.mobile-inforbar--inner{
  width:100%;
}
.mobile-inforbar-details{
  width: 100%;
  float: right;
  display: inline-block;
  padding-left: 20px;
  padding-bottom :16px;
}
.mobile-inforbar-img{
  display: inline-block;
  width: 70px;
  object-fit: contain;
  float: left;
}
.mobile-img{
  height:60px
}
.mobile-inforbar-rider-name{
  width: 70%;
  display: inline-block;
  float: left;
  font-size: 15px;
  padding-left: 10px;
  padding-top: 10px;
}
.mobile-rider-name-inner{
  padding-bottom: 10px;
}
.mobile-rider-name{
  padding-right:25px
}
.mobile-order-amount{
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #74696942;
  padding-top: 10px;
}
.mobile-order-status{
  padding-left: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #74696942;
  padding-top: 10px;
}
.infobar--item-bordered > div{
  width: 77%;
}
.infobar--order-align{
  text-align: center;
}
.infobar--item-bordered > div > div:nth-child(3){
  max-width: 18.3333% !important;
}
.el-step__title {
    font-size: 12px !important;
  }
.el-step__description{
    font-size: 10px !important;
    /* width: 103px!important; */
  }
/* .infobar--status{
  width: 23% !important;
} */
.el-step.is-horizontal {
  flex-basis: 160px !important;
}
.el-step__head.is-success{
  color: #c0c4cc !important;
  border-color: #c0c4cc !important;
}
.el-step__title.is-success{
  color: #c0c4cc !important;
}
.el-step__description.is-success{
  color: #c0c4cc !important;
}
.el-step__title.is-process{
  font-weight: 400 !important;
}
.el-step__head.is-process {
  color: #f57f20 !important;
  border-color: #f57f20 !important;
}
.infor-top-bar-text{
  color: #8A8A8A;
}
.cancel-text-option{
  width: 23% !important;
}
.steps-inner{
  font-size:10px !important;
}
.el-step.is-vertical .el-step__title {
  font-size: 15px !important;
}
.el-step.is-vertical .el-step__description{
  font-size: 12px !important;
  /* width: 103px!important; */
}
.confirmedActive{
  color: #1B7FC3;
}
.pickedActive {
  color: #1B7FC3;
}
.deliveredActive {
  color: #1B7FC3;
}
.payedActive{
  color: #1B7FC3;
}
</style>
