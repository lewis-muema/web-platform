<template lang="html">
  <div class="" style="width:150% ">
    <div class="">
      <div class="home-view-vendor-classes--label">
        <div
          class="home-view-vendor-classes-label-item"
          @click="do_set_active_order_option('payment')"
        >
          <a
            class="home-view-vendor-classes-menu options-section__link"
            :class="get_current_active_order_option_class('payment')"
          >
            <span class="home-view-actions--items__span">
              {{ pay_order_text }}
            </span>
            <font-awesome-icon icon="chevron-down" :class="revertIcon" width="15px" />
          </a>
        </div>
      </div>
    </div>

    <div v-if="get_active_order_option === 'payment'" class="home-view-actions--note">
      <div class="" />
      <div class="home-view-notes-wrapper">
        <div
          v-show="show_payment"
          class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
        >
          <div v-show="show_payment_label" class="home-view-payments-wrapper">
            <div class="home-view-payments-wrapper--left">
              <div class="home-view-payments-wrapper--left__amount-label">
                Total Payment
              </div>
              <div class="home-view-payments-wrapper--left__amount-figure">
                {{ rb_currency }} {{ pending_amount }}
              </div>
            </div>
            <div class="home-view-payments-wrapper--right">
              <div class="home-view-payments-wrapper--right-label">
                {{ balance_quote_label }}
              </div>
              <div class="home-view-payments-wrapper--right-amount">
                {{ rb_currency }} {{ abs_running_balance }}
              </div>
            </div>
          </div>
        </div>
        <span v-if="checkIfTruckOrder()">
          <!-- Nothing displayed -->
        </span>
        <span v-else-if="getPriceRequestObject.payment_option !== 2">
          <div v-if="country_code === 'KE'">
            <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
              <div class="home-view-notes-wrapper--item__option">
                <div class="home-view-notes-wrapper--item__option-div">
                  <el-radio v-model="payment_method" label="1">
                    M-Pesa
                  </el-radio>
                </div>
              </div>
              <div class="home-view-notes-wrapper--item__value" />
            </div>
            <span v-if="allowCash">
              <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
                <div class="home-view-notes-wrapper--item__option">
                  <div class="home-view-notes-wrapper--item__option-div">
                    <el-radio v-model="payment_method" label="3">
                      Cash on delivery
                    </el-radio>
                  </div>
                </div>
                <div class="home-view-notes-wrapper--item__value" />
              </div>
            </span>
          </div>
          <div v-if="Array.isArray(get_saved_cards) && get_saved_cards.length > 0" class="">
            <div
              v-for="card in get_saved_cards"
              class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
            >
              <div class="home-view-notes-wrapper--item__option">
                <div class="home-view-notes-wrapper--item__option-div">
                  <el-radio v-model="payment_method" :label="getCardValue(card.last4)">
                    **** **** **** {{ card.last4 }}
                    <font-awesome-icon :icon="getCardIcon(card)" class="payments-orange" />
                  </el-radio>
                </div>
              </div>
              <div class="home-view-notes-wrapper--item__value" />
            </div>
          </div>
          <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row">
            <div class="home-view-notes-wrapper--item__option">
              <div class="home-view-notes-wrapper--item__option-div">
                <div class="home-view-notes-wrapper--item__link" @click="takeMeToAddNewCard()">
                  + &nbsp;&nbsp; Visa/Mastercard
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
      <div v-if="loading && payment_state === 1" class="home-view-place-order--mpesa-cancel">
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
import PaymentMxn from '../../../../../mixins/payment_mixin.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
library.add(faChevronDown);

// const TRUCK_VENDORS = [6,10,13,14,17,18,19,20];
const TRUCK_VENDORS = [20];

export default {
  name: 'OrderOptions',
  components: {
    'no-ssr': NoSSR,
  },
  mixins: [Mcrypt, PaymentMxn],
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
      vendors_with_fixed_carrier_type: ['Standard', 'Runner', 'Van'],
      return_status: false,
      showing: 1,
      country_code: 'KE',
      default_currency: 'KES',
      rb_currency: 'KES',
    };
  },

  computed: {
    ...mapGetters({
      get_active_order_option: '$_orders/$_home/getActiveOrderOption',
      getRunningBalance: 'getRunningBalance',
      getPriceRequestObject: '$_orders/$_home/getPriceRequestObject',
      get_active_package_class: '$_orders/$_home/getActivePackageClass',
      get_active_vendor_name: '$_orders/$_home/getActiveVendorName',
      activeVendorPriceData: '$_orders/$_home/getActiveVendorDetails',
      get_order_path: '$_orders/$_home/getOrderPath',
      get_pickup_filled: '$_orders/$_home/getPickupFilled',
      get_payment_method: '$_orders/$_home/getPaymentMethod',
      get_order_notes: '$_orders/$_home/getOrderNotes',
      get_schedule_time: '$_orders/$_home/getScheduleTime',
      get_saved_cards: '$_orders/$_home/getSavedCards',
      get_stripe_user_id: '$_orders/$_home/getStripeUserId',
      get_carrier_type: '$_orders/$_home/getCarrierType',
      getIsReturn: '$_orders/$_home/getReturnStatus',
      getMaxTemperature: '$_orders/$_home/getMaxTemperature',
      getCustomerMinAmount: '$_orders/$_home/getCustomerMinAmount',
      getDeliveryItem: '$_orders/$_home/getDeliveryItem',
      getLoadWeight: '$_orders/$_home/getLoadWeight',
      getLoadUnits: '$_orders/$_home/getLoadUnits',
      getAdditionalLoaderStatus: '$_orders/$_home/getAdditionalLoaderStatus',
      getNOOfLoaders: '$_orders/$_home/getNOOfLoaders',
      getPairWithRiderStatus: '$_orders/$_home/getPairWithRiderStatus',
      getPairSerialNumber: '$_orders/$_home/getPairSerialNumber',
      getPairRiderPhone: '$_orders/$_home/getPairRiderPhone',
      getCountryCode: 'getCountryCode',
    }),

    active_price_tier_data() {
      if (this.get_active_package_class != '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class
        );
      }
      return '';
    },
    revertIcon: function() {
      return {
        'sendy-blue': true,
        'rotate-transform': true,
        rotate: this.get_active_order_option === 'payment',
      };
    },

    // cost that the client pays. Is less the discount
    order_cost() {
      let cost = 0;
      if (typeof this.activeVendorPriceData !== 'undefined') {
        if ('cost' in this.activeVendorPriceData) {
          if (
            !this.getIsReturn ||
            this.vendors_without_return.includes(this.get_active_vendor_name)
          ) {
            cost = this.activeVendorPriceData.cost - this.activeVendorPriceData.discountAmount;
            return cost;
          }
          cost = this.activeVendorPriceData.return_cost - this.activeVendorPriceData.discountAmount;
          return cost;
        }
      }

      return cost;
    },

    // order cost including discounts
    full_order_cost() {
      return this.order_cost + this.activeVendorPriceData.discountAmount;
    },

    allowCash() {
      return this.getPriceRequestObject.payment_option === 2 || this.getRunningBalance <= 0;
    },

    hide_payment() {
      return (
        this.getPriceRequestObject.payment_option === 2 ||
        this.getRunningBalance + this.order_cost <= 0
      );
    },

    show_payment() {
      return !this.hide_payment;
    },

    show_payment_label() {
      return !this.hide_payment && this.getRunningBalance !== 0;
    },

    place_order_text() {
      let text = 'Confirm ';
      if (this.order_is_scheduled) {
        text = 'Schedule ';
      }
      return `${text}${this.get_active_vendor_name} Order`;
    },

    pay_order_text() {
      let text = 'Payment Options';
      if (this.getPriceRequestObject.payment_option === 2) {
        text = 'Post Pay';
      } else {
        if (this.abs_running_balance > 0) {
          text = 'Payment Options';
        } else {
          if (this.country_code === 'KE') {
            text = 'Cash on delivery';
            this.payment_method = '3';
          } else {
            text = 'Card Payment';
          }
        }
      }

      return text;
    },

    order_is_scheduled() {
      return this.moment(this.eta_time).isBefore(this.get_schedule_time);
    },

    eta_time() {
      return this.moment()
        .add(this.activeVendorPriceData.eta, 'second')
        .format('YYYY-MM-DD HH:mm:ss');
    },

    scheduled_time() {
      return this.moment(this.get_schedule_time, 'YYYY-MM-DD HH:mm:ss Z').format(
        'YYYY-MM-DD HH:mm:ss'
      );
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

    // Disabled return orders - users to place the last pickup as the last destination
    allow_return() {
      return false;
    },

    final_carrier_type() {
      return this.vendors_with_fixed_carrier_type.includes(this.get_active_vendor_name)
        ? 2
        : Number(this.get_carrier_type);
    },
  },

  methods: {
    ...mapMutations({
      remove_polyline: '$_orders/removePolyline',
      remove_markers: '$_orders/removeMarkers',
      unsetMap: '$_orders/unsetMap',
      set_active_order_option: '$_orders/$_home/setActiveOrderOption',
      setPickupFilled: '$_orders/$_home/setPickUpFilled',
      setPaymentMethod: '$_orders/$_home/setPaymentMethod',
      setScheduleTime: '$_orders/$_home/setScheduleTime',
      setOrderNotes: '$_orders/$_home/setOrderNotes',
      clear_order_path: '$_orders/$_home/clearOrderPath',
      clear_location_names_state: '$_orders/$_home/clearLocationNames',
      clear_price_request_object: '$_orders/$_home/clearPriceRequestObject',
      clear_extra_destinations: '$_orders/$_home/clearExtraDestination',
      setSavedCards: '$_orders/$_home/setSavedCards',
      setStripeUserId: '$_orders/$_home/setStripeUserId',
      setReturnStatus: '$_orders/$_home/setReturnStatus',
    }),

    ...mapActions({
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
      requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
      requestSavedCards: '$_orders/$_home/requestSavedCards',
    }),

    do_set_active_order_option(name) {
      this.get_active_order_option !== name
        ? this.set_active_order_option(name)
        : this.set_active_order_option('');
    },

    get_current_active_order_option_class(name) {
      return {
        'options-link-active': name === this.get_active_order_option,
      };
    },

    checkAllowPrePaid() {
      if (
        this.getPriceRequestObject.payment_option === 1 &&
        this.getRunningBalance + this.order_cost > 0
      ) {
        return false;
      }
      return true;
    },

    checkIfTruckOrder() {
      let is_truck = false;
      if (
        TRUCK_VENDORS.includes(this.activeVendorPriceData.vendor_id) &&
        !this.getPriceRequestObject.fixed_cost
      ) {
        is_truck = true;
      }

      return is_truck;
    },

    isValidateCustomerMinAmount() {
      const customer_min_amount_is_filled = false;
      let min_amount = 0;
      try {
        min_amount = Number(this.getCustomerMinAmount);
      } catch (er) {
        //
      }
      if (min_amount <= 0) {
        this.doNotification(
          '2',
          'Missing Minimum Order Amount',
          'The minimum order amount is missing, please fill it to enable the drivers bid effectively.'
        );
        return false;
      }

      return true;
    },

    preCheckPaymentDetails() {
      this.loading = true;
      this.refreshRunningBalance().then(
        response => {
          this.loading = false;
          if (this.checkIfTruckOrder()) {
            if (this.isValidateCustomerMinAmount()) {
              this.handlePostPaidPayments();
              return true;
            }
            return false;
          }
          this.checkPaymentDetails();
          return true;
        },
        error => {
          this.doNotification(
            '2',
            'Running balance check',
            'Running balance check has failed, please try again.'
          );
          this.loading = false;
        }
      );
    },

    checkPaymentDetails() {
      if (this.get_active_vendor_name === '') {
        this.doNotification(
          '2',
          'Select a vehicle type',
          'The vehicle type not been set, please set and try again.'
        );
        return false;
      }

      if (this.payment_method === '') {
        if (this.checkAllowPrePaid()) {
          this.handlePostPaidPayments();
        } else {
          this.doNotification(
            '2',
            'Choose a payment method',
            'Please select a payment method and try again.'
          );
          return false;
        }
      } else {
        this.saveInfoToStore();
        if (Number(this.payment_method) === 1) {
          this.handleMpesaPayments();
        } else if (Number(this.payment_method) === 3) {
          this.handleCashPayments();
        } else if (Number(this.payment_method) === 5) {
          this.handlePromoCodePayments();
        } else if (this.payment_method.startsWith('2_')) {
          const card = this.get_saved_cards.find(
            card_details => card_details.last4 === this.payment_method.slice(2)
          );
          this.handleSavedCard(card, true);
        } else {
          // console.log('not handled payment method', this.payment_method);
        }
      }

      return true;
    },

    handleMpesaPayments() {
      if (this.payment_is_to_be_requested) {
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
        response => {
          this.loading = false;
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status) {
            this.setPickupFilled(false);
            const { order_no } = this.activeVendorPriceData;
            this.should_destroy = true;
            this.$store.dispatch('$_orders/fetchOngoingOrders');
            this.trackMixpanelEvent('Place Order');
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
              'Price request failed. Please try again'
            );
          }
        },
        error => {
          this.doNotification(
            3,
            'Order completion failed',
            'Order completion failed. Please check your internet connection and try again.'
          );
          this.loading = false;
        }
      );
    },

    getCompleteOrderObject() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      let payload = {
        note: this.get_order_notes,
        trans_no: this.activeVendorPriceData.order_no,
        user_email: acc.user_email,
        user_phone: acc.user_phone,
        no_charge_status: false,
        insurance_amount: 10,
        cash_status: this.cash_status,
        note_status:
          typeof this.get_order_notes === 'undefined' ? false : this.get_order_notes.length > 0,
        last_digit: 'none',
        insurance_id: 1,
        platform: 'corporate',
        card_token: this.card_token,
        customer_token: this.customer_token,
        insurance_status: true,
        close_rider_id: 0,
        amount: this.full_order_cost,
        schedule_status: this.order_is_scheduled,
        destination_paid_status: false,
        delivery_points: this.get_order_path.length - 1,
        sendy_coupon: '0',
        payment_mode: this.payment_method.startsWith('2')
          ? 2
          : this.payment_method === ''
          ? 0
          : Number(this.payment_method),
        schedule_time: this.order_is_scheduled ? this.scheduled_time : this.eta_time,
        tier_tag: this.activeVendorPriceData.tier_tag,
        tier_name: this.activeVendorPriceData.tier_name,
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        carrier_type: this.final_carrier_type,
        isreturn:
          this.getIsReturn && !this.vendors_without_return.includes(this.get_active_vendor_name),
        vendor_type: this.activeVendorPriceData.vendor_id,
        rider_phone: this.activeVendorPriceData.order_no,
        type: this.payment_type,
        package_details: {
          max_temperature: Number(this.getMaxTemperature),
          delivery_item: this.getDeliveryItem,
          load_weight: Number(this.getLoadWeight),
          load_units: this.getLoadUnits,
          additional_loader: Boolean(this.getAdditionalLoaderStatus),
          no_of_loaders: Number(this.getNOOfLoaders),
          customer_min_amount: Number(this.getCustomerMinAmount),
        },
      };
      if (this.getPairWithRiderStatus) {
        payload.rider_details = {
          sim_card_sn: this.getPairSerialNumber,
          rider_phone: this.getPairRiderPhone,
          order_no: this.activeVendorPriceData.order_no,
        };
      }
      payload = {
        values: payload,
      };
      this.identifyMixpanelUser(acc.user_email);
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

      this.setPaymentMethod(this.payment_method);
    },

    retrieveFromStore() {
      this.schedule_time = this.get_schedule_time;
      this.payment_method = this.get_payment_method;
    },

    refreshRunningBalance() {
      return new Promise((resolve, reject) => {
        const session = this.$store.getters.getSession;

        const running_balance_payload = {
          cop_id: 'cop_id' in session[session.default] ? session[session.default].cop_id : 0,
          phone: session[session.default].user_phone,
          default_currency: this.default_currency,
          rb_currency: this.activeVendorPriceData.currency,
        };

        const payload = {
          values: running_balance_payload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'running_balance',
        };
        this.requestRunningBalanceFromAPI(payload).then(
          response => {
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status === 200) {
              this.$store.commit('setRunningBalance', response.data.running_balance);
              this.setDefaultOptions();
              resolve(response.data);
            } else {
              reject(response.data);
            }
          },
          error => {
            reject(response.data);
          }
        );
      });
    },

    initializeOrderPlacement() {
      if (this.get_schedule_time !== '') {
        this.retrieveFromStore();
      }

      return false;
    },

    getCardValue(last4digits) {
      return `2_${last4digits}`;
    },

    setDefaultOptions() {
      if (this.get_active_order_option === '') {
        if (this.show_payment) {
          this.set_active_order_option('payment');
        }
      }
    },

    getCardIcon(card) {
      const name = `cc-${card.type.toLowerCase()}`;
      return ['fab', name];
    },

    identifyMixpanelUser(email) {
      let analytics_env = '';
      try {
        analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {}
      try {
        if (analytics_env === 'production') {
          mixpanel.identify(email);
        }
      } catch (er) {}
    },

    trackMixpanelEvent(name) {
      let analytics_env = '';
      try {
        analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {}

      try {
        if (analytics_env === 'production') {
          mixpanel.track(name);
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Order Placement',
          //   eventLabel: name,
          //   eventValue: 15,
          // });
        }
      } catch (er) {}
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
        response => {
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status === 200) {
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `Request for payment sent to ${user_phone}.`
            );
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshRunningBalance();
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `M-Pesa request to ${user_phone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
                this.pending_amount
              }.`
            );
            this.payment_state = 0;
            this.loading = false;
          }
        },
        error => {
          this.refreshRunningBalance();
          this.doNotification(
            '0',
            'M-Pesa Payment',
            `M-Pesa request to ${user_phone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
              this.pending_amount
            }.`
          );
          this.payment_state = 0;
          this.loading = false;
        }
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
        (function(poll_count) {
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
                  "We'll keep retrying to check your payment status and complete your order once the payment is received."
                );
                that.payment_state = 0;
                that.loading = false;
                that.requestMpesaPaymentPoll(60);
              }
            }
          }, 10000 * poll_count);
        })(poll_count);
      }
    },

    checkRunningBalance(old_rb, payload) {
      this.requestRunningBalanceFromAPI(payload).then(
        response => {
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
        error => false
      );
    },

    cancelMpesaPaymentRequest() {
      this.payment_state = 0;
      this.loading = 0;
      this.doNotification(
        '2',
        'M-Pesa Payment cancelled',
        'M-Pesa payment has been cancelled, please try again.'
      );
      this.requestMpesaPaymentPoll(60);
    },

    instantiateReturnStatus() {
      this.return_status = this.getIsReturn;
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
        response => {
          // decrypt response here
          response = JSON.parse(Mcrypt.decrypt(response));
          if (response.status) {
            this.setSavedCards(response.cards);
            this.setStripeUserId(response.stripe_user_id);
          } else {
            // console.log('failed to get saved cards');
          }
        },
        error => false
      );
    },

    /* end card */

    checkCountryCode() {
      this.getUserDefaultCurrency();
      this.country_code = this.getCountryCode;
      this.rb_currency = this.activeVendorPriceData.currency;
    },
    getUserDefaultCurrency() {
      const session = this.$store.getters.getSession;
      const default_user_currency = session[session.default].default_currency;
      this.default_currency = default_user_currency;
    },
  },

  created() {
    this.initializeOrderPlacement();
    this.refreshRunningBalance();
    this.getUserCards();
    this.instantiateReturnStatus();
  },
  mounted() {
    this.checkCountryCode();
  },

  destroyed() {
    if (this.should_destroy) {
      this.$emit('destroyOrderOptions');
    } else {
      this.saveInfoToStore();
    }
  },
};
</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement_options.css';
</style>
