<template>
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
                {{$t('general.total_payment')}}
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
          <span v-if="getPriceRequestObject.payment_option === 1">
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
                    class="payment__radio-button-dedicated"
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
              <div class="payment-options-cards-container">
                <div v-if="!addCardStatus && get_saved_cards.length > 0">
                  <div v-if="deletedCardIndex === ''">
                    <p class="payment-options-cards-title">{{$t('general.saved_cards')}}</p>
                    <div
                      v-for="(cards, index) in get_saved_cards"
                      :key="index"
                      class="payment-options-saved-cards-row"
                    >
                      <input
                        v-model="activeSavedCard"
                        :value="index"
                        type="radio"
                        class="payment-options-saved-card-radio"
                      >
                      {{ formatCardNumber(cards.pay_method_details) }}
                      <font-awesome-icon
                        icon="trash-alt"
                        class="payment-options-delete-card-icon"
                        @click="deletedCardIndex = index"
                      />
                    </div>
                    <div
                      class="payment-options-add-card-holder"
                      @click="addCardStatus = !addCardStatus"
                    >
                      <span>
                        <font-awesome-icon
                          icon="plus-circle"
                          class="payment-options-add-card-icon"
                        />
                      </span>
                      <span class="payment-options-add-card">{{$t('general.add_new_card')}}</span>
                    </div>
                  </div>
                  <div
                    v-else
                    class="delete-saved-card-dialogue"
                  >
                    <p class="delete-saved-card-dialogue-label">
                      {{$t('general.sure_delete_card')}}
                      <strong>{{ get_saved_cards[deletedCardIndex].pay_method_details }}</strong>?
                    </p>
                    <p class="delete-saved-card-dialogue-label">
                      <span
                        class="delete-saved-card-dialogue-buttons"
                        @click="deleteSavedCard(deletedCardIndex)"
                      >{{$t('general.yes')}}</span>
                      <span
                        class="delete-saved-card-dialogue-buttons"
                        @click="deletedCardIndex = ''"
                      >{{$t('general.no')}}</span>
                    </p>
                  </div>
                </div>
                <form
                  v-else
                  class="VGS-form"
                  @submit.prevent="onSubmit"
                >
                  <AdditionalCardFields 
                    :additionalData="additionalData" 
                    :transaction_id="transaction_id" 
                    v-if="!loading && showAdditionalCardFields" 
                    @continue="handleContinue"
                  />
                  <div v-else>
                    <span
                      v-if="get_saved_cards.length > 0"
                      class="payment-options-cards-title back-option"
                      @click="addCardStatus = !addCardStatus"
                    >
                      <font-awesome-icon
                        icon="arrow-left"
                        class="payment-options-add-card-icon"
                      />
                      {{$t('general.back')}}
                      </span>
                      <p class="payment-options-cards-title">{{$t('general.add_new_card')}}</p>
                      <div
                        id="cc-number"
                        class="form-group"
                      >
                        <div class="form-control-static">
                          <span class="fake-input-1" />
                        </div>
                      </div>
                      <div class="cvv-expire-fields">
                        <div
                          id="cc-expiration-date"
                          class="form-group"
                        >
                          <div class="form-control-static">
                            <span class="fake-input-1" />
                          </div>
                        </div>
                        <div
                          id="cc-cvc"
                          class="form-group"
                        >
                          <div class="form-control-static">
                            <span class="fake-input-1" />
                          </div>
                        </div>
                      </div>
                      <div
                      id="cc-save-card-1"
                      class="form-group"
                    >
                      <div class="form-control-static">
                        <input
                          v-model="saveCardState"
                          type="checkbox"
                        >
                        <span
                          class="fake-checkbox-label-1"
                        >{{$t('general.save_card_for_future_orders')}}</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              class="loading-margin"
              v-if="loading"
              v-loading="loading"
              :element-loading-text="transactionText"
              element-loading-spinner="el-icon-loading"
            > 
            </div>
            <div v-if="!getCardPaymentStatus">
              <p
                v-if="country === 'KE'"
                class="card-option-disabled-notification"
                v-html="$t('general.technical_mantainance_still_pay', {user_name: user_name })"
              >
                <!-- Dear {{ user_name }}, <br>
                Card payments will be momentarily unavailable as we undergo technical maintenance.
                You can still pay for your Sendy deliveries using M-Pesa. Contact Support on
                +254709779779 for any queries. -->
              </p>
              <p
                v-if="country === 'UG'"
                class="card-option-disabled-notification"
                v-html="$t('general.technical_mantainance_contact_customer_care', {user_name: user_name })"
              >
                <!-- Dear {{ user_name }}, <br>
                Card payments will be momentarily unavailable as we undergo technical maintenance.
                Contact Support on +256393239706 for any queries. -->
              </p>
            </div>
          </span>
        </div>
        <span v-else-if="getPriceRequestObject.payment_option === 2">
          <div class="home-view-payments--postpay">
            <p>{{$t('general.post_pay_account')}}</p>
            <p>{{$t( 'general.delivery_cost_added_to_balance' )}}</p>
          </div>
        </span>
        <span v-else>
          <div class="home-view-payments--postpay">
            <p>{{$t( 'general.delivery_cost_charged_from_balance' )}}</p>
          </div>
        </span>
      </div>
    </div>

    <div
      class="home-view-place-order"
      :class="loader_class"
    >
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
          {{$t('general.cancel_payment' )}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import numeral from 'numeral';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faPlusCircle,
  faArrowLeft,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import Mcrypt from '../../../../../mixins/mcrypt_mixin';
import PaymentMxn from '../../../../../mixins/payment_mixin';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';

library.add(faChevronDown, faPlusCircle, faArrowLeft, faTrashAlt);

// const TRUCK_VENDORS = [6,10,13,14,17,18,19,20];
const TRUCK_VENDORS = [20, 25];

export default {
  name: 'OrderOptions',
  components: {
    AdditionalCardFields: () => import('../../../../payment/_components/AdditionalCardFields.vue'),
  },
  mixins: [Mcrypt, PaymentMxn, TimezoneMxn, EventsMixin],
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
      payment_type: this.$t('general.prepay'),
      payment_state: 0, // 0- initial 1- loading 2- success 3- cancelled
      shouldDestroy: false,
      schedule_picker_options: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      price_request_response_received: false,
      vendors_without_return: [this.$t('general.standard'), this.$t('general.runner')],
      vendors_with_fixed_carrier_type: [this.$t('general.standard'), this.$t('general.runner') , this.$t('general.van') ],
      return_status: false,
      showing: 1,
      country_code: 'KE',
      default_currency: 'KES',
      rb_currency: 'KES',
      mpesa_valid: false,
      mpesa_payment: false,
      mpesa_payment_state: false,
      confirmFinal: false,
      smallVendors: [1, 22, 21, 23],
      mediumVendors: [2, 3],
      largeVendors: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      time: 15,
      isRunning: false,
      interval: null,
      squashedVendorData: {},
      country: '',
      form: {},
      vgs_valid_payment: false,
      addCardStatus: false,
      activeSavedCard: '',
      saveCardState: false,
      deletedCardIndex: '',
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      transactionText: 'loading ....',
      showAdditionalCardFields: false,
      additionalData: null,
      is3DS: false,
      twoFACompleted: false,
      transactionStatus: null,
      count: false
    };
  },

  computed: {
    ...mapGetters({
      get_active_order_option: '$_orders/$_home/getActiveOrderOption',
      getRunningBalance: 'getRunningBalance',
      getPriceRequestObject: '$_orders/$_home/getPriceRequestObject',
      getOuterPriceRequestData: '$_orders/getOuterPriceRequestData',
      getActiveVendorTally: '$_orders/getActiveVendorTally',
      getExpandedActiveVendorTally: '$_orders/getExpandedActiveVendorTally',
      get_active_package_class: '$_orders/$_home/getActivePackageClass',
      get_active_vendor_name: '$_orders/$_home/getActiveVendorName',
      activeVendorPriceData: '$_orders/$_home/getActiveVendorDetails',
      get_order_path: '$_orders/$_home/getOrderPath',
      get_pickup_filled: '$_orders/$_home/getPickupFilled',
      get_payment_method: '$_orders/$_home/getPaymentMethod',
      get_order_notes: '$_orders/$_home/getOrderNotes',
      get_schedule_time: '$_orders/$_home/getScheduleTime',
      get_schedule_end_time: '$_orders/$_home/getScheduleEndTime',
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
      getHomeLocations: '$_orders/getHomeLocations',
      getSecondaryProfile: 'getSecondaryProfile',
      getCardPaymentStatus: '$_payment/getCardPaymentStatus',
      getActiveCurrency: '$_payment/getActiveCurrency',
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
      let totalCost = 0;
      let totalReturnCost = 0;
      let totalDiscountAMount = 0;
      this.getExpandedActiveVendorTally.forEach((row) => {
        totalCost = row.cost + totalCost;
        totalReturnCost = row.return_cost + totalReturnCost;
        totalDiscountAMount = row.discountAmount + totalDiscountAMount;
      });
      cost = totalCost - totalDiscountAMount;
      return cost;
    },

    // order cost including discounts
    full_order_cost() {
      let totalDiscountAMount = 0;
      this.getExpandedActiveVendorTally.forEach((row) => {
        totalDiscountAMount = row.discountAmount + totalDiscountAMount;
      });
      return this.order_cost + totalDiscountAMount;
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
      let text = this.$t('general.confirm');
      if (this.order_is_scheduled) {
        text = this.$t('general.schedule');
      }
      return `${text} ${this.$t('general.order')}`;
    },
    pay_order_text() {
      let text = this.$t('general.payment_options');
      if (this.getPriceRequestObject.payment_option === 2) {
        text = this.$t('general.post_pay');
      } else if (this.getRunningBalance - this.order_cost >= 0) {
        text = this.$t('general.running_balance');
      }

      return text;
    },

    order_is_scheduled() {
      return this.moment(this.eta_time).isBefore(this.get_schedule_time);
    },

    eta_time() {
      let ETA = 0;
      this.getExpandedActiveVendorTally.forEach((row) => {
        if (row.eta > ETA) {
          ETA = row.eta;
        }
      });
      return this.moment()
        .add(ETA, 'second')
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
    order_no() {
      return this.activeVendorPriceData.order_no === undefined
        ? this.activeVendorPriceData.id
        : this.activeVendorPriceData.order_no;
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
      let text = '';
      if (this.getRunningBalance < 0) {
        text = this.$t('general.you_owe');
      } else {
        text = this.$t('general.your_balance');
      }
      return text;
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
    loader_class() {
      if (Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
        return 'loading-override';
      }
      return '';
    },
    user_name() {
      const session = this.$store.getters.getSession;
      return session[session.default].user_name.split(' ')[0];
    },
    valid_vgs_saved_card() {
      if (!this.addCardStatus && this.activeSavedCard !== '') {
        return true;
      }
      return false;
    },
    savedCardsTally() {
      return this.get_saved_cards.length;
    },
  },

  watch: {
    addCardStatus(val) {
      if (val) {
        setTimeout(() => {
          this.setForm();
        }, 800);
      } else {
        this.getUserCards();
      }
    },
    payment_method(val) {
      if (val === 2 && this.get_saved_cards.length === 0) {
        setTimeout(() => {
          this.addCardStatus = true;
        }, 500);
      }
      if (val !== 2) {
        this.addCardStatus = false;
      }
    },
    savedCardsTally(val) {
      if (val === 0) {
        setTimeout(() => {
          this.addCardStatus = true;
        }, 500);
      }
    },
    form: {
      handler(val) {
        if (
          Object.prototype.hasOwnProperty.call(val.state, 'cardno')
          && val.state.cardno.isValid
          && val.state.cvv.isValid
          && val.state.expiry_date.isValid
          && this.addCardStatus
        ) {
          this.vgs_valid_payment = true;
        } else {
          this.vgs_valid_payment = false;
        }
      },
      deep: true,
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
    const session = this.$store.getters.getSession;
    this.country = session[session.default].country_code;
    this.loadVeryGoodSecurityScript();
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
      setOrderState: '$_orders/$_home/setOrderState',
      setExtendOptions: '$_orders/$_home/setExtendOptions',
      clearOuterActiveVendorDetails: '$_orders/clearOuterActiveVendorDetails',
      setSecondaryProfile: 'setSecondaryProfile',
      setCardPaymentStatus: '$_payment/setCardPaymentStatus',
      setPairedDriversTally: '$_orders/setPairedDriversTally',
    }),

    ...mapActions({
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
      requestDedicatedOrderCompletion: '$_orders/$_home/requestDedicatedOrderCompletion',
      requestSavedCards: '$_orders/$_home/requestSavedCards',
      requestPaymentOptionsAction: '$_payment/requestPaymentOptions',
      paymentAxiosGet: '$_payment/paymentAxiosGet',
    }),

    loadVeryGoodSecurityScript() {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js';
      document.head.appendChild(script);
    },

    setForm() {
      // eslint-disable-next-line no-undef
      this.form = VGSCollect.create(
        process.env.CONFIGS_ENV.VGS_VAULT_ID,
        process.env.CONFIGS_ENV.VGS_ENVIRONMENT,
        () => {},
      );

      this.form.field('#cc-number .fake-input-1', {
        type: 'card-number',
        name: 'cardno',
        successColor: '#4F8A10',
        errorColor: '#D8000C',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        placeholder: this.$t('general.card_number'),
        validations: ['required', 'validCardNumber'],
      });

      this.form.field('#cc-cvc .fake-input-1', {
        type: 'card-security-code',
        name: 'cvv',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        placeholder: 'CVV',
        validations: ['required', 'validCardSecurityCode'],
      });

      this.form.field('#cc-expiration-date .fake-input-1', {
        type: 'card-expiration-date',
        name: 'expirydate',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        serializers: [{ name: 'replace', options: { old: ' ', new: '' } }],
        placeholder: 'Card Expiry (MM/YYYY)',
        validations: ['required', 'validCardExpirationDate'],
      });
      setTimeout(() => {
        this.addCardStatus = true;
      }, 500);
    },

    onSubmit() {
      if (this.vgs_valid_payment) {
        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const firstName = accData.user_name.split(' ')[0];
        const lastName = accData.user_name.split(' ').length > 1 ? accData.user_name.split(' ')[1] : '';
        const order_no = Object.prototype.hasOwnProperty.call(
          this.getExpandedActiveVendorTally[0],
          'order_no',
        )
          ? this.getExpandedActiveVendorTally[0].order_no
          : this.getExpandedActiveVendorTally[0].id;
        const newCardPayload = {
          currency: this.getExpandedActiveVendorTally[0].currency,
          country: this.getCountryCode,
          amount: this.pending_amount.replace(',', ''),
          email: accData.user_email,
          phonenumber: accData.user_phone,
          firstname: firstName,
          lastname: lastName,
          txref: `${Date.now()}`,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          save: this.saveCardState,
        };
        this.loading = true;
        this.form.submit(
          '/customers/collect_card_details',
          {
            data: newCardPayload,
            headers: {
              Authorization: localStorage.jwtToken,
            },
          },
          (status, response) => {
            if (response.status) {
              const newSavedCardPayload = {
                values: response.data,
                app: 'AUTH',
                endpoint: 'customers/charge_card_v3',
              };
              this.requestSavedCards(newSavedCardPayload).then((res) => {
                this.transaction_id = res.transaction_id;
                if (res.status) {
                  this.transactionStatus = res.transaction_status;

                  if(res.additional_data) {
                    this.additionalData = res.additional_data;
                    this.is3DS = res.tds;
                    if (res.tds) {
                      this.init3DS(res.additional_data);
                      return;
                    }
                    this.showAdditionalCardFields = true;
                    this.loading = false;
                    return;
                  }

                  switch (res.transaction_status) {
                    case 'pending':
                      this.transactionPoll();
                      break;
                    case 'success':
                      this.transactionText = res.message;
                      this.loading = false;
                      this.clearInputs();
                      const notification = {
                        title: res.transaction_status,
                        level: 1,
                        message: res.message,
                      };
                      this.displayNotification(notification);
                      break;
                    default:
                      break;
                  }
                } else {
                  this.loading = false;
                  this.clearInputs();
                  this.doNotification(2, this.$t('general.failed_to_charge_card'), res.message);
                }
              }).catch(err => {
                  this.loading = false;
                  this.clearInputs();
                  this.doNotification(2, this.$t('general.failed_to_charge_card'), res.message);
              });
            } else {
              this.loading = false;
              this.clearInputs();
              this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
            }
          },
        );
      } else {
        this.loading = false;
        this.clearInputs();
        this.doNotification(
          2,
          this.$t('general.failed_to_charge_card'),
          this.$t('general.please'),
        );
      }
    },

    chargeSavedCard() {
      if (this.valid_vgs_saved_card) {
        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const firstName = accData.user_name.split(' ')[0];
        const order_no = Object.prototype.hasOwnProperty.call(
          this.getExpandedActiveVendorTally[0],
          'order_no',
        )
          ? this.getExpandedActiveVendorTally[0].order_no
          : this.getExpandedActiveVendorTally[0].id;
        const payload = {
          txref: `${Date.now()}`,
          cardno:
            this.activeSavedCard !== '' && this.get_saved_cards.length > 0
              ? this.get_saved_cards[this.activeSavedCard].pay_method_details
              : '',
          currency: this.getExpandedActiveVendorTally[0].currency,
          amount: this.pending_amount.replace(',', ''),
          country: this.getCountryCode,
          phonenumber: accData.user_phone,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          bulk: false,
        };
        const savedCardPayload = {
          values: payload,
          app: 'AUTH',
          endpoint: 'customers/charge_saved_card_v2',
        };
        this.loading = true;
        this.requestSavedCards(savedCardPayload).then(
          (response) => {
            if (response.status) {
              this.transaction_id = response.transaction_id;
              if (response.status) {
                this.transactionPoll();
              } else {
                this.loading = false;
                this.transactionText = response.reason;
                this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
              }
            } else {
              this.loading = false;
              this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
            }
          },
          error => false,
        );
      } else {
        this.loading = false;
        this.doNotification(2, this.$t('general.failed_to_charge_card'), this.$t('general.select_one_of_your_saved_cards'));
      }
    },

    transactionPoll() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = poll_limit;
              return;
            }

            that.updateTransactionStatus(); 
            if (poll_count === (that.poll_limit - 1)) {
              that.transactionText = 'card payment Failed';
              that.loading = false;
              const notification = {
                title: that.$t('general.failed_to_charge_card'),
                level: 2,
              };
              that.clearInputs();
              that.displayNotification(notification);
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    updateTransactionStatus() {
     
      const fullPayload = {
        app: 'AUTH',
        endpoint: `customers/transaction_status?id=${this.transaction_id}`,
      }
      this.paymentAxiosGet(fullPayload).then((res) => {
        let level = 1;
        if (res.status) { 
          this.transactionText = res.message;
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.loading = false;
              this.doCompleteOrder();
              const notification1 = {
                title: res.transaction_status,
                level: level,
                message: res.message,
              };
              this.displayNotification(notification1);
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading = false;
              level = 2;
              this.clearInput();
              const notification2 = {
                title: res.transaction_status,
                level: level,
                message: res.message,
              };
              this.displayNotification(notification2);
              break;
            case 'pending':
              break;
            default:
              break;
          }

          return res;
        }

        const notification = {
          title: this.$t('general.failed_to_charge_card'),
          level: 2,
          message: res.message
        };
        this.displayNotification(notification);
      })
        
    },

    handleContinue(val) {
      if (val) {
        this.loading = true;
        this.pollCard();
        return;
      }
      this.loading = false;
      this.showAdditionalCardFields = false;
      this.clearInputs();
      const notification = {
        title: this.$t('general.failed_to_charge_card'),
        level: 2,
        message: this.$t('general.failed_to_charge_card_text'),
      };
      this.displayNotification(notification);
    },

    init3DS(additionalData) {
      const res = additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, '');

      const timer = setInterval(() => {
			  if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
	  	}, 500);

    },
    init3dsPoll() {
      this.loading = true;
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      }

      const fullPayload = {
        values: payload,
        app: 'AUTH',
        endpoint: 'customers/submit_info'
      }

      this.paymentAxiosPost(fullPayload).then((res) => {
        if (res.status) {
          switch (res.transaction_status) {
              case 'pending':
                this.transactionPoll();
                this.count = true;
                break;
              case 'success':
                this.poll_count = this.poll_limit;
                this.clearInputs();
                this.loading = false;
                const notification1 = {
                  title: res.transaction_status,
                  level: 1,
                  message: res.message,
                };
                this.displayNotification(notification1);
                break;
              default:
                break;
          };
          return;
        }
      }).catch((error) => {
        this.transactionText = this.$t('general.failed_to_charge_card');
        this.loading = false;
        this.clearInputs();
        const notification = {
        title: this.$t('general.failed_to_charge_card'),
        level: 2,
        message: res.message,
        };
        this.displayNotification(notification);
      });
    },
    deleteSavedCard(index) {
      const session = this.$store.getters.getSession;
      const accData = session[session.default];
      const payload = {
        cardno: this.get_saved_cards[index].pay_method_details,
        userid: accData.user_id,
      };
      const deleteCardPayload = {
        values: payload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/api/v1/card/delete',
      };
      this.deleteCardIndex = '';
      this.loading = true;
      this.requestSavedCards(deleteCardPayload).then((response) => {
        this.loading = false;
        if (response.status) {
          this.getUserCards();
        } else {
          const notification = {
            title: this.$t('general.failed_to_delete_saved_card'),
            level: 2,
            message: this.$t('general.try_again_later'),
          };
          this.displayNotification(notification);
        }
      });
    },

    clearInputs() {
      
      setTimeout(() => {
        this.form.reset();
      }, 100);
    },
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

    individual_order_cost(row) {
      let cost = 0;
      cost = row.cost - row.discountAmount;
      return cost;
    },

    // order cost including discounts
    individual_full_order_cost(row) {
      return this.individual_order_cost(row) + row.discountAmount;
    },

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
        || (this.getPriceRequestObject.payment_option === 0
          && this.getRunningBalance - this.order_cost >= 0)
      );
    },

    preCheckPaymentDetails() {
      const eventPayload = {
        eventCategory: 'Order Placement',
        eventAction: 'Click',
        eventLabel: 'Order Confirmation Button - Order Placement Page - Web App',
      };
      this.$root.$emit('tour class hidden', 1);
      this.fireGAEvent(eventPayload);
      const unsetCarriers = this.getExpandedActiveVendorTally.filter(
        data => data.carrier_type === '',
      );
      if (unsetCarriers.length > 0) {
        this.doNotification(
          2,
          this.$t('general.vehicle_type_not_set'),
          this.$t('general.set_vehicle_type'),
        );
        return false;
      }
      if (this.isValidateScheduleTime() === 1) {
        this.loading = true;
        this.refreshRunningBalance().then(
          () => {
            this.loading = false;
            this.checkPaymentDetails();
            return true;
          },
          () => {
            this.doNotification(
              2,
              this.$t('general.running_balance_check'),
              this.$t('general.running_balance_check_text'),
            );
            this.loading = false;
          },
        );
      } else if (this.isValidateScheduleTime() === 2) {
        this.doNotification(2, this.$t('general.schedule_time_not_set'), this.$t('general.please_enter_starting_time'));
      } else if (this.isValidateScheduleTime() === 3) {
        this.doNotification(2, this.$t('general.schedule_time_not_set'), this.$t('general.please_enter_ending_time'));
      } else if (this.isValidateScheduleTime() === 4) {
        this.doNotification(
          2,
          this.$t('general.schedule_time_not_set'),
          this.$t('general.please_enter_start_and_ending_time'),
        );
      }
    },

    checkPaymentDetails() {
      if (this.getExpandedActiveVendorTally.length === 0) {
        this.doNotification(
          '2',
          this.$t('general.select_vehicle_type'),
          this.$t('general.vehicle_type_not_set_please_try_again'),     
        );
        return false;
      }
      const session = this.$store.getters.getSession;
      const profile_id = session.default === 'biz'
        ? session[session.default].cop_id
        : session[session.default].user_id;
      const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
      const secondaryProfile = session.default === 'biz'
        ? this.getPriceRequestObject.client_id - profile_id === 100000000
        : this.getPriceRequestObject.user_id - profile_id === 100000000;
      this.setSecondaryProfile(secondaryProfile);
      if (this.payment_method === '') {
        if (this.checkAccountPaymentOption()) {
          this.handlePostPaidPayments();
        } else {
          this.doNotification(
            '2',
            this.$t('general.choose_payment_method'),
            this.$t('general.select_payment_method_try_again'),
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
          if (this.addCardStatus) {
            this.onSubmit();
          } else {
            this.chargeSavedCard();
          }
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
      const orderData = this.getCompleteOrderObject();
      if (orderData.values[0].payment_method === 12 && orderData.values[0].cop_id === 0) {
        this.handleOrderPlacementError(orderData.values);
      } else {
        const payload = {
          values: this.getCompleteOrderObject(),
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'orders/confirm_order/no_destination',
        };
        this.loading = true;
        this.requestDedicatedOrderCompletion(payload).then(
          (response) => {
            this.loading = false;
            this.shouldDestroy = true;
            this.should_destroy = true;
            if (Object.keys(this.$store.getters.getSession).length > 0) {
              this.$store.dispatch('$_orders/fetchOngoingOrders');
            }
            const eventPayload = {
              eventCategory: 'Order Placement',
              eventAction: 'Order Confirmation',
              eventLabel: 'Order Confirmed - Order Placement - Web App',
            };
            this.fireGAEvent(eventPayload);
            this.sendGA4Events('select_schedule_order');
            this.setPickupFilled(false);
            this.$root.$emit('Order Placement Force Update');
            let order = '';
            response.forEach((row) => {
              /* eslint camelcase: ["error", {ignoreDestructuring: true}] */
              if (row.status) {
                if (!order) {
                  order = row.respond.order_no;
                }
                this.mixpanelTrackPricingServiceCompletion(row.respond.order_no);
                this.setPairedDriversTally(0);
                let accData = {};
                const data = row.original_data;
                const session = this.$store.getters.getSession;
                const acc = session.default;
                accData = session[session.default];
                this.trackGAEvent('No destination vendor type selected');
                this.trackMixpanelEvent('No destination vendor type selected', {
                  'Vendor ID': data.vendor_type,
                  'Carrier type': this.carrierTypeName(data.carrier_type, data.vendor_type),
                  'Client name': accData.user_name,
                  'Client email': data.user_email,
                  'Account type': acc === 'peer' ? 'Personal' : 'Business',
                  'Client type': 'Web Platform',
                });
                this.trackGAEvent('No destination payment option');
                this.trackMixpanelEvent('No destination payment option', {
                  'Payment option': this.payMethodName(data.payment_method),
                  'Client name': accData.user_name,
                  'Client email': data.user_email,
                  'Account type': acc === 'peer' ? 'Personal' : 'Business',
                  'Order no': row.respond.order_no,
                  'Client type': 'Web Platform',
                });
                this.trackGAEvent('No destination order completion log');
                this.trackMixpanelEvent('No destination order completion log', {
                  'Account ': data.type,
                  'Account Type': acc === 'peer' ? 'Personal' : 'Business',
                  'Client Type': 'Web Platform',
                  'Payment Mode': this.payment_method,
                  'Cash Status': data.cash_status,
                  'Client Email': data.user_email,
                  'Client Phone': data.user_phone,
                  'Client name': accData.user_name,
                  'Order Number': row.respond.order_no,
                  'Order Amount': data.amount,
                  'Schedule Time': data.schedule_time,
                  'Schedule Status': data.schedule_status,
                  'Carrier Type ID': data.carrier_type,
                  'Vendor Type ID': data.vendor_type,
                });
              } else {
                setTimeout(() => {
                  this.doNotification(
                    3,
                    this.$t('general.order_completion_failed'),
                    `${row.reason}`,
                  );
                }, 10);
              }
            });
            if (order) {
              this.$router.push(`/orders/tracking/${order}`);
            }
          },
          (error) => {
            error.response.data.forEach((row) => {
              setTimeout(() => {
                this.doNotification(
                  3,
                  this.$t('general.order_completion_failed'),
                  `${row.reason}`,
                );
              }, 10);
            });
            this.loading = false;
          },
        );
      }
    },

    getCompleteOrderObject() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const fullPayload = [];
      this.getExpandedActiveVendorTally.forEach((row) => {
        const payload = {
          note: this.get_order_notes,
          trans_no: 'order_no' in row ? row.order_no : row.id,
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
          amount: this.individual_full_order_cost(row),
          schedule_status: this.order_is_scheduled,
          destination_paid_status: true,
          delivery_points: this.get_order_path.length - 1,
          sendy_coupon: '0',
          payment_method: Number(this.payment_method),
          schedule_start_time: this.convertToUTC(this.get_schedule_time),
          schedule_end_time: this.convertToUTC(this.get_schedule_end_time),
          tier_tag: row.tier_tag,
          tier_name: row.tier_name,
          cop_id: 'cop_id' in acc ? acc.cop_id : 0,
          carrier_type: row.carrier_type,
          isreturn: false,
          vendor_type: row.vendor_id,
          rider_phone: 'order_no' in row ? row.order_no : row.id,
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
        // support new pricing
        if (row.order_no === undefined) {
          payload.pricing_uuid = row.id;
        }
        if (row.pair_status === '2' && row.vehicle_plate) {
          payload.rider_details = {
            sim_card_sn: row.pair_rider_sim_card_sn,
            rider_phone: row.pair_rider_phone,
            order_no: 'order_no' in row ? row.order_no : row.id,
          };
        }
        fullPayload.push(payload);
      });
      const data = {
        values: fullPayload,
      };
      this.identifyMixpanelUser(acc.user_email);
      return data;
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

    payMethodName(id) {
      if (id === 1) {
        return this.$t('general.mpesa');
      }
      if (id === 2) {
        return this.$t('general.card');
      }
      if (id === 3) {
        return this.$t('general.promo_code');
      }
      if (id === 5) {
        return this.$t('general.cash');
      }
      if (id === 11) {
        return this.$t('general.running_balance');
      }
      if (id === 12) {
        return 'Post pay';
      }
      return this.$t('general.unknown_payment_method');
    },

    carrierTypeName(id, vendor) {
      if (vendor === 1) {
        if (id === '0') {
          return this.$t('general.bike_without_box');
        }
        if (id === '1') {
          return this.$t('general.bike_with_box');
        }
        return this.$t('general.any');
      }
      if (id === '0') {
        return this.$t('general.open');
      }
      if (id === '1') {
        return this.$t('general.closed');
      }
      return this.$t('general.any');
    },

    retrieveFromStore() {
      this.schedule_time = this.get_schedule_time;
      this.payment_method = this.get_payment_method;
    },

    refreshRunningBalance() {
      return new Promise((resolve, reject) => {
        const session = this.$store.getters.getSession;
        const profile_id = session.default === 'biz'
          ? session[session.default].cop_id
          : session[session.default].user_id;
        const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
        const secondaryProfile = session.default === 'biz'
          ? this.getPriceRequestObject.client_id - profile_id === 100000000
          : this.getPriceRequestObject.user_id - profile_id === 100000000;
        const runningBalancePayload = {
          [profile_name]: profile_id,
          phone: session[session.default].user_phone,
          default_currency: this.default_currency,
          rb_currency: this.getPriceRequestObject.currency,
          secondary_profile: secondaryProfile,
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

    formatCardNumber(cardno) {
      const last4 = cardno.substring(cardno.length - 4, cardno.length);
      return `**** **** **** ${last4}`;
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
        this.doNotification('3', this.$t('general.something_went_wrong'), '');
      }
    },

    mixpanelTrackPricingServiceCompletion(orderNo) {
      this.trackMixpanelEvent('Place Order - Pricing Service', { 'Order No': orderNo });
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

    trackGAEvent(eventLabel) {
      const eventPayload = {
        eventCategory: 'Sendy Dedicated',
        eventAction: 'Click',
        eventLabel,
      };
      this.fireGAEvent(eventPayload);
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
        currency: this.getPriceRequestObject.currency,
        vendorType: this.getExpandedActiveVendorTally[0].vendor_id,
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

          if (response.status === 200 && response.data.status) {
            this.doNotification('0', this.$t('general.mpesa_payment'), this.$t('general.request_for_payement_sent', {userPhone: userPhone }) );
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshRunningBalance();
            this.doNotification(
              '0',
              this.$t('general.mpesa_payment'),
              this.$t('general.mpesa_request_failed', {userphone: userPhone, referenceNumber: referenceNumber }) + this.pending_amount
            );
            this.payment_state = 0;
            this.loading = false;
          }
        },
        () => {
          this.refreshRunningBalance();
          this.doNotification(
            '0',
            this.$t('general.mpesa_payment'),
            this.$t('general.mpesa_request_failed', {userphone: userPhone, referenceNumber: referenceNumber }) + this.pending_amount
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
      const profile_id = session.default === 'biz'
        ? session[session.default].cop_id
        : session[session.default].user_id;
      const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
      const secondaryProfile = session.default === 'biz'
        ? this.getPriceRequestObject.client_id - profile_id === 100000000
        : this.getPriceRequestObject.user_id - profile_id === 100000000;

      const oldRb = this.$store.getters.getRunningBalance;
      const runningBalancePayload = {
        [profile_name]: profile_id,
        phone: session[session.default].user_phone,
        default_currency: session[session.default].default_currency,
        rb_currency: session[session.default].default_currency,
        secondary_profile: secondaryProfile,
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
            if (!that.mpesa_payment_state) {
              that.checkRunningBalance(oldRb, payload);
            }
            if (that.mpesa_payment) {
              // eslint-disable-next-line no-param-reassign
              pollCount = pollLimit;
              that.payment_state = 0;
              that.loading = false;
              that.doNotification('1', that.$t('general.payment_successful'), that.$t('general.completing_your_order'));
              that.doCompleteOrder();
              that.mpesa_payment = false;
              that.mpesa_payment_state = true;
              return true;
            }

            if (pollLimitValue === 6) {
              if (pollCount === 5 && !that.mpesa_payment_state) {
                that.doNotification(
                  '0',
                  that.$t('general.payment_not_recieved'),
                  that.$t('general.will_keep_trying_checking_payment')
                  );
                that.payment_state = 0;
                that.loading = false;
                that.requestMpesaPaymentPoll(60);
                that.mpesa_payment_state = false;
                that.mpesa_payment = false;
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
          if (!this.mpesa_payment_state) {
            if (response.status === 200) {
              const newRb = response.data.data.running_balance;
              if (newRb > oldRb) {
                this.completeMpesaPaymentRequest({});
                this.mpesa_payment = true;
              } else {
                this.mpesa_payment = false;
              }
            } else {
              this.mpesa_payment = false;
            }
          } else {
            this.requestMpesaPaymentPoll(60);
          }
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
        this.$t('general.mpesa_payment_cancelled'),
        this.$t('general.mpesa_payment_cancelled_text'),
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

      const cardPayload = {
        user_id: userId,
        cop_id: copId,
      };

      const fullPayload = {
        values: cardPayload,
        app: 'AUTH',
        endpoint: 'customers/get_saved_cards',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          if (response.status) {
            this.setSavedCards(response.cards);
          } else {
            this.setSavedCards([]);
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
              currency: this.getPriceRequestObject.currency,
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
                  this.determinePaymentOptions(response);
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
            this.$t('general.running_balance_check'),
            this.$t('general.running_balance_check_failed'),
          );
          this.loading = false;
        },
      );
    },

    determinePaymentOptions(data) {
      let payment = [];
      payment = data.payment_methods;

      const exist = data.payment_methods.find(available => available.payment_method_id === 5);

      if (
        exist
        && (this.$route.path === '/orders/dedicated/multi-destination'
          || this.$route.path === '/orders/dedicated/no-destination')
      ) {
        data.payment_methods.splice(data.payment_methods.indexOf(exist), 1);
      }

      if (exist === undefined || exist === null) {
        payment = data.payment_methods;
      } else {
        const runningBalance = this.getRunningBalance;
        if (runningBalance >= 0 && runningBalance - this.order_cost < 0) {
          payment = data.payment_methods;
        } else {
          const cashIndex = data.payment_methods.findIndex(
            index => index.payment_method_id === 5,
          );
          payment = data.payment_methods.splice(cashIndex, 1);
        }
      }

      this.payment_methods = data.payment_methods;
      this.payment_methods.forEach((row) => {
        if (row.payment_method_id === 2) {
          this.setCardPaymentStatus(true);
        }
      });
    },

    /* end card */

    checkCountryCode() {
      this.getUserDefaultCurrency();
      this.country_code = this.getCountryCode;
      this.rb_currency = this.getPriceRequestObject.currency;
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
    isValidateScheduleTime() {
      if (this.get_schedule_time && this.get_schedule_end_time) {
        return 1;
      }
      if (!this.get_schedule_time && this.get_schedule_end_time) {
        return 2;
      }
      if (this.get_schedule_time && !this.get_schedule_end_time) {
        return 3;
      }
      return 4;
    },

    handleOrderPlacementError(data) {
      this.doNotification(
        2,
        this.$t('general.order_completion_failed'),
        this.$t('general.ensure_using_biz_account'),
      );
      this.trackMixpanelEvent('Business Order Fail Alert', {
        'Account ': data.type,
        'Client Type': 'Web Platform',
        'Payment Mode': data.payment_method,
        'Client Mode': data.cop_id,
        'User Email': data.user_email,
        'User Phone': data.user_phone,
        'Order Number': data.trans_no,
        'Order Amount': data.amount,
        'Schedule Time': data.schedule_time,
        'Schedule Status': data.schedule_status,
        'Carrier Type ID': data.carrier_type,
        'Vendor Type ID': data.vendor_type,
      });

      setTimeout(() => {
        location.reload();
      }, 4000);
    },
  },
};
</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement_options.css';
</style>
