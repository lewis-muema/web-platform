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
              <div class="cancel-reason-title-name">
                {{$t('general.why_cancel')}}
              </div>
            </div>
            <div class="cancel-reason-text">
              <div v-for="reason in cancellation_reasons" :key="reason.id">
                <div class="cancel-reason-text" id="cancel-reason-text">
                  <div class="">
                    <el-radio
                      v-model="cancel_reason"
                      :label="JSON.stringify(reason.cancellation_reason_id)"
                    >
                      {{ reason.cancellation_reason }}
                    </el-radio>
                  </div>
                </div>
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
            <div class="action--slide-desc-confirm">
              <button
                type="button"
                name="button"
                class="action--slide-button cancellation-submit submit-cancell-btn"
                @click="cancelOrder()"
              >
                {{$t('general.submitCapital')}}
              </button>
              <button
                type="button"
                name="button"
                class="action--slide-button cancellation-submit"
                @click="cancelToggle()"
              >
                {{$t('general.dont_cancel')}}
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
                class="action--slide-button cancellation-submit submit-cancell-btn"
                @click="cancelToggle(cancel_reason)"
              >
                {{$t('general.ok_call_rider')}}
              </button>
              <button
                type="button"
                name="button"
                class="action--slide-button cancellation-submit"
                @click="cancelOrder()"
              >
               {{$t('general.cancel_order')}}
              </button>
            </div>
          </div>
        </el-dialog>
      </div>
    </transition>
    <FbuTrackBar @fetchreasons="retrieveCancellationReasons()" @clicked="cancelOption = true" />
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters, mapMutations, mapActions } from 'vuex';
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
      cancellation_reasons: [],
      cancellation_state: false,
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/trackingData',
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
    ...mapActions({
      requestCancellationReasons: '$_orders/$_tracking/requestCancellationReasons',
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
    retrieveCancellationReasons() {
      const session = this.$store.getters.getSession;
      const riderInfo = this.tracking_data.rider;
      const countryCode = this.tracking_data.currency === 'USD' ? this.tracking_data.path[0].country_code : session[session.default].country_code;
      const params = {
        vendor_id: riderInfo.vendor_id,
        order_status: 1,
        country_code: countryCode,
        status: 1,
      };
      this.requestCancellationReasons(params).then(
        (response) => {
          if (response.status) {
            this.cancellation_reasons = response.data;
            this.cancellation_state = true;
          } else {
            this.cancellation_state = false;
          }
        },
        (error) => {
          this.cancellation_state = false;
        },
      );
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
          this.$mixpanel.track(name);
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
  width: 400px;
}
.cancel-reason-option {
  text-align: center;
}
.action--slide-desc {
  display: flex;
  justify-content: center;
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
.cancel-reason-title-name {
  font-size: 17px;
  padding-left: 9%;
  color: #1c1c1c;
  margin: 5px 0px 15px 0px;
  font-weight: 600;
}
.cancel-reason-text {
  padding-left: 5%;
  margin-bottom: 10px;
  margin-top: 10px;
}
#cancel-reason-text > div > label > span.el-radio__label{
  line-height: 23px;
  color: #000000;
  font-size: 14px !important;
  padding-left: 5px;
  white-space: inherit !important;
}
#cancel-reason-text > div > label > span.el-radio__input > span{
  border: 1px solid #000;
}
.cancellation-submit{
  font-size: 12px !important;
  border-radius: 7px;
  height: 40px;
  margin-left: 4% !important;
}
.accept-cancell-btn{
  background: #FFFFFF !important;
  color: #808080 !important;
  border: 1px solid #808080 !important;
}
.submit-cancell-btn{
  background: #FFFFFF !important;
  color: #1682c5 !important;
  border: 1px solid #1682c5 !important;
}
.action--slide-desc-confirm {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: center;
  padding: 10px 0px 0px 0px;
}
.cancelOptions--content-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: auto;
  padding-top: 15px;
}
.cancelOptions--content-message {
  line-height: 23px;
  color: #000000;
  font-size: 14px !important;
  padding-left: 5px;
  white-space: inherit !important;
}
</style>
