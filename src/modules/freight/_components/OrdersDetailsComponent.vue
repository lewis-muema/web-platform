<template lang="html">
  <div class="transporters-main">
    <div class="transporters-container transporters-main--inner flex-div">
      <div v-if="loading">
        <loading-component />
      </div>
      <div v-else>
        <div
          class="back-freight-btn back-freight-orders"
          @click="backToOrders()"
        >
          <i class="el-icon-arrow-left view-transporter-info" />
          {{ $t('orderDetailsComponent.back') }}
        </div>
        <div class="shipment-id-label">
          {{ $t('orderDetailsComponent.shipment_id') }} : {{ freightOrderDetail.transformed_id }}
        </div>
        <div
          v-if="view_tracking"
          class="shipment-tracking-container"
        >
          <shipment-tracking />
          <shipment-vehicles class="vehicle-layout" />
        </div>
        <div class="freight-orders-main-summary">
          <div class="freight-order-details-wrapper">
            <div
              v-if="!view_tracking"
              class="freight_order_details_map"
            >
              <Img
                :src="createStaticMapUrl(freightOrderDetail.destination, freightOrderDetail.pickup)"
              />
            </div>
            <div class="flex-div">
              <div
                class="inner-content-flex"
                :class="{ disable_tracking: view_tracking }"
              >
                <div class="order_details_desc">
                  <div class="order_details_desc_item">
                    <img
                      src="../../../assets/img/maroon_button.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.pick_up_location')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.pickup.name }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/blue_button.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.destination')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.destination.name }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/delivery_time.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.pick_up_time')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{
                        moment(freightOrderDetail.pickup_time, 'MM-DD-YYYY HH:mm:ss').format(
                          'DD-MM-YYYY HH:mm'
                        )
                      }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/load_type.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.type_of_load')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.cargo_type }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/price_offer.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.price_offer')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{
                        freightOrderDetail.offer_amount === 0 ||
                          freightOrderDetail.offer_amount === null
                          ? 'Transporters to bid'
                          : `${freightOrderDetail.currency} ${freightOrderDetail.offer_amount}`
                      }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="freight-order-etra-info">
                <div class="">
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/trucks_no.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.needed_trucks')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.total_trucks }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/truck_type.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.type_of_truck')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.carrier_type }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/load_weight.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.loader_weight')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.tonnes_per_truck }}
                      {{ $t('orderDetailsComponent.tonnes') }}
                    </div>
                  </div>
                  <div
                    v-if="checkContainerState(freightOrderDetail)"
                    class="order_details_desc_item order-details-schedule-time"
                  >
                    <img
                      src="../../../assets/img/freight/return.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{
                      $t('orderDetailsComponent.returnable_text')
                    }}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.cargo_type_options[0].value === 'true' ? 'Yes' : 'No' }}
                    </div>
                  </div>

                  <!-- <div
                    v-if="!freightOrderDetail.rated"
                    class="rating-section"
                  >
                    <div class="rating-title">
                      How was your experience with {{ freightOrderDetail.transporter_name }} ?
                    </div>
                    <div class="decline-documemt-extend">
                      <button
                        type="button"
                        name="button"
                        class="decline-action--slide-button rate-freight-order"
                        @click="openRatingDialog"
                      >
                        Rate order
                      </button>
                    </div>
                  </div>
                  <div v-else>
                    <div class="transporters-filters transporters-highlight">
                      <div class="truck-add-info">
                        <div class="transporter-infor--header freight-ratings-section">
                          Order Ratings
                        </div>
                        <el-rate
                          :value="freightOrderDetail.rating.rating"
                          disabled
                          disabled-void-color="#C0C4CC"
                          :colors="['#99A9BF', '#F57f20', '#1782C5']"
                        />
                      </div>
                    </div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="freight-border-line" />

        <!-- Transporters List -->

        <DocumentsSection :freight-order-detail="freightOrderDetail" />

        <!-- Counter offers section  -->
        <div
          v-if="Object.prototype.hasOwnProperty.call(freightOrderDetail, 'quotations')"
          class=""
        >
          <div v-if="freightOrderDetail.counter_offers.length > 0">
            <div class="order-info-header align-documents-data">
              {{ $t('orderDetailsComponent.counter_offers') }}
              ({{ freightOrderDetail.counter_offers.length }})
            </div>
            <div class="">
              <div class="order_details_desc_item ">
                <img
                  src="../../../assets/img/freight/truck_type.png"
                  class="order_details_desc_image"
                >
                <span
                  class="freight-documents-date trucks-listing"
                >{{
                  getTrucksNeeded(
                    freightOrderDetail.available_trucks,
                    freightOrderDetail.total_trucks
                  )
                }}
                </span>
              </div>
            </div>
            <div class="transporter-listing order-order-documents">
              <div
                v-for="(val, index) in freightOrderDetail.counter_offers"
                :key="index"
                class="doc-detail"
                :class="getItemPosition(freightOrderDetail.counter_offers, index)"
              >
                <div class="transporters-filters documents-highlight orders-freight-documents ">
                  <div class="freight-documents-title">
                    {{ val.name }}
                  </div>
                  <div class=" freight-documents-date order-info-header">
                    {{ val.trucks_available }}
                    {{ $t('orderDetailsComponent.trucks_multiple') }}
                  </div>
                  <div class=" freight-documents-date">
                    {{ freightOrderDetail.currency }}
                    {{ val.price_per_truck }} /{{
                      $t('orderDetailsComponent.single_truck')
                    }}
                  </div>

                  <div
                    v-if="checkActionableBtnState"
                    class="freight-documents-approve flex-div"
                  >
                    <button
                      type="button"
                      class="button-primary section--filter-action freight-approve-doc"
                      name="create_order_text"
                      @click="awardBid(freightOrderDetail.counter_offers[index],2)"
                    >
                      {{ accept }}
                    </button>
                    <button
                      type="button"
                      class="section--filter-action freight-decline-doc"
                      name="create_order_text"
                      @click="declineCounter()"
                    >
                      {{ decline_quatation_text }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quatations List -->

        <div
          v-if="Object.prototype.hasOwnProperty.call(freightOrderDetail, 'quotations')"
          class=""
        >
          <div class="order-info-header align-documents-data">
            {{ $t('orderDetailsComponent.quotations') }}
            {{
              freightOrderDetail.quotations.length > 0
                ? `(${freightOrderDetail.quotations.length})`
                : ''
            }}
          </div>
          <div class="">
            <div class="order_details_desc_item ">
              <img
                src="../../../assets/img/freight/truck_type.png"
                class="order_details_desc_image"
              >
              <span
                class="freight-documents-date trucks-listing"
              >{{
                getTrucksNeeded(
                  freightOrderDetail.available_trucks,
                  freightOrderDetail.total_trucks
                )
              }}
              </span>
            </div>
          </div>
          <div class="transporter-listing order-order-documents">
            <div v-if="freightOrderDetail.quotations.length > 0">
              <div
                v-for="(val, index) in freightOrderDetail.quotations"
                v-if="index >= 0"
                class="doc-detail"
                :class="getItemPosition(freightOrderDetail.quotations, index)"
              >
                <div class="transporters-filters documents-highlight orders-freight-documents ">
                  <div class="freight-documents-title">
                    {{ freightOrderDetail.quotations[index].name }}
                  </div>
                  <div class=" freight-documents-date order-info-header">
                    {{ freightOrderDetail.quotations[index].trucks_available }}
                    {{ $t('orderDetailsComponent.trucks_multiple') }}
                  </div>
                  <div class=" freight-documents-date">
                    {{ freightOrderDetail.currency }}
                    {{ freightOrderDetail.quotations[index].price_per_truck }} /{{
                      $t('orderDetailsComponent.single_truck')
                    }}
                  </div>

                  <div
                    v-if="checkActionableBtnState"
                    class="freight-documents-approve flex-div"
                  >
                    <button
                      type="button"
                      class="button-primary section--filter-action freight-approve-doc"
                      name="create_order_text"
                      @click="awardBid(freightOrderDetail.quotations[index],1)"
                    >
                      {{ approve_quatation_text }}
                    </button>
                    <button
                      type="button"
                      class="section--filter-action freight-decline-doc"
                      name="create_order_text"
                      @click="declineBid(freightOrderDetail.quotations[index])"
                    >
                      {{ decline_quatation_text }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="doc-detail waiting-quatation">
                <img
                  src="../../../assets/img/freight/no_quatations.svg"
                  class="no-quatations-img "
                >
                <div class="no-transporters-label">
                  {{ $t('orderDetailsComponent.awaiting_quotations') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <transition
          name="fade"
          mode="out-in"
        >
          <div class="">
            <el-dialog
              :visible.sync="awardDialogVisible"
              class="requestShipmentOptions"
            >
              <div v-if="!verification_stage">
                <div
                  v-if="counter"
                  class="counter"
                >
                  <h1
                    class="counter-title"
                  >
                    Accept {{ awardedTransporter.name }}s' counter offer?
                  </h1>
                  <p class="counter-label">
                    {{ $t('orderDetailsComponent.counter_truck_price') }}
                  </p>
                  <p class="counter-value">
                    USD {{ awardedTransporter.price_per_truck }}
                  </p>
                  <p class="counter-label">
                    {{ $t('orderDetailsComponent.counter_available_trucks') }}
                  </p>

                  <div
                    v-if="fewerTrucks"
                    class="counter-counter"
                  >
                    <button
                      class="counter-btn"
                      :disabled="trucks_no === 1"
                      @click="trucks_no--"
                    >
                      -
                    </button>
                    <p
                      class="counter-value counter-input counter-truck"
                      type="text"
                    >
                      {{ trucks_no }}
                    </p>
                    <button
                      class="counter-btn"
                      :disabled="trucks_no === awardedTransporter.trucks_available"
                      @click="trucks_no++"
                    >
                      +
                    </button>
                  </div>
                  <div
                    v-else
                    class="counter-trucks"
                  >
                    <p class="counter-value">
                      {{ awardedTransporter.trucks_available }}
                    </p>
                    <p
                      class="counter-redirect"
                      @click="fewerTrucks=true"
                    >
                      {{ $t('orderDetailsComponent.counter_fewer_trucks') }}
                    </p>
                  </div>
                  <p class="counter-label">
                    {{ $t('orderDetailsComponent.total_amount') }}
                  </p>
                  <p class="counter-value">
                    USD {{ trucks_no * awardedTransporter.price_per_truck }}
                  </p>
                </div>

                <div v-else>
                  <div class="">
                    <div
                      class="decline-text-option decline-documemt-extend
                      request-shipment-header outline-info-value"
                    >
                      {{ $t('orderDetailsComponent.available_trucks') }}
                      {{ awardedTransporter.name }}
                    </div>
                  </div>

                  <div class="award-sub-details doc-detail">
                    <div class="award-inner-info">
                      <div class="quatations-outline-info">
                        {{ $t('orderDetailsComponent.awaiting_quotations') }}:
                        <span class="outline-info-value">
                          {{ awardedTransporter.trucks_available }}
                        </span>
                      </div>
                      <div class="quatations-outline-info">
                        {{ $t('orderDetailsComponent.rate_per_truck') }}:
                        <span
                          class="outline-info-value"
                        >{{ freightOrderDetail.currency }}
                          {{ awardedTransporter.price_per_truck }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="award-shipment-input">
                    <p class="award-input--label">
                      {{ $t('orderDetail.how_many_of') }}
                      {{ awardedTransporter.name }}’s {{ $t('orderDetail.availabe_trucks_assign') }}
                    </p>
                    <div class="block">
                      <el-input-number
                        v-model="trucks_no"
                        :min="1"
                      />
                    </div>
                  </div>
                </div>

                <div class="award-shipment-input">
                  <p class="award-input--label upload-landing">
                    {{ $t('orderDetailsComponent.bill_of_lading_upload') }}
                  </p>
                  <div class="document-image">
                    <div class="download-uploaded-img">
                      <el-upload
                        class="upload-demo"
                        drag
                        action="handleLandingCardPreview"
                        :before-upload="beforeLandingUpload"
                        :http-request="handleLandingCardPreview"
                        :on-remove="handleRemoveLanding"
                      >
                        <img
                          id="ladingImagePreview"
                          class="upload_image"
                          src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                        >
                        <i class="el-icon-upload" />
                        <div v-if="billOfLandingName !== ''">
                          {{ landing_text }}
                        </div>
                        <div v-else>
                          {{ $t('createFreightOrder.drop_file') }}
                          <em>{{ $t('createFreightOrder.click_upload') }}</em>
                        </div>
                      </el-upload>
                      <div v-if="billOfLandingName !== '' && landing_text === 'Change'">
                        <span class="document-upload-label">
                          {{ $t('createFreightOrder.bill_lading_successfully') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="award-shipment-input payment-terms">
                  <p class="award-input--label">
                    {{ $t('orderDetailsComponent.payment_terms') }}
                  </p>
                  <div class="block">
                    <el-select
                      v-model="payment_terms"
                      placeholder=""
                      class="transporters-element-inputs"
                      filterable
                    >
                      <el-option
                        v-for="item in terms"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>

                <div class="decline-button-align">
                  <div
                    v-if="counter"
                    class="counter-submit"
                  >
                    <button
                      type="button"
                      name="button"
                      class="counter-submit-btn counter-submit-btn__clear"
                      @click="closeCounter(1)"
                    >
                      {{ $t('orderDetailsComponent.counter_cancel') }}
                    </button>
                    <button
                      type="button"
                      name="button"
                      class="counter-submit-btn"
                      @click="awardDocument()"
                    >
                      {{ $t('orderDetailsComponent.accept_counter') }}
                    </button>
                  </div>
                  <button
                    v-else
                    type="button"
                    name="button"
                    class="quote-action--slide-button award-shipment-btn"
                    @click="awardDocument()"
                  >
                    {{ $t('orderDetailsComponent.award') }}
                  </button>
                </div>
              </div>
              <div v-else>
                <div class="">
                  <div
                    class="decline-text-option decline-documemt-extend request-shipment-header outline-info-value"
                  >
                    {{ $t('orderDetailsComponent.award_verification') }}
                    {{ awardedTransporter.name }}
                    ?
                  </div>
                </div>
                <div class="shipment-summary-outer">
                  <div class="quatations-outline-info-summary">
                    {{ $t('orderDetailsComponent.truck_price') }}
                    <p class="outline-info-value summary-inner-value">
                      {{ freightOrderDetail.currency }} {{ awardedTransporter.price_per_truck }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{ $t('orderDetailsComponent.assigned_truck') }}
                    <p class="outline-info-value summary-inner-value">
                      {{ trucks_no }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{ $t('orderDetailsComponent.total_amount') }}
                    <p class="outline-info-value summary-inner-value">
                      {{ freightOrderDetail.currency }}
                      {{ trucks_no * awardedTransporter.price_per_truck }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{ $t('orderDetailsComponent.payment_terms_label') }}
                    <p class="outline-info-value summary-inner-value">
                      {{ $t('orderDetailsComponent.payment_in') }} {{ payment_terms }} {{ $t('orderDetailsComponent.payment_days') }}
                    </p>
                  </div>

                  <div class="decline-documemt-extend decline-button-align send-quote--outer">
                    <button
                      type="button"
                      name="button"
                      class="quote-action--slide-button send-final-quote-btn back-shipment-btn"
                      @click="goBack()"
                    >
                      {{ $t('orderDetailsComponent.back') }}
                    </button>
                    <button
                      type="button"
                      name="button"
                      class="quote-action--slide-button send-final-quote-btn"
                      @click="awardFinal()"
                    >
                      {{ $t('orderDetailsComponent.award_bid') }}
                    </button>
                  </div>
                </div>
              </div>
            </el-dialog>
            <el-dialog
              :visible.sync="declineCounterDialog"
              class="counter-dialog"
            >
              <div
                v-for="(val, index) in freightOrderDetail.counter_offers"
                :key="index"
                class="counter-dialog-decline"
              >
                <h2 class="outline-info-value">
                  Decline {{ val.name }}s' Counter offer
                </h2>
                <p class="counter-dialog-label">
                  {{ $t('orderDetailsComponent.counter_sure') }}
                </p>
                <div class="counter-decline-btn">
                  <button
                    class="counter-submit-btn counter-submit-btn__clear"
                    @click="closeCounter(2)"
                  >
                    Cancel
                  </button>
                  <button
                    class="counter-submit-btn"
                    @click="declineBid(freightOrderDetail.counter_offers[index])"
                  >
                    {{ $t('orderDetailsComponent.decline_counter') }}
                  </button>
                </div>
              </div>
            </el-dialog>

            <el-dialog
              :visible.sync="viewDocumentOption"
              class="documentOptions"
            >
              <div class="">
                <div class="document-text-option ">
                  {{ src_name }} {{ $t('orderDetailsComponent.document') }}
                </div>
                <div class="document-divider" />
                <div class="document-view-inner">
                  <iframe
                    :src="src_link"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                  />
                </div>
              </div>
            </el-dialog>

            <el-dialog
              :visible.sync="showDeclineDialog"
              class="declineDocumentOptions"
            >
              <div class="">
                <div class="decline-text-option decline-documemt-extend">
                  {{ $t('orderDetailsComponent.decline_document') }}
                </div>
              </div>
              <div class="decline-documemt-extend award-shipment-input">
                <el-input
                  v-model.trim="reason"
                  :min="0"
                  type="textarea"
                  autocomplete="true"
                />
              </div>

              <div class="decline-documemt-extend decline-button-align">
                <button
                  type="button"
                  name="button"
                  class="decline-action--slide-button"
                  @click="declineDocument()"
                >
                  {{ $t('orderDetailsComponent.decline') }}
                </button>
              </div>
            </el-dialog>

            <el-dialog
              :visible.sync="showRatingDialog"
              class="declineDocumentOptions"
            >
              <div class="">
                <div class="decline-text-option rating-header">
                  {{ $t('orderDetailsComponent.rating_experience') }}
                  {{ freightOrderDetail.transporter_name }} ?
                </div>
              </div>
              <span class="freight-stars-container">
                <el-rate
                  v-model="rated_score"
                  class="freight-rating"
                  :colors="['#99A9BF', '#F57f20', '#1782C5']"
                />
              </span>
              <div class="award-shipment-input">
                <el-input
                  v-model.trim="comment"
                  :min="0"
                  :placeholder="$t('orderDetailsComponent.rating_placeholder')"
                  type="textarea"
                  autocomplete="true"
                />
              </div>

              <div class="decline-documemt-extend decline-button-align">
                <button
                  type="button"
                  name="button"
                  class="decline-action--slide-button"
                  @click="submitRating(freightOrderDetail)"
                >
                  {{ $t('orderDetailsComponent.submit') }}
                </button>
              </div>
            </el-dialog>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import numeral from 'numeral';
import S3 from 'aws-s3';
import $ from 'jquery';
import TimezoneMxn from '../../../mixins/timezone_mixin';
import LoadingComponent from './LoadingComponent.vue';
import NotificationMxn from '../../../mixins/notification_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';
import DocumentsSection from './FreightDocuments/Documents.vue';
import ShipmentTracking from './tracking/FreightTracking.vue';
import ShipmentVehicles from './tracking/ShipmentVehicles.vue';

let s3 = '';

export default {
  name: 'OrderDetailsComponent',
  components: {
    LoadingComponent,
    DocumentsSection,
    ShipmentTracking,
    ShipmentVehicles,
  },
  mixins: [TimezoneMxn, NotificationMxn, MixpanelMixin],
  data() {
    return {
      quote_text: this.$t('orderDetailsComponent.request_quote'),
      financing_text: this.$t('orderDetailsComponent.place_order'),
      rating: 5.0,
      loading: true,
      approve_quatation_text: this.$t('orderDetailsComponent.award'),
      accept: 'Accept',
      decline_quatation_text: this.$t('orderDetailsComponent.decline'),
      viewDocumentOption: false,
      src_link: '',
      src_name: '',
      documents_data: [],
      freightOrderDetail: [],
      decline_doc: {},
      showDeclineDialog: false,
      reason: '',
      comment: '',
      showRatingDialog: false,
      rated_score: 1,
      awardDialogVisible: false,
      payment_terms: '',
      trucks_no: 1,
      billOfLandingData: {},
      landing_text: this.$t('orderDetailsComponent.landing_text'),
      billOfLandingName: '',
      awardedTransporter: {},
      verification_stage: false,
      counter: false,
      fewerTrucks: false,
      declineCounterDialog: false,
      terms: [
        {
          value: 7,
          label: this.$t('orderDetailsComponent.payment_days_7'),
        },
        {
          value: 14,
          label: this.$t('orderDetailsComponent.payment_days_14'),
        },
        {
          value: 21,
          label: this.$t('orderDetailsComponent.payment_days_21'),
        },
        {
          value: 28,
          label: this.$t('orderDetailsComponent.payment_days_28'),
        },
      ],
      opened: [],
      billOfLadingOptions: {},
      view_tracking: false,
    };
  },
  computed: {
    ...mapGetters({
      getDocumentUrl: '$_freight/getDocumentUrl',
      getDocumentName: '$_freight/getDocumentName',
      getDocumentDialog: '$_freight/getDocumentDialog',
      getOrderDetail: '$_freight/getOrderDetail',
      getDeclineDocument: '$_freight/getDeclineDocument',
      getDocumentDialogDocument: '$_freight/getDocumentDialogDocument',
    }),
  },
  watch: {
    viewDocumentOption(val) {
      if (!val) {
        this.setDocumentUrl('');
        this.setDocumentName('');
        this.setDocumentDialog(false);
      }
    },
    showDeclineDialog(val) {
      if (!val) {
        this.closeDeclineDialog();
      }
    },
    awardDialogVisible(val) {
      if (!val) {
        this.resetShipmentDialog();
      }
    },
    getDocumentDialog(value) {
      this.viewDocumentOption = value;
      this.src_link = this.getDocumentUrl;
      this.src_name = this.getDocumentName;
    },
    getOrderDetail(val) {
      if (val) {
        this.loading = true;
        this.fetchOrderDetail(this.$route.params.id);
        this.setOrderDetail(false);
      }
    },
    getDocumentDialogDocument(value) {
      this.decline_doc = this.getDeclineDocument;
      this.showDeclineDialog = value;
    },
  },
  mounted() {
    this.loading = true;
    const session = this.$store.getters.getSession;
    if (Object.keys(session).length > 0) {
      this.fetchOrderDetail(this.$route.params.id);
      this.initiateS3();
      this.trackMixpanelEvent('Shipments Info Viewed', {
        userId: session[session.default].user_id,
        email: session[session.default].user_email,
        phone: session[session.default].user_phone,
        name: session[session.default].user_name,
        shipmentId: parseInt(this.$route.params.id, 10),
        clientType: 'Web',
        clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
        device: 'Desktop',
      });
      this.setBillOfLadingData();
    }
  },
  methods: {
    ...mapActions({
      getFreightOrderDetail: '$_freight/getFreightOrderDetail',
      rateFreightOrder: '$_freight/rateFreightOrder',
      awardShipment: '$_freight/awardShipment',
      approveDocument: '$_freight/approveDocument',
      getDocumentOptions: '$_freight/getDocumentOptions',
      getTrackingVehicles: '$_freight/getTrackingVehicles',
    }),
    ...mapMutations({
      setDocumentUrl: '$_freight/setDocumentUrl',
      setDocumentName: '$_freight/setDocumentName',
      setDocumentDialog: '$_freight/setDocumentDialog',
      setDeclineDocument: '$_freight/setDocumentName',
      setDocumentDialogDocument: '$_freight/setDocumentDialog',
      setOrderDetail: '$_freight/setOrderDetail',
      setTrackingVehicles: '$_freight/setTrackingVehicles',
    }),
    initiateS3() {
      const script = document.createElement('script');
      script.onload = () => {
        const albumBucketName = 'sendy-partner-docs';
        const bucketRegion = 'eu-west-1';
        const IdentityPoolId = 'eu-west-1:2812c134-0c22-4755-be2d-8fa850a041ee';

        AWS.config.update({
          region: bucketRegion,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId,
          }),
        });

        s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: { Bucket: albumBucketName },
        });
      };
      script.src = 'https://sdk.amazonaws.com/js/aws-sdk-2.7.20.min.js';

      document.head.appendChild(script);
    },
    fetchOrderDetail(orderId) {
      this.fetchTrackingVehicles(orderId);
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: `shipments/${orderId}`,
      };

      this.getFreightOrderDetail(fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.freightOrderDetail = workingResponse.data;
            this.loading = false;
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.failure_to_fetch_details'),
              workingResponse.message,
            );
            this.$router.push('/freight/orders');
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('orderDetailsComponent.failure_to_fetch_details'),
            this.$t('orderDetailsComponent.support_response'),
          );
          this.$router.push('/freight/orders');
        },
      );
    },
    fetchTrackingVehicles(orderId) {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: `shipments/track/${orderId}`,
      };
      this.getTrackingVehicles(fullPayload).then(
        (response) => {
          if (response.status) {
            const responseData = response.data;
            if (responseData.length > 0) {
              this.view_tracking = true;
              this.setTrackingVehicles(responseData);

              setTimeout(() => {
                this.fetchTrackingVehicles(orderId);
              }, 30000);
            } else {
              this.view_tracking = false;
              this.setTrackingVehicles([]);
            }
          } else {
            this.view_tracking = false;
            this.setTrackingVehicles([]);
          }
        },
        (error) => {
          this.view_tracking = false;
          this.setTrackingVehicles([]);
        },
      );
    },
    setBillOfLadingData() {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'document_types/stages/1',
      };
      this.getDocumentOptions(fullPayload).then(
        (response) => {
          if (response.status) {
            const responseData = response.data;
            if (responseData.length > 0) {
              const listed = responseData.find(
                location => location.document_type === this.$t('createFreightOrder.bol'),
              );

              if (listed !== undefined) {
                this.billOfLadingOptions = listed;
              }
            }
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.failure_to_retrieve_options'),
              response.message,
            );
            this.$router.push('/freight/orders');
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('orderDetailsComponent.failure_to_retrieve_options'),
            this.$t('orderDetailsComponent.failure_options_support'),
          );
          this.$router.push('/freight/orders');
        },
      );
    },
    backToTransporters() {
      this.$router.push('/freight/transporters');
    },
    getRowKey(row) {
      return row.id;
    },
    getTrucksNeeded(available, total) {
      const pendingTrucks = total - available;
      let resp = `${pendingTrucks} ${this.$t('orderDetailsComponent.multiple_trucks_needed')}`;
      if (pendingTrucks === 1) {
        resp = `${pendingTrucks} ${this.$t('orderDetailsComponent.single_truck_needed')}`;
      }
      return resp;
    },
    backToOrders() {
      this.$router.push('/freight/orders');
    },
    checkContainerState(val) {
      let resp = false;
      if (Object.prototype.hasOwnProperty.call(val, 'cargo_type_options')) {
        if (val.cargo_type_options.length > 0) {
          resp = true;
        }
      }

      return resp;
    },
    createStaticMapUrl(destination, pickup) {
      const googleKey = process.env.CONFIGS_ENV.GOOGLE_API_KEY;
      const fromCordinates = pickup.coordinates;
      const toCordinates = destination.coordinates;
      return `https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|${fromCordinates}|${toCordinates}&size=257x257&markers=color:0xF17F3A%7Clabel:P%7C
        ${fromCordinates}&markers=color:0x2c82c5%7Clabel:D%7C${toCordinates}&key=${googleKey}`;
    },
    getOrderFromName(path) {
      return path[0].name;
    },
    getOrderToName(path) {
      const pathLength = path.length;
      return path[pathLength - 1].name;
    },
    goToTransporter(val) {
      this.$router.push(`/freight/transporters/info/${val}`);
    },
    formatCurrency(currency) {
      return numeral(currency).format('0,0');
    },
    handleRemoveLanding() {
      this.billOfLandingName = '';
      this.billOfLandingData = {};
      this.landing_text = this.$t('orderDetailsComponent.landing_text');
    },
    beforeLandingUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(
          2,
          this.$t('orderDetailsComponent.document_upload_error'),
          this.$t('orderDetailsComponent.document_upload_error_msg'),
        );
      }
      return isPdf;
    },
    getItemPosition(data, index) {
      let name = '';

      if (index >= 0 && index < data.length - 1) {
        name = 'no-transporter-top-margin';
      }
      return name;
    },
    handleLandingCardPreview(file) {
      this.billOfLandingData = file;
      this.uploadBillOfLanding();
    },
    uploadBillOfLanding() {
      if (Object.keys(this.billOfLandingData).length === 0) {
        this.doNotification(2, this.$t('orderDetailsComponent.upload_lading_docs'), '');
      } else {
        const imageId = 'ladingImagePreview';
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.landing_text = this.$t('orderDetailsComponent.uploading');
        const { file } = this.billOfLandingData;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name, 'bill');
        this.billOfLandingName = fileName;
        const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
        const photoKey = albumPhotosKey + fileName;
        this.billOfLandingName = photoKey;
        s3.upload(
          {
            Key: photoKey,
            Body: file,
            ACL: 'public-read',
            ContentType: fileType,
          },
          (err) => {
            if (err) {
              this.landing_text = this.$t('orderDetailsComponent.landing_text');
              console.log(this.$t('orderDetailsComponent.upload_doc_error'), err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.landing_text = this.$t('orderDetailsComponent.landing_text');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    sanitizeFilename(name, type) {
      const session = this.$store.getters.getSession;
      let tempName = '';
      let values = '';
      if (session.default === 'biz') {
        values = session[session.default].cop_id;
      } else {
        values = session[session.default].user_id;
      }
      if (type === 'bill') {
        tempName = `bill_of_landing_${values}_${new Date().getTime()}.${name.split('.').pop()}`;
      } else if (type === 'other') {
        tempName = `add_new_document_${values}_${new Date().getTime()}.${name.split('.').pop()}`;
      } else {
        tempName = `terms_of_delivery_${values}_${new Date().getTime()}.${name.split('.').pop()}`;
      }

      return tempName;
    },
    awardBid(val, num) {
      this.awardDialogVisible = true;
      this.awardedTransporter = val;

      if (num === 1) {
        this.counter = false;
      } else if (num === 2) { // counter offer dialog
        this.counter = true;
        this.trucks_no = this.awardedTransporter.trucks_available;
      }
      this.fewerTrucks = false;
    },
    closeCounter(num) {
      if (num === 1) {
        this.awardDialogVisible = false;
      } else if (num === 2) {
        this.declineCounterDialog = false;
      }
    },
    declineCounter() {
      this.declineCounterDialog = true;
    },
    declineBid(val) {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        quotation_id: val.quotation_id,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
      } else {
        payload.peer_id = acc.user_id;
      }

      const fullPayload = {
        values: payload,
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'shipments/quotations',
      };

      this.$store.dispatch('$_freight/declineShipment', fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          this.declineCounterDialog = false;
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetailsComponent.reject_bid'), '');
            this.trackMixpanelEvent('Bid Rejected', {
              userId: session[session.default].user_id,
              email: session[session.default].user_email,
              phone: session[session.default].user_phone,
              name: session[session.default].user_name,
              shipmentId: parseInt(this.$route.params.id, 10),
              clientType: 'Web',
              quotationId: val.quotation_id,
              clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
              device: 'Desktop',
            });
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.unable_to_reject_bid'),
              workingResponse.message,
            );
          }
          this.fetchOrderDetail(this.$route.params.id);
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'message')) {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.reject_bid_failure'),
              error.response.data.message,
            );
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.reject_bid_failure'),
              this.$t('orderDetailsComponent.something_went_wrong'),
            );
            this.$router.push('/freight/orders');
          }
        },
      );
    },
    awardDocument() {
      if (this.billOfLandingName !== '' && this.trucks_no !== '' && this.payment_terms !== '') {
        if (this.counter) {
          this.awardFinal();
        } else {
          this.verification_stage = true;
        }
      } else if (this.counter) {
        this.doNotification(
          2,
          this.$t('orderDetailsComponent.award_counter_error'),
          this.billOfLandingName === '' ? this.$t('orderDetailsComponent.provide_bill_lading') : this.$t('orderDetailsComponent.provide_payment_terms'),
        );
      } else {
        this.doNotification(
          2,
          this.$t('orderDetailsComponent.award_shipment_error'),
          this.$t('orderDetailsComponent.provide_all_values'),
        );
      }
    },
    goBack() {
      this.verification_stage = false;
    },
    awardFinal() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        document_id: this.billOfLadingOptions.id,
        quotation_id: this.awardedTransporter.quotation_id,
        trucks_available: this.trucks_no,
        payment_terms: this.payment_terms,
        document: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.billOfLandingName}`,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
      } else {
        payload.peer_id = acc.user_id;
      }

      const fullPayload = {
        values: payload,
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'shipments/quotations',
      };
      this.awardShipment(fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetailsComponent.award_shipment_success'), '');
            this.trackMixpanelEvent('Bid Accepted', {
              userId: session[session.default].user_id,
              email: session[session.default].user_email,
              phone: session[session.default].user_phone,
              name: session[session.default].user_name,
              shipmentId: parseInt(this.$route.params.id, 10),
              clientType: 'Web',
              quotationId: this.awardedTransporter.quotation_id,
              clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
              device: 'Desktop',
            });
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.unable_to_award'),
              workingResponse.data.message,
            );
          }
          this.resetShipmentDialog();
          this.fetchOrderDetail(this.$route.params.id);
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'message')) {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.award_shipment_failure'),
              error.response.data.message,
            );
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.award_shipment_failure'),
              this.$t('orderDetailsComponent.something_went_wrong'),
            );
            this.$router.push('/freight/orders');
          }
        },
      );
    },
    resetShipmentDialog() {
      this.verification_stage = false;
      this.awardDialogVisible = false;
      this.payment_terms = '';
      this.trucks_no = 1;
      this.billOfLandingData = {};
      this.landing_text = this.$t('orderDetailsComponent.landing_text');
      this.billOfLandingName = '';
      this.awardedTransporter = {};
    },
    declineDocument() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        document_id: this.decline_doc.document_id,
        status: -1,
        reason: this.reason,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
      } else {
        payload.peer_id = acc.user_id;
      }

      const fullPayload = {
        values: payload,
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'shipments/quotations/documents/decline',
      };

      this.approveDocument(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(
              1,
              this.$t('orderDetailsComponent.decline_document_resp'),
              this.$t('orderDetailsComponent.decline_document_msg'),
            );
            this.showDeclineDialog = false;
            this.setDeclineDocument({});
            this.setDocumentDialogDocument(false);
            this.fetchOrderDetail(this.$route.params.id);
          } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.decline_document_failure'),
              workingResponse.message,
            );
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.decline_document_failure'),
              workingResponse.reason,
            );
          }
          this.closeDeclineDialog();
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.decline_document_failure'),
              error.response.data.reason,
            );
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.decline_document_failure'),
              this.$t('orderDetailsComponent.decline_document_support'),
            );
          }
          this.closeDeclineDialog();
        },
      );
    },
    closeDeclineDialog() {
      this.setDeclineDocument({});
      this.setDocumentDialogDocument(false);
      this.reason = '';
    },
    openRatingDialog() {
      this.showRatingDialog = true;
    },
    submitRating(val) {
      const payload = {
        order_id: val.order_id,
        rating: parseInt(this.rated_score, 10),
        comment: this.comment,
      };
      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/rate_owner',
      };

      this.rateFreightOrder(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetailsComponent.rating_successfull'), '');
            this.closeRatingDialog();
            this.backToOrders();
          } else {
            this.doNotification(
              2,
              this.$t('orderDetailsComponent.rating_failure'),
              workingResponse.message,
            );
            this.closeRatingDialog();
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('orderDetailsComponent.rating_failure'),
            this.$t('orderDetailsComponent.rating_failure_support'),
          );
          this.closeRatingDialog();
        },
      );
    },
    closeRatingDialog() {
      this.decline_doc = {};
      this.rating = 1;
      this.comment = '';
    },
    checkActionableBtnState() {
      const session = this.$store.getters.getSession;
      let resp = false;
      if (session.default === 'biz') {
        if (session[session.default].freight_approver === 1) {
          resp = true;
        }
      }
      return resp;
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/transporters_component.css';
@import '../../../assets/styles/transporters_documents.css';
</style>
