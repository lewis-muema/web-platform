<template>
  <div class="homeview--childinfo">
    <transition name="fade">
      <div class="homeview--childinfo-card" v-if="get_selected_child !== ''">
        <div class="homeview--childinfo-card-left">
          <div class="">
            <p class="homeview--childinfo-order-status">Order Status: {{ getStatus(orderData) }}</p>
          </div>
          <div class="">
            <div class="full-width">
              <div>
                <p class="homeview--childinfo-order-details">Order details</p>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">Pick Up</p>
                  <p class="no-margin homeview--field">{{ orderData.from_details.from_name }}</p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">Order type</p>
                  <p class="no-margin homeview--field">Container order, <br>{{ get_child_orders[get_selected_child].container_size_feet }}ft Container, {{ get_child_orders[get_selected_child].container_weight_tonnes }}T</p>
                </div>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">Drop-off</p>
                  <p class="no-margin homeview--field">{{ orderData.to_details.to_name }}</p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">Container number</p>
                  <p class="no-margin homeview--field">{{ container_number }}</p>
                </div>
              </div>
              <div class="homeview--childinfo-row">
                <div class="homeview--childinfo-col-1">
                  <p class="no-margin">Empty Container Destination</p>
                  <p class="no-margin homeview--field">{{ get_child_orders[get_selected_child].container_destination.name }}</p>
                </div>
                <div class="homeview--childinfo-col-2">
                  <p class="no-margin">Consignee</p>
                  <p class="no-margin homeview--field">{{ get_child_orders[get_selected_child].consignee }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="homeview--childinfo-cancel" v-if="orderData.confirm_status === 0">
            <button class="button-primary">CANCEL ORDER</button>
          </div>
          <div class="full-width homeview--childinfo-rider-details" v-else>
            <div class="homeview--childinfo-rider-col">
              <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/tracking/contact.png" class="homeview--childinfo-contact">
            </div>
            <div class="homeview--childinfo-rider-col">
              <p class="no-margin">{{ orderData.rider.rider_name }}</p>
              <p class="no-margin">{{ orderData.rider.rider_phone }}</p>
            </div>
            <div class="homeview--childinfo-rider-col">
              <p class="no-margin">{{ orderData.rider.number_plate }}</p>
              <p class="no-margin">{{ orderData.rider.vehicle_name }}</p>
            </div>
          </div>
        </div>
        <div class="homeview--childinfo-card-right">
          <div class=""/>
          <div class="">
            <p class="homeview--childinfo-order-details">
              Order Timeline
            </p>
          </div>
          <div :key="action.actionText" class="homeview--childinfo-order-actions" v-for="action in actions">
            <i :class="action.actionClass" class="el-icon-success" />
            <p class="no-margin" :class="action.actionTextClass">{{ action.actionText }}</p>
          </div>
        </div>
      </div>
    </transition>
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
      orderData: {},
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
      get_selected_child: '$_orders/getSelectedChild',
    }),
    container_number() {
      if (this.get_child_orders[this.get_selected_child].container_number) {
        return this.get_child_orders[this.get_selected_child].container_number;
      }
      return 'Not specified';
    },
  },
  created() {
    const STORE_PARENT = '$_orders';
    const STORE_KEY = '$_tracking';
    if (!this.$store.state[STORE_PARENT][STORE_KEY]) {
      this.$store.registerModule([STORE_PARENT, STORE_KEY], TrackingStore);
    }
  },
  mounted() {
    this.$store
      .dispatch('$_orders/getOrderData', { order_no: this.$route.params.order })
      .then((response) => {
        if (response.data.status) {
          this.orderData = response.data;
          let data = {};
          response.data.freight_order_details.containers.container_details.forEach((row, i) => {
            data = {
              index: i,
              vals: row,
            };
            this.setChildOrders(data);
          });
        } else {
          this.doNotification('2', 'Failed to fetch child orders', 'Please retry after a few minutes');
        }
      });
  },
  destroyed() {
    this.clear_child_orders();
    this.clear_selected_child();
  },
  methods: {
    ...mapMutations({
      setChildOrders: '$_orders/setChildOrders',
      clear_child_orders: '$_orders/clearChildOrders',
      clear_selected_child: '$_orders/clearSelectedChild',
    }),
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
    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },
  },
};

</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement.css?v=1';
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=1';
</style>
