<template lang="html">
  <div
    v-if="Object.prototype.hasOwnProperty.call(freightOrderDetail, 'awarded_bids')"
    class=""
  >
    <div v-if="freightOrderDetail.awarded_bids.length > 0">
      <div class="order-info-header align-documents-data">
        Awarded Transporters
      </div>
      <div
        class=""
        style="display: flex;"
      >
        <div class="">
          <el-progress
            type="circle"
            :percentage="
              getTruckPercentage(
                freightOrderDetail.available_trucks,
                freightOrderDetail.total_trucks
              )
            "
          />
        </div>
        <div class="awarded-highlight">
          {{ freightOrderDetail.available_trucks }}/{{ freightOrderDetail.total_trucks }}
          Trucks confirmed

          <span class="align-awarded-total-sum">
            Total cost: {{ freightOrderDetail.currency }}
            {{ freightOrderDetail.awarded_amount.toLocaleString() }}
          </span>
        </div>
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
            @click="toggleRow(index, data)"
          >
            <div class="transporter-content freight-documents-title transporters-name-highlight">
              {{ data.name }}
            </div>
            <div class="transporter-content">
              {{ getAvailableTrucks(data.trucks_available) }}
            </div>
            <div class="transporter-content transporters-name-highlight">
              {{ freightOrderDetail.currency }} {{ data.price_per_truck }}/Truck
            </div>
            <div class="transporter-content view-transporter-documents">
              View document details
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
            class="freight-documents transporters-doc-align"
          >
            <awardingDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.awarding_documents.documents"
            />
            <div
              v-if="opened.includes(index)"
              class="documents-divider"
            />
            <loadingDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.loading_documents.vehicles"
            />
            <div
              v-if="opened.includes(index)"
              class="documents-divider"
            />

            <fulfillmentDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.fulfillment_documents.documents"
            />
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
          :visible.sync="viewLoadingDocument"
          class="documentOptions"
        >
          <div
            v-for="(val, index) in loadingDocs"
            v-if="index >= 0"
          >
            <div class="document-text-option freight-documents">
              {{ val.document_name }} document
            </div>
            <div class="document-divider" />
            <div class="document-view-inner loading-docs-image">
              <iframe
                :src="val.document_url"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </el-dialog>

        <el-dialog
          :visible.sync="viewUploadLoadingDocs && loading_options.length > 0"
          class="requestShipmentOptions requestShipmentLoadingDocs"
        >
          <div class="">
            <div
              class="decline-text-option decline-documemt-extend request-shipment-header outline-info-value"
            >
              Upload loading documents
            </div>
          </div>

          <div class="loading-docs-hint">
            <div class="loading-docs-hint--inner">
              Please upload the necessary loading document(s) required.
            </div>
          </div>

          <div
            v-for="(val, index) in loading_options"
            v-if="index >= 0"
            class="upload-loading-docs-dialog"
          >
            <div class="award-shipment-input">
              <p class="award-input--label upload-landing">
                Upload the <span>{{ val.document_type }} document </span>
              </p>
              <div class="document-image">
                <div
                  class="download-uploaded-img"
                  @click="setIndex(index)"
                >
                  <el-upload
                    class="upload-demo upload-T1s"
                    drag
                    action="handleLandingCardPreview"
                    :before-upload="beforeLandingUpload"
                    :http-request="handleLandingCardPreview"
                    :on-remove="handleRemoveLanding"
                  >
                    <img
                      :id="'ladingImagePreview_' + index"
                      class="upload_image"
                      src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                    >
                    <i class="el-icon-upload" />
                    <div v-if="billOfLandingName[index].name !== ''">
                      {{ landing_text[index].name }}
                    </div>
                    <div v-else>
                      Drop file here or <em>click to upload</em>
                    </div>
                  </el-upload>
                  <div
                    v-if="
                      billOfLandingName[index].name !== '' && landing_text[index].name === 'Change'
                    "
                  >
                    <span class="document-upload-label">
                      {{ val.document_type }} added successfully .
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="decline-button-align upload-docs-btn">
            <button
              type="button"
              name="button"
              class="quote-action--slide-button award-shipment-btn"
              @click="finalLoadingDocsUpload()"
            >
              Upload document
            </button>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import S3 from 'aws-s3';
import $ from 'jquery';
import NotificationMxn from '../../../../mixins/notification_mixin';
import awardingDocs from './components/awardingDocs.vue';
import fulfillmentDocs from './components/fulfillmentDocs.vue';
import loadingDocs from './components/loadingDocs.vue';

let s3 = '';

export default {
  name: 'Documents',
  components: { awardingDocs, fulfillmentDocs, loadingDocs },
  mixins: [NotificationMxn],
  props: {
    freightOrderDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      opened: [],
      viewLoadingDocument: false,
      viewUploadLoadingDocs: false,
      loadingDocs: [],
      loading_options: [],
      landing_text: [],
      billOfLandingName: [],
      billOfLandingData: [],
      upload_index: 0,
    };
  },
  computed: {
    ...mapGetters({
      getLoadingDocs: '$_freight/getLoadingDocs',
      getLoadingDocumentDialog: '$_freight/getLoadingDocumentDialog',
      getShipmentDetail: '$_freight/getShipmentDetail',
      getUploadLoadingDocs: '$_freight/getUploadLoadingDocs',
      getLoadingDocumentOptions: '$_freight/getLoadingDocumentOptions',
      getQuatationId: '$_freight/getQuatationId',
      getVehicleId: '$_freight/getVehicleId',
    }),
  },
  watch: {
    viewLoadingDocument(val) {
      if (!val) {
        this.setLoadingDocumentDialog(false);
        this.loadingDocs = [];
        this.setLoadingDocs([]);
      }
    },
    getLoadingDocumentDialog(value) {
      this.loadingDocs = this.getLoadingDocs;
      this.viewLoadingDocument = value;
    },
    viewUploadLoadingDocs(val) {
      if (!val) {
        this.setShipmentDetail({});
        this.setUploadLoadingDocs(false);
        this.loading_options = [];
        this.resetUploadLoadingDocsDialog();
      }
    },
    getUploadLoadingDocs(value) {
      this.viewUploadLoadingDocs = value;
      this.loading_options = this.getLoadingDocumentOptions;
    },
    getLoadingDocumentOptions(value) {
      this.loading_options = value;
      this.billOfLandingName = [];
      this.landing_text = [];
      for (let i = 0; i < value.length; i++) {
        this.billOfLandingName.push({
          name: '',
          type: '',
          doc_name: '',
        });
        this.landing_text.push({
          name: 'Change',
        });
        this.billOfLandingData.push({
          name: {},
        });
      }
    },
  },
  mounted() {
    this.initiateS3();
  },
  methods: {
    ...mapActions({}),
    ...mapMutations({
      setLoadingDocumentDialog: '$_freight/setLoadingDocumentDialog',
      setLoadingDocs: '$_freight/setLoadingDocs',
      setUploadLoadingDocs: '$_freight/setUploadLoadingDocs',
      setShipmentDetail: '$_freight/setShipmentDetail',
      setQuatationId: '$_freight/setQuatationId',
      setOrderDetail: '$_freight/setOrderDetail',
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
    toggleRow(i, data) {
      if (this.opened.includes(i)) {
        const index = this.opened.indexOf(i);
        this.opened.splice(index, 1);
      } else {
        this.opened.push(i);
      }
      this.setQuatationId(data.quotation_id);
    },
    getTruckPercentage(availableTrucks, totalTrucks) {
      const resp = (availableTrucks / totalTrucks) * 100;

      return parseInt(resp, 10);
    },
    getItemPosition(data, index) {
      let name = '';

      if (index >= 0 && index < data.length - 1) {
        name = 'no-transporter-top-margin';
      }
      return name;
    },
    getAvailableTrucks(val) {
      let resp = `${val} Trucks`;
      if (val === 1) {
        resp = `${val} Truck`;
      }
      return resp;
    },
    beforeLandingUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(2, 'Document upload error !', 'Document must be in PDF format');
      }
      return isPdf;
    },
    setIndex(index) {
      this.upload_index = index;
    },
    handleLandingCardPreview(file) {
      this.billOfLandingData[this.upload_index].name = file;
      this.billOfLandingName[this.upload_index].doc_name = this.loading_options[
        this.upload_index
      ].document_type;
      this.billOfLandingName[this.upload_index].type = this.loading_options[this.upload_index].id;
      this.uploadBillOfLanding();
    },
    handleRemoveLanding() {
      this.billOfLandingName[this.upload_index].name = '';
      this.billOfLandingName[this.upload_index].doc_name = '';
      this.billOfLandingName[this.upload_index].type = '';
      this.billOfLandingData[this.upload_index].name = {};
      this.landing_text[this.upload_index].name = 'Change';
    },
    uploadBillOfLanding() {
      if (Object.keys(this.billOfLandingData[this.upload_index].name).length === 0) {
        this.doNotification(2, 'Kindly upload the necessary loading document', '');
      } else {
        const imageId = `ladingImagePreview_${this.upload_index}`;
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.landing_text[this.upload_index].name = 'Uploading ...';
        const { file } = this.billOfLandingData[this.upload_index].name;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name, 'loading_document');
        this.billOfLandingName[this.upload_index].name = fileName;
        const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
        const photoKey = albumPhotosKey + fileName;
        this.billOfLandingName[this.upload_index].name = photoKey;
        s3.upload(
          {
            Key: photoKey,
            Body: file,
            ACL: 'public-read',
            ContentType: fileType,
          },
          (err) => {
            if (err) {
              this.landing_text[this.upload_index].name = 'Change';
              console.log('There was an error uploading your document: ', err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.landing_text[this.upload_index].name = 'Change';
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
      tempName = `${type}_${values}_${new Date().getTime()}.${name.split('.').pop()}`;

      return tempName;
    },
    finalLoadingDocsUpload() {
      const docsOptionsLength = this.loading_options.length;
      const submittedDocsLength = this.billOfLandingName.length;

      if (docsOptionsLength !== submittedDocsLength) {
        this.doNotification(2, 'Kindly upload all the necessary loading document(s)', '');
      } else {
        const filtered = this.billOfLandingName.find(location => location.name === '');
        if (filtered === undefined || filtered === 'undefined') {
          this.processRequest();
        } else {
          this.doNotification(2, 'Kindly upload all the necessary loading document(s)', '');
        }
      }
    },
    processRequest() {
      const documentUpload = [];

      for (let i = 0; i < this.billOfLandingName.length; i++) {
        documentUpload.push({
          document_type: this.billOfLandingName[i].type,
          document_name: this.billOfLandingName[i].doc_name,
          url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${
            this.billOfLandingName[i].name
          }`,
        });
      }
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        quotation_id: this.getQuatationId,
        vehicle_id: this.getQuatationId,
        documents: documentUpload,
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
        endpoint: 'shipments/quotations/documents/upload',
      };

      this.$store.dispatch('$_freight/uploadLoadingDocuments', fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(1, 'Loading documents uploaded successfully!', '');
            this.resetUploadLoadingDocsDialog();
            this.setOrderDetail(this.$route.params.id);
          } else {
            this.doNotification(2, 'Unable to upload loading documernts!', response.message);
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'message')) {
            this.doNotification(2, 'Document upload failed', error.response.data.message);
          } else {
            this.doNotification(
              2,
              'Document upload failed',
              'Something went wrong.Please try again',
            );
            this.$router.push('/freight/orders');
            this.resetUploadLoadingDocsDialog();
          }
        },
      );
    },
    resetUploadLoadingDocsDialog() {
      this.viewUploadLoadingDocs = false;
      this.landing_text = [];
      this.billOfLandingName = [];
      this.billOfLandingData = [];
      this.upload_index = 0;
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/transporters_component.css';
@import '../../../../assets/styles/transporters_documents.css';
</style>
