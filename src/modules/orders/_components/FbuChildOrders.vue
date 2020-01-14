<template lang="html">
  <div
    v-if="!loading && get_orders.length > 0"
    class="ongoing--outer"
  >
    <div
      class="ongoing--count"
      @click="toggle_ongoing()"
    >
      <span>{{ num_ongoing }} ongoing FBU orders</span>
      <font-awesome-icon
        icon="chevron-up"
        :class="classObject"
        width="15px"
      />
    </div>
    <transition name="fade">
      <div
        v-if="showing"
        class="ongoing--column"
      >
        <template v-for="order in filter_orders">
          <div
            class="ongoing--card bg-white"
            :class="{ active: active_card(order.order_no) }"
            @click="track(order.order_no)"
          >
            <div class="ongoing--order-count">
              Good Quantity: <b>{{ order.no_of_containers }} container{{ pluralize(order.no_of_containers) }}</b>
            </div>
            <div class="ongoing--card-location card-location-override">
              <span class="homeview--childinfo-order-details">Order Details</span><br>
              <div class="ongoing--card-parent-order-details">
                <div class="ongoing--parent-locations">
                  <span class="ongoing--parent-locations-header">Pick-Up</span><br>
                  <span class="ongoing--parent-locations-body">{{ order.from_name }}</span>
                </div>
                <div class="ongoing--parent-locations">
                  <span class="ongoing--parent-locations-header">Destination</span><br>
                  <span class="ongoing--parent-locations-body">{{ order.to_name }}</span>
                </div>
              </div>
            </div>
            <div class="card-status-override" :class="getStatus(order)">
              <div class="">
                Order Status: <b>{{ getStatus(order) }}
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
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronUp);

export default {
  name: 'OngoingComponent',
  data() {
    return {
      loading: true,
      showing: 1,
    };
  },
  computed: {
    ...mapGetters({
      get_orders: '$_orders/getOngoingOrders',
      show: '$_orders/showOngoing',
      getSession: 'getSession',
    }),
    num_ongoing() {
      return this.filter_orders.length;
    },
    filter_orders() {
      const orders = [];
      this.get_orders.forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(row, 'freight_order')) {
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
        this.$store.dispatch('$_orders/fetchOngoingOrders');
      },
      deep: true,
    },
  },
  mounted() {
    this.loading = true;
    this.poll();
  },
  methods: {
    ...mapMutations({
      change_page: '$_orders/setPage',
      hide_vendors: '$_orders/hideVendors',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
    }),
    ...mapActions({
      fetchOngoingOrders: '$_orders/fetchOngoingOrders',
    }),
    toggle_ongoing() {
      if (this.showing) {
        this.showing = 0;
      } else {
        this.showing = 1;
      }
    },
    track(order) {
      // this.hide_vendors();
      // this.clearVendorMarkers();
      this.$router.push({ path: `/orders/freight/tracking/${order}` });
      // this.change_page(1);
    },
    date_format(date) {
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
          that.loading = false;
        });
      } catch (e) {
        Sentry.captureException(e);
      }
    },
    getStatus(order) {
      if (!this.loading) {
        switch (order.delivery_status) {
          case 3: {
            return 'Delivered';
          }
          case 2: {
            return 'Ongoing';
          }
          default: {
            switch (order.confirm_status) {
              case 1: {
                return 'Ongoing';
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
    border: 0px solid #1782C5;
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
</style>
