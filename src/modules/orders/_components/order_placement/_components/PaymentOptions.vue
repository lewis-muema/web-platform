<template lang="html">
  <div
    class=""
    style="width:150% "
  >
    <div class="">
      <div class="home-view-vendor-classes--label">
        <div
          class="home-view-vendor-classes-label-item"
          @click="do_set_active_order_option('payment')"
        >
          <a
            class="home-view-vendor-classes-menu-payment options-section__link"
            :class="get_current_active_order_option_class('payment')"
          >
            <span class="home-view-actions--items__span">
              {{ pay_order_text }}
            </span>
            <font-awesome-icon
              icon="chevron-down"
              :class="revertIcon"
              width="15px"
            />
          </a>
        </div>
      </div>
    </div>

    <div
      v-if="get_active_order_option === 'payment'"
      class="home-view-actions--note"
    >
      <div class="" />
      <div class="home-view-notes-wrapper">
        <div
          v-if="show_payment"
          class=""
        >
          <div
            v-show="show_payment_label"
            class="home-view-payments-wrapper"
          >
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
          <span v-if="checkIfTruckOrder()">
            <!-- Nothing displayed -->
          </span>
          <span v-else-if="getPriceRequestObject.payment_option === 1">
            <div
              v-for="method in payment_methods"
              :key="method.payment_method_id"
              class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
            >
              <div class="home-view-notes-wrapper--item__option">
                <div class="home-view-notes-wrapper--item__option-div payment__radio-button-label">
                  <input
                    v-model="payment_method"
                    type="radio"
                    :value="method.payment_method_id"
                    name="paymentOptions"
                    class="payment__radio-button"
                  >
                  <span>
                    <p class="no-margin">{{ method.name }}</p>
                  </span>
                </div>
              </div>
              <div class="home-view-notes-wrapper--item__value" />
            </div>
            <div
              v-if="display_cards"
              class="card-accounts-list"
            >
              <div
                v-if="Array.isArray(get_saved_cards) && get_saved_cards.length > 0"
                class=""
              >
                <div
                  v-for="card in get_saved_cards"
                  :key="card.last4"
                  class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
                >
                  <div class="home-view-notes-wrapper--item__option">
                    <div class="home-view-notes-wrapper--item__option-div">
                      <el-radio
                        v-model="payment_account"
                        :label="getCardValue(card.last4)"
                      >
                        **** **** **** {{ card.last4 }}
                        <font-awesome-icon
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
                      + &nbsp;&nbsp; Visa/Mastercard
                    </div>
                  </div>
                </div>
                <div class="home-view-notes-wrapper--item__value" />
              </div>
            </div>
          </span>
        </div>
        <span v-else-if="getPriceRequestObject.payment_option === 2">
          <div class="home-view-payments--postpay">
            <p>This is a postpay account</p>
            <p>The delivery costs will be added to your balance.</p>
          </div>
        </span>
        <span v-else>
          <div class="home-view-payments--postpay">
            <p>The delivery costs will be charged from your balance.</p>
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
      <div
        v-if="loading && payment_state === 1"
        class="home-view-place-order--mpesa-cancel"
      >
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
import numeral from 'numeral';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Mcrypt from '../../../../../mixins/mcrypt_mixin';
import PaymentMxn from '../../../../../mixins/payment_mixin';

library.add(faChevronDown);

// const TRUCK_VENDORS = [6,10,13,14,17,18,19,20];
const TRUCK_VENDORS = [20, 25];

export default {
  name: 'OrderOptions',
  components: {},
  mixins: [Mcrypt, PaymentMxn],
  data() {
    return {
      schedule_time: this.moment(),
      order_notes: '',
      payment_method: '',
      payment_methods: [],
      payment_account: '',
      balance_quote: '',
      order_amount: 0,
      user_balance: 0,
      mpesa_poll_timer_id: null,
      loading: false,
      card_token: '',
      customer_token: '',
      payment_type: 'prepay',
      payment_state: 0, // 0- initial 1- loading 2- success 3- cancelled
      shouldDestroy: false,
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
      mpesa_valid: false,
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
      getTestSpecs: '$_orders/$_home/getTestSpecs',
      getLoadWeightStatus: '$_orders/$_home/getLoadWeightStatus',
      getLoadWeightValue: '$_orders/$_home/getLoadWeightValue',
    }),

    active_price_tier_data() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class,
        );
      }
      return '';
    },
    revertIcon() {
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
            !this.getIsReturn
            || this.vendors_without_return.includes(this.get_active_vendor_name)
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

    display_cards() {
      return this.payment_method === 2;
    },

    hide_payment() {
      return (
        this.getPriceRequestObject.payment_option === 2
        || this.getRunningBalance - this.order_cost >= 0
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
      } else if (this.getRunningBalance - this.order_cost >= 0) {
        text = 'Running Balance';
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
    current_time() {
      return this.moment().format('YYYY-MM-DD HH:mm:ss');
    },

    scheduled_time() {
      return this.moment(this.get_schedule_time, 'YYYY-MM-DD HH:mm:ss Z').format(
        'YYYY-MM-DD HH:mm:ss',
      );
    },

    getRB() {
      return numeral(this.getRunningBalance).format('0,0');
    },

    pending_amount() {
      return numeral(Math.abs(this.getRunningBalance - this.order_cost)).format('0,0');
    },

    raw_pending_amount() {
      return numeral(Math.abs(this.getRunningBalance - this.order_cost)).format('0,0');
    },

    payment_is_to_be_requested() {
      return this.getRunningBalance - this.order_cost < 0;
    },

    order_cost_display() {
      return numeral(this.order_cost).format('0,0');
    },

    abs_running_balance() {
      return numeral(Math.abs(this.getRunningBalance)).format('0,0');
    },

    balance_quote_label() {
      if (this.getRunningBalance < 0) {
        return 'You Owe';
      }
      if (this.getRunningBalance - this.order_cost < 0) {
        return 'Your Balance';
      }
      return false;
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

    order_no() {
      return this.activeVendorPriceData.order_no === undefined
        ? this.activeVendorPriceData.id
        : this.activeVendorPriceData.order_no;
    },
  },

  created() {
    this.initializeOrderPlacement();
    this.refreshRunningBalance();
    this.getUserCards();
    this.instantiateReturnStatus();
    this.setDefaultPaymentOptions();
  },
  mounted() {
    this.checkCountryCode();
    this.checkUserPhone();
    // this.setDefaultPaymentOptions();
  },

  destroyed() {
    if (this.shouldDestroy) {
      this.$emit('destroyOrderOptions');
    } else {
      this.saveInfoToStore();
    }
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
      requestPaymentOptionsAction: '$_payment/requestPaymentOptions',
    }),

    do_set_active_order_option(name) {
      // eslint-disable-next-line no-unused-expressions
      this.get_active_order_option !== name
        ? this.set_active_order_option(name)
        : this.set_active_order_option('');
    },

    get_current_active_order_option_class(name) {
      return {
        'options-link-active': name === this.get_active_order_option,
      };
    },

    checkAccountPaymentOption() {
      return (
        (this.getPriceRequestObject.payment_option === 1
          && this.getRunningBalance - this.order_cost >= 0)
        || this.getPriceRequestObject.payment_option === 2
      );
    },

    checkIfTruckOrder() {
      let isTruck = false;
      if (
        TRUCK_VENDORS.includes(this.activeVendorPriceData.vendor_id)
        && !this.getPriceRequestObject.fixed_cost
      ) {
        isTruck = true;
      }

      return isTruck;
    },

    isValidateCustomerMinAmount() {
      let minAmount = 0;
      try {
        minAmount = Number(this.getCustomerMinAmount);
      } catch (er) {
        //
      }
      if (minAmount <= 0) {
        this.doNotification(
          '2',
          'Missing Minimum Order Amount',
          'The minimum order amount is missing, please fill it to enable the drivers bid effectively.',
        );
        return false;
      }

      return true;
    },

    preCheckPaymentDetails() {
      if (this.isValidateLoadWeightStatus() && this.isValidateScheduleTime()) {
        this.loading = true;
        this.refreshRunningBalance().then(
          () => {
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
          () => {
            this.doNotification(
              2,
              'Running balance check',
              'Running balance check has failed, please try again.',
            );
            this.loading = false;
          },
        );
      }
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

      if (this.payment_method === '') {
        if (this.checkAccountPaymentOption()) {
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
        if (Number(this.payment_method) === 1) {
          this.handleMpesaPayments();
        } else if (Number(this.payment_method) === 5) {
          this.handleCashPayments();
        } else if (Number(this.payment_method) === 3) {
          this.handlePromoCodePayments();
        } else if (Number(this.payment_method) === 11) {
          this.handleRunningBalancePayments();
        } else if (Number(this.payment_method) === 2) {
          const card = this.get_saved_cards.find(
            // eslint-disable-next-line camelcase
            card_details => card_details.last4 === this.payment_account.slice(2),
          );
          const setCurrency = this.activeVendorPriceData.currency;
          this.handleSavedCard(setCurrency, card, true);
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
      this.doCompleteOrder();
    },

    handleRunningBalancePayments() {
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
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            response = response[0];
          }
          /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
          if (response.status) {
            let order_no;
            this.setPickupFilled(false);
            // eslint-disable-next-line camelcase
            if (Object.prototype.hasOwnProperty.call(this.activeVendorPriceData, 'order_no')) {
              ({ order_no } = this.activeVendorPriceData);
            } else {
              ({ order_no } = response.respond);
            }
            this.shouldDestroy = true;
            this.$store.dispatch('$_orders/fetchOngoingOrders');

            const data = JSON.parse(payload.values).values;
            const session = this.$store.getters.getSession;
            const acc = session.default;
            if (Object.prototype.hasOwnProperty.call(session, 'admin_details')) {
              this.trackMixpanelEvent('Place Order', {
                'Account ': data.type,
                'Account Type': acc === 'peer' ? 'Personal' : 'Business',
                'Client Type': 'Web Platform',
                'Order Number': data.trans_no,
                'Payment Mode': this.payment_method,
                'User Email': data.user_email,
                'User Phone': data.user_phone,
                'Super User Id': session.admin_details.admin_id,
              });
            } else {
              this.trackMixpanelEvent('Place Order', {
                'Account ': data.type,
                'Account Type': acc === 'peer' ? 'Personal' : 'Business',
                'Client Type': 'Web Platform',
                'Order Number': data.trans_no,
                'Payment Mode': this.payment_method,
                'User Email': data.user_email,
                'User Phone': data.user_phone,
              });
            }

            this.trackMixpanelEvent('Order Completion Log', {
              'Account ': data.type,
              'Account Type': acc === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
              'Payment Mode': this.payment_method,
              'Cash Status': data.cash_status,
              'User Email': data.user_email,
              'User Phone': data.user_phone,
              'Order Number': data.trans_no,
              'Order Amount': data.amount,
              'Schedule Time': data.schedule_time,
              'Schedule Status': data.schedule_status,
              'Carrier Type ID': data.carrier_type,
              'Vendor Type ID': data.vendor_type,
            });
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
        () => {
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
      if (
        this.getPriceRequestObject.payment_option === 1
        && this.getRunningBalance - this.order_cost >= 0
      ) {
        this.payment_method = 11;
      } else if (this.getPriceRequestObject.payment_option === 2) {
        this.payment_method = 12;
      }
      let payload = {
        note: this.get_order_notes,
        trans_no: this.order_no,
        user_email: acc.user_email,
        user_phone: acc.user_phone,
        no_charge_status: false,
        insurance_amount: 10,
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
        payment_method: Number(this.payment_method),
        schedule_time: this.order_is_scheduled ? this.scheduled_time : this.current_time,
        tier_tag: this.activeVendorPriceData.tier_tag,
        tier_name: this.activeVendorPriceData.tier_name,
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        carrier_type: this.final_carrier_type,
        isreturn:
          this.getIsReturn && !this.vendors_without_return.includes(this.get_active_vendor_name),
        vendor_type: this.activeVendorPriceData.vendor_id,
        rider_phone: this.order_no,
        type: this.payment_type,
        package_details: {
          max_temperature: Number(this.getMaxTemperature),
          delivery_item: this.getDeliveryItem,
          load_weight: this.getLoadWeightStatus ? this.getLoadWeightValue : 0,
          load_units: this.getLoadUnits,
          additional_loader: Boolean(this.getAdditionalLoaderStatus),
          no_of_loaders: Number(this.getNOOfLoaders),
          customer_min_amount: Number(this.getCustomerMinAmount),
        },
        test_specs: this.getTestSpecs,
      };
      if (this.getPairWithRiderStatus) {
        payload.rider_details = {
          sim_card_sn: this.getPairSerialNumber,
          rider_phone: this.getPairRiderPhone,
          order_no: this.order_no,
        };
      }
      // support new pricing
      if (this.activeVendorPriceData.order_no === undefined) {
        payload.pricing_uuid = this.activeVendorPriceData.id;
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

        const runningBalancePayload = {
          cop_id: 'cop_id' in session[session.default] ? session[session.default].cop_id : 0,
          phone: session[session.default].user_phone,
          default_currency: this.default_currency,
          rb_currency: this.activeVendorPriceData.currency,
        };

        const payload = {
          values: runningBalancePayload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'running_balance',
        };
        this.requestRunningBalanceFromAPI(payload).then(
          (response) => {
            if (response.length > 0) {
              // eslint-disable-next-line no-param-reassign,prefer-destructuring
              response = response[0];
            }
            if (response.status === 200) {
              const resp = response.data;
              this.$store.commit('setRunningBalance', resp.data.running_balance);
              this.setDefaultOptions();
              resolve(response.data);
            } else {
              reject(response.data);
            }
          },
          (error) => {
            reject(error);
          },
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
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          // eslint-disable-next-line no-undef
          mixpanel.identify(email);
        }
      } catch (er) {
        // ...
      }
    },

    /* global mixpanel */

    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },

    /* start mpesa */

    requestMpesaPayment() {
      const session = this.$store.getters.getSession;
      let referenceNumber = 'SENDY';
      let copId = 0;
      let userId = 0;
      let userEmail = '';
      let userPhone = '';
      if (session.default === 'biz') {
        referenceNumber += session.biz.cop_id;
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
        userEmail = session.biz.user_email;
        userPhone = session.biz.user_phone;
      } else {
        referenceNumber = session.peer.user_phone;
        userId = session.peer.user_id;
        userPhone = session.peer.user_phone;
        userEmail = session.peer.user_email;
      }

      const mpesaPayload = {
        amount: this.raw_pending_amount.replace(',', ''),
        sourceMobile: userPhone,
        referenceNumber,
        user_id: userId,
        cop_id: copId,
        phone: userPhone,
        email: userEmail,
        currency: this.activeVendorPriceData.currency,
      };
      const fullPayload = {
        values: mpesaPayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };
      this.payment_state = 1;
      this.loading = true;

      this.requestMpesaPaymentAction(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            // eslint-disable-next-line no-param-reassign
            response = response[0];
          }

          if (response.status === 200) {
            this.doNotification('0', 'M-Pesa Payment', `Request for payment sent to ${userPhone}.`);
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshRunningBalance();
            this.doNotification(
              '0',
              'M-Pesa Payment',
              `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
                this.pending_amount
              }.`,
            );
            this.payment_state = 0;
            this.loading = false;
          }
        },
        () => {
          this.refreshRunningBalance();
          this.doNotification(
            '0',
            'M-Pesa Payment',
            `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
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

    requestMpesaPaymentPoll(pollLimitValue = 6) {
      this.clearMpesaPollCounter();
      const session = this.$store.getters.getSession;
      let copId = 0;
      if (session.default === 'biz') {
        copId = session.biz.cop_id;
      }

      const oldRb = this.$store.getters.getRunningBalance;
      const runningBalancePayload = {
        copId,
        phone: session[session.default].user_phone,
        default_currency: session[session.default].default_currency,
        rb_currency: session[session.default].default_currency,
      };

      const payload = {
        params: runningBalancePayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'running_balance',
      };

      const pollLimit = pollLimitValue; // 10secs * 6  = 60sec = 1min
      // poll the dispatch
      for (let pollCount = 0; pollCount < pollLimit; pollCount++) {
        // wait 10 seconds
        const that = this;
        // eslint-disable-next-line func-names,no-shadow
        (function (pollCount) {
          // eslint-disable-next-line consistent-return
          that.mpesa_poll_timer_id = window.setTimeout(() => {
            const res = that.checkRunningBalance(oldRb, payload);
            if (res) {
              // eslint-disable-next-line no-param-reassign
              pollCount = pollLimit;
              that.payment_state = 0;
              that.loading = false;
              that.doNotification('1', 'Payment successful', 'Completing your order...');
              that.doCompleteOrder();
              return true;
            }

            if (pollLimitValue === 6) {
              if (pollCount === 5) {
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
          }, 10000 * pollCount);
        }(pollCount));
      }
    },

    checkRunningBalance(oldRb, payload) {
      this.requestRunningBalanceFromAPI(payload).then(
        (response) => {
          if (response.length > 0) {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            response = response[0];
          }

          if (response.status === 200) {
            const newRb = response.data.data.running_balance;
            if (newRb < oldRb) {
              this.completeMpesaPaymentRequest({});
              return true;
            }
          }

          return false;
        },
        // eslint-disable-next-line no-unused-vars
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
      this.return_status = this.getIsReturn;
    },

    dispatchReturnToPickup() {
      this.setReturnStatus(this.return_status);
    },

    /* End mpesa */

    /* start card */

    getUserCards() {
      const session = this.$store.getters.getSession;
      let copId = 0;
      let userId = 0;
      if (session.default === 'biz') {
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
      } else {
        copId = 0;
        userId = session.peer.user_id;
      }

      let cardPayload = {
        user_id: userId,
        cop_id: copId,
      };

      // encrypt card payload here
      cardPayload = Mcrypt.encrypt(cardPayload);

      const fullPayload = {
        values: cardPayload,
        app: 'PRIVATE_API',
        endpoint: 'get_card',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          // decrypt response here
          // eslint-disable-next-line no-param-reassign
          response = JSON.parse(Mcrypt.decrypt(response));
          if (response.status) {
            this.setSavedCards(response.cards);
            this.setStripeUserId(response.stripe_user_id);
          } else {
            // console.log('failed to get saved cards');
          }
        },
        // eslint-disable-next-line no-unused-vars
        error => false,
      );
    },
    setDefaultPaymentOptions() {
      this.refreshRunningBalance().then(
        () => {
          // Payment service
          const payOption = this.getPriceRequestObject.payment_option;
          if (payOption === 1) {
            const accountType = 'Individual';
            const payload = {
              country_code: this.getCountryCode,
              account_type: accountType,
              entry_point: 'Customer App Price Request',
            };
            const fullPayload = {
              values: payload,
              vm: this,
              app: 'PAYMENT_SERVICE',
              endpoint: 'accounts/pay_methods',
            };

            this.requestPaymentOptionsAction(fullPayload).then(
              (response) => {
                if (response.status) {
                  this.payment_methods = response.payment_methods;
                }
              },
              (error) => {
                console.log('error', error);
              },
            );
          }
        },
        () => {
          this.doNotification(
            '2',
            'Running balance check',
            'Running balance check has failed, please try again.',
          );
          this.loading = false;
        },
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
      const defaultUserCurrency = session[session.default].default_currency;
      this.default_currency = defaultUserCurrency;
    },
    checkUserPhone() {
      const session = this.$store.getters.getSession;
      const phone = session[session.default].user_phone;
      const intValue = phone.substring(0, 4);
      this.mpesa_valid = intValue !== '+256';
    },
    isValidateLoadWeightStatus() {
      if (this.activeVendorPriceData.vendor_id === 25 && !this.getLoadWeightStatus) {
        this.doNotification('2', 'Invalid Load Weight', 'Kindly provide a valid load weight');
        return false;
      }
      return true;
    },
    isValidateScheduleTime() {
      let dateTime = '';
      if (this.get_schedule_time === '' || this.get_schedule_time === null) {
        dateTime = this.moment();
      } else {
        dateTime = this.scheduled_time;
      }
      const day = this.moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('dddd');
      const timeHrs = this.moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('HH');

      const standardOptions = [21, 22, 24];
      if (standardOptions.includes(this.activeVendorPriceData.vendor_id)) {
        if (day === 'Sunday' && timeHrs >= '17') {
          this.doNotification(
            2,
            'Standard option is unavailable right now',
            'Kindly schedule for tommorow 8AM',
          );
          return false;
        }
        if (day === 'Saturday' && timeHrs >= '17') {
          this.doNotification(
            2,
            'Standard option is unavailable right now',
            'Kindly schedule for Monday 8AM',
          );
          return false;
        }
        if (timeHrs < '07') {
          this.doNotification(
            2,
            'Standard option is unavailable right now',
            'Kindly schedule for 8AM',
          );
          return false;
        }
        if (timeHrs >= '17') {
          this.doNotification(
            2,
            'Standard option is unavailable right now',
            'Kindly schedule for tommorow 8AM',
          );
          return false;
        }
        return true;
      }
      return true;
    },
  },
};
</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement_options.css';
</style>
