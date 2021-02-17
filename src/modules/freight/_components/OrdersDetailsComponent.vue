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
          <i class="el-icon-arrow-left view-transporter-info" /> {{$t('general.back')}}
        </div>
        <div class="freight-orders-main-summary">
          <div class="freight-order-details-wrapper">
            <div class="freight_order_details_map">
              <Img
                :src="createStaticMapUrl(freightOrderDetail.destination, freightOrderDetail.pickup)"
              />
            </div>
            <div class="flex-div">
              <div class="inner-content-flex">
                <div class="order_details_desc">
                  <div class="order_details_desc_item">
                    <img
                      src="../../../assets/img/maroon_button.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.pickup_location')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.pickup.name }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order_details_desc_item--no-space">
                    <img
                      src="../../../assets/img/blue_button.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.destination')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.destination_name }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/time.svg"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.pickup_time')}}</span>
                    <div class="freight-order-info-extra">
                      {{ convertToUTCToLocal(freightOrderDetail.pick_up_time) }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/load_type.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.type_of_load')}} </span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.cargo_type }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/price_offer.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.price_offer')}}</span>
                    <div class="freight-order-info-extra">
                      {{
                        freightOrderDetail.offer_amount === 0
                          ? 'Transporters to bid'
                          : `USD ${freightOrderDetail.offer_amount}`
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
                    <span class="order-info-header">{{$t('orderDetail.no_of_trucks_needed')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.total_trucks }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/truck_type.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.type_of_truck')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.carrier_type }}
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/load_weight.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header">{{$t('orderDetail.weight_of_load_per_move')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.tonnes_per_truck }} {{$t('orderDetail.tonnes')}} 
                    </div>
                  </div>
                  <div class="order_details_desc_item order-details-schedule-time">
                    <img
                      src="../../../assets/img/freight/return.png"
                      class="order_details_desc_image"
                    >
                    <span class="order-info-header"> {{$t('orderDetail.container_returned')}}</span>
                    <div class="freight-order-info-extra">
                      {{ freightOrderDetail.returned === true ? `${$t('general.yes')}` : `${$t('general.no')}` }}
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

        <div
          v-if="Object.prototype.hasOwnProperty.call(freightOrderDetail, 'awarded_bids')"
          class=""
        >
          <div v-if="freightOrderDetail.awarded_bids.length > 0">
            <div class="order-info-header align-documents-data">
              {{$t('orderDetail.awarded_transporter')}}
            </div>

           <div class="transporter-listing order-order-documents">
              <div
                v-for="(data, index) in freightOrderDetail.awarded_bids"
                :key="index"
                class="doc-detail"
                :class="getItemPosition(freightOrderDetail.awarded_bids, index)"
              >
                <div
                  class="transporters-filters documents-highlight
                  orders-freight-documents transporters-doc-align"
                  @click="toggleRow(index)"
                >
                  <div class="transporter-content freight-documents-title">
                    {{ data.company_name === null ? data.name : data.company_name }}
                  </div>
                  <div class="transporter-content">
                    {{ data.available_trucks }} {{$t('orderDetail.trucks')}}
                  </div>
                  <div class="transporter-content">
                    USD {{ data.price_per_truck }}/{{$t('orderDetail.truck')}}
                  </div>
                  <div class="transporter-content view-transporter-documents">
                    {{$t('orderDetail.view_doc_details')}}
                    <span
                      v-if="opened.includes(index)"
                      class=""
                    >
                      <i class="el-icon-arrow-up" />
                    </span>
                    <span
                      v-if="!opened.includes(index)"
                      class=""
                    >
                      <i class="el-icon-arrow-down" />
                    </span>
                  </div>
                </div>
                <div
                  v-if="opened.includes(index)"
                  class="documents-divider"
                />
                <div
                  v-if="opened.includes(index)"
                  class="documents-highlight orders-freight-documents transporters-doc-align"
                >
                  <div class="transporters-documents">
                     {{$t('orderDetail.doc')}}
                  </div>
                  <div class="transporters-filters ">
                    <div
                      v-for="(val, index) in data.documents"
                      v-if="index >= 0"
                      class="freight-documents--inner"
                    >
                      <div class="transporter-content">
                        {{ val.document_name }}
                      </div>
                      <div class="transporter-content">
                        {{ val.date_created }}
                      </div>
                      <div
                        class="transporter-content view-transporter-documents"
                        @click="viewDocument(val.url, val.document_name)"
                      >
                        {{$t('orderDetail.view_doc')}} <i class="el-icon-arrow-right view-transporter-info" />
                      </div>
                      <div class="freight-documents-approve flex-div transporter-content">
                        <button
                          type="button"
                          class="button-primary approve-documents-action freight-approve-doc"
                          name="create_order_text"
                          @click="approveDoc(val)"
                        >
                          {{ approve_doc_text }}
                        </button>
                        <button
                          type="button"
                          class="approve-documents-action freight-decline-doc"
                          name="create_order_text"
                          @click="declineDialog(val)"
                        >
                          {{ decline_doc_text }}
                        </button>
                      </div>
                    </div>
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
            {{$t('orderDetail.quotation')}}
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
              >{{ getTrucksNeeded(freightOrderDetail.total_trucks) }}
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
                    {{
                      freightOrderDetail.quotations[index].company_name === null
                        ? freightOrderDetail.quotations[index].name
                        : freightOrderDetail.quotations[index].company_name
                    }}
                  </div>
                  <div class=" freight-documents-date order-info-header">
                    {{ freightOrderDetail.quotations[index].trucks_available }} {{$t('orderDetail.trucks')}}
                  </div>
                  <div class=" freight-documents-date">
                    USD {{ freightOrderDetail.quotations[index].price_per_truck }} /{{$t('orderDetail.truck')}}
                  </div>

                  <div
                    v-if="checkActionableBtnState"
                    class="freight-documents-approve flex-div"
                  >
                    <button
                      type="button"
                      class="button-primary section--filter-action freight-approve-doc"
                      name="create_order_text"
                      @click="awardBid(freightOrderDetail.quotations[index])"
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
                  {{$t('orderDetail.awaiting_quotation')}}
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
                <div class="">
                  <div class="decline-text-option decline-documemt-extend request-shipment-header">
                    {{$t('orderDetail.award_shipment')}}
                    {{
                      awardedTransporter.company_name === null
                        ? awardedTransporter.name
                        : awardedTransporter.company_name
                    }}
                  </div>
                </div>

                <div class="award-sub-details doc-detail">
                  <div class="award-inner-info">
                    <div class="quatations-outline-info">
                      {{$t('orderDetail.available_trucks')}}:
                      <span class="outline-info-value">
                        {{ awardedTransporter.trucks_available }}
                      </span>
                    </div>
                    <div class="quatations-outline-info">
                      {{$t('orderDetail.rate_per_truck')}}:
                      <span
                        class="outline-info-value"
                      >USD {{ awardedTransporter.price_per_truck }}</span>
                    </div>
                  </div>
                </div>

                <div class="award-shipment-input">
                  <p class="award-input--label">
                    {{$t('orderDetail.how_many_of')}}
                    {{
                      awardedTransporter.company_name === null
                        ? awardedTransporter.name
                        : awardedTransporter.company_name
                    }}’s {{$t('orderDetail.availabe_trucks_assign')}}
                  </p>
                  <div class="block">
                    <el-input-number
                      v-model="trucks_no"
                      :min="1"
                      :max="10"
                    />
                  </div>
                </div>

                <div class="award-shipment-input">
                  <p class="award-input--label upload-landing"> 
                    {{$t('orderDetail.upload_bill_of_lading')}}
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
                          {{$t('orderDetail.drop_files_here')}} <em>{{$t('orderDetail.click_to_upload')}}</em>
                        </div>
                      </el-upload>
                      <div v-if="billOfLandingName !== '' && landing_text === 'Change'">
                        <span class="document-upload-label">
                          {{$t('orderDetail.bill_lading_added_successfully')}}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="award-shipment-input payment-terms">
                  <p class="award-input--label">
                    {{$t('orderDetail.what_payment_terms')}}
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
                  <button
                    type="button"
                    name="button"
                    class="quote-action--slide-button award-shipment-btn"
                    @click="awardDocument()"
                  >
                    {{$t('orderDetail.award')}}
                  </button>
                </div>
              </div>
              <div v-else>
                <div class="">
                  <div class="decline-text-option decline-documemt-extend request-shipment-header">
                    {{$t('orderDetail.sure_want_award')}}
                    {{
                      awardedTransporter.company_name === null
                        ? awardedTransporter.name
                        : awardedTransporter.company_name
                    }}
                    ?
                  </div>
                </div>
                <div class="shipment-summary-outer">
                  <div class="quatations-outline-info-summary">
                    {{$t('orderDetail.price_per_truck')}} 
                    <p class="outline-info-value summary-inner-value">
                      USD {{ awardedTransporter.price_per_truck }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{$t('orderDetail.trucks_assigned')}}
                    <p class="outline-info-value summary-inner-value">
                      {{ trucks_no }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{$t('orderDetail.total_amount')}}
                    <p class="outline-info-value summary-inner-value">
                      USD {{ trucks_no * awardedTransporter.price_per_truck }}
                    </p>
                  </div>
                  <div class="quatations-outline-info-summary">
                    {{$t('orderDetail.payment_terms')}} 
                    <p class="outline-info-value summary-inner-value">
                     {{$t('orderDetail.payment_in_days', {payment_terms: payment_terms})}}
                    </p>
                  </div>

                  <div class="decline-documemt-extend decline-button-align send-quote--outer">
                    <button
                      type="button"
                      name="button"
                      class="quote-action--slide-button send-final-quote-btn back-shipment-btn"
                      @click="goBack()"
                    >
                      {{$t('general.back')}}
                    </button>
                    <button
                      type="button"
                      name="button"
                      class="quote-action--slide-button send-final-quote-btn"
                      @click="awardFinal()"
                    >
                      {{$t('general.yes_award_bid')}}
                    </button>
                  </div>
                </div>
              </div>
            </el-dialog>
            <el-dialog
              :visible.sync="viewDocumentOption"
              class="documentOptions"
            >
              <div class="">
                <div class="document-text-option ">
                <!-- {{ src_name }} document -->
                  {{$t('orderDetail.name_doc', {src_name:src_name})}}
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
                  {{$t('orderDetail.decline_doc')}}
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
                  {{$t('orderDetail.decline')}}
                </button>
              </div>
            </el-dialog>
            <el-dialog
              :visible.sync="showRatingDialog"
              class="declineDocumentOptions"
            >
              <div class="">
                <div class="decline-text-option rating-header">
                  <!-- How was your experience with {{ freightOrderDetail.transporter_name }} ? -->
                  {{$t('orderDetail.experience_with',{transporter_name: freightOrderDetail.transporter_name  } )}}
                </div>
              </div>
              <span class="freight-stars-container">
                <el-rate
                  v-model="rated_score"
                  class="freight-rating"
                  :colors="['#99A9BF', '#EE7D00', '#007FFF']"
                />
              </span>
              <div class="decline-documemt-input">
                <el-input
                  v-model.trim="comment"
                  :min="0"
                  :placeholder="$t('orderDetail.tell_us_more')"
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
                  {{$t('orderDetail.submit')}}
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
import { mapGetters, mapActions } from 'vuex';
import numeral from 'numeral';
import S3 from 'aws-s3';
import $ from 'jquery';
import TimezoneMxn from '../../../mixins/timezone_mixin';
import LoadingComponent from './LoadingComponent.vue';
import NotificationMxn from '../../../mixins/notification_mixin';

let s3 = '';

export default {
  name: 'Transporters',
  components: { LoadingComponent },
  mixins: [TimezoneMxn, NotificationMxn],
  data() {
    return {
      quote_text: this.$t('orderDetail.request_quote'),
      financing_text: this.$t('orderDetail.create_order'),
      rating: 5.0,
      loading: true,
      approve_doc_text: this.$t('orderDetail.approve'),
      decline_doc_text: this.$t('orderDetail.decline'),
      approve_quatation_text: 'Award',
      decline_quatation_text: 'Decline',
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
      landing_text: 'Change',
      billOfLandingName: '',
      awardedTransporter: {},
      verification_stage: false,
      terms: [
        {
          value: 7,
          label: this.$t('orderDetail.payment_seven_days'),
        },
        {
          value: 14,
          label: this.$t('orderDetail.payment_fourteen_days'),
        },
        {
          value: 21,
          label: this.$t('orderDetail.payment_twentyone_days'),
        },
        {
          value: 28,
          label: this.$t('orderDetail.payment_twenty_eight_days'),
        },
      ],
      opened: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {
    viewDocumentOption(val) {
      if (!val) {
        this.src_link = '';
        this.src_name = '';
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
  },
  mounted() {
    this.loading = true;
    const sessionData = this.$store.getters.getSession;
    if (Object.keys(sessionData).length > 0) {
      this.fetchOrderDetail(this.$route.params.id);
      this.initiateS3();
    }
  },
  methods: {
    ...mapActions({
      getFreightOrderDetail: '$_freight/getFreightOrderDetail',
      approveDocument: '$_freight/approveDocument',
      rateFreightOrder: '$_freight/rateFreightOrder',
      awardShipment: '$_freight/awardShipment',
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
            this.freightOrderDetail = workingResponse.shipment;
            this.loading = false;
          } else {
            this.doNotification(2, this.$t('orderDetail.failed_retrieve_order'), workingResponse.message);
            this.$router.push('/freight/orders');
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('orderDetail.order_retrival_failure'),
            this.$t('orderDetail.failed_to_fetch'),
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
    getTrucksNeeded(val) {
      let resp = `${val} ${this.$t('orderDetail.trucks_needed')}`;
      if (val === 1) {
        resp = `${val} ${this.$t('orderDetail.truck_needed')}`;
      }
      return resp;
    },
    backToOrders() {
      this.$router.push('/freight/orders');
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
    viewDocument(url, name) {
      this.src_link = url;
      this.src_name = name;
      this.viewDocumentOption = true;
    },
    handleRemoveLanding() {
      this.billOfLandingName = '';
      this.billOfLandingData = {};
      this.landing_text = 'Change';
    },
    beforeLandingUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(2, this.$t('orderDetail.document_error'), this.$t('orderDetail.document_must_be_pdf'));
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
        this.doNotification(2, this.$t('orderDetail.kindly_upload_bill_doc'), '');
      } else {
        const imageId = 'ladingImagePreview';
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.landing_text = 'Uploading ...';
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
              this.landing_text = 'Change';
              console.log('There was an error uploading your document: ', err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.landing_text = 'Change';
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
      }
      tempName = `terms_of_delivery_${values}_${new Date().getTime()}.${name.split('.').pop()}`;

      return tempName;
    },
    toggleRow(i) {
      if (this.opened.includes(i)) {
        const index = this.opened.indexOf(i);
        this.opened.splice(index, 1);
      } else {
        this.opened.push(i);
      }
    },
    awardBid(val) {
      this.awardedTransporter = val;
      this.awardDialogVisible = true;
    },
    declineBid(val) {
      const payload = {};
      const fullPayload = {
        values: payload,
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: `shipments/quotations/${val.quotation_id}`,
      };

      this.$store.dispatch('$_freight/declineShipment', fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetail.bid_rejected'), '');
          } else {
            this.doNotification(2, this.$t('orderDetail.unable_reject_bid'), workingResponse.message);
          }
          this.fetchOrderDetail(this.$route.params.id);
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'message')) {
            this.doNotification(2, this.$t('orderDetail.reject_bid_request_failed'), error.response.data.message);
          } else {
            this.doNotification(
              2,
              this.$t('orderDetail.reject_bid_request_failed'),
              this.$t('orderDetail.something_went_wrong'),
            );
            this.$router.push('/freight/orders');
          }
        },
      );
    },
    awardDocument() {
      if (this.billOfLandingName !== '' && this.trucks_no !== '' && this.payment_terms !== '') { 
        this.verification_stage = true;
      } else {
        this.doNotification(2, this.$t('orderDetail.award_shipment_error'), this.$t('orderDetail.kindly_provide_all_values'));
      }
    },
    goBack() {
      this.verification_stage = false;
    },
    awardFinal() {
      const payload = {
        quotation_id: this.awardedTransporter.quotation_id,
        trucks_available: this.trucks_no,
        payment_terms: this.payment_terms,
        document: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.billOfLandingName}`,
      };
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
            this.doNotification(1,  this.$t('orderDetail.shipment_awarded_successfully'), '');
          } else {
            this.doNotification(2, this.$t('orderDetail.unable_award_shipment'), workingResponse.message);
          }
          this.resetShipmentDialog();
          this.fetchOrderDetail(this.$route.params.id);
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'message')) {
            this.doNotification(2, this.$t('orderDetail.award_shipment_failed'), error.response.data.message);
          } else {
            this.doNotification(
              2,
              this.$t('orderDetail.award_shipment_failed'),
              this.$t('orderDetail.something_went_wrong'),
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
      this.landing_text = 'Change';
      this.billOfLandingName = '';
      this.awardedTransporter = {};
    },
    approveDoc(val) {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        order_id: this.freightOrderDetail.order_id,
        document_id: val.document_id,
        owner_id: this.freightOrderDetail.owner_id,
        status: 2,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
        payload.created_by = 1;
      } else {
        payload.peer_id = acc.user_id;
        payload.created_by = 3;
      }

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order/documents',
      };

      this.approveDocument(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetail.document_approval'), this.$t('orderDetail.doc_approved_succesful'));
            this.fetchOrderDetail(this.$route.params.id);
          } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
            this.doNotification(2, this.$t('orderDetail.failed_to_approve'), workingResponse.message);
          } else {
            this.doNotification(2, this.$t('orderDetail.failed_to_approve'), workingResponse.reason);
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
            this.doNotification(2, this.$t('orderDetail.failed_to_approve'), error.response.data.reason);
          } else {
            this.doNotification(
              2,
              this.$t('orderDetail.failed_to_approve'),
              this.$t('orderDetail.failed_to_approve_text'),
            );
          }
        },
      );
    },
    declineDialog(val) {
      this.decline_doc = val;
      this.showDeclineDialog = true;
    },
    declineDocument() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        order_id: this.freightOrderDetail.order_id,
        document_id: this.decline_doc.document_id,
        owner_id: this.freightOrderDetail.owner_id,
        status: 3,
        reason: this.reason,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
        payload.created_by = 1;
      } else {
        payload.peer_id = acc.user_id;
        payload.created_by = 3;
      }

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order/documents',
      };

      this.approveDocument(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, this.$t('orderDetail.document_declined'), this.$t('orderDetail.doc_declined_successful'));
            this.fetchOrderDetail(this.$route.params.id);
          } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
            this.doNotification(2, this.$t('orderDetail.doc_declined_failed'), workingResponse.message);
          } else {
            this.doNotification(2, this.$t('orderDetail.doc_declined_failed'), workingResponse.reason);
          }
          this.closeDeclineDialog();
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
            this.doNotification(2, this.$t('orderDetail.doc_declined_failed'), error.response.data.reason);
          } else {
            this.doNotification(
              2,
              this.$t('orderDetail.doc_declined_failed'),
              this.$t('orderDetail.doc_declined_failed_text'),
            );
          }
          this.closeDeclineDialog();
        },
      );
    },
    closeDeclineDialog() {
      this.decline_doc = {};
      this.showDeclineDialog = false;
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
            this.doNotification(1, this.$t('orderDetail.order_rated'), '');
            this.closeRatingDialog();
            this.backToOrders();
          } else {
            this.doNotification(2, this.$t('orderDetail.failed_rate_order'), workingResponse.message);
            this.closeRatingDialog();
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('orderDetail.failed_rate_order'),
            this.$t('orderDetail.failed_rate_order_text'),
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
      if (session.default === 'biz') {
        if (session[session.default].freight_approver === 1) {
          return true;
        }
        return false;
      }
      return true;
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/transporters_component.css?v=4';
.rating-section{
  background: #FBFBFB;
  border: 1px solid #d8dfe6;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 4px;
  width: 66%;
  margin-top: 7%;
  min-height: 138px;
}
.rating-title{
  font-size: 13px;
  margin-top: 1%;
}
.rate-freight-order{
  margin-left: 0 !important;
  height: 40px !important;
  margin-top: 9% !important;
  width: 61% !important;
}
.rating-header{
  font-size: 18px;
  line-height: 27px;
  text-align: center;
  color: #000000;
}
.freight-stars-container {
  display: flex;
  justify-content: center;
  margin-bottom: 17%;
}
.freight-ratings-section{
  margin-top: 14%;
  margin-bottom: 10%;
  font-weight: 500;
}
.flex-div{
  display: flex;
}
.inner-content-flex{
  flex: 0.9;
}
.freight-order-etra-info{
  width: 35%;
}
.no-quatations-img{
  width: 28%;
  display: block;
  margin: auto;
}
.no-transporters-label{
  text-align: center;
}
.waiting-quatation{
  width: 100%;
  height: 395px;
}
.transporters-element-inputs{
  background-color: white !important;
  width: 100% !important;
}
.request-shipment-header{
  display: flex;
  align-items: center;
  color: #000000;
  font-weight: 500;
  font-size: 17px;
  line-height: 18px;
}
.award-sub-details{
  margin: 0px 10px 10px 10px;
  padding-right: 20px;
  min-height: 55px;
}
.award-inner-info{
  color: #000000;
  margin: 2%;
  font-size: 13px;
  line-height: 25px;
  font-weight: 300;
}
.quatations-outline-info{
  margin-bottom: 2%;
}
.outline-info-value{
  color: #000000;
  font-weight: 600;
}
.payment-terms{
   margin-top: 9% !important;
   margin-bottom : 9% !important;
}
.award-shipment-input{
  margin: 0px 0px 10px 10px;
}
.award-shipment-btn{
  margin: 0px 0px 10px 10px !important;
  width: 98% !important;
  background: #EA7125 !important;
  border: 1px solid #EA7125 !important;
}
.summary-inner-value{
  margin-top: 2%;
}
.shipment-summary-outer{
  margin-left: 3%;
}
.quatations-outline-info-summary{
  margin-bottom: 6%;
}
.transporter-content{
  width: 38%;
  font-size: 15px;
  margin-top: 1%;
}
.transporters-documents{
  width: 11%;
  color: #000000;
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 1%;
  margin-top: 3%;
}
.documents-divider{
  border-top: 1px solid #d8dfe6 !important;
}
.trucks-listing{
  font-size: 14px !important;
}
.transporters-doc-align{
  margin-left: 2 !important;
}
.no-transporter-top-margin{
  border-bottom: 1px solid transparent;
}
.freight-documents--inner{
  width: 100%;
  display: flex;
}
.approve-documents-action{
  float: right;
  font-size: 13px;
  letter-spacing: 0.01em;
  margin-right: 13px;
}
</style>
