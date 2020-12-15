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
          <i class="el-icon-arrow-left view-transporter-info" /> Back
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
                Order amount: {{ freightOrderDetail.currency }}
                {{ formatCurrency(freightOrderDetail.amount) }}
              </div>

              <div class="order_details_desc_item">
                <img
                  src="../../../assets/img/maroon_button.png"
                  class="order_details_desc_image"
                >
                <span class="order-info-header">Pick up location</span>
                <div class="freight-order-info-extra">
                  {{ freightOrderDetail.pick_up_name }}
                </div>
              </div>
              <div class="order_details_desc_item order_details_desc_item--no-space">
                <img
                  src="../../../assets/img/blue_button.png"
                  class="order_details_desc_image"
                >
                <span class="order-info-header">Destination</span>
                <div class="freight-order-info-extra">
                  {{ freightOrderDetail.destination_name }}
                </div>
              </div>
              <div class="order_details_desc_item order-details-schedule-time">
                <img
                  src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/time.svg"
                  class="order_details_desc_image"
                >
                <span class="order-info-header">Pick up time</span>
                <div class="freight-order-info-extra">
                  {{ convertToUTCToLocal(freightOrderDetail.pick_up_time) }}
                </div>
              </div>
            </div>
          </div>

          <div class="rider_details_wrap">
            <div class="">
              <div class="transporter-infor--header">
                Transporter
              </div>
              <div class="transporter-info-extra">
                {{ freightOrderDetail.transporter_name }}
              </div>
              <div
                class="transporter-info-extra view-transporter-mark"
                @click="goToTransporter(freightOrderDetail.owner_id)"
              >
                View
              </div>
            </div>
          </div>
        </div>
        <div class="freight-border-line" />
        <div class="">
          <div class="transporter-doucuments-title align-documents-data">
            Documents
          </div>
          <div class="transporter-listing order-order-documents">
            <div
              v-for="(val, index) in freightOrderDetail.documents"
              v-if="index >= 0"
              class="doc-detail"
            >
              <div class="transporters-filters documents-highlight orders-freight-documents">
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
                  View Document <i class="el-icon-arrow-right view-transporter-info" />
                </div>
                <div
                  v-if="freightOrderDetail.documents[index].status === 'PENDING'"
                  class="freight-documents-approve"
                  style="display : flex"
                >
                  <button
                    type="button"
                    class="button-primary section--filter-action freight-approve-doc"
                    name="create_order_text"
                  >
                    {{ approve_doc_text }}
                  </button>
                  <button
                    type="button"
                    class="section--filter-action freight-decline-doc"
                    name="create_order_text"
                  >
                    {{ decline_doc_text }}
                  </button>
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
                  {{ src_name }} document
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
      quote_text: 'Request for quote',
      financing_text: 'Create order',
      rating: 5.0,
      loading: true,
      approve_doc_text: 'Approve',
      decline_doc_text: 'Decline',
      viewDocumentOption: false,
      src_link: '',
      src_name: '',
      path: [
        {
          coordinates: '-1.3001097,36.772822099999985',
          country_code: 'KE',
          locality: {
            coordinates: '-1.300190,36.772672',
            name: 'Nairobi',
          },
          name: 'Ngong Rd, Nairobi, Kenya',
          waypoint_type: 'PICKUP',
        },
        {
          coordinates: '-1.2987826,36.76318070000002',
          country_code: 'KE',
          locality: {
            coordinates: '-1.298783,36.763181',
            name: 'Maziwa',
          },
          name: 'Junction Mall Parking Hall, Ngong Rd, Nairobi, Kenya',
          waypoint_type: 'DELIVERY',
        },
      ],
      documents_data: [],
      freightOrderDetail: [],
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
          if (response.status) {
            this.freightOrderDetail = response.order;
            this.loading = false;
          } else {
            this.doNotification(2, 'Failed to retrieve order details', response.message);
            this.$router.push('/freight/orders');
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Order details retrival failure !',
            'Failed to fetch order , Kindly retry again or contact customer support ',
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
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../assets/styles/transporters_component.css?v=1';
.back-freight-btn{
  font-size: 14px;
  font-weight: 200;
  color: #000;
  cursor: pointer;
}
.transporter-summary-data{
  width: 89%;
  background: #F1F1F1;
}
.align-contacts-data{
  margin-top: 6%;
}
.quote-btn{
  width: 72%;
  margin-bottom: 6%;
}
.financing-btn{
  width: 72%;
  background-color: #EA7125 !important;
  border-color: #EA7125 !important;
}
.transporters-quote-section{
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  margin-right: 2%;
  padding: 2rem;
  width: 2%;
}
.check-tranporters{
  color: #1B7FC3;
}
.transporter-doucuments-title{
  color: #1B7FC3;
}
.truck-title-info{
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #000000;
  margin-top: 2%;
}
.transporter-vehicle-info{
  font-size: 12px;
  font-weight: 200;
  color: #000;
  margin-top: 2%;
}
.vehicles-split{
  border-bottom: 1px solid #BBB9B9;
  width: 90%;
  margin-top: 3%;
}
.transporter-name-inner{
  margin-top: 4%;
  font-size: 15px;
}
.reviews-section{
  margin-bottom: 2%;
}
.reviews-outer{
  width: 85%;
}
.freight-order-details-wrapper {
  width: 64%;
  display: inline-block;
}
.order_details_map {
  width: 38%;
  display: inline-block;
  float: left;
}
.back-freight-orders{
  margin-bottom: 3%;
}
.order_details_desc {
  display: inline-block;
  padding-left: 48px;
  font-size: 14px;
}
.order_details_price {
  margin-top: 1%;
  font-size: 15px;
  margin-bottom: 6%;
  color: #000000;
}
.order_details_desc_item {
  margin-top: 10px;
}
.order_details_desc_item--no-space {
  margin-top: unset;
}
.order_details_desc_image {
  width: 13px;
  height: auto;
  margin-top: 10px;
  margin-right: 5px;
}
.order-details-schedule-time{
  margin-top: 10%;
}
.freight-order-info-extra{
  margin-left: 6%;
  margin-top: 5%;
  margin-bottom: 2%;
}
.order-info-header{
  font-size: 15px;
  line-height: 18px;
  color: #000000;
}
.rider_details_wrap {
  width: 34%;
  float: right;
  display: inline-block;
}
.transporter-info-extra{
  margin-bottom: 2%;
  font-size: 14px;
}
.transporter-infor--header{
  margin-top: 1%;
  font-size: 15px;
  margin-bottom: 4%;
  color: #000000;
}
.view-transporter-mark{
  margin-top: 6%;
  color: #1B7FC3;
  cursor: pointer;
}
.freight-border-line{
  border-bottom: 1px solid #f0f0f0;
  width: 94%;
}
.freight-orders-main-summary{
  margin-bottom: 2%;
}
.order-order-documents{
  width: 94%;
}
.align-documents-data{
  margin-top: 4%;
  margin-bottom: 2%
}
.orders-freight-documents{
  margin-left: 5%;
}
.freight-documents-name{
  width: 20%;
  font-size: 15px;
  margin-top: 1%;
}
.freight-documents-approve{
  width: 45%;
  font-size: 15px;
}
.freight-documents-date{
  width: 20%;
  font-size: 15px;
  margin-top: 1%;
}
.freight-documents-title{
  width: 20%;
  font-size: 15px;
  margin-top: 1%;
}
.documents-highlight{
  font-size: 12px;
  font-weight: 200;
  color: #000;
  margin: 2%;
}
.view-freight-document{
  color: #1B7FC3;
  cursor: pointer;
}
.freight-create-order{

}
.freight-approve-doc{
  border-width: 0px !important;
  width: 60%;
  background-color: #EA7125 !important;
  border: #EA7125 !important;
}
.freight-decline-doc{
  color: #EA7125;
  width: 60%;
  border-width: 1px !important;
  background-color: white;
  cursor: pointer;
  position: relative;
  display: block;
  border-radius: 4px;
  height: 40px;
  transition: background-color 0.3s;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  border-color: #EA7125;
}
.doc-detail{
  border: 1px solid #d8dfe6;
  border-radius: 1px;
}
.document-text-option {
  text-align: left;
  margin: 0px 10px 10px 10px;
  line-height: 20px;
}
.document-view-inner{
  height: 500px !important;
}
</style>
