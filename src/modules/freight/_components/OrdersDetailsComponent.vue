<template lang="html">
  <div class="transporters-main">
    <div
      class="transporters-container transporters-main--inner"
      style="display : flex"
    >
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
            <div class="order_details_map">
              <Img
                :src="
                  createStaticMapUrl(freightOrderDetail.destination, freightOrderDetail.pick_up)
                "
              />
            </div>
            <div class="order_details_desc">
              <div class="order_details_price">
                {{$t('orderDetail.order_amount')}}
                <!-- Order amount: {{ freightOrderDetail.currency }} -->
                {{ formatCurrency(freightOrderDetail.amount) }}
              </div>

              <div class="order_details_desc_item">
                <img
                  src="../../../assets/img/maroon_button.png"
                  class="order_details_desc_image"
                >
                <span class="order-info-header">{{$t('orderDetail.pickup_location')}}</span>
                <div class="freight-order-info-extra">
                  {{ freightOrderDetail.pick_up_name }}
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
            </div>
          </div>

          <div class="rider_details_wrap">
            <div class="">
              <div class="transporter-infor--header">
                {{$t('orderDetail.transporter')}}
              </div>
              <div class="transporter-info-extra">
                {{ freightOrderDetail.transporter_name }}
              </div>
              <div
                class="transporter-info-extra view-transporter-mark"
                @click="goToTransporter(freightOrderDetail.owner_id)"
              >
                {{$t('orderDetail.view')}}
              </div>
              <div
                v-if="!freightOrderDetail.rated"
                class="rating-section"
              >
                <div class="rating-title">
                  <!-- How was your experience with {{ freightOrderDetail.transporter_name }} ? -->
                  {{$t('orderDetail.experience_with')}}
                </div>
                <div class="decline-documemt-extend">
                  <button
                    type="button"
                    name="button"
                    class="decline-action--slide-button rate-freight-order"
                    @click="openRatingDialog"
                  >
                    {{$t('orderDetail.rate_order')}}
                  </button>
                </div>
              </div>
              <div v-else>
                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info">
                    <div class="transporter-infor--header freight-ratings-section">
                      {{$t('orderDetail.order_ratings')}}
                    </div>
                    <el-rate
                      :value="freightOrderDetail.rating.rating"
                      disabled
                      disabled-void-color="#C0C4CC"
                      :colors="['#99A9BF', '#F57f20', '#1782C5']"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="freight-border-line" />
        <div class="">
          <div class="transporter-doucuments-title align-documents-data">
            {{$t('orderDetail.doc')}}
          </div>
          <div class="transporter-listing order-order-documents">
            <div
              v-for="(val, index) in freightOrderDetail.documents"
              v-if="index >= 0"
              class="doc-detail"
            >
              <div class="transporters-filters documents-highlight orders-freight-documents ">
                <div class=" freight-documents-title">
                  {{ freightOrderDetail.documents[index].document_name }}
                </div>
                <div class=" freight-documents-date">
                  {{ freightOrderDetail.documents[index].date_created }}
                </div>
                <div
                  class="freight-documents-name view-freight-document"
                  @click="
                    viewDocument(
                      freightOrderDetail.documents[index].url,
                      freightOrderDetail.documents[index].document_name
                    )
                  "
                >
                  {{$t('orderDetail.view_doc')}} <i class="el-icon-arrow-right view-transporter-info" />
                </div>
                <div
                  v-if="
                    freightOrderDetail.documents[index].status === 'PENDING' &&
                      freightOrderDetail.documents[index].created_by === 'OWNER' &&
                      checkActionableBtnState
                  "
                  class="freight-documents-approve"
                  style="display : flex"
                >
                  <button
                    type="button"
                    class="button-primary section--filter-action freight-approve-doc"
                    name="create_order_text"
                    @click="approveDoc(freightOrderDetail.documents[index])"
                  >
                    {{ approve_doc_text }}
                  </button>
                  <button
                    type="button"
                    class="section--filter-action freight-decline-doc"
                    name="create_order_text"
                    @click="declineDialog(freightOrderDetail.documents[index])"
                  >
                    {{ decline_doc_text }}
                  </button>
                </div>
                <div
                  v-else
                  class="freight-documents-approve"
                  style="display : flex"
                >
                  <div class="freight-approval-reason">
                    {{ freightOrderDetail.documents[index].message }}
                    <div
                      v-if="freightOrderDetail.documents[index].status === 'DECLINED'"
                      class="freight-decline-reason"
                    >
                      {{$t('orderDetail.reason')}} : {{ freightOrderDetail.documents[index].reason }}
                    </div>
                  </div>
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
              :visible.sync="viewDocumentOption"
              class="documentOptions"
            >
              <div class="">
                <div class="document-text-option ">
                  <!-- {{ src_name }} document -->
                  {{$t('orderDetail.name_document')}}
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
              <div class="decline-documemt-extend decline-documemt-input">
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
                  {{$t('orderDetail.experience_with')}}
                </div>
              </div>
              <span class="freight-stars-container">
                <el-rate
                  v-model="rated_score"
                  class="freight-rating"
                  :colors="['#99A9BF', '#F57f20', '#1782C5']"
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
import TimezoneMxn from '../../../mixins/timezone_mixin';
import LoadingComponent from './LoadingComponent.vue';
import NotificationMxn from '../../../mixins/notification_mixin';

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
  },
  mounted() {
    this.loading = true;
    const sessionData = this.$store.getters.getSession;
    if (Object.keys(sessionData).length > 0) {
      this.fetchOrderDetail(this.$route.params.id);
    }
  },
  methods: {
    ...mapActions({
      getFreightOrderDetail: '$_freight/getFreightOrderDetail',
      approveDocument: '$_freight/approveDocument',
      rateFreightOrder: '$_freight/rateFreightOrder',
    }),
    fetchOrderDetail(orderId) {
      const sessionData = this.$store.getters.getSession;
      const payload = {
        order_id: orderId,
        user_type: sessionData.default === 'biz' ? 1 : 3,
      };

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order/details',
      };

      this.getFreightOrderDetail(fullPayload).then(
        (response) => {
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.freightOrderDetail = workingResponse.order;
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
@import '../../../assets/styles/transporters_component.css?v=1';
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
</style>
