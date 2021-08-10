<template lang="html">
  <div
    v-if="order_details"
    id="order_details_container"
    class=""
  >
    <div class="order-details-wrapper">
      <div class="order_details_map">
        <Img :src="createStaticMapUrl(order_details.path)" />
      </div>
      <div class="order_details_desc">
        <div
          v-if="order_details.fixed_cost"
          class="order_details_price"
        >
          {{ order_details.order_currency }} {{ formatCurrency(order_details.order_cost) }}
        </div>
        <div
          v-else
          class="order_details_price"
        >
          <div
            v-if="
              order_details.order_details.delivery_status === 0 && order_details.customer_min_amount
            "
          >
            {{ order_details.order_currency }}
            {{ formatCurrency(order_details.customer_min_amount) }}
          </div>
          <div v-else>
            {{ order_details.order_currency }} {{ formatCurrency(order_details.order_cost) }}
          </div>
        </div>

        <div class="order_details_desc_item">
          {{ $t('general.distance') }}: {{ order_details.order_details.distance }} KMs
        </div>
        <!-- TODO: add this in later with the duration the order took -->
        <!-- <div class="order_details_desc_item">
                    Duration : {{order_details.order_details.duration}}
              </div>-->
        <div class="order_details_desc_item--wrapper">
          <div class="order_details_desc_item">
            {{ $t('general.date') }} : {{ convertToUTCToLocal(order_details.order_date) | moment }}
          </div>
          <span v-for="j in order_details.logs">
            <div
              v-if="j.log_type === 3"
              class="order_details_desc_item"
            >
              {{ $t('general.picked') }} : {{ j.log_time | moment }}
            </div>
            <div
              v-if="j.log_type === 4"
              class="order_details_desc_item"
            >
              {{ $t('general.delivered') }} : {{ j.log_time | moment }}
            </div>
          </span>
        </div>

        <div class="order_details_desc_item">
          <img
            src="../../../assets/img/maroon_button.png"
            class="order_details_desc_image"
          >
          {{ getOrderFromName(order_details.path) }}
        </div>
        <template
          v-for="(locations, index) in order_details.path"
          v-if="index >= 1"
        >
          <div class="order_details_desc_item order_details_desc_item--no-space">
            <img
              v-if="order_details.path[index].waypoint_type === 'PICKUP'"
              src="../../../assets/img/maroon_button.png"
              class="order_details_desc_image"
            >

            <img
              v-else
              src="../../../assets/img/blue_button.png"
              class="order_details_desc_image"
            >
            <span>{{ order_details.path[index].name }}</span>
            <div
              v-if="
                order_details.rider_deliver_img !== null &&
                  index <= order_details.rider_deliver_img.length
              "
              class="recepient-padded"
            >
              {{ $t('general.recieved_by') }} {{ order_details.rider_deliver_img[index - 1].name }}
            </div>
            <div
              v-if="order_details.path[index].reference_number"
              class="reference-number"
            >
              <span class="reference-number-title">{{ $t('general.notes') }}:</span> The order number is {{ order_details.path[index].reference_number }}
            </div>
            <div
              v-if="order_details.path[index].reference_number"
              class="reference-number"
            >
              <span class="reference-number-title">Notes:</span> The order number is {{ order_details.path[index].reference_number }}
            </div>
          </div>
        </template>
        <div class="order_details_desc_item--wrapper">
          <div
            v-if="order_details.extra_distance_amount > 0"
            class="order_details_desc_item"
          >
            {{ $t('general.distance_bill') }} : {{ order_details.extra_distance_amount }}
          </div>
          <div
            v-if="order_details.waiting_time_amount > 0"
            class="order_details_desc_item"
          >
            {{ $t('general.waiting_charges') }}: {{ order_details.waiting_time_amount }}
          </div>
        </div>
      </div>
    </div>
    <div class="rider_details_wrap">
      <div class="rider_details_image">
        <img :src="order_details.rider.rider_photo">
      </div>
      <div class="rider_details_items">
        <div class="rider_details_item">
          {{ order_details.rider.rider_name }}
        </div>
        <div class="rider_details_item">
          {{ order_details.rider.number_plate }}
        </div>
        <div
          v-if="order_details.order_details.delivery_status === 3"
          class="rider_details_item"
        >
          <div v-if="order_details.rider.rider_rating !== null">
            <el-rate
              v-model="order_details.rider.rider_rating"
              disabled
              class="el-rate__icon"
              disabled-void-color="#C0C4CC"
              :colors="['#1782C5', '#1782C5', '#1782C5']"
              score-template="{value} points"
            />
          </div>
        </div>

        <div class="rider_details_actions">
          <div
            v-if="order_details.order_details.delivery_status !== 3"
            class="rider_details_actions_completed"
          >
            <div class="rider_details_action">
              <button
                class="button-primary rider_details_action_btn"
                type="button"
                @click="trackOrder(order_details.order_no)"
              >
                {{ $t('general.track') }}
              </button>
            </div>
          </div>
          <div
            v-else
            class="rider_details_actions_ongoing"
          >
            <div class="rider_details_action">
              <div
                v-if="disputeImageStatus === 2"
                class="order_details_dispute_status_label order_details_dispute_label_red"
              >
                <i class="el-icon-warning warning-icon-override" />
                {{ $t('general.doc_disputed') }}
              </div>
              <div
                v-if="disputeImageStatus === 3"
                class="order_details_dispute_status_label order_details_dispute_label_orange"
              >
                <i class="el-icon-warning warning-icon-override" />
                {{ $t('general.doc_resubmitted') }}
              </div>
              <div
                v-if="disputeImageStatus === 4"
                class="order_details_dispute_status_label order_details_dispute_label_blue"
              >
                <i class="el-icon-warning warning-icon-override" />
                {{ $t('general.doc_resolved') }}
              </div>
              <button
                class="button-primary rider_details_action_btn rider_details--view-delivery-docs-btn"
                type="button"
                @click="viewDeliveryDoc"
              >
                {{ $t('general.view_delivery_doc') }}
              </button>
              <button
                class="button-primary rider_details_action_btn rider_details--view-delivery-docs-btn order_details_dispute_delivery_docs_override"
                type="button"
                @click="disputeDocsOption"
              >
                {{ $t('general.dispute_extra_charges') }}
              </button>
            </div>
            <el-dialog
              v-if="order_details.rider_deliver_img !== null"
              class="delivery_image_dialog"
              :visible.sync="dialogVisible"
            >
              <span slot="title"> {{ $t('general.delivery_doc_for') }}{{ order_details.order_no }} </span><br>
              <template
                v-for="(locations, index) in order_details.path"
                v-if="index >= 1"
              >
                <div class="delivery_documents_info">
                  <div class="delivery_image_details">
                    {{ $t('general.delivery_at') }} {{ order_details.path[index].name }}
                  </div>

                  <template
                    v-for="(val, index) in order_details.rider_deliver_img"
                    v-if="index >= 0"
                  >
                    <div
                      v-if="val.delivery_image.length > 0"
                      class="delivery_documents_img"
                    >
                      <div style="width: 166%">
                        <div
                          v-for="(val, index) in val.delivery_image[0].images"
                          v-if="index >= 0"
                        >
                          <img
                            class="delivery-image-content"
                            :src="deliveryImagePath(val)"
                          >
                        </div>
                      </div>
                    </div>
                  </template>

                  <div class="delivery_documents_sign">
                    <img
                      v-if="index <= order_details.rider_deliver_img.length && signaturePresent"
                      class="delivery-image-content"
                      :src="deliverySignaturePath(order_details.rider_deliver_img[index - 1].img)"
                      :onerror="signaturePresent = false"
                    >
                    <div
                      v-else
                      class="delivery-image-content-absent"
                    >
                      {{ $t('general.no_signature_uploaded') }}
                    </div>
                  </div>
                  <div
                    v-if="
                      order_details.rider_deliver_img !== null &&
                        index <= order_details.rider_deliver_img.length
                    "
                    class="delivery_image_details"
                  >
                    {{ $t('general.delivery_signature') }}: {{ order_details.rider_deliver_img[index - 1].name }}
                  </div>
                </div>
              </template>
              <div
                v-if="disputeImageStatus === 3"
                class="order_details_dispute_modal_section"
              >
                <div>
                  <el-radio
                    v-model="doc_status"
                    label="1"
                  >
                    {{ $t('general.accept_driver_documents') }}
                  </el-radio>
                  <el-radio
                    v-model="doc_status"
                    label="2"
                  >
                    {{ $t('general.reject_driver_documents') }}
                  </el-radio>
                </div>
                <div
                  v-if="doc_status === '2'"
                  class="order_details_dialog_override order_details_dialog_override_inner"
                >
                  <div>
                    <select
                      v-model="disputeReason"
                      class="dispute_type_select"
                    >
                      <option
                        value=""
                        disabled
                        selected
                      >
                        {{ $t('general.dispute_reason') }}
                      </option>

                      <option
                        v-for="(reason, index) in dispute_reasons"
                        :key="index"
                        :value="index + 1"
                      >
                        {{ reason }}
                      </option>
                    </select>
                  </div>
                  <textarea
                    v-model="disputeDescription"
                    :placeholder="$t('general.description')"
                    class="form-control dispute_description"
                  />
                  <div class="rider_details_action">
                    <button
                      class="button-primary order_details_button_override"
                      type="button"
                      @click="disputeDeliveryImages"
                    >
                      {{ $t('general.submitCapital') }}
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="doc_status === '1'"
                class="rider_details_action"
              >
                <button
                  class="button-primary dispute-delivery-button"
                  type="button"
                  @click="disputeButton"
                >
                  {{ $t('general.dispute_delivery_docs') }}
                </button>
              </div>
            </el-dialog>
            <el-dialog
              class="dispute_delivery_dialog"
              :visible.sync="dialogFormVisible"
              @close="closeDialog()"
            >
              <span slot="title">
                {{ $t('general.dispute_delivery_docs_order') }} {{ order_details.order_no }} </span><br>
              <div class="dispute_documents_body">
                <div>
                  <select
                    v-model="disputeType"
                    class="dispute_type_select"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      {{ $t('general.dispute_type') }}
                    </option>

                    <option value="1">
                      {{ $t('general.waiting_time') }}
                    </option>
                    <option value="2">
                      {{ $t('general.extra_distance') }}
                    </option>
                  </select>
                </div>
                <div>
                  <select
                    v-model="disputeReason"
                    class="dispute_type_select"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      {{ $t('general.dispute_reason') }}
                    </option>
                    <option value="1">
                      {{ $t('general.was_overcharge_order') }}
                    </option>
                    <option value="2">
                      {{ $t('general.driver_took_too_long') }}
                    </option>
                    <option value="3">
                      {{ $t('general.driver_went_wrong_location') }}
                    </option>
                    <option value="4">
                      {{ $t('general.different_issue') }}
                    </option>
                  </select>
                </div>
                <textarea
                  v-model="disputeDescription"
                  :placeholder="$t('general.description')"
                  class="form-control dispute_description"
                />
                <div class="rider_details_action">
                  <button
                    class="button-primary dispute-delivery-submit"
                    type="button"
                    @click="disputeDeliveryDocs"
                  >
                    {{ $t('general.submit') }}
                  </button>
                </div>
              </div>
            </el-dialog>
            <el-dialog
              class="dispute_delivery_dialog"
              :visible.sync="disputeImageVisible"
              @close="closeImageDialog()"
            >
              <div class="title title-override">
                {{ $t('general.dispute_delivery_docs_order') }} {{ order_details.order_no }}
              </div>
              <div class="order_details_dialog_override">
                <div>
                  <select
                    v-model="disputeReason"
                    class="dispute_type_select"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      {{ $t('general.dispute_reason') }}
                    </option>

                    <option
                      v-for="(reason, index) in dispute_reasons"
                      :key="index"
                      :value="index + 1"
                    >
                      {{ reason }}
                    </option>
                  </select>
                </div>
                <textarea
                  v-model="disputeDescription"
                  :placeholder="$t('general.description')"
                  class="form-control dispute_description"
                />
                <div class="rider_details_action">
                  <button
                    class="button-primary order_details_button_override"
                    type="button"
                    @click="disputeDeliveryImages"
                  >
                    {{ $t('general.submitCapital') }}
                  </button>
                </div>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    {{ order_details }}
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import numeral from 'numeral';
import TimezoneMxn from '../../../mixins/timezone_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import EventsMixin from '../../../mixins/events_mixin';

const moment = require('moment');

export default {
  name: 'OrderDetails',
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
  },
  mixins: [TimezoneMxn, NotificationMxn, EventsMixin],
  data() {
    return {
      order_id: '',
      show_rating: false,
      dialogVisible: false,
      dialogFormVisible: false,
      disputeImageVisible: false,
      disputeType: '',
      disputeReason: '',
      disputeDescription: '',
      default_currency: '',
      dispute_reasons: [
        this.$t('general.a_delivery_document_is_missing'),
        this.$t('general.the_delivery_document_is_not_clear'),
        this.$t('general.the_delivery_document_is_not_valid'),
      ],
      disputeImageStatus: 0,
      doc_status: '1',
      signaturePresent: true,
    };
  },
  methods: {
    moment() {
      return moment();
    },
    ...mapActions({
      requestDisputeDeliveryDocs: '$_transactions/requestDisputeDeliveryDocs',
      requestDisputeStatus: '$_transactions/requestDisputeStatus',
      requestDisputeDocStatus: '$_transactions/requestDisputeDocStatus',
    }),
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },
    createStaticMapUrl(path) {
      // TODO:get google_key from configs
      const googleKey = process.env.CONFIGS_ENV.GOOGLE_API_KEY;
      const fromCordinates = path[0].coordinates;
      const toCordinates = path[path.length - 1].coordinates;
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

    activateRating() {
      this.show_rating = true;
    },
    rateOrder() {
      this.show_rating = false;
    },
    trackOrder(order_no) {
      this.sendGA4Events('select_track_order', { order_number: order_no });
      this.$router.push({
        name: 'tracking',
        params: {
          order_no,
        },
      });
    },
    getDeliveryDocsSrc(order) {
      let env = '';
      try {
        env = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      if (env !== 'production') {
        return `https://apptest.sendyit.com/biz/sendyconnect/verify/${order}`;
      }
      return `https://oldapp.sendyit.com/biz/sendyconnect/verify/${order}`;
    },
    printReceipt() {},
    deliveryDocs() {},
    closeDialog() {
      this.disputeType = '';
      this.disputeReason = '';
      this.disputeDescription = '';
      this.dialogFormVisible = false;
    },
    closeImageDialog() {
      this.disputeType = '';
      this.disputeReason = '';
      this.disputeDescription = '';
      this.disputeImageVisible = false;
    },
    deliverySignaturePath(path) {
      return `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/${path}`;
    },

    deliveryImagePath(path) {
      return `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/rider_delivery_image//${path}`;
    },
    disputeButton() {
      if (this.disputeImageStatus !== 3) {
        this.disputeImageVisible = true;
      } else {
        this.disputeDeliveryImages();
      }
    },
    disputeDocsOption() {
      if (
        this.order_details.extra_distance_amount > 0
        || this.order_details.waiting_time_amount > 0
      ) {
        const values = {
          order_no: this.order_details.order_no,
        };
        const fullPayload = {
          values,
          app: 'NODE_PRIVATE_API',
          endpoint: 'check_dispute',
        };

        this.requestDisputeStatus(fullPayload).then(
          (response) => {
            if (!response.status) {
              this.dialogFormVisible = true;
            } else {
              this.doNotification(
                2,
                this.$t('general.delivery_dispute'),
                this.$t('general.failure_doc_dispute'),
              );
            }
          },
          (error) => {
            this.doNotification(2, this.$t('general.delivery_dispute'), this.$t('general.something_went_wrong_please_try'));
          },
        );
      } else {
        this.doNotification(
          2,
          this.$t('general.dispute_delivery_docs'),
          this.$t('general.sorry_no_extra_charges'),
        );
      }
    },
    checkDisputeStatus() {
      const fullPayload = {
        app: 'ADONIS_PRIVATE_API',
        endpoint: `orders/${this.order_details.order_no}`,
      };
      this.disputeImageStatus = 0;
      this.requestDisputeDocStatus(fullPayload).then(
        (response) => {
          this.disputeImageStatus = response.order_details.dispute_delivery_doc_status;
          this.doc_status = '1';
        },
        (error) => {
          this.disputeImageStatus = 0;
        },
      );
    },
    viewDeliveryDoc() {
      this.dialogVisible = true;
      this.requestOrderHistory();
      this.checkDisputeStatus();
    },
    requestOrderHistory() {
      if (Object.keys(this.getFilterDataPayload).length > 0) {
        const fullPayload = {
          values: this.getFilterDataPayload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'order_history',
        };
        this.$store.dispatch('$_transactions/requestOrderHistoryOrders', fullPayload);
      }
    },
    disputeDeliveryDocs() {
      if (this.disputeType !== '' && this.disputeReason !== '' && this.disputeDescription !== '') {
        const session = this.$store.getters.getSession;
        const values = {
          dispute_type: this.disputeType,
          dispute_reason_id: this.disputeReason,
          dispute_description: this.disputeDescription,
          order_no: this.order_details.order_no,
          name: session[session.default].user_name,
          email: session[session.default].user_email,
          phone: session[session.default].user_phone,
        };
        const fullPayload = {
          values,
          app: 'PRIVATE_API',
          endpoint: 'dispute_order',
        };
        this.requestDisputeDeliveryDocs(fullPayload).then(
          (response) => {
            if (response.status) {
              this.doNotification(2, this.$t('general.delivery_dispute'), this.$t('general.delivery_dispute_successful'));
              this.closeDialog();
            } else {
              this.doNotification(2, this.$t('general.delivery_dispute'), response.message);
            }
          },
          (error) => {
            this.doNotification(2, this.$t('general.delivery_dispute'), this.$t('general.something_went_wrong_please_try'));
          },
        );
      } else {
        this.message = this.$t('general.please_provide_all_details');
        this.doNotification(2, this.$t('general.delivery_dispute_failed'), this.$t('general.provide_all_details'));
      }
    },
    disputeDeliveryImages() {
      if ((this.disputeReason !== '' && this.disputeDescription !== '') || (this.disputeImageStatus > 0 && this.disputeImageStatus < 4)) {
        const session = this.$store.getters.getSession;
        const values = {
          admin_id: 0,
          biz_name: session.default === 'biz' ? session[session.default].user_name : '',
          cop_name: session.default === 'biz' ? session[session.default].cop_name : '',
          customer_email: session[session.default].user_email,
          customer_name: session[session.default].user_name,
          customer_phone: session[session.default].user_phone,
          description: this.disputeDescription,
          dispute_delivery_doc_status: this.disputeImageStatus === 3 && this.disputeImageStatus < 4 ? this.delivery_doc_status : 2,
          dispute_docs_reason_id: this.disputeReason,
          order_no: this.order_details.order_no,
          rider_id: this.order_details.rider.rider_id,
          source: 'Customer Web',
        };
        const fullPayload = {
          values,
          app: 'ORDERS_APP',
          endpoint: 'dispute_delivery_docs',
        };
        this.requestDisputeDeliveryDocs(fullPayload).then(
          (response) => {
            if (response.status) {
              this.doNotification(2, this.$t('general.delivery_dispute'), this.$t('general.delivery_dispute_successful'));
              this.closeImageDialog();
              this.checkDisputeStatus();
            } else {
              this.doNotification(2, this.$t('general.delivery_dispute'), response.message);
            }
          },
          (error) => {
            this.doNotification(2, this.$t('general.delivery_dispute'), this.$t('general.something_went_wrong_please_try'));
          },
        );
      } else {
        this.message = this.$t('general.please_provide_all_details');
        this.doNotification(2, this.$t('general.delivery_dispute_failed'), this.$t('general.provide_all_details'));
      }
    },
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },
    setUserDefaultCurrency() {
      const sessionData = this.$store.getters.getSession;
      this.default_currency = sessionData[sessionData.default].default_currency;
    },
    formatCurrency(currency) {
      return numeral(currency).format('0,0');
    },
  },
  computed: {
    ...mapGetters({
      getOrderDetails: '$_transactions/getOrderHistoryOrders',
      getFilterDataPayload: '$_transactions/getFilterDataPayload',
    }),
    order_details() {
      return this.getOrderDetails.find(
        order => order.order_id === parseInt(this.$route.params.id, 10),
      );
    },
    delivery_doc_status() {
      return this.doc_status === '1' ? 4 : 2;
    },
  },
  watch: {
    // eslint-disable-next-line func-names
    'order_details.order_id': function (val) {
      if (this.order_details.order_id === val) {
        this.checkDisputeStatus();
      }
    },
  },
  mounted() {
    this.setUserDefaultCurrency();
    this.checkDisputeStatus();
  },
  created() {
    this.order_id = this.$route.params.id;
  },
};
</script>

<style lang="css">
@import "../../../assets/styles/order_details.css";
.order-details-wrapper {
  width: 50%;
  display: inline-block;
  border-right: 1px solid #f0f0f0;
  padding-right: 20px;
}
.rating-star {
  background: transparent !important;
  color: inherit;
}
.rate--action-btn {
  display: inline-block;
  margin-left: 30px;
}
.delivery_documents_info {
  width: 50%;
  min-height: 310px;
  margin: 3%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.delivery_documents_img {
  min-height: 310px;
  margin: 3%;
  border-radius: 4px;
}
.delivery_documents_sign {
  min-height: 310px;
  margin: 3%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.delivery-image-content {
  width: 60%;
}
.delivery_image_details {
  margin-top: 7%;
  margin-left: 7%;
}
.dispute-delivery-button {
  margin-top: 20px;
  margin-left: 15%;
  width: 100% !important;
}
.dispute_type_select {
  width: 100% !important;
  margin-bottom: 10px;
  height: 35px;
}
.dispute_description {
  padding: 12px;
  margin-right: -6px;
  width: 100% !important;
  height: 100px;
}
.dispute-delivery-submit {
  margin-top: 20px;
  width: 320px;
}
.delivery_image_dialog {
  width: 100%;
  height: 100%;
}
.dispute_delivery_dialog {
  width: 83%;
  height: 100%;
  margin-left: 10%;
}
.dispute_documents_body {
  width: 60%;
  margin-left: 19%;
}
.el-rate__icon {
  font-size: 20px !important;
}
.reference-number {
  margin: 5px 0px 0px 22px;
}
.reference-number-title {
  font-weight: 500;
}
.delivery-image-content-absent {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40% 0%;
}
</style>
