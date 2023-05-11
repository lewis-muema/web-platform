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
                  {{ $t('general.your_order_has_been_scheduled') }}
                </p>
                <p v-if="getScheduleStatus">
                  {{ $t('general.scheduled_by_1_hour') }}
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
                  {{ $t('general.price_confirmation') }}
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
                        {{ $t('general.price_has_been_confirmed_to_be') }}
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
                          {{ $t('general.price_has_been_confirmed_to_be') }}
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
                          {{ $t('general.price_has_been_confirmed_to_be') }}
                          {{
                            trackingData.price_tier.currency
                              ? trackingData.price_tier.currency
                              : trackingData.currency
                          }}
                          {{ trackingData.amount }}.{{ $t('general.choose_payment_option_below') }}
                        </p>
                        <div class="">
                          <el-radio
                            v-model="paymentOption"
                            label="1"
                          >
                            {{ $t('general.mpesa') }}
                          </el-radio>
                        </div>
                        <div class="">
                          <el-radio
                            v-model="paymentOption"
                            label="2"
                          >
                            {{ $t('general.card') }}
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
                    {{ $t('general.matched_parter_to_package', {getTrackPartnerName: getTrackPartnerName, getTrackPackageName: getTrackPackageName }) }}
                  </p>
                  <p class="eta_data">{{ getConfirmEta }}</p>
                </span>
                <span v-else>
                  <p class="stagePending">
                    {{ $t('general.finding_partner_to_package',{getTrackPartnerName: getTrackPartnerName, getTrackPackageName: getTrackPackageName }) }}
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
                    {{ $t('general.your') }} {{ getTrackPartnerName }} {{ trackingData.rider.rider_name }} {{ $t('general.has_picked_your') }}

                    {{ getTrackPackageName }}
                  </p>
                  <p class="eta_data">{{ getPickUpEta }}</p>
                </span>
                <span v-else>
                  <p class="stagePending">
                    {{ $t('general.your') }}  {{ getTrackPartnerName }} {{ $t('general.is_on_the_way_to_pick') }}
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
                      {{ $t('general.your') }}  {{ getTrackPartnerName }} {{ $t('general.is_on_the_way_to_pick') }}
                      {{ getTrackPackageName }} {{ $t('general.at') }}
                    </p>
                  </span>
                  <span v-else>
                    <p class="stagePassed">
                      {{ $t('general.your') }}  {{ getTrackPackageName }} {{ $t('general.at') }}  {{ val.name }} {{ $t('general.has_been_picked') }}
                    </p>
                  </span>
                </span>
                <span v-else>
                  <span v-if="trackingData.delivery_status < 3 && !val.visited">
                    <p class="stagePending">
                      {{ $t('general.your') }} {{ getTrackPackageName }} {{ $t('general.is_on_the_way_to') }} {{ val.name }}
                    </p>
                  </span>
                  <span v-else>
                    <p class="stagePassed">
                      {{ $t('general.your') }} {{ getTrackPackageName }} {{ $t('general.has_been_delivered_to') }}{{ val.name }}
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
                    {{ $t('general.delivery_complete') }}
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
      getScheduleStatus: 'getScheduleStatus',
    }),
    orderPlaced() {
      const text = this.$t('general.order_recieved');

      return text;
    },
    getStatus() {
      switch (this.trackingData.delivery_status) {
        case 3: {
          return this.$t('general.delivered');
        }
        case 2: {
          return this.$t('general.in_transit');
        }
        default: {
          switch (this.trackingData.confirm_status) {
            case 1: {
              return this.$t('general.confirmed');
            }
            default: {
              return this.$t('general.pending');
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
        this.doNotification('2', this.$t('general.payment_failure'), this.$t('general.choose_payment_option'));
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
