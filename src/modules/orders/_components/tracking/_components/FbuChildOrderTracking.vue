<template>
  <div class="homeview--child-orders">
    <template v-for="(order, index) in get_child_orders">
      <div
        :key="index"
        class="ongoing--card card--override"
        :class="{ active: active_card(order.container_no) }"
        @click="select_child_orders(index)"
      >
        <div class="ongoing--card-location ongoing--card-override">
          <div class="ongoing--card-row">
            <div class="">
              <span class="homeview--heading__container-ongoing">Container Number</span><br>
              <span class="homeview--body__container-ongoing">{{ container_number(index) }}</span>
            </div>
            <div class="">
              <span class="homeview--heading__container-ongoing">Empty Container Destination</span><br>
              <span class="homeview--body__container-ongoing">{{ order.container_destination.name }}</span>
            </div>
            <div class="">
              <span class="homeview--heading__container-ongoing">Truck Size</span><br>
              <span class="homeview--body__container-ongoing">{{ order.container_size_feet }} Feet</span>
            </div>
          </div>
        </div>
        <div class="ongoing--card-status">
          <div class="ongoing--card-text">
            {{ getStatus(order) }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import TrackingStore from '../_store';
import RegisterStoreModule from '../../../../../mixins/register_store_module';

export default {
  mixins: [RegisterStoreModule],
  data() {
    return {
      showing: false,
      actionCount: 0,
      actions: [
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your rider is on the way',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your truck has Gated-In',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your truck has Gate-Out',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your cargo is on the way to Industrial Area',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your cargo has been delivered and offloaded',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'The empty container is in-transit to Thika Depot ',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'The empty container has been delivered',
          actionTextClass: 'homeview--field-inactive',
        },
      ],
      container_no: '',
      truck_size: '',
      container_destination: '',
      delivery_status: 1,
    };
  },
  computed: {
    ...mapGetters({
      get_child_orders: '$_orders/getChildOrders',
    }),
  },
  created() {
    const STORE_PARENT = '$_orders';
    const STORE_KEY = '$_tracking';
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT, STORE_KEY], TrackingStore);
    }
  },
  methods: {
    ...mapMutations({
      select_child_orders: '$_orders/selectChildOrders',
    }),
    container_number(index) {
      if (this.get_child_orders[index].container_number) {
        return this.get_child_orders[index].container_number;
      }
      return 'Not specified';
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
    getStatus(order) {
      if (!this.loading) {
        switch (order.delivery_status) {
          case 3: {
            return 'Delivered';
          }
          case 2: {
            return 'In Transit';
          }
          default: {
            switch (order.confirm_status) {
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
  },
};

</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement.css?v=1';
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=1';
</style>
