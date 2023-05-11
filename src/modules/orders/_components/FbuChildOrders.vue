<template lang="html">
  <div
    v-if="!loading && get_orders !== undefined && get_orders.length > 0"
    class="ongoing--outer"
  >
    <div
      class="ongoing--count"
      @click="toggle_ongoing()"
    >
      <span v-if="!parent_order">
        {{ num_ongoing }} {{ $t('general.ongoing_fbu_orders') }}

      </span>
      <span v-else>{{ child_orders.length }} {{ $t('general.containers') }}</span>
      <font-awesome-icon
        icon="chevron-up"
        :class="classObject"
        class="icon-width"
      />
    </div>
    <transition name="fade">
      <div
        v-if="showing === 1"
        class="ongoing--column"
      >
        <template v-for="(order, index) in filter_orders">
          <div
            :key="index"
            class="ongoing--card bg-white"
            :class="{ active: active_card(order.order_no) }"
            @click="toggle_parent(order.child_orders, order)"
          >
            <div class="ongoing--order-count">
              {{ $t('general.goods_quantity') }}: <b>{{ order.count }} {{ $t('general.container') }} {{ pluralize(order.count) }}</b>
            </div>
            <div class="ongoing--card-location card-location-override">
              <span class="homeview--childinfo-order-details">{{ $t('general.order_details') }}</span><br>
              <div class="ongoing--card-parent-order-details">
                <div class="ongoing--parent-locations">
                  <span class="ongoing--parent-locations-header">{{ $t('general.pick_up_') }}</span><br>
                  <span class="ongoing--parent-locations-body">{{ order.path[0].name }}</span>
                </div>
                <div class="ongoing--parent-locations">
                  <span class="ongoing--parent-locations-header">{{ $t('general.destination') }}</span><br>
                  <span class="ongoing--parent-locations-body">{{ order.path[1].name }}</span>
                </div>
              </div>
            </div>
            <div
              class="card-status-override"
              :class="getStatus(order)"
            >
              <div class="">
                {{ $t('general.order_status') }}: <b>{{ getStatus(order) }}
                </b>
              </div>
              <div class="">
                <i class="el-icon-time" />
                {{ date_format(order.date_time) }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="showing === 2"
        class="ongoing--column"
      >
        <template v-for="(order, index) in child_orders">
          <div
            :key="index"
            class="ongoing--card card--override"
            :class="{ active: active_card(order.order_no) }"
            @click="track(order.order_no)"
          >
            <div class="ongoing--card-location ongoing--card-override">
              <div class="ongoing--card-row">
                <div class="">
                  <span class="homeview--heading__container-ongoing">Container Number</span><br>
                  <span class="homeview--body__container-ongoing">{{ order.container_details.container_number }}</span>
                </div>
                <div class="">
                  <span class="homeview--heading__container-ongoing">Empty Container Destination</span><br>
                  <span class="homeview--body__container-ongoing">{{ order.container_details.container_destination.name }}</span>
                </div>
                <div class="">
                  <span class="homeview--heading__container-ongoing">Truck Size</span><br>
                  <span class="homeview--body__container-ongoing">{{ order.container_details.container_size_feet }} Feet</span>
                </div>
              </div>
            </div>
            <div class="ongoing--card-status">
              <div class="ongoing--card-text">
                {{ statusName(order.freight_status) }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import TimezoneMxn from '../../../mixins/timezone_mixin';

library.add(faChevronUp);

export default {
  name: 'OngoingComponent',
  mixins: [TimezoneMxn],
  data() {
    return {
      loading: true,
      showing: 1,
      child_orders: [],
      placeholder: 0,
      riders: [],
      count: 0,
    };
  },
  computed: {
    ...mapGetters({
      get_orders: '$_orders/getOngoingOrders',
      parent_order: '$_orders/getParentOrder',
      show: '$_orders/showOngoing',
      getSession: 'getSession',
    }),
    num_ongoing() {
      return this.filter_orders.length;
    },
    filter_orders() {
      const orders = [];
      this.get_orders.forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(row, 'freight_order') && Object.prototype.hasOwnProperty.call(row, 'child_orders')) {
          row.count = this.validateChildOrders(row.child_orders).length;
          orders.push(row);
        }
      });
      return orders;
    },
    classObject() {
      return {
        'sendy-blue': true,
        'rotate-transform': true,
        rotate: this.showing === 0,
      };
    },
  },
  watch: {
    getSession: {
      handler() {
        if (Object.keys(this.$store.getters.getSession).length > 0) {
          this.$store.dispatch('$_orders/fetchOngoingOrders');
        }
      },
      deep: true,
    },
    parent_order() {
      if (!this.parent_order) {
        this.showing = 1;
        this.clearVendorMarkers();
        this.set_tracking_data({});
      } else {
        this.child_orders = [];
        this.child_orders = this.validateChildOrders(this.parent_order.child_orders);
        this.showing = 2;
      }
    },
    get_orders() {
      if (this.get_orders.length > 0) {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.initializeComponent();
  },
  methods: {
    ...mapMutations({
      set_tracking_data: '$_orders/$_tracking/setTrackingData',
      set_ongoing_orders: '$_orders/setOngoingOrders',
      set_parent_order: '$_orders/setParentOrder',
      change_page: '$_orders/setPage',
      hide_vendors: '$_orders/hideVendors',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      setVendorMarkers: '$_orders/setVendorMarkers',
    }),
    ...mapActions({
      fetchOngoingOrders: '$_orders/fetchOngoingOrders',
      riderDetails: '$_orders/riderDetails',
    }),
    toggle_ongoing() {
      if (this.showing) {
        this.placeholder = this.showing;
        this.showing = 0;
      } else {
        this.showing = this.placeholder;
      }
    },
    initializeComponent() {
      if (Object.keys(this.$store.getters.getSession).length > 0) {
        this.set_ongoing_orders([]);
        this.poll();
      }
      if (!this.parent_order) {
        this.showing = 1;
        this.loading = true;
        this.clearVendorMarkers();
        this.set_tracking_data({});
      } else {
        this.loading = false;
        this.child_orders = [];
        this.child_orders = this.validateChildOrders(this.parent_order.child_orders);
        this.fetchRiderLocations();
        this.showing = 2;
      }
    },
    track(order) {
      this.clearVendorMarkers();
      this.$router.push({ path: `/orders/freight/tracking/${order}` });
    },
    toggle_parent(children, order) {
      this.set_parent_order(order);
      this.child_orders = [];
      this.child_orders = this.validateChildOrders(children);
      this.fetchRiderLocations();
      this.showing = 2;
    },
    fetchRiderLocations() {
      this.riderDetails({ rider_id: this.riders }).then((response) => {
        if (response.data.status) {
          response.data.partnerArray.forEach((row) => {
            row.overide_visible = true;
            this.setVendorMarkers(row);
          });
        }
      });
    },
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
    date_format(date) {
      const localTime = this.convertToUTCToLocal(date);
      return this.moment(localTime).calendar(null, {
        lastWeek: 'MMM-D hh:mm a',
        sameDay: '[Today] hh:mm a',
        nextDay: '[Tomorrow] hh:mm a',
        nextWeek: 'ddd',
        sameElse() {
          return 'MMM D, hh:mm a';
        },
      });
    },
    active_card(orderNo) {
      if (this.$route.params.order_no === orderNo) {
        return true;
      }
      return false;
    },
    poll() {
      try {
        const that = this;
        this.$store.dispatch('$_orders/fetchOngoingOrders').then((response) => {
          if (['freight_order_placement'].includes(that.$router.currentRoute.name)) {
            setTimeout(() => {
              that.poll();
            }, 15000);
          }
          this.filter_orders.forEach((row, i) => {
            if (this.parent_order && row.order_no === this.parent_order.order_no && row.parent_order_no === this.parent_order.parent_order_no) {
              this.set_parent_order(row);
            }
          });
          that.loading = false;
        });
      } catch (e) {
        this.loading = false;
        Sentry.captureException(e);
      }
    },
    getStatus(order) {
      let pending = true;
      let delivered = true;
      order.child_orders.forEach((row) => {
        if (row.freight_status !== 'pending') {
          pending = false;
        }
        if (row.freight_status !== 'delivered') {
          delivered = false;
        }
      });
      if (pending) {
        return this.$t('general.pending');
      }
      if (delivered) {
        return this.$t('general.delivered');
      }
      return this.$t('general.ongoing');
    },
    validateChildOrders(children) {
      const childrenObject = [];
      this.riders = [];
      children.forEach((row) => {
        if (row.order_no !== row.parent_order_no) {
          if (row.confirm_status === 1) {
            this.riders.push(row.rider_id);
          }
          childrenObject.push(row);
        }
      });
      return childrenObject;
    },
    pluralize(count) {
      if (count > 1) {
        return 's';
      }
      return '';
    },
  },
};
</script>

<style lang="css">
.ongoing--outer
{
  position: absolute;
  margin-top: 10px;
  right: 10px;
  min-width: 345px;
  max-height: 55%;
  overflow-x: hidden;
}
.ongoing--count
{
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  color: #1782c5;
  padding: 9px 18px 9px 60px;
  font-size: 13px;
  cursor: pointer;
  border: 0px solid #1782c5;
  border-radius: 2px;
  box-shadow: 0 3px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  max-width: 72%;
}
.ongoing--card
{
    font-size: 13px;
    margin-top: 15px;
    border: 0px solid #1782c5;
    cursor: pointer;
    transition: all .5s ease-in-out;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
    border-radius: 2px !important;
    max-width: 90%;
}
.ongoing--card:hover,.ongoing--card.active
{
  border-color: #f57f20;
}
.ongoing--card-location
{
  padding: 25px 25px 11px 25px;
  background-color: #fff;
  border-radius: 3px 3px 0px 0px;
  font-size: 13px;
  line-height: 17px;
}
.ongoing--card-parent-order-details {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
}
.ongoing--parent-locations-header {
  font-size: 11px;
  color: #757575;
}
.ongoing--parent-locations-body {
}
.card-status-override {
  display: flex;
  justify-content: space-between;
  padding: 14px;
  color: #fff;
  transition: all .5s ease-in-out;
  border-radius: 0px 0px 3px 3px;
  font-size: 11px;
}
.ongoing--parent-locations {
  width: 160px;
  margin-right: 10px;
}
.Pending {
  background-color: #f57f20;
}
.Ongoing {
  background-color: #1782c5;
}
.Delivered {
  background-color: #43A047;
}
.ongoing--card-padded
{
  padding-bottom: 5px;
}
.rotate-transform
{
  transition: all 1s ease-in-out;
}
.rotate
{
  transform: rotate(180deg);
}
.icon-width {
  width: 15px !important;
}
</style>
