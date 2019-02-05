<template lang="html">
  <div class="">
    <div class="">
      <div v-if="allow_return"
class="homeview-locations-options--set-return">
        <el-checkbox
v-model="return_status"
                     @input="dispatchReturnToPickup"
>
          Return to pick up
        </el-checkbox>
      </div>
      <div class="home-view-vendor-classes--label">
        <div
class="home-view-vendor-classes-label-item"
             @click="do_set_active_order_option('payment')"
>
          <a
            class="home-view-vendor-classes-menu section__link"
            :class="get_current_active_order_option_class('payment')"
          >
            <span class="home-view-actions--items__span">
              <i class="el-icon-goods" /> Payment
            </span>
          </a>
        </div>
        <div
class="home-view-vendor-classes-label-item"
             @click="do_set_active_order_option('note')"
>
          <a
            class="home-view-vendor-classes-menu section__link"
            :class="get_current_active_order_option_class('note')"
          >
            <span class="home-view-actions--items__span">
              <i class="el-icon-edit-outline" /> Note
            </span>
          </a>
        </div>
        <div
class="home-view-vendor-classes-label-item"
             @click="do_set_active_order_option('schedule')"
>
          <a
            class="home-view-vendor-classes-menu section__link"
            :class="get_current_active_order_option_class('schedule')"
          >
            <span class="home-view-actions--items__span">
              <i class="el-icon-time" /> Schedule
            </span>
          </a>
        </div>
      </div>
    </div>

    <div v-if="get_active_order_option === 'payment'"
class="home-view-actions--note">
      <div class="" />
      <div class="home-view-notes-wrapper">
        <div v-show="show_payment"
class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
          <div class="home-view-payments-wrapper">
            <div class="home-view-payments-wrapper--left">
              <div class="home-view-payments-wrapper--left__amount-label">
                Total Payment
              </div>
              <div class="home-view-payments-wrapper--left__amount-figure">
                Ksh {{ pending_amount }}
              </div>
            </div>
            <div class="home-view-payments-wrapper--right">
              <div class="home-view-payments-wrapper--right-label">
                {{ balance_quote_label }}
              </div>
              <div class="home-view-payments-wrapper--right-amount">
                Ksh {{ abs_running_balance }}
              </div>
            </div>
          </div>
        </div>

        <span v-if="get_price_request_object.payment_option !== 2">
          <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
            <div class="home-view-notes-wrapper--item__option">
              <div class="home-view-notes-wrapper--item__option-div">
                <el-radio
v-model="payment_method"
                          label="1"
>
                  M-Pesa
                </el-radio>
              </div>
            </div>
            <div class="home-view-notes-wrapper--item__value" />
          </div>
          <span v-if="allowCash === true">
            <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
              <div class="home-view-notes-wrapper--item__option">
                <div class="home-view-notes-wrapper--item__option-div">
                  <el-radio
v-model="payment_method"
                            label="3"
>
                    Payment on delivery
                  </el-radio>
                </div>
              </div>
              <div class="home-view-notes-wrapper--item__value" />
            </div>
          </span>
          <div v-if="Array.isArray(get_saved_cards) && get_saved_cards.length > 0"
class="">
            <div
              v-for="card in get_saved_cards"
              class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
            >
              <div class="home-view-notes-wrapper--item__option">
                <div class="home-view-notes-wrapper--item__option-div">
                  <el-radio
v-model="payment_method"
                            :label="getCardValue(card.last4)"
>
                    **** **** **** {{ card.last4 }} <font-awesome-icon
:icon="getCardIcon(card)"
                                                                       class="payments-orange"
/>
                  </el-radio>
                </div>
              </div>
              <div class="home-view-notes-wrapper--item__value" />
            </div>
          </div>
          <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
            <div class="home-view-notes-wrapper--item__option">
              <div class="home-view-notes-wrapper--item__option-div">
                <div
class="home-view-notes-wrapper--item__link"
                     @click="takeMeToAddNewCard()"
>
                  +  &nbsp;&nbsp; Visa/Mastercard
                </div>
              </div>
            </div>
            <div class="home-view-notes-wrapper--item__value" />
          </div>
        </span>
        <span v-else>
          <div class="home-view-payments--postpay">
            <p>This is a postpay account</p>
            <p>The delivery costs will be added to your balance.</p>
          </div>
        </span>
      </div>
    </div>

    <div v-if="get_active_order_option === 'note'"
class="home-view-actions--note">
      <div class="" />
      <div class="">
        <textarea
          name="name"
          v-model="order_notes" rows="5" class="textarea-control"
          placeholder="Additional delivery instructions"
        />
      </div>
      <div class="" />
    </div>
    <div v-if="get_active_order_option === 'schedule'"
class="home-view-actions--note">
      <div class="home-view-actions--schedule">
        Schedule a pickup time for your order
      </div>
      <div class="">
        <div class="block">
          <el-date-picker
            v-model="schedule_time"
            class="home-view-actions__element-date"
            type="datetime"
            :picker-options="schedule_picker_options"
            format="dd-MM-yyyy h:mm a"
            placeholder="Select date and time"
          />
        </div>
      </div>
      <div class="" />
    </div>
    <div class="home-view-place-order">
      <div
        v-if="loading"
        v-loading="loading"
        class="orders-loading-container orders-loading-container--completion"
      />
      <div v-if="!loading && payment_state === 0">
        <button
          type="button"
          class="button-primary home-view--place-order"
name="button"
          @click="preCheckPaymentDetails()"
        >
          {{ place_order_text }}
        </button>
      </div>
      <div v-if="loading && payment_state === 1"
class="home-view-place-order--mpesa-cancel">
        <button
          type="button"
          class="button-primary home-view--place-order"
name="button"
          @click="cancelMpesaPaymentRequest()"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import NoSSR from 'vue-no-ssr';
import numeral from 'numeral';
import payment_store from '../../../../payment/_store';
import order_store from '../../../_store';
import home_store from '../_store';
import Mcrypt from '../../../../../mixins/mcrypt_mixin.js';

export default {
  name: 'OrderOptions',
  components: {
    'no-ssr': NoSSR,
  },
  mixins: [Mcrypt],
  data() {
    return {
      schedule_time: this.moment(),
      order_notes: '',
      payment_method: '',
      balance_quote: '',
      order_amount: 0,
      user_balance: 0,
      mpesa_poll_timer_id: null,
      loading: false,
      cash_status: false,
      card_token: '',
      customer_token: '',
      payment_type: 'prepay',
      payment_state: 0, // 0- initial 1- loading 2- success 3- cancelled
      should_destroy: false,
      schedule_picker_options: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      price_request_response_received: false,
      vendors_without_return: ['Standard', 'Runner'],
      return_status: false,
    };
  },

  computed: {
    ...mapGetters({
      get_active_order_option: '$_orders/$_home/get_active_order_option',
      getRunningBalance: 'getRunningBalance',
      get_price_request_object: '$_orders/$_home/get_price_request_object',
      get_active_package_class: '$_orders/$_home/get_active_package_class',
      get_active_vendor_name: '$_orders/$_home/get_active_vendor_name',
      active_vendor_price_data: '$_orders/$_home/get_active_vendor_details',
      get_order_path: '$_orders/$_home/get_order_path',
      get_pickup_filled: '$_orders/$_home/get_pickup_filled',
      get_payment_method: '$_orders/$_home/get_payment_method',
      get_order_notes: '$_orders/$_home/get_order_notes',
      get_schedule_time: '$_orders/$_home/get_schedule_time',
      get_saved_cards: '$_orders/$_home/get_saved_cards',
      get_stripe_user_id: '$_orders/$_home/get_stripe_user_id',
      get_carrier_type: '$_orders/$_home/get_carrier_type',
      getReturnStatus: '$_orders/$_home/getReturnStatus',
    }),

    active_price_tier_data() {
      if (this.get_active_package_class != '') {
        return this.get_price_request_object.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class,
        );
      }
      return '';
    },

    order_cost() {
      let cost = 0;
      if (typeof this.active_vendor_price_data !== 'undefined') {
        if ('cost' in this.active_vendor_price_data) {
          if (
            this.getReturnStatus !== true
						|| this.vendors_without_return.includes(this.get_active_vendor_name)
          ) {
            cost =							this.active_vendor_price_data.cost - this.active_vendor_price_data.discountAmount;
            return cost;
          }
          cost =						this.active_vendor_price_data.return_cost
						- this.active_vendor_price_data.discountAmount;
          return cost;
        }
      }

      return cost;
    },

    allowCash() {
      return this.get_price_request_object.payment_option == 2 || this.getRunningBalance <= 0;
    },

    hide_payment() {
      return (
        this.get_price_request_object.payment_option == 2
				|| this.getRunningBalance == 0
				|| this.getRunningBalance + this.order_cost <= 0
      );
    },

    show_payment() {
      return !this.hide_payment;
    },

    place_order_text() {
      let text = 'Confirm ';
      if (this.order_is_scheduled == true) {
        text = 'Schedule ';
      }
      return `${text}${this.get_active_vendor_name} Order`;
    },

    order_is_scheduled() {
      return this.moment(this.eta_time).isBefore(this.scheduled_time);
    },

    eta_time() {
      return this.moment()
        .add(this.active_vendor_price_data.eta, 'second')
        .format('YYYY-MM-DD HH:mm:ss');
    },

    scheduled_time() {
      return this.moment(this.schedule_time, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
    },

    getRB() {
      return numeral(this.getRunningBalance).format('0,0');
    },

    pending_amount() {
      return numeral(this.getRunningBalance + this.order_cost).format('0,0');
    },

    raw_pending_amount() {
      return this.getRunningBalance + this.order_cost;
    },

    payment_is_to_be_requested() {
      return this.getRunningBalance + this.order_cost > 0;
    },

    order_cost_display() {
      return numeral(this.order_cost).format('0,0');
    },

    abs_running_balance() {
      return numeral(Math.abs(this.getRunningBalance)).format('0,0');
    },

    balance_quote_label() {
      if (this.getRunningBalance > 0) {
        return 'You Owe';
      }
      if (this.getRunningBalance + this.order_cost > 0) {
        return 'Your Balance';
      }
    },

    allow_return() {
      // let allowed = true;
      // if (this.vendors_without_return.includes(this.get_active_vendor_name)) {
      //   allowed = false;
      // }
      // return allowed;
      // Disable return for now
      return false;
    },
  },

  methods: {
    ...mapMutations({
      remove_polyline: '$_orders/remove_polyline',
      remove_markers: '$_orders/remove_markers',
      unsetMap: '$_orders/unsetMap',
      set_active_order_option: '$_orders/$_home/set_active_order_option',
      setPickupFilled: '$_orders/$_home/set_pickup_filled',
      setPaymentMethod: '$_orders/$_home/set_payment_method',
      setScheduleTime: '$_orders/$_home/set_schedule_time',
      setOrderNotes: '$_orders/$_home/set_order_notes',
      clear_order_path: '$_orders/$_home/clear_order_path',
      clear_location_names_state: '$_orders/$_home/clear_location_names',
      clear_price_request_object: '$_orders/$_home/clear_price_request_object',
      clear_extra_destinations: '$_orders/$_home/clear_extra_destination',
      setSavedCards: '$_orders/$_home/set_saved_cards',
      setStripeUserId: '$_orders/$_home/set_stripe_user_id',
      setReturnStatus: '$_orders/$_home/setReturnStatus',
    }),

    ...mapActions({
      requestRunningBalanceFromAPI: '$_payment/requestRunningBalance',
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      requestCardPaymentAction: '$_payment/requestCardPayment',
      completeCardPaymentAction: '$_payment/completeCardPaymentRequest',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
      requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
      requestSavedCards: '$_orders/$_home/requestSavedCards',
    }),

    do_set_active_order_option(name) {
      this.get_active_order_option != name
        ? this.set_active_order_option(name)
        : this.set_active_order_option('');
    },

    get_current_active_order_option_class(name) {
      return {
        'router-link-active': name == this.get_active_order_option,
      };
    },

    checkAllowPrePaid() {
      if (
        this.get_price_request_object.payment_option == 1
				&& this.getRunningBalance + this.order_cost > 0
      ) {
        return false;
      }
      return true;
    },

    preCheckPaymentDetails() {
      this.loading = true;
      this.refreshRunningBalance().then(
        (response) => {
          this.loading = false;
          this.checkPaymentDetails();
        },
        (error) => {
          this.doNotification(
            '2',
            'Running balance check',
            'Running balance check has failed, please try again.',
          );
          this.loading = false;
        },
      );
    },

    checkPaymentDetails() {
      if (this.get_active_vendor_name === '') {
        this.doNotification(
          '2',
          'Select a vehicle type',
          'The vehicle type not been set, please set and try again.',
        );
        return false;
      }

      if (this.payment_method == '') {
        if (this.checkAllowPrePaid() == true) {
          this.handlePostPaidPayments();
        } else {
          this.doNotification(
            '2',
            'Choose a payment method',
            'Please select a payment method and try again.',
          );
          return false;
        }
      } else {
        this.saveInfoToStore();
        if (this.payment_method == 1) {
          this.handleMpesaPayments();
        } else if (this.payment_method == 3) {
          this.handleCashPayments();
        } else if (this.payment_method == 5) {
          this.handlePromoCodePayments();
        } else if (this.payment_method.startsWith('2_')) {
          const card = this.get_saved_cards.find(
            card_details => card_details.last4 === this.payment_method.slice(2),
          );
          this.handleCardPayments(card);
        } else {
          // console.log('not handled payment method', this.payment_method);
        }
      }

      return true;
    },

    handleMpesaPayments() {
      if (this.payment_is_to_be_requested === true) {
        this.requestMpesaPayment();
        return false;
      }

      this.doCompleteOrder();
      return true;
    },

    handlePromoCodePayments() {
      this.$router.push({
        name: 'promo_payment',
      });
    },

    handleCashPayments() {
      this.cash_status = true;
      this.doCompleteOrder();
    },

    takeMeToAddNewCard() {
      this.$router.push({
        name: 'card_payment',
        query: {
          action: 'add',
        },
      });
    },

    handlePostPaidPayments() {
      this.payment_type = 'postpay';
      this.doCompleteOrder();
    },

    doCompleteOrder() {
      const payload = {
        values: this.getCompleteOrderObject(),
        app: 'PRIVATE_API',
        endpoint: 'pay',
      };
      this.loading = true;
      this.requestOrderCompletion(payload).then(
        (response) => {
          this.loading = false;
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status === true) {
            this.setPickupFilled(false);
            const order_no = this.active_vendor_price_data.order_no;
            this.should_destroy = true;
            this.$store.dispatch('$_orders/fetch_ongoing_orders');
            this.$router.push({
              name: 'tracking',
              params: {
                order_no,
              },
            });
          } else {
            this.doNotification(
              2,
              'Order completion failed',
              'Price request failed. Please try again',
            );
          }
        },
        (error) => {
          this.doNotification(
            3,
            'Order completion failed',
            'Order completion failed. Please check your internet connection and try again.',
          );
          this.loading = false;
        },
      );
    },

    getCompleteOrderObject() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      let payload = {
        note: this.order_notes,
        trans_no: this.active_vendor_price_data.order_no,
        user_email: acc.user_email,
        user_phone: acc.user_phone,
        no_charge_status: false,
        insurance_amount: 10,
        cash_status: this.cash_status,
        note_status: typeof this.order_notes === 'undefined' ? false : this.order_notes.length > 0,
        last_digit: 'none',
        insurance_id: 1,
        platform: 'corporate',
        card_token: this.card_token,
        customer_token: this.customer_token,
        insurance_status: true,
        close_rider_id: 0,
        amount: this.active_vendor_price_data.cost,
        schedule_status: this.order_is_scheduled,
        destination_paid_status: false,
        delivery_points: this.get_order_path.length - 1,
        sendy_coupon: '0',
        payment_mode: this.payment_method.startsWith('2')
          ? 2
          : this.payment_method === ''
            ? 0
            : parseInt(this.payment_method),
        schedule_time: this.order_is_scheduled ? this.scheduled_time : this.eta_time,
        tier_tag: this.active_vendor_price_data.tier_tag,
        tier_name: this.active_vendor_price_data.tier_name,
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        carrier_type: parseInt(this.get_carrier_type),
        isreturn:
					this.getReturnStatus === true
					&& this.vendors_without_return.includes(this.get_active_vendor_name) === false,
        vendor_type: this.active_vendor_price_data.vendor_id,
        rider_phone: this.active_vendor_price_data.order_no,
        type: this.payment_type,
      };
      payload = {
        values: payload,
      };
      return payload;
    },

    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = {
        title,
        level,
        message,
      };
      this.$store.commit('setNotification', notification);
    },

    saveInfoToStore() {
      // save locations, notes & payment option
      this.setScheduleTime(this.schedule_time);
      this.setPaymentMethod(this.payment_method);
      this.setOrderNotes(this.order_notes);
    },

    retrieveFromStore() {
      this.schedule_time = this.get_schedule_time;
      this.payment_method = this.get_payment_method;
      this.order_notes = this.get_order_notes;
    },

    refreshRunningBalance() {
      return new Promise((resolve, reject) => {
        const session = this.$store.getters.getSession;

        const running_balance_payload = {
          values: {
            cop_id: 'cop_id' in session[session.default] ? session[session.default].cop_id : 0,
            user_phone: session[session.default].user_phone,
          },
        };

        const payload = {
          values: running_balance_payload,
          app: 'PRIVATE_API',
          endpoint: 'running_balance',
        };
        this.requestRunningBalanceFromAPI(payload).then(
          (response) => {
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status == 200) {
              this.$store.commit('setRunningBalance', response.data.running_balance);
              this.setDefaultOptions();
              resolve(response.data);
            } else {
              reject(response.data);
            }
          },
          (error) => {
            reject(response.data);
          },
        );
      });
    },

    initializeOrderPlacement() {
      if (this.get_schedule_time != '') {
        this.retrieveFromStore();
      }

      return false;
    },

    getCardValue(last4digits) {
      return `2_${last4digits}`;
    },

    setDefaultOptions() {
      if (this.get_active_order_option == '') {
        if (this.show_payment == true) {
          this.set_active_order_option('payment');
        }
      }
    },

    getCardIcon(card) {
      const name = `cc-${card.type.toLowerCase()}`;
      return ['fab', name];
    },

    /* start mpesa */

    requestMpesaPayment() {
      const session = this.$store.getters.getSession;
      let referenceNumber = 'SENDY';
      let cop_id = 0;
      let user_id = 0;
      let user_email = '';
      let user_phone = '';
      if (session.default === 'biz') {
        referenceNumber += session.biz.cop_id;
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_email = session.biz.user_email;
        user_phone = session.biz.user_phone;
      } else {
        referenceNumber = session.peer.user_phone;
        user_id = session.peer.user_id;
        user_email = session.peer.user_email;
        user_phone = session.peer.user_phone;
      }

      const mpesa_payload = {
        amount: this.raw_pending_amount,
        sourceMobile: user_phone,
        referenceNumber,
        user_id,
        cop_id,
        phone: user_phone,
        email: user_email,
      };
      const full_payload = {
        values: mpesa_payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };
      this.payment_state = 1;
      this.loading = true;

      this.requestMpesaPaymentAction(full_payload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status === 200) {
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `Request for payment sent to ${user_phone}.`,
            );
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshRunningBalance();
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `M-Pesa request to ${user_phone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
                this.pending_amount
              }.`,
            );
            this.payment_state = 0;
            this.loading = false;
          }
        },
        (error) => {
          this.refreshRunningBalance();
          this.doNotification(
            '0',
            'M-Pesa Payment',
            `M-Pesa request to ${user_phone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
              this.pending_amount
            }.`,
          );
          this.payment_state = 0;
          this.loading = false;
        },
      );
    },

    clearMpesaPollCounter() {
      // fails silently if the id is not found
      window.clearTimeout(this.mpesa_poll_timer_id);
    },

    requestMpesaPaymentPoll(poll_limit_value = 6) {
      this.clearMpesaPollCounter();
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }

      const old_rb = this.$store.getters.getRunningBalance;
      const requested_amount = this.raw_pending_amount;

      const running_balance_payload = {
        values: {
          cop_id,
          user_phone: session[session.default].user_phone,
        },
      };

      const payload = {
        params: running_balance_payload,
        app: 'PRIVATE_API',
        endpoint: 'running_balance',
      };

      const poll_limit = poll_limit_value; // 10secs * 6  = 60sec = 1min
      // poll the dispatch
      for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
        // wait 10 seconds
        const that = this;
        (function (poll_count) {
          that.mpesa_poll_timer_id = window.setTimeout(() => {
            const res = that.checkRunningBalance(old_rb, payload);
            if (res) {
              poll_count = poll_limit;
              that.payment_state = 0;
              that.loading = false;
              that.doNotification('1', 'Payment successful', 'Completing your order...');
              that.doCompleteOrder();
              return true;
            }

            if (poll_limit_value === 6) {
              if (poll_count === 5) {
                that.doNotification(
                  '0',
                  'Payment not received',
                  "We'll keep retrying to check your payment status and complete your order once the payment is received.",
                );
                that.payment_state = 0;
                that.loading = false;
                that.requestMpesaPaymentPoll(60);
              }
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    checkRunningBalance(old_rb, payload) {
      this.requestRunningBalanceFromAPI(payload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status === 200) {
            const new_rb = response.data.running_balance;

            if (new_rb < old_rb) {
              this.completeMpesaPaymentRequest({});
              return true;
            }
          }

          return false;
        },
        error => false,
      );
    },

    cancelMpesaPaymentRequest() {
      this.payment_state = 0;
      this.loading = 0;
      this.doNotification(
        '2',
        'M-Pesa Payment cancelled',
        'M-Pesa payment has been cancelled, please try again.',
      );
      this.requestMpesaPaymentPoll(60);
    },

    instantiateReturnStatus() {
      this.return_status = this.getReturnStatus;
    },

    dispatchReturnToPickup() {
      this.setReturnStatus(this.return_status);
    },

    /* End mpesa */

    /* start card */

    getUserCards() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      let user_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
      } else {
        cop_id = 0;
        user_id = session.peer.user_id;
      }

      let card_payload = {
        user_id,
        cop_id,
      };

      // encrypt card payload here
      card_payload = Mcrypt.encrypt(card_payload);

      const full_payload = {
        values: card_payload,
        app: 'PRIVATE_API',
        endpoint: 'get_card',
      };

      this.requestSavedCards(full_payload).then(
        (response) => {
          // decrypt response here
          response = JSON.parse(Mcrypt.decrypt(response));
          if (response.status === true) {
            this.setSavedCards(response.cards);
            this.setStripeUserId(response.stripe_user_id);
          } else {
            // console.log('failed to get saved cards');
          }
        },
        error => false,
      );
    },

    handleCardPayments(card) {
      if (this.payment_is_to_be_requested === false) {
        this.doCompleteOrder();
        return false;
      }

      let card_payload = {
        amount: Mcrypt.encrypt(this.raw_pending_amount),
        last4: Mcrypt.encrypt(card.last4),
        stripe_user_id: this.get_stripe_user_id,
      };

      // encrypt the card payload
      card_payload = Mcrypt.encrypt(card_payload);

      const full_payload = {
        values: card_payload,
        app: 'PRIVATE_API',
        endpoint: 'charge_customer_card',
      };
      this.requestCardPaymentAction(full_payload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          // decrypt response.data here
          response.data = Mcrypt.decrypt(response.data);
          response.data = JSON.parse(response.data);

          if (response.data.status === true) {
            const card_trans_id = response.data.id;
            this.completeCardPayment(card_trans_id);
            // complete payment here
          } else {
            this.doNotification(
              '2',
              'Card Payment Failed',
              'Card payment failed, please try again.',
            );
            this.payment_state = 0;
            this.loading = 0;
          }
        },
        (error) => {
          this.doNotification('2', 'Card Payment Failed', 'Card payment failed, please try again.');
          this.payment_state = 0;
          this.loading = 0;
        },
      );
      return true;
    },

    completeCardPayment(card_trans_id) {
      const session = this.$store.getters.getSession;
      let user_id = 0;
      let cop_id = 0;
      let user_name = '';
      let user_email = '';
      let user_phone = '';

      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
        user_name = session.biz.user_name;
        user_email = session.biz.user_email;
        user_phone = session.biz.user_phone;
      } else {
        user_id = session.peer.user_id;
        user_name = session.peer.user_name;
        user_email = session.peer.user_email;
        user_phone = session.peer.user_phone;
      }

      const payload = {
        values: {
          amount: this.raw_pending_amount,
          pay_method: 2,
          ref_no: `VISA-${Math.round(+new Date() / 1000)}`,
          client_id: cop_id,
          account_no: `SENDY${cop_id}`,
          phone: user_phone,
          email: user_email,
          name: user_name,
          bill_Ref_Number: user_phone,
          card_trans_id,
        },
      };

      const full_payload = {
        params: payload,
        app: 'PRIVATE_API',
        endpoint: 'payment',
      };

      // this is not encrypted
      this.completeCardPaymentAction(full_payload).then(
        (response) => {
          // console.log(response);
          if (response.length > 0) {
            response = response[0];
          }

          const self = this;
          if (response.data.status === true) {
            // this will request the new running balance and update the store

            this.doNotification(
              '1',
              'Successful Payment',
              'Card payment has been completed successfully.',
            );
            const running_balance_payload = {
              values: {
                cop_id,
                user_phone,
              },
            };

            const payload = {
              values: running_balance_payload,
              app: 'PRIVATE_API',
              endpoint: 'running_balance',
            };

            this.requestRunningBalanceFromAPI(payload).then((response) => {
              this.payment_state = 0;
              this.loading = 0;
              self.doCompleteOrder();
            });
          } else {
            this.payment_state = 0;
            this.loading = 0;
            this.doNotification('3', 'Card Payment Failed', 'Card payment failed to complete.');
          }
        },
        (error) => {
          this.doNotification('3', 'Card Payment Failed', 'Card payment failed to complete.');
          this.payment_state = 0;
          this.loading = 0;
        },
      );
    },
    /* end card */
  },

  created() {
    this.initializeOrderPlacement();
    this.refreshRunningBalance();
    this.getUserCards();
    this.instantiateReturnStatus();
  },

  destroyed() {
    if (this.should_destroy === true) {
      this.$emit('destroyOrderOptions');
    } else {
      this.saveInfoToStore();
    }
  },
};
</script>

<style lang="css">
@import "../../../../../assets/styles/orders_order_placement_options.css";
</style>
