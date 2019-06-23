<template lang="html">
  <div
    v-if="!loading && get_orders.length > 0"
    class="ongoing--outer"
  >
    <div
      class="ongoing--count"
      @click="toggle_ongoing()"
    >
      <span>{{ num_ongoing }} ongoing orders</span>
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
        <template v-for="order in get_orders">
          <div
            class="ongoing--card"
            :class="{ active: active_card(order.order_no) }"
            @click="track(order.order_no)"
          >
            <div class="ongoing--card-location">
              <div class="ongoing--card-padded">
                <span>{{ order.from_name }}</span>
              </div>
              <div class="">
                <span>{{ order.to_name }}</span>
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
import { mapGetters, mapMutations } from 'vuex';
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
      return this.get_orders.length;
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
        Sentry.captureException(e);
      }
    },
    getStatus(order) {
      if (!this.loading) {
        switch (order.delivery_status) {
          case 3: {
            return 'Delivered';
            break;
          }
          case 2: {
            return 'In Transit';
            break;
          }
          default: {
            switch (order.confirm_status) {
              case 1: {
                return 'Confirmed';
                break;
              }
              default: {
                return 'Pending';
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
</style>
