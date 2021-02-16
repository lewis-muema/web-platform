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
                {{$t('general.cancel_this_order')}}
              </div>
              <div class="cancel-reason-option">
                {{$t('general.place_another_one_any_time')}}
              </div>
            </div>
            <div class="cancel-reason-text">
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="4"
                >
                  {{$t('general.placed_wrong_location')}}
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="5"
                >
                  {{$t('general.order_not_ready')}}
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="7"
                >
                  {{$t('general.no_driver_allocated')}}
                </el-radio>
              </div>
              <div class="">
                <el-radio
                  v-model="cancel_reason"
                  label="8"
                >
                  {{$t('general.placed_order_twice')}}
                </el-radio>
              </div>
            </div>
            <div class="cancel-reason-input">
              <input
                v-model="inputCancelReason"
                type="text"
                class="cancel-reason-text-input"
                name=""
                placeholder="Enter cancel reason"
              >
            </div>
            <div class="action--slide-desc">
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelOrder()"
              >
                {{$t('general.yes')}}
              </button>
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelToggle()"
              >
                {{$t('general.no')}}
              </button>
            </div>
          </div>
          <div
            v-if="cancel_reason === '4'"
            class="cancelOptions--content-wrap"
          >
            <div class="cancelOptions--content-message">
              {{$t('general.call_rider_and_right_destination')}}
            </div>
            <div class="cancelOptions--content-buttons">
              <button
                type="button"
                name="button"
                class="action--slide-button"
                @click="cancelToggle(cancel_reason)"
              >
                {{$t('general.ok_call_the_rider')}}
              </button>
              <button
                type="button"
                name="button"
                class="default action--slide-button"
                @click="cancelOrder()"
              >
               {{$t('general.cancel_order')}}
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
import _ from 'lodash';
import { mapGetters, mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faWallet } from '@fortawesome/free-solid-svg-icons';
import TrackingStore from './_store';
import FbuTrackBar from './_components/FbuTrackBar.vue';
import RegisterStoreModule from '../../../../mixins/register_store_module';
import EventsMixin from '../../../../mixins/events_mixin';
import NotificationMxn from '../../../../mixins/notification_mixin';

library.add(faArrowLeft);
library.add(faWallet);

export default {
  name: 'FBUTracking',
  components: { FbuTrackBar },
  mixins: [RegisterStoreModule, EventsMixin, NotificationMxn],
  data() {
    return {
      cancel_reason: '',
      cancelOption: false,
      cancel_popup: '',
      inputCancelReason: '',
      cancel_desc: '',
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
    inputCancelReason(data) {
      if (data) {
        this.cancel_reason = 11;
        this.cancel_desc = data;
        this.debounceCancelReason(data);
      } else {
        this.cancel_reason = -1;
        this.cancel_desc = '';
      }
    },
    cancel_reason(reason) {
      switch (reason) {
        case 4: {
          this.cancel_desc = this.$t('general.placed_wrong_location');
          break;
        }
        case 5: {
          this.cancel_desc = this.$t('general.order_not_ready');
          break;
        }
        case 7: {
          this.cancel_desc = this.$t('general.no_driver_allocated');
          break;
        }
        case 8: {
          this.cancel_desc = this.$t('general.placed_order_twice');
          break;
        }
        default:
      }
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
    // eslint-disable-next-line func-names
    debounceCancelReason: _.debounce(function () {
      this.fireGAEvent({
        eventCategory: 'Order Cancellation',
        eventAction: 'Click',
        eventLabel: 'Enter cancel reason input - Order Cancellation Page - WebApp',
      });
    }, 500),
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
    cancelPromocode() {
      const session = this.$store.getters.getSession;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const payload = {
        cop_id: copID,
        individual_id: individualID,
        coupon_code: '',
        coupon_amount: 0,
        is_cancelled: true,
        coupon_type: 0,
      };

      this.$store.dispatch('$_orders/$_tracking/cancelCoupon', payload).then(
        response => response.status,
        error => error,
      );
    },

    cancelOrder() {
      if (this.cancel_reason !== '') {
        const payload = {
          order_no: this.tracking_data.order_no,
          cancel_reason_id: this.cancel_reason,
          reason_description: this.cancel_desc,
          client_type: this.$store.getters.getSession.default,
        };
        const that = this;
        if (this.inputCancelReason) {
          this.submitHubspotCancelReason();
          this.fireGAEvent({
            eventCategory: 'Order Cancellation',
            eventAction: 'Click',
            eventLabel: 'Submit cancel reason input - Order Cancellation Page - WebApp',
          });
        }
        this.cancelPromocode();

        this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then((response) => {
          if (response.status) {
            that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
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
                that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
                that.cancelToggle();
                that.set_parent_order('');
                that.$router.push('/orders/freight');
              } else {
                that.doNotification(
                  2,
                  this.$t('general.order_cancellation_failed'),
                  this.$t('general.not_cancel_order_contact_support')
                );
              }
            });
          }
        });
      } else {
        this.doNotification(3,  this.$t('general.order_cancellation_failed'),  this.$t('general.select_cancellation_reason'));
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
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
    submitHubspotCancelReason() {
      const session = this.$store.getters.getSession;
      // eslint-disable-next-line global-require
      const portalId = '4951975';
      const formId = '396e6fb7-2bb9-4bae-a5e7-623983ecd97e';
      const fields = {
        fields: [
          {
            name: 'firstname',
            value: session[session.default].user_name,
          },
          {
            name: 'email',
            value: session[session.default].user_email,
          },
          {
            name: 'phone',
            value: session[session.default].user_phone,
          },
          {
            name: 'cancel_reason',
            value: this.inputCancelReason,
          },
        ],
      };
      const payload = {
        values: fields,
        app: 'HUBSPOT_URL',
        vm: this,
        endpoint: `${portalId}/${formId}`,
      };

      this.$store
        .dispatch('requestAxiosPost', payload)
        .then(response => response)
        .catch(err => err);
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
  background-color: #007FFF;
  color: #fff;
  width: 100%;
  height: 30px;
  cursor: pointer;
  border: 0px solid;
  border-radius: 2px;
}
.cancel-reason-text-input {
  display: none;
  width: 180px;
  height: 25px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #dbd8d8;
  padding-left: 15px;
  margin-left: auto;
  margin-right: auto;
}
</style>
