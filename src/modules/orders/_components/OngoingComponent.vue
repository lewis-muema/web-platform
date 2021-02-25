<template lang="html">
  <div
    v-if="!loading && ongoing_data > 0"
    class="ongoing--outer"
  >
    <div
      class="ongoing--count"
      @click="toggle_ongoing()"
    >
      <span>{{ num_ongoing }} {{$t('general.num_ongoing_orders')}}</span>
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
            class="ongoing--card"
            :class="{ active: active_card(order.order_no) }"
            @click="track(order.order_no)"
          >
            <div class="ongoing--card-location">
              <div class="ongoing--card-padded">
                <span class="ongoing-card-text">{{ order.from_name }}</span>
              </div>
              <div class="">
                <span class="ongoing-card-text">{{ order.to_name }}</span>
              </div>
            </div>
            <div class="ongoing--card-status">
              <div class="">
                {{ getStatus(order) }}
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
import TimezoneMxn from '../../../mixins/timezone_mixin';

library.add(faChevronUp);

export default {
  name: 'OngoingComponent',
  mixins: [TimezoneMxn],
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
      const childOrders = [];
      const parentOrders = [];
      this.get_orders.forEach((row) => {
        if (Object.prototype.hasOwnProperty.call(row, 'child_orders')) {
          row.child_orders.forEach((child) => {
            if (!childOrders.includes(child.order_no)) {
              childOrders.push(child.order_no);
            }
          });
        }
        if (!Object.prototype.hasOwnProperty.call(row, 'freight_order')) {
          parentOrders.push(row);
        }
      });
      if (childOrders.length === 0) {
        return parentOrders;
      }
      parentOrders.forEach((row) => {
        if (!childOrders.includes(row.order_no)) {
          orders.push(row);
        }
      });
      return orders;
    },
    ongoing_data() {
      let length = 0;
      if (this.get_orders !== undefined) {
        length = this.get_orders.length;
      }
      return length;
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
  },
  mounted() {
    const session = this.$store.getters.getSession;
    if (Object.keys(session).length > 0 && this.get_orders !== undefined) {
      this.poll();
      this.$store.dispatch('$_orders/fetchOngoingOrders');
      this.loading = true;
    }
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
      this.hide_vendors();
      this.clearVendorMarkers();
      this.$router.push({ path: `/orders/tracking/${order}` });
      this.change_page(1);
    },
    active_card(orderNo) {
      if (this.$route.params.order_no === orderNo) {
        return true;
      }
      return false;
    },
    date_format(date) {
      const localTime = this.convertToUTCToLocal(date);
      return this.moment(localTime).calendar(null, {
        lastWeek: 'MMM-D hh:mm a',
        sameDay: `[${this.$t('general.today')}] hh:mm a`,
        nextDay: `[${this.$t('general.tommorow')}] hh:mm a`,
        nextWeek: 'ddd',
        sameElse() {
          return 'MMM D, hh:mm a';
        },
      });
    },
    poll() {
      try {
        const that = this;
        this.$store.dispatch('$_orders/fetchOngoingOrders').then((response) => {
          if (['order_placement', 'tracking'].includes(that.$router.currentRoute.name)) {
            setTimeout(() => {
              that.poll();
            }, 15000);
          }
          that.loading = false;
        });
      } catch (e) {
        this.$store.commit('setOngoingOrders', []);
        this.loading = false;
      }
    },
    getStatus(order) {
      if (!this.loading) {
        switch (order.delivery_status) {
          case 3: {
            return this.$t('general.delivered');
            break;
          }
          case 2: {
            return this.$t('general.in_transit');
            break;
          }
          default: {
            switch (order.confirm_status) {
              case 1: {
                return this.$t('general.confirmed');
                break;
              }
              default: {
                return this.$t('general.pending');
                break;
              }
            }
          }
        }
      } else {
        return '';
      }
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
  min-width: 25%;
  max-height: 55%;
  overflow-x: hidden;
  margin-right : 19px;
  max-width: 32%;
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
    max-width: 100%;
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
.ongoing--card-status
{
  display: flex;
justify-content: space-between;
padding: 14px;
background-color: #1782c5;
color: #fff;
transition: all .5s ease-in-out;
border-radius: 0px 0px 3px 3px;
}
.ongoing--card:hover .ongoing--card-status, .ongoing--card.active .ongoing--card-status
{
  background-color: #f57f20;
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
.ongoing--column{
  width: 105%;
}
.ongoing-card-text{
  color: #555;
}
</style>
