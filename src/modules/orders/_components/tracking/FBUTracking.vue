<template lang="html">
  <div class="">
    <a
      v-if="this.$route.name === 'freight_order_tracking'"
      class="back--button"
      @click="$router.push('/orders/freight');"
    >
      <i class="el-icon-back" />
    </a>
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="cancel-pop-up">
        <el-dialog
          :visible.sync="cancelOption"
          class="cancelOptions"
        >
          <div
            v-if="cancel_reason !== '4'"
            class="cancelOptions--content-wrap"
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
          </div>
          <div
            v-if="cancel_reason === '4'"
            class="cancelOptions--content-wrap"
          >
            <div class="cancelOptions--content-message">
              Did you know after your order is confirmed you can
              call your rider and give him the right destination?
              We will recalculate the cost and deliver your item.
            </div>
            <div class="cancelOptions--content-buttons">
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelToggle(cancel_reason)"
              >
                Okay, I'll call the rider
              </button>
              <button
                type="button"
                name="button"
                class="default action--slide-button"
                @click="cancelOrder()"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </el-dialog>
      </div>
    </transition>
    <FbuTrackBar @clicked="cancelOption = true" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faWallet } from '@fortawesome/free-solid-svg-icons';
import TrackingStore from './_store';
import FbuTrackBar from './_components/FbuTrackBar.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';

library.add(faArrowLeft);
library.add(faWallet);

export default {
  name: 'FBUTracking',
  components: { FbuTrackBar },
  mixins: [RegisterStoreModule],
  data() {
    return {
      cancel_reason: '',
      cancelOption: false,
      cancel_popup: '',
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      parent_order: '$_orders/getParentOrder',
      vendors: '$_orders/getVendors',
    }),
  },
  watch: {
    $route() {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.clearVendorMarkers();
      this.hide_vendors();
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
    this.change_page(1);
    this.hide_vendors();
  },
  methods: {
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      change_page: '$_orders/setPage',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      set_parent_order: '$_orders/setParentOrder',
    }),
    cancelToggle(cancelReason = 0) {
      if (cancelReason === '4') {
        this.trackMixpanelEvent('Dissuaded Cancellation ', {
          'Order No': this.tracking_data.order_no,
        });
      }
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
      this.cancel_reason = '';
    },
    cancelOrder() {
      if (this.cancel_reason !== '') {
        const payload = {
          order_no: this.tracking_data.order_no,
          cancel_reason_id: this.cancel_reason,
          reason_description: '',
          client_type: this.$store.getters.getSession.default,
        };
        const that = this;
        this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then((response) => {
          if (response.status) {
            that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
            that.cancelToggle();
            that.set_parent_order('');
            that.$router.push('/orders/freight');
          } else {
            const payload2 = {
              order_no: that.$route.params.order_no,
              cancel_reason_id: 4,
              reason_description: 'I placed the wrong locations',
              client_type: that.$store.getters.getSession.default,
            };
            this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload2).then((response2) => {
              if (response2.status) {
                that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
                that.cancelToggle();
                that.set_parent_order('');
                that.$router.push('/orders/freight');
              } else {
                that.doNotification(
                  2,
                  'Order cancellation failed',
                  'Could not cancel the order. Please contact Customer Care at 0709779779.',
                );
              }
            });
          }
        });
      } else {
        this.doNotification(3, 'Order cancellation failed', 'Please select cancellation reason.');
      }
    },
    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">
.back--button
{
  position: absolute;
  top: 80px;
  left: 10px;
  border: 1px solid #55555500;
  background-color: #fff;
  border-radius: 50%;
  padding: 15px;
  font-size: larger;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  cursor: pointer;
  color: #555;
}
.cancelOptions .el-dialog {
  width: 350px;
}
.cancel-reason-option {
  text-align: center;
}
.action--slide-desc {
  display: flex;
  justify-content: center;
}
.cancel-reason-text {
  padding-left: 15%;
}
.action--slide-button {
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
</style>
