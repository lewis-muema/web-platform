<template lang="html">
  <div class="">
    <el-col
      :span="6"
      class=""
    >
      <div class="">
        <!-- Tracking Timeline for Small Vendors  -->

        <div class="inforbar--item-scrollable">
          <ul class="timeline inforbar_order_timeline">
            <li>
              <div class="">
                <p class="infor-top-bar-text stagePassed">
                  {{ orderPlaced }}
                </p>
                <p class="eta_data">
                  {{ convertToLocalTime(trackingData.eta_data.placed) | moment }}
                </p>
              </div>
            </li>

            <!-- Order Scheduled State -->

            <li
              v-if="trackingData.eta_data.scheduled"
              id="timeline_right"
              :class="{
                confirmedScheduled: true,
              }"
            >
              <div class="">
                <p class="infor-top-bar-text stagePassed">
                  Your Order has been scheduled
                </p>
                <p class="eta_data">
                  {{ convertToUTCToLocal(trackingData.date_time) | moment }}
                </p>
              </div>
            </li>

            <!-- Pricing check for Truck Orders-->
            <li
              v-if="truck_orders.includes(trackingData.rider.vendor_id)"
              id="timeline_right"
              :class="{ timelinePay: isPayed, payedReached: setPayed }"
            >
              <div class="">
                <p
                  class="infor-top-bar-text"
                  :class="{ payedActive: setPayed }"
                >
                  Price Confirmation
                </p>
                <div
                  v-if="getStatus === 'Pending'"
                  class=""
                />
                <div v-else>
                  <div class="">
                    <div
                      v-if="accType === 1"
                      class=""
                    >
                      <p>
                        Price has been confirmed to be
                        {{
                          trackingData.price_tier.currency
                            ? trackingData.price_tier.currency
                            : trackingData.currency
                        }}
                        {{ trackingData.amount }}
                      </p>
                    </div>
                    <div
                      v-else
                      class=""
                    >
                      <div v-if="myRb <= 0">
                        <p>
                          Price has been confirmed to be
                          {{
                            trackingData.price_tier.currency
                              ? trackingData.price_tier.currency
                              : trackingData.currency
                          }}
                          {{ trackingData.amount }}
                        </p>
                      </div>
                      <div v-else>
                        <p>
                          Price has been confirmed to be
                          {{
                            trackingData.price_tier.currency
                              ? trackingData.price_tier.currency
                              : trackingData.currency
                          }}
                          {{ trackingData.amount }}.Choose payment option below
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

            <!-- Order Confirmation State -->

            <li
              id="timeline_right"
              :class="{
                timelineConfirmed: isConfirmed,
                confirmedExpressReached: setConfirmed,
              }"
            >
              <div
                class="infor-top-bar-text"
                :class="{ confirmedActive: setConfirmed }"
              >
                <span v-if="trackingData.confirm_status > 0">
                  <p class="stagePassed">
                    We have matched a {{ getTrackPartnerName }} to your {{ getTrackPackageName }}
                  </p>
                  <p class="eta_data">{{ getConfirmEta }}</p>
                </span>
                <span v-else>
                  <p class="stagePending">
                    We are finding a {{ getTrackPartnerName }} for your {{ getTrackPackageName }}
                  </p>
                  <p
                    class="eta_data"
                    :class="toConfirmationStateClass()"
                  >
                    {{ delayState }}
                  </p>
                </span>
              </div>
            </li>

            <!-- Order In-Transit State  -->
            <li
              id="timeline_right"
              :class="{
                timelinePicked: isPicked,
                pickedExpressReached: setPicked,
              }"
            >
              <div
                class="infor-top-bar-text"
                :class="{ pickedActive: setPicked }"
              >
                <span v-if="trackingData.delivery_status > 0">
                  <p class="stagePassed">
                    Your {{ getTrackPartnerName }} {{ trackingData.rider.rider_name }} has picked
                    your
                    {{ getTrackPackageName }}
                  </p>
                  <p class="eta_data">{{ getPickUpEta }}</p>
                </span>
                <span v-else>
                  <p class="stagePending">
                    Your {{ getTrackPartnerName }} is on the way to pick your
                    {{ getTrackPackageName }}
                  </p>
                  <p class="eta_data">{{ getPickUpEta }}</p>
                </span>
              </div>
            </li>

            <!-- Order towards Delivery Points State -->
            <li
              v-for="(val, index) in trackingData.path"
              v-if="index > 0"
              id="timeline_right"
              :key="index"
              :class="toDeliveryTypeClass(val, index)"
            >
              <div
                class="infor-top-bar-text"
                :class="{ deliveredActive: setDelivered }"
              >
                <span
                  v-if="
                    'waypoint_type' in val &&
                      val.waypoint_type !== null &&
                      val.waypoint_type.toLowerCase() === 'pickup'
                  "
                >
                  <span v-if="trackingData.delivery_status < 3 && !val.visited">
                    <p class="stagePending">
                      Your {{ getTrackPartnerName }} is on the way to pick your
                      {{ getTrackPackageName }} at
                      {{ val.name }}
                    </p>
                  </span>
                  <span v-else>
                    <p class="stagePassed">
                      Your {{ getTrackPackageName }} at {{ val.name }} has been picked.
                    </p>
                  </span>
                </span>
                <span v-else>
                  <span v-if="trackingData.delivery_status < 3 && !val.visited">
                    <p class="stagePending">
                      Your {{ getTrackPackageName }} is on the way to {{ val.name }}
                    </p>
                  </span>
                  <span v-else>
                    <p class="stagePassed">
                      Your {{ getTrackPackageName }} has been delivered to {{ val.name }}
                    </p>
                  </span>
                </span>
              </div>
            </li>

            <!-- Order Delivery State-->
            <li
              id="timeline_right"
              :class="{
                timelineDeliveredExpress: setComplete,
              }"
            >
              <div
                class="infor-top-bar-text"
                :class="{ deliveredActive: setComplete }"
              >
                <span>
                  <p :class="{ stagePassed: setComplete }">
                    Delivery complete
                  </p>
                </span>
              </div>
            </li>
          </ul>
        </div>
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
  name: 'InfoBarOrderTimelineComponent',
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
    eta_moment(date) {
      return moment(date).format('hA');
    },
  },
  mixins: [NotificationMxn, EventsMixin, TimezoneMxn],
  props: {
    trackingData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      myRb: '',
      accType: '',
      truck_orders: [20, 25],
      paymentOption: '',
      isConfirmed: false,
      isPicked: false,
      isPayed: false,
      isDelivered: false,
      setConfirmed: false,
      setPicked: false,
      setDelivered: false,
      setPayed: false,
      setComplete: false,
    };
  },
  computed: {
    ...mapGetters({
      getTrackPartnerName: '$_orders/$_tracking/getTrackPartnerName',
      getTrackPackageName: '$_orders/$_tracking/getTrackPackageName',
      getConfirmEta: '$_orders/$_tracking/getConfirmEta',
      getPickUpEta: '$_orders/$_tracking/getPickUpEta',
      getDeliveryEta: '$_orders/$_tracking/getDeliveryEta',
    }),
    orderPlaced() {
      const text = 'Your order has been received';

      return text;
    },
    getStatus() {
      switch (this.trackingData.delivery_status) {
        case 3: {
          return 'Delivered';
        }
        case 2: {
          return 'In Transit';
        }
        default: {
          switch (this.trackingData.confirm_status) {
            case 1: {
              return 'Confirmed';
            }
            default: {
              return 'Pending';
            }
          }
        }
      }
    },
    delayState() {
      if (this.trackingData !== undefined) {
        if (
          Object.prototype.hasOwnProperty.call(this.trackingData.eta_data, 'cancelled')
          && this.trackingData.eta_data.cancelled
        ) {
          return this.trackingData.eta_data.cancelled_message;
        }
        if (this.trackingData.eta_data.delayed) {
          return this.trackingData.eta_data.delayed_message;
        }
        return this.getConfirmEta;
      }
      return this.getConfirmEta;
    },
  },
  mounted() {
    this.checkRunningBalance();
    this.setTimeLineIconState();
  },
  methods: {
    ...mapMutations({}),
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
      if (this.paymentOption === 1) {
        this.$router.push('/payment/mpesa');
      } else if (this.paymentOption === 2) {
        this.$router.push('/payment/card');
      } else {
        this.doNotification('2', 'Payment Failure', 'Choose a Payment Option.');
      }
    },
    setTimeLineIconState() {
      if (
        Object.prototype.hasOwnProperty.call(this.trackingData.eta_data, 'scheduled')
        && this.trackingData.eta_data.scheduled
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
      } else if (this.trackingData.confirm_status === 0) {
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
        this.trackingData.confirm_status === 1
        && this.trackingData.delivery_status === 0
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
      } else if (this.trackingData.delivery_status === 2) {
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
      } else if (this.trackingData.delivery_status === 3) {
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
      }
    },
    toConfirmationStateClass() {
      if (this.trackingData.eta_data.delayed) {
        return ['confirmationDelayActive'];
      }
      return '';
    },
    toDeliveryTypeClass(val, index) {
      const nextPoint = this.trackingData.path[index - 1].visited;
      if (this.trackingData.delivery_status >= 2) {
        if (val.visited) {
          return ['timelineDeliveredExpress'];
        }
        if (nextPoint) {
          return ['deliveryEnrouteReached'];
        }
      }
      return '';
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
