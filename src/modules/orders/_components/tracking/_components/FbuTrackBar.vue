<template>
  <div
    class="homeview--childinfo"
    :class="loading ? 'loading-parent' : ''"
  >
    <transition name="fade">
      <div
        v-if="Object.prototype.hasOwnProperty.call(orderData, 'freight_order_details') && !loading
          && tracking_data !== undefined"
        class="homeview--childinfo-card"
      >
        <div class="homeview--childinfo-card-left">
          <div class="">
            <p class="homeview--childinfo-order-status">
              {{$t('general.order_status')}}: {{ statusName(orderData.freight_order_details.freight_status) }}
            </p>
          </div>
          <div class="childinfo-container">
            <div class="full-width">
              <div>
                <p class="homeview--childinfo-order-details">
                  {{$t('general.order_details')}}
                </p>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">
                    {{$t('general.pickup_solo')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{ orderData.path[0].name }}
                  </p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">
                    {{$t('general.order_type')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{$t('general.container_order')}}, {{ orderData.freight_order_details.containers.container_details[0].container_size_feet }}ft {{$t('general.container_capital')}}, {{ orderData.freight_order_details.containers.container_details[0].container_weight_tonnes }}T
                  </p>
                </div>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">
                    {{$t('general.drop_off')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{ orderData.path[1].name }}
                  </p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">
                    {{$t('general.container_number')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{ orderData.freight_order_details.containers.container_details[0].container_number }}
                  </p>
                </div>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">
                    {{$t('general.empty_container_destination')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{ orderData.path[2].name }}
                  </p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">
                    {{$t('general.consignee')}}
                  </p>
                  <p class="no-margin homeview--field">
                    {{ orderData.freight_order_details.containers.container_details[0].consignee }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="orderData.confirm_status === 0"
            class="homeview--childinfo-cancel"
          >
            <button
              class="button-primary"
              @click="$emit('clicked', true)"
            >
              {{$t('general.cancel_order_capital')}}
            </button>
          </div>
          <div
            v-else
            class="full-width homeview--childinfo-rider-details"
          >
            <div class="homeview--childinfo-rider-photo">
              <img
                :src="tracking_data.rider.rider_photo"
                class="homeview--childinfo-contact"
              >
            </div>
            <div class="homeview--childinfo-rider-col">
              <p class="no-margin">
                {{ orderData.rider.rider_name }}
              </p>
              <p class="no-margin">
                {{ orderData.rider.rider_phone }}
              </p>
            </div>
            <div class="homeview--childinfo-rider-col">
              <p class="no-margin">
                {{ orderData.rider.number_plate }}
              </p>
              <p
                v-if="orderData.rider.vehicle_name !== 'null'"
                class="no-margin"
              >
                {{ orderData.rider.vehicle_name }}
              </p>
            </div>
          </div>
        </div>
        <div class="homeview--childinfo-card-right">
          <div class="" />
          <div class="">
            <p class="homeview--childinfo-order-details">
             {{$t('general.order_timeline')}}
            </p>
          </div>
          <div
            v-for="(action, index) in actions"
            :key="action.actionText"
            class="homeview--childinfo-order-actions"
          >
            <div
              v-if="index < actions.length - 1"
              class="homeview-action-icon-divider"
            />
            <i
              :class="action.actionClass"
              class="el-icon-success"
            />
            <p
              class="no-margin"
              :class="action.actionTextClass"
            >
              {{ action.actionText }}
            </p>
          </div>
        </div>
      </div>
    </transition>
    <i
      v-if="loading"
      class="el-icon-loading tracking-loading-spinner"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TrackingStore from '../_store';
import RegisterStoreModule from '../../../../../mixins/register_store_module';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  mixins: [RegisterStoreModule, NotificationMxn],
  data() {
    return {
      showing: false,
      actionCount: 0,
      orderData: {
        to_details: 'None',
      },
      actions: [
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.rider_on_the_way'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.confirmed'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.truck_gated_in'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.gated_in'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.truck_gated_out'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.gated_out'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.cargo_on_the_way_to_destination'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.intransit'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.cargo_arrived_at_destination'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.arrived'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.cargo_delivered_offloaded'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: this.$t('general.offloaded'),
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.empty_container_in_transit_return'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: 'ec_returned',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: this.$t('general.empty_container_delivered'),
          actionTextClass: 'homeview--field-inactive',
          freight_status: 'delivered',
        },
      ],
      container_no: '',
      truck_size: '',
      destination: this.$t('general.the_destination'),
      container_destination: this.$t('general.the_empty_container_destination'),
      delivery_status: 1,
      order_number: '',
      loading: false,
      fcm: '',
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      parent_order: '$_orders/getParentOrder',
      date_time: '$_orders/$_tracking/getDateTime',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      vendors: '$_orders/getVendors',
      fcm_notification: 'getFCMData',
    }),
  },
  watch: {
    fcm_notification(data) {
      this.fcm = data;
      if (this.$route.name === 'freight_order_tracking') {
        this.poll(this.$route.params.order_no);
      }
    },
    date_time() {
      if (this.$route.name === 'freight_order_tracking') {
        this.poll(this.$route.params.order_no);
      }
    },
    '$route.params.order_no': function trackedOrder(from) {
      this.order_number = from;
      this.loading = true;
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', from);
      this.poll(from);
    },
    tracking_data(data) {
      if (Object.prototype.hasOwnProperty.call(data, 'confirm_status')) {
        if (data.confirm_status === 1) {
          this.reCheckMQTTConnection();
        }
      }
    },
  },
  beforeDestroy() {
    this.set_tracking_data({});
  },
  created() {
    this.order_number = this.$route.params.order_no;
    const STORE_PARENT = '$_orders';
    const STORE_KEY = '$_tracking';
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT, STORE_KEY], TrackingStore);
    }
    this.loading = true;
    this.poll(this.$route.params.order_no);
  },
  methods: {
    ...mapMutations({
      set_tracked_order: '$_orders/$_tracking/setTrackedOrder',
      set_tracking_data: '$_orders/$_tracking/setTrackingData',
      set_parent_order: '$_orders/setParentOrder',
      set_polyline: '$_orders/setPolyline',
      set_markers: '$_orders/setMarkers',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
    }),
    statusName(status) {
      let statusName = '';
      status.split('_').forEach((name) => {
        if (statusName === '') {
          statusName = name;
        } else {
          statusName = `${statusName} ${name}`;
        }
      });
      if (statusName.includes('return')) {
        statusName = 'container return';
      }
      return statusName[0].toUpperCase() + statusName.slice(1);
    },
    demo() {
      if (this.actionCount < this.actions.length) {
        if (this.actionCount > 0) {
          this.actions[this.actionCount - 1].actionClass = 'homeview--icon-success';
        }
        this.actions[this.actionCount].actionClass = 'homeview--icon-ongoing';
        this.actionCount++;
      } else {
        this.actions[this.actionCount - 1].actionClass = 'homeview--icon-success';
      }
    },
    checkDetails() {
      this.showCard();
      this.actions.forEach((row) => {
        row.actionClass = 'homeview--icon-pending';
      });
      this.actionCount = 0;
      if (this.delivery_status > 0) {
        for (let i = 0; i < this.delivery_status; i++) {
          this.demo();
        }
      }
    },
    showCard() {
      if (this.showing === true) {
        this.showing = false;
        setTimeout(() => {
          this.showing = true;
        }, 100);
      } else {
        this.showing = true;
      }
    },
    active_card(orderNo) {
      if (this.$route.params.order_no === orderNo) {
        return true;
      }
      return false;
    },
    poll(from) {
      this.$store
        .dispatch('$_orders/getOrderData', { order_no: this.$route.params.order_no })
        .then((response) => {
          if (response.data.status) {
            this.orderData = response.data;
            this.actions[3].actionText = this.$t('general.cargo_on_the_way') + this.orderData.path[1].name;
            this.actions[4].actionText = this.$t('general.cargo_arrived_at') + this.orderData.path[1].name;
            this.actions[6].actionText = this.$t('general.empty_container_in_transit')+ this.orderData.path[2].name;
            this.set_tracked_order(this.$route.params.order_no);
            this.set_tracking_data(response.data);
            this.set_polyline(response.data.polyline);
            this.set_markers(response.data.path);
            let loopCount = 0;
            this.actions.forEach((row, i) => {
              if (loopCount === 0 && response.data.freight_order_details.freight_status !== 'pending') {
                this.actions[i].actionClass = 'homeview--icon-success';
                if (this.actions.length > (i + 1)) {
                  this.actions[i + 1].actionClass = 'homeview--icon-ongoing';
                }
                if (response.data.freight_order_details.freight_status === row.freight_status) {
                  loopCount = 1;
                }
              }
            });
            const that = this;
            if (this.tracking_data.delivery_status === 3) {
              that.doNotification('1', this.$t('general.order_delivered'), this.$t('general.order_has_been_delivered'));
              that.set_tracking_data({});
              that.clearVendorMarkers();
              this.set_parent_order('');
              this.$router.push('/orders/freight');
            } else if (this.tracking_data.main_status === 2) {
              that.doNotification('2', this.$t('general.order_cancelled'), this.$t('general.your_order_cancelled'));
              that.set_tracking_data({});
              that.clearVendorMarkers();
              this.set_parent_order('');
              this.$router.push('/orders/freight');
            } else if (this.tracked_order === from) {
              setTimeout(() => {
                that.poll(from);
              }, 60000);
            }
            that.loading = false;
            let data = {};
            response.data.freight_order_details.containers.container_details.forEach((row, i) => {
              data = {
                index: i,
                vals: row,
              };
            });
          } else {
            this.doNotification('2', this.$t('general.failed_to_fetch_child_orders'), this.$t('general.please_retry_after_afew'));
          }
        });
    },
    reCheckMQTTConnection() {
      if (!this.isMQTTConnected) {
        this.$store.dispatch('$_orders/$_tracking/trackMQTT');
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};

</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement.css?v=2';
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=2';
</style>
<style lang="css">
.tracking-loading-spinner {
  font-size: 70px;
}
.loading-parent {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
