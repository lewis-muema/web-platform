<template>
  <div
    class=""
    style="width:150% "
  >
    <div
      v-if="activeVendorPriceData.vendor_id !== 26"
      class=""
    >
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
      v-if="paymentStatusOption"
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
                {{ $t('general.total_payment') }}
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
              <div
                v-if="method.payment_method_id !== 3"
                class="home-view-notes-wrapper--item__option"
              >
                <div class="home-view-notes-wrapper--item__option-div payment__radio-button-label">
                  <input
                    v-model="payment_method"
                    type="radio"
                    :value="method.payment_method_id"
                    name="paymentOptions"
                    class="payment__radio-button"
                  >
                  <span class="payment-options-alignment">
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
                class="payment-options-cards-container"
              >
                <div v-if="!addCardStatus && get_saved_cards.length > 0">
                  <div v-if="deletedCardIndex === ''">
                    <p class="payment-options-cards-title">{{ $t('general.saved_cards') }}</p>
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
                      <span class="payment-options-add-card">{{ $t('general.add_new_card') }}</span>
                    </div>
                  </div>
                  <div
                    v-else
                    class="delete-saved-card-dialogue"
                  >
                    <p class="delete-saved-card-dialogue-label">
                      {{ $t('general.sure_delete_card') }}
                      <strong>{{ get_saved_cards[deletedCardIndex].pay_method_details }}</strong>?
                    </p>
                    <p class="delete-saved-card-dialogue-label">
                      <span
                        class="delete-saved-card-dialogue-buttons"
                        @click="deleteSavedCard(deletedCardIndex)"
                      >{{ $t('general.yes') }}</span>
                      <span
                        class="delete-saved-card-dialogue-buttons"
                        @click="deletedCardIndex = ''"
                      >{{ $t('general.no') }}</span>
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
                      {{ $t('general.back') }}
                    </span>
                    <p class="payment-options-cards-title">{{ $t('general.add_new_card') }}</p>
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
                        <span class="fake-checkbox-label-1">{{
                          $t('general.save_card_for_future_orders')
                        }}</span>
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
                v-html="$t('general.technical_mantainance_still_pay', { user_name: user_name })"
              />
              <p
                v-if="country === 'UG'"
                class="card-option-disabled-notification"
                v-html="
                  $t('general.technical_mantainance_contact_customer_care', {
                    user_name: user_name,
                  })
                "
              />
            </div>
          </span>
        </div>
        <span v-else-if="getPriceRequestObject.payment_option === 2">
          <div class="home-view-payments--postpay">
            <p>{{ $t('general.post_pay_account') }}</p>
            <p>{{ $t('general.delivery_cost_added_to_balance') }}</p>
          </div>
        </span>
        <span v-else>
          <div class="home-view-payments--postpay">
            <p>{{ $t('general.delivery_cost_charged_from_balance') }}</p>
          </div>
        </span>
      </div>
    </div>
    <PromoCodesComponent
      :hide-payment="hide_payment"
      @promoCodeDetails="setPromoCodeDetails"
    />
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
          @click="displayOrderHistory()"
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
          {{ $t('general.cancel_payment') }}
        </button>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="summary-pop-up">
        <el-dialog
          :visible.sync="confirmFinal"
          width="30%"
          class="summary-dialog"
          :before-close="handleClose"
          :modal-append-to-body="false"
        >
          <div class="order_final_summary">
            <p class="confirm-label">
              {{ $t('general.confirm_order_details') }}
            </p>
            <div class="">
              <div class="">
                <ul class="summary_timeline order_summary_timeline">
                  <li>
                    <p class="delivery_label">
                      {{ $t('general.pickup_location') }}
                    </p>
                    <p class="delivery_points">
                      {{ getHomeLocations[0] }}
                    </p>
                  </li>

                  <li
                    v-for="(val, index) in getHomeLocations"
                    v-if="index > 0"
                    :key="index"
                  >
                    <p
                      v-if="index > 1"
                      class="delivery_label"
                    >
                      {{ `Destination ${index}` }}
                    </p>
                    <p
                      v-else
                      class="delivery_label"
                    >
                      {{ $t('general.destination') }}
                    </p>
                    <p class="delivery_points">
                      {{ val }}
                    </p>
                  </li>
                </ul>
              </div>
              <label class="delivery_label">{{ $t('general.type_of_order') }}</label>
              <div class="order_summary-types-item order_summary--vendor-wrapper">
                <div class="order_summary__img">
                  <img
                    class="order_summary-item__image"
                    :src="getVendorIcon(activeVendorPriceData.vendor_id)"
                    alt=""
                  >
                </div>
                <div class="order_summary-wrapper__vendor">
                  <div class="order_summary--vendor-formal-name">
                    {{ activeVendorPriceData.vendor_name }}
                  </div>
                </div>
              </div>

              <div
                v-if="activeVendorPriceData.vendor_id === 26"
                class="order_summary--outline"
              >
                <label class="delivery_label">
                  {{ $t('general.type_of_package_delivered') }}
                </label>
                <p>{{ getInterCountyPayload.package_type }}</p>
              </div>

              <div
                v-else-if="activeVendorPriceData.vendor_id !== 28"
                class="order_summary--outline"
              >
                <label class="delivery_label">
                  {{ $t('general.type_of') }} {{ activeVendorPriceData.vendor_name.toLowerCase() }}
                </label>
                <p>{{ carrierTypeSummary() }}</p>
              </div>

              <div v-if="activeVendorPriceData.vendor_id === 26">
                <div
                  v-if="getInterCountyPayload.package_type === 'PARCEL'"
                  class="order_summary--outline"
                >
                  <label class="delivery_label">
                    {{ $t('general.approximate_weight') }}
                  </label>
                  <p>{{ getInterCountyPayload.approximate_weight }}kg</p>
                </div>

                <div class="order_summary--outline">
                  <label class="delivery_label">
                    {{ $t('general.want_package_picked') }}
                  </label>
                  <p>{{ interCountyPickUpOption() }}</p>
                </div>

                <div
                  v-if="activeVendorPriceData.inter_county_info.pickup_collection_center !== null"
                  class="order_summary--outline"
                >
                  <label class="delivery_label">
                    {{ $t('general.nearest_collection_center_to_you') }}
                  </label>
                  <p>
                    {{ activeVendorPriceData.inter_county_info.pickup_collection_center.address }}
                  </p>
                </div>

                <div class="order_summary--outline">
                  <label class="delivery_label">
                    {{ $t('general.recipient_contact_info_small') }}
                  </label>
                  <p>{{ getInterCountyPayload.recipient_info.name }}</p>
                  <p>{{ getInterCountyPayload.recipient_info.phone_number }}</p>
                </div>

                <div
                  v-if="
                    activeVendorPriceData.inter_county_info.destination_collection_center !== null
                  "
                  class="order_summary--outline"
                >
                  <label class="delivery_label">
                    {{ $t('general.package_will_be_delivered_cc_at') }}
                  </label>
                  <p>
                    {{
                      activeVendorPriceData.inter_county_info.destination_collection_center.address
                    }}
                  </p>
                </div>
              </div>

              <div class="order_summary--outline">
                <label class="delivery_label">{{ $t('general.pick_up_time_of_order') }}</label>
                <div class="order_summary-types-item order_summary--vendor-wrapper">
                  <div class="order_summary__img">
                    <i class="el-icon-date order_summary-item__image calender--icon" />
                  </div>
                  <div class="order_summary-wrapper__vendor">
                    <div class="order_summary--vendor-formal-name">
                      {{ scheduleTimeSummary() }}
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="pickUpInstructions()"
                class="order_summary--outline"
              >
                <label class="delivery_label">
                  {{ $t('general.pickup_instructions_at') }} {{ getInstructionNotes[0].name }}
                </label>
                <div
                  v-if="getInstructionNotes[0].notes !== ''"
                  class="order_summary-wrapper__vendor instructions-notes"
                >
                  <div class="order_summary--vendor-formal-name">
                    {{ getInstructionNotes[0].notes }}
                  </div>
                </div>
                <div
                  v-if="getInstructionNotes[0].recipient_phone !== ''"
                  class="order_summary-types-item order_summary--vendor-wrapper"
                >
                  <div class="order_summary__img">
                    <i class="el-icon-phone-outline order_summary-item__image calender--icon" />
                  </div>
                  <div class="order_summary-wrapper__vendor">
                    <div class="order_summary--vendor-formal-name">
                      {{ getInstructionNotes[0].recipient_phone }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="dropOffInstructions()"
                class="order_summary--outline"
              >
                <div
                  v-for="(data, index) in deliveryNotesData()"
                  :key="index"
                >
                  <label class="delivery_label">
                    {{ $t('general.drop_off_instructions_at_name') }} {{ data.name }}
                  </label>
                  <div
                    v-if="data.notes !== ''"
                    class="order_summary-wrapper__vendor instructions-notes"
                  >
                    <div class="order_summary--vendor-formal-name">
                      {{ data.notes }}
                    </div>
                  </div>
                  <div
                    v-if="data.recipient_phone !== ''"
                    class="order_summary-types-item order_summary--vendor-wrapper"
                  >
                    <div class="order_summary__img">
                      <i class="el-icon-phone-outline order_summary-item__image calender--icon" />
                    </div>
                    <div class="order_summary-wrapper__vendor">
                      <div class="order_summary--vendor-formal-name">
                        {{ data.recipient_phone }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="get_order_notes.length > 0"
                class="order_summary--outline"
              >
                <label class="delivery_label">{{ $t('general.notes') }}</label>
                <p>{{ get_order_notes }}</p>
              </div>

              <div class="countdown_divider" />

              <div class="count_down_section">
                <p class="timeout_text">
                  {{ $t('general.order_will_be_placed') }}
                  <a class="timeout_count">{{ $t('general.time_seconds', { time: time }) }}</a>
                </p>
              </div>

              <div class="summary-button-outer">
                <input
                  class="button-primary btn-edit-order"
                  type="submit"
                  :value="$t('general.edit_order')"
                  @click="editOrder"
                >

                <input
                  class="button-primary btn-submit-order "
                  type="submit"
                  :value="$t('general.confirm_order_capital')"
                  @click="confirmOrder"
                >
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
/* eslint-disable camelcase */
/* eslint-disable max-len */

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
import NotificationMxn from '../../../../../mixins/notification_mixin';
import PromoCodesComponent from './PromoCodesComponent.vue';
import PromocodesMixin from '../../../../../mixins/promocodes_mixin';

library.add(faChevronDown, faPlusCircle, faArrowLeft, faTrashAlt);

// const TRUCK_VENDORS = [6,10,13,14,17,18,19,20];
const TRUCK_VENDORS = [20, 25];

export default {
  name: 'OrderOptions',
  components: { 
    PromoCodesComponent,
    AdditionalCardFields: () => import('../../../../payment/_components/AdditionalCardFields.vue'),
   },
  mixins: [Mcrypt, PaymentMxn, TimezoneMxn, EventsMixin, NotificationMxn, PromocodesMixin],
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
      mpesa_payment: false,
      mpesa_payment_state: false,
      confirmFinal: false,
      smallVendors: [1, 22, 21, 23, 12, 28],
      mediumVendors: [2, 3],
      largeVendors: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      time: 15,
      isRunning: false,
      interval: null,
      country: '',
      form: {},
      vgs_valid_payment: false,
      addCardStatus: false,
      activeSavedCard: '',
      saveCardState: false,
      deletedCardIndex: '',
      couponDetails: null,
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      transactionText: 'loading ....',
      showAdditionalCardFields: false,
      additionalData: null,
      is3DS: false,
      twoFACompleted: false,
      transactionStatus: null,
      count: false,
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
      getHomeLocations: '$_orders/getHomeLocations',
      getStoreOrderPath: '$_orders/getStorePath',
      getPairWithRiderState: '$_orders/$_home/getPairWithRiderState',
      getPairErrorMessage: '$_orders/$_home/getPairErrorMessage',
      getInstructionNotes: '$_orders/$_home/getInstructionNotes',
      getSecondaryProfile: 'getSecondaryProfile',
      getCardPaymentStatus: '$_payment/getCardPaymentStatus',
      getActiveCurrency: '$_payment/getActiveCurrency',
      getInterCountyPayload: '$_orders/$_home/getInterCountyPayload',
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
        if (
          'cost' in this.activeVendorPriceData
          && !Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')
        ) {
          if (
            !this.getIsReturn
            || this.vendors_without_return.includes(this.get_active_vendor_name)
          ) {
            cost = this.activeVendorPriceData.cost - this.activeVendorPriceData.discountAmount;
          }
          cost = this.activeVendorPriceData.return_cost - this.activeVendorPriceData.discountAmount;
        }
        cost = this.activeVendorPriceData.cost - this.activeVendorPriceData.discountAmount;
      }

      return cost;
    },

    // order cost including discounts
    full_order_cost() {
      if (Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
        return this.order_cost + this.activeVendorPriceData.discountAmount;
      }
      return this.order_cost + this.activeVendorPriceData.discountAmount;
    },

    display_cards() {
      return this.payment_method === 2;
    },

    hide_payment() {
      // check if running balance plus promocode will cover the order amount
      let couponAmount = 0;
      if (this.couponDetails !== null) {
        const discountedAmount = this.calculateCouponAmount(this.order_cost, this.couponDetails);
        couponAmount = this.order_cost < discountedAmount ? this.order_cost : discountedAmount;
      }

      return (
        this.getPriceRequestObject.payment_option === 2
        || this.getRunningBalance + couponAmount - this.order_cost >= 0
      );
    },

    show_payment() {
      return !this.hide_payment;
    },

    show_payment_label() {
      return !this.hide_payment && this.getRunningBalance !== 0;
    },
    paymentStatusOption() {
      let resp = false;

      if (this.get_active_order_option === 'payment') {
        resp = true;
      }

      if (this.activeVendorPriceData.vendor_id === 26) {
        resp = false;
      }
      return resp;
    },

    place_order_text() {
      let text = this.$t('general.confirm');
      if (this.order_is_scheduled) {
        text = this.$t('general.schedule');
      }
      return `${text} ${this.get_active_vendor_name} ${this.$t('general.order')}`;
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
    notification(obj) {
      this.displayNotification(obj);
    },
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
          && val.state.expirydate.isValid
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
      clearInstructionNotes: '$_orders/$_home/clearInstructionNotes',
      setSecondaryProfile: 'setSecondaryProfile',
      setCardPaymentStatus: '$_payment/setCardPaymentStatus',
    }),

    ...mapActions({
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
      requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
      requestSavedCards: '$_orders/$_home/requestSavedCards',
      requestPaymentOptionsAction: '$_payment/requestPaymentOptions',
      paymentAxiosGet: '$_payment/paymentAxiosGet',
      paymentAxiosPost: '$_payment/paymentAxiosPost',
    }),

    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

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
        placeholder: this.$t('general.card_expiry'),
        validations: ['required', 'validCardExpirationDate'],
      });
    },

    onSubmit() {
      if (this.vgs_valid_payment) {
        const amountToPay = this.effectDiscount(this.pending_amount);

        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const firstName = accData.user_name.split(' ')[0];
        const lastName = accData.user_name.split(' ').length > 1 ? accData.user_name.split(' ')[1] : '';
        const newCardPayload = {
          currency: this.activeVendorPriceData.currency,
          country: this.getCountryCode,
          amount: amountToPay,
          email: accData.user_email,
          phonenumber: accData.user_phone,
          firstname: firstName,
          lastname: lastName,
          txref: `${Date.now()}`,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          save: this.saveCardState,
          paymethod: 2,
          bulk: false,
        };
        this.loading = true;
        this.transactionText = 'Initializing card payment...';
        
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
                  this.doNotification(2, this.$t('general.failed_to_charge_card'), this.$t('general.failed_to_charge_card_text'));
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
          this.$t('general.enter_card_details_try_again'),
        );
      }
    },

    chargeSavedCard() {
      if (this.valid_vgs_saved_card) {
        const amountToPay = this.effectDiscount(this.pending_amount);

        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const payload = {
          txref: `${Date.now()}`,
          cardno:
            this.activeSavedCard !== '' && this.get_saved_cards.length > 0
              ? this.get_saved_cards[this.activeSavedCard].pay_method_details
              : '',
          currency: this.activeVendorPriceData.currency,
          amount: amountToPay,
          country: this.getCountryCode,
          phonenumber: accData.user_phone,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          bulk: false,
        };

        const savedCardPayload = {
          values: payload,
          app: 'AUTH',
          endpoint: 'customers/charge_saved_card_v3',
        };

        this.loading = true;
        this.requestSavedCards(savedCardPayload).then(
          (response) => {
            this.transaction_id = response.transaction_id;
            if (response.status) {

              if(response.additional_data) {
                this.additionalData = response.additional_data;
                this.is3DS = response.tds;
                if (response.tds) {
                  this.init3DS(response.additional_data);
                  return;
                }
                this.showAdditionalCardFields = true;
                this.loading = false;
                return;
              }

              switch (response.transaction_status) {
                case 'pending':
                  this.transactionPoll();
                  break;
                case 'success':
                  this.transactionText = response.message;
                  this.loading = false;
                  this.clearInputs();
                  const notification = {
                    title: response.transaction_status,
                    level: 1,
                    message: response.message,
                  };
                  this.displayNotification(notification);
                  break;
                default:
                  break;
              }

            } else {
              this.loading = false;
              this.transactionText = response.reason;
              this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
            }
          },
          error => false,
        );
      } else {
        this.loading = false;
        this.doNotification(
          2,
          this.$t('general.failed_to_charge_card'),
          this.$t('general.select_one_of_your_saved_cards'),
        );
      }
    },
    
    transactionPoll() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = that.poll_limit;
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
        this.transactionPoll();
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
      this.saveCardState = false;
      setTimeout(() => {
        this.form.reset();
      }, 500);
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
      if (
        minAmount <= 0
        && !Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')
      ) {
        this.doNotification(
          '2',
          this.$t('general.missing_minimum_amount'),
          this.$t('general.minimum_order_amount_missing'),
        );
        return false;
      }

      return true;
    },

    displayOrderHistory() {
      if (
        !this.getDeliveryItem
        && !this.smallVendors.includes(this.activeVendorPriceData.vendor_id)
        && !Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')
      ) {
        this.doNotification(
          2,
          this.$t('general.delivery_item_not_set'),
          this.$t('general.enter_delivery_item'),
        );
      } else if (this.getPairWithRiderState && this.getPairRiderPhone === '') {
        this.initiatePairingFailureNotification();
      } else if (this.getPairWithRiderState && !this.getPairWithRiderStatus) {
        this.doNotification(2, this.$t('general.pairing_failure'), this.getPairErrorMessage);
      } else if (this.activeVendorPriceData.vendor_id === 26) {
        this.initiateInterCountyCheck();
      } else if (Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
        this.preCheckPaymentDetails();
      } else {
        this.initiateOrderSummaryDialog();
      }
    },
    initiateOrderSummaryDialog() {
      this.confirmFinal = true;
      this.isRunning = false;
      this.toggleTimer();
      let accData = {};
      const session = this.$store.getters.getSession;
      const acc = session.default;
      accData = session[session.default];
      this.trackMixpanelEvent('Order Summary View', {
        'Account Type': acc === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
        'User Email': accData.user_email,
        'User Phone': accData.user_phone,
      });
    },
    initiateInterCountyCheck() {
      let msg = '';
      if (this.getInterCountyPayload.package_type === '') {
        msg = this.$t('general.kindly_provide_type_of_package');
        this.doNotification(2, this.$t('general.order_completion_failure'), msg);
      } else if (
        this.getInterCountyPayload.package_type === 'PARCEL'
        && this.getInterCountyPayload.approximate_weight === ''
      ) {
        msg = this.$t('general.provide_weight_of_package');
        this.doNotification(2, this.$t('general.order_completion_failure'), msg);
      } else if (
        this.getInterCountyPayload.package_type === 'PARCEL'
        && this.getInterCountyPayload.approximate_weight === ''
      ) {
        msg = this.$t('general.provide_weight_of_package');
        this.doNotification(2, this.$t('general.order_completion'), msg);
      } else if (Object.keys(this.getInterCountyPayload.recipient_info).length === 0) {
        msg = this.$t('general.provide_recipient_info');
        this.doNotification(2, this.$t('general.order_completion_failure'), msg);
      } else {
        this.initiateOrderSummaryDialog();
      }
    },
    initiatePairingFailureNotification() {
      let msg = '';
      if (this.getPairErrorMessage !== '') {
        msg = this.getPairErrorMessage;
      } else {
        msg = this.$t('general.provide_partner_details');
      }

      this.doNotification(2, this.$t('general.pairing_failure'), msg);
    },
    editOrder() {
      this.confirmFinal = false;
      this.isRunning = true;
      this.time = 15;
      clearInterval(this.interval);
      this.setOrderState(1);
      this.setExtendOptions(false);
      this.clearOuterActiveVendorDetails();
      let accData = {};
      const session = this.$store.getters.getSession;
      const acc = session.default;
      accData = session[session.default];
      this.trackMixpanelEvent('Order Summary Edit Button - Clicked', {
        'Account Type': acc === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
        'User Email': accData.user_email,
        'User Phone': accData.user_phone,
      });
    },
    confirmOrder() {
      this.confirmFinal = false;
      this.preCheckPaymentDetails();
      clearInterval(this.interval);
      let accData = {};
      const session = this.$store.getters.getSession;
      const acc = session.default;
      accData = session[session.default];
      this.trackMixpanelEvent('Confirm Order', {
        'Account Type': acc === 'peer' ? 'Personal' : 'Business',
        'Client Type': 'Web Platform',
        'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
        'User Email': accData.user_email,
        'User Phone': accData.user_phone,
      });
    },
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval);
      } else {
        // eslint-disable-next-line no-lonely-if
        if (!this.interval) {
          this.interval = setInterval(this.incrementTime, 1000);
        }
      }
      this.isRunning = !this.isRunning;
    },
    incrementTime() {
      this.time = parseInt(this.time, 10) - 1;
      if (this.time <= 1) {
        this.preCheckPaymentDetails();
        this.confirmFinal = false;
        this.isRunning = true;
        clearInterval(this.interval);
        this.time = 15;
        let accData = {};
        const session = this.$store.getters.getSession;
        const acc = session.default;
        accData = session[session.default];
        this.trackMixpanelEvent('Order Summary View Timeout', {
          'Account Type': acc === 'peer' ? 'Personal' : 'Business',
          'Client Type': 'Web Platform',
          'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
          'User Email': accData.user_email,
          'User Phone': accData.user_phone,
        });
      }
    },

    preCheckPaymentDetails() {
      const eventPayload = {
        eventCategory: 'Order Placement',
        eventAction: 'Click',
        eventLabel: 'Order Confirmation Button - Order Placement Page - Web App',
      };
      this.fireGAEvent(eventPayload);
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
            if (this.activeVendorPriceData.vendor_id === 26) {
              if (this.getPriceRequestObject.payment_option === 2) {
                this.payment_type = this.$t('general.postpay');
              } else {
                this.payment_type = this.$t('general.prepay');
              }
              this.doCompleteOrder();
            } else {
              this.checkPaymentDetails();
            }

            return true;
          },
          () => {
            this.doNotification(
              2,
              this.$t('general.running_balance_check'),
              this.$t('general.running_balance_check_failed'),
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
          const amountToPay = this.effectDiscount(this.raw_pending_amount);
          if (amountToPay > 0) {
            if (this.addCardStatus) {
              this.onSubmit();
            } else {
              this.chargeSavedCard();
            }
          } else {
            this.doCompleteOrder();
          }
        } else {
          // console.log('not handled payment method', this.payment_method);
        }
      }

      return true;
    },
    effectDiscount(amount) {
      let rawAmount = amount.replace(',', '');

      if (this.couponDetails !== null) {
        const discountedAmount = this.calculateCouponAmount(rawAmount, this.couponDetails);
        const couponAmount = rawAmount < discountedAmount ? rawAmount : discountedAmount;
        // eslint-disable-next-line operator-assignment
        rawAmount = rawAmount - couponAmount;
      }
      return rawAmount;
    },
    handleMpesaPayments() {
      const amountToPay = this.effectDiscount(this.raw_pending_amount);

      if (this.payment_is_to_be_requested && amountToPay > 0) {
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
      if (orderData.values.payment_method === 12 && orderData.values.cop_id === 0) {
        this.handleOrderPlacementError(orderData.values);
      } else {
        const payload = {
          values: this.getCompleteOrderObject(),
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'orders/confirm_order',
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
              const eventPayload = {
                eventCategory: 'Order Placement',
                eventAction: 'Order Confirmation',
                eventLabel: 'Order Confirmed - Order Placement - Web App',
              };
              this.fireGAEvent(eventPayload);
              this.sendGA4Events('select_confirm_order');
              let order_no;
              this.setPickupFilled(false);
              // eslint-disable-next-line camelcase
              if (Object.prototype.hasOwnProperty.call(this.activeVendorPriceData, 'order_no')) {
                ({ order_no } = this.activeVendorPriceData);
              } else {
                ({ order_no } = response.respond);
                try {
                  this.mixpanelTrackPricingServiceCompletion(order_no);
                } catch (er) {
                  // catch er
                }
              }
              // ecommerce data tracking
              const ecommercePayload = {
                // eslint-disable-next-line camelcase
                orderNo: order_no,
                amount: orderData.values.amount,
                vendorType: orderData.values.vendor_type,
              };
              this.trackEcommerceData(ecommercePayload);

              if (Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
                this.doNotification(1, this.$t('general.successfull_placed_freight_order'), '');
                this.sendGA4Events('freight_place_order');
              }
              this.shouldDestroy = true;
              this.should_destroy = true;
              if (Object.keys(this.$store.getters.getSession).length > 0) {
                this.$store.dispatch('$_orders/fetchOngoingOrders');
              }

              this.$root.$emit('Order Placement Force Update');
              let accData = {};
              const data = JSON.parse(payload.values).values;
              const session = this.$store.getters.getSession;
              const acc = session.default;
              accData = session[session.default];
              if (Object.prototype.hasOwnProperty.call(session, 'admin_details')) {
                this.trackMixpanelEvent('Place Order', {
                  'Account ': data.type,
                  'Account Type': acc === 'peer' ? 'Personal' : 'Business',
                  'Client Type': 'Web Platform',
                  'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
                  'Order Number': order_no,
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
                  'Client Mode': 'cop_id' in accData ? accData.cop_id : 0,
                  'Order Number': order_no,
                  'Payment Mode': this.payment_method,
                  'User Email': data.user_email,
                  'User Phone': data.user_phone,
                });
              }
              if (this.$route.path === '/orders/dedicated/multi-destination') {
                this.trackGAEvent('Multi destination vendor type selected');
                this.trackMixpanelEvent('Multi destination vendor type selected', {
                  'Vendor ID': data.vendor_type,
                  'Carrier type': this.carrierTypeName(data.carrier_type, data.vendor_type),
                  'Client name': accData.user_name,
                  'Client email': data.user_email,
                  'Account type': acc === 'peer' ? 'Personal' : 'Business',
                  'Client type': 'Web Platform',
                });
                this.trackGAEvent('Multi destination payment option');
                this.trackMixpanelEvent('Multi destination payment option', {
                  'Payment option': this.payMethodName(data.payment_method),
                  'Client name': accData.user_name,
                  'Client email': data.user_email,
                  'Account type': acc === 'peer' ? 'Personal' : 'Business',
                  'Order no': order_no,
                  'Client type': 'Web Platform',
                });
              }
              this.trackGAEvent(
                this.$route.path === '/orders/dedicated/multi-destination'
                  ? 'Multi destination order completion log'
                  : 'Order Completion Log',
              );
              this.trackMixpanelEvent(
                this.$route.path === '/orders/dedicated/multi-destination'
                  ? 'Multi destination order completion log'
                  : 'Order Completion Log',
                {
                  'Account ': data.type,
                  'Account Type': acc === 'peer' ? 'Personal' : 'Business',
                  'Client Type': 'Web Platform',
                  'Payment Mode': this.payment_method,
                  'Cash Status': data.cash_status,
                  'User Email': data.user_email,
                  'User Phone': data.user_phone,
                  'Order Number': order_no,
                  'Order Amount': data.amount,
                  'Schedule Time': data.schedule_time,
                  'Schedule Status': data.schedule_status,
                  'Carrier Type ID': data.carrier_type,
                  'Vendor Type ID': data.vendor_type,
                },
              );
              this.clearInstructionNotes();
              if (!Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
                this.$router.push({
                  name: 'tracking',
                  params: {
                    order_no,
                  },
                });
              }
              const discountedAmount = this.calculateCouponAmount(
                this.full_order_cost,
                this.couponDetails,
              );

              const couponData = {
                coupon_code: this.couponDetails.couponName,
                coupon_amount:
                  this.full_order_cost < discountedAmount ? this.full_order_cost : discountedAmount,
                is_cancelled: false,
                coupon_type: this.couponDetails.couponCodeType,
              };
              this.useCoupon(couponData);
            } else {
              this.doNotification(
                2,
                this.$t('general.order_completion_failed'),
                this.$t('general.price_request_failed_please_try_again'),
              );
            }
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
              this.doNotification(2, this.$t('general.order_completion_failed'), error.response.data.reason);
            } else {
              this.doNotification(
                2,
                this.$t('general.order_completion_failed'),
                this.$t('general.order_completion_failed_text'),
              );
            }
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
        schedule_time: this.order_is_scheduled
          ? this.convertToUTC(this.scheduled_time)
          : this.convertToUTC(this.current_time),
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

      if (this.couponDetails !== null) {
        const discountedAmount = this.calculateCouponAmount(
          this.full_order_cost,
          this.couponDetails,
        );
        payload.promo_code_details = {
          discount_amount:
            this.full_order_cost < discountedAmount ? this.full_order_cost : discountedAmount,
          promo_code: this.couponDetails.couponName,
        };
      }

      // intercounty payload

      if (this.activeVendorPriceData.vendor_id === 26) {
        const intercountyPayload = {
          recipient_info: this.getInterCountyPayload.recipient_info,
          pickup_waypoint_instructions: this.getInterCountyPayload.pickup_waypoint_instructions,
          package_type: this.getInterCountyPayload.package_type,
          approximate_weight: this.getInterCountyPayload.approximate_weight,
          destination_delivery_status: this.getInterCountyPayload.destination_delivery_status,
          pickup_delivery_status: this.getInterCountyPayload.pickup_delivery_status,
          destination_delivery_status: this.getInterCountyPayload.destination_delivery_status,
        };

        if (this.getInterCountyPayload.destination_delivery_status) {
          intercountyPayload.destination_delivery_mode = this.getInterCountyPayload.destination_delivery_mode;
        }
        if (this.getInterCountyPayload.pickup_delivery_status) {
          intercountyPayload.pickup_pricing_uuid = this.getInterCountyPayload.pickup_pricing_uuid;
        }
        if (this.getInterCountyPayload.destination_delivery_status) {
          intercountyPayload.destination_delivery_mode = this.getInterCountyPayload.destination_delivery_mode;
          intercountyPayload.destination_pricing_uuid = this.getInterCountyPayload.destination_pricing_uuid;
        }
        payload.inter_county_order_details = intercountyPayload;
      }
      // support new pricing
      if (this.activeVendorPriceData.order_no === undefined) {
        payload.pricing_uuid = this.activeVendorPriceData.id;
      }
      if (Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')) {
        payload.freight = true;
      }
      if (this.$route.path === '/orders/dedicated/multi-destination') {
        let notesArray = [];
        const notesIndex = [];
        this.getStoreOrderPath.forEach((row) => {
          if (row.notes) {
            notesArray.push(row.notes);
            notesIndex.push(row.notes);
          } else {
            notesArray.push('');
          }
        });
        if (notesIndex.length === 0) {
          notesArray = [];
        }
        payload.waypoint_notes = notesArray;
      }
      payload.waypoint_instructions = this.getInstructionNotes.filter(
        value => Object.keys(value).length !== 0,
      );
      payload = {
        values: payload,
      };
      this.identifyMixpanelUser(acc.user_email);
      return payload;
    },

    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },

    saveInfoToStore() {
      // save locations, notes & payment option

      this.setPaymentMethod(this.payment_method);
    },

    retrieveFromStore() {
      this.schedule_time = this.get_schedule_time;
      this.payment_method = this.get_payment_method;
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
        return this.$t('general.post_pay');
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
          rb_currency: this.activeVendorPriceData.currency,
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
        this.doNotification('3', 'Something went wrong', '');
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
      const amountToPay = this.effectDiscount(this.raw_pending_amount);

      const mpesaPayload = {
        amount: amountToPay,
        sourceMobile: userPhone,
        referenceNumber,
        user_id: userId,
        cop_id: copId,
        phone: userPhone,
        email: userEmail,
        currency: this.activeVendorPriceData.currency,
        vendorType: this.activeVendorPriceData.vendor_id,
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
            this.doNotification(
              '0',
              this.$t('general.mpesa_payment'),
              this.$t('general.request_for_payment_sent', { userPhone }),
            );
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshRunningBalance();
            this.doNotification(
              '0',
              this.$t('general.mpesa_payment'),
              this.$t('general.mpesa_request_failed', { userPhone, referenceNumber })
                + this.pending_amount,
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
            this.$t('general.mpesa_request_failed', { userPhone, referenceNumber })
              + this.pending_amount,
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
              that.doNotification(
                '1',
                that.$t('general.payment_successful'),
                that.$t('general.completing_your_order'),
              );
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
                  that.$t('general.will_keep_trying_checking_payment'),
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
      let cop_id = 0;
      let user_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
      } else {
        cop_id = 0;
        user_id = session.peer.user_id;
      }

      const cardPayload = {
        user_id,
        cop_id,
        entity_id: 3,
        country_code: session[session.default].country_code,
      };

      // encrypt card payload here

      const fullPayload = {
        values: cardPayload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/payment_methods',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          // decrypt response here
          if (response.status) {
            const cards = response.saved_payment_methods.filter(el => el.pay_method_id === 2)
            this.setSavedCards(cards);
          } else {
            this.setSavedCards([]);
          }
        },
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
      if (
        this.activeVendorPriceData.vendor_id === 25
        && !this.getLoadWeightStatus
        && !Object.prototype.hasOwnProperty.call(this.getPriceRequestObject, 'freight')
      ) {
        this.doNotification(
          '2',
          this.$t('general.invalid_load_weight'),
          this.$t('general.provide_a_valid_load_weight'),
        );
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
            this.$t('general.standard_option'),
            this.$t('general.kindly_schedule_for_monday_eight'),
          );
          return false;
        }
        if (day === 'Saturday' && timeHrs >= '17') {
          this.doNotification(
            2,
            this.$t('general.standard_option'),
            this.$t('general.kindly_schedule_for_monday_eight'),
          );
          return false;
        }
        if (timeHrs < '07') {
          this.doNotification(
            2,
            this.$t('general.standard_option'),
            this.$t('general.kindly_schedule_for_monday_eight'),
          );
          return false;
        }
        if (timeHrs >= '17') {
          this.doNotification(
            2,
            this.$t('general.standard_option'),
            this.$t('general.kindly_schedule_for_monday_eight'),
          );
          return false;
        }
        return true;
      }
      return true;
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
    handleClose() {
      // Do nothing ...
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },
    scheduleTimeSummary() {
      let resp = this.$t('general.asap');
      if (this.order_is_scheduled) {
        resp = this.scheduled_time;
      }
      return resp;
    },
    pickUpInstructions() {
      let value = true;
      if (
        this.getInstructionNotes[0] === ''
        || this.getInstructionNotes[0] === undefined
        || this.activeVendorPriceData.vendor_id === 26
      ) {
        value = false;
      }
      return value;
    },
    dropOffInstructions() {
      const data = this.getInstructionNotes.slice(1);
      let value = true;
      if (data.length === 0 || this.activeVendorPriceData.vendor_id === 26) {
        value = false;
      }
      return value;
    },
    deliveryNotesData() {
      return this.getInstructionNotes.slice(1);
    },
    carrierTypeSummary() {
      const carrierType = this.final_carrier_type;
      let resp = this.$t('general.any');
      if (this.largeVendors.includes(this.activeVendorPriceData.vendor_id)) {
        if (carrierType === 3) {
          resp = this.$t('general.refrigirated');
        } else if (carrierType === 4) {
          resp = this.$t('general.flatbed_skeleton');
        } else if (carrierType === 5) {
          resp = this.$t('general.tipper');
        } else if (carrierType === 6) {
          resp = this.$t('general.refeer');
        } else if (carrierType === 7) {
          resp = this.$t('general.highside');
        } else {
          resp = this.$t('general.closed_boxed_body');
        }
      } else if (this.mediumVendors.includes(this.activeVendorPriceData.vendor_id)) {
        if (carrierType === 0) {
          resp = this.$t('general.open');
        } else if (carrierType === 1) {
          resp = this.$t('general.closed');
        } else {
          resp = this.$t('general.any');
        }
      } else if (carrierType === 0) {
        resp = this.$t('general.bike_without_box');
      } else if (carrierType === 1) {
        resp = this.$t('general.bike_with_box');
      } else if (carrierType === 3) {
        resp = this.$t('general.refrigirated');
      } else if (carrierType === 4) {
        resp = this.$t('general.flatbed');
      } else {
        resp = this.$t('general.any');
      }
      return resp;
    },
    interCountyPickUpOption() {
      let resp = this.$t('general.sendy_rider_will_pick_packege');
      if (this.getInterCountyPayload.pickup_pricing_uuid === '') {
        resp = this.$t('general.take_to_nearest_collection_center');
      }
      return resp;
    },
    setPromoCodeDetails(promoCodeDetails) {
      this.couponDetails = promoCodeDetails;
    },
    calculateCouponAmount(orderAmount, couponDetails) {
      // eslint-disable-next-line no-unused-vars
      let amount = orderAmount;
      if (couponDetails.couponCodeType === 1) {
        amount = couponDetails.couponBalance;
      } else {
        const calculatedAmount = couponDetails.couponBalance * orderAmount;
        // eslint-disable-next-line max-len
        amount = calculatedAmount > couponDetails.maxDiscountAmount
          ? couponDetails.maxDiscountAmount
          : calculatedAmount;
      }

      const couponAmount = orderAmount < amount ? orderAmount : amount;
      this.payment_method = this.getRunningBalance + couponAmount - orderAmount >= 0 ? 11 : this.payment_method;
      return amount;
    },
  },
};
</script>

<style lang="css">
@import '../../../../../assets/styles/orders_order_placement_options.css';
</style>
