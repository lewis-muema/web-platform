<template lang="html">
  <div class="create-order-main">
    <div
      class="back-order-btn"
      @click="backToOrders()"
    >
      <i class="el-icon-arrow-left view-transporter-info" /> {{ $t('general.back') }}
    </div>
    <div class="create-order-upper">
      {{ $t('createFreightOrder.create_order') }}
    </div>
    <div class="transporters-container transporters-main--inner">
      <div class="transporters-content">
        <div class="create-order-section">
          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.pickup_location') }}
            </p>
            <gmap-autocomplete
              v-model="locations[0]"
              :options="map_options"
              placeholder="Enter a pickup location"
              :select-first-on-enter="true"
              class="input-control"
              @place_changed="setLocation($event, 0)"
            />
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.destination') }}
            </p>
            <gmap-autocomplete
              v-model="locations[1]"
              :options="map_options"
              :placeholder="$t('createFreightOrder.enter_destination')"
              :select-first-on-enter="true"
              class="input-control"
              @place_changed="setLocation($event, 1)"
            />
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.pickup_time') }}
            </p>
            <div class="block">
              <el-date-picker
                v-model="pick_up_time"
                class="transporters-pickup-time"
                type="datetime"
                format="dd-MM-yyyy h:mm a"
                :placeholder="$t('createFreightOrder.asap')"
                prefix-icon="el-icon-date"
                :default-time="default_value"
                :picker-options="dueDatePickerOptions"
              />
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.load_weight') }}
            </p>
            <div>
              <input
                v-model.trim="load_weight"
                class="input-control freight-create-load-weight"
                type="number"
                placeholder=""
                autocomplete="on"
              >
              <span class="freight-tonage-value-text">{{ $t('createFreightOrder.tonnes') }}</span>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.cost_order') }}
            </p>
            <div class="freight-input">
              <div class="freight-input-icon">
                <span>{{ getCurrency }}</span>
              </div>
              <div class="freight-input-area">
                <input
                  v-model.trim="amount"
                  type="number"
                  name="amount"
                  class="form-control freight-selector"
                >
              </div>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.select_transporter') }}
            </p>
            <div
              :class="`trigger ${hideInput}`"
              @click="trigger"
            >
              <input
                v-model="ownerDisplay"
                class="input-control"
                type="text"
                placeholder=""
                autocomplete="on"
              >
            </div>
            <div :class="`${hide}`">
              <input
                v-model="query"
                class="input-control"
                :placeholder="$t('createFreightOrder.search_by_name')"
                autocomplete="off"
                :prepare-response-data="prepareResponseData"
                @keydown.down="down"
                @keydown.up="up"
                @keydown.enter="hit"
                @keydown.esc="reset"
                @blur="reset"
                @input="update"
              >
            </div>

            <ul
              v-show="hasItems"
              class="search-transporter-ul"
            >
              <li
                v-for="(item, $item) in items"
                :key="$item"
                class="suggestions_solr"
                :class="activeClass($item)"
                @mousedown="hit"
                @mousemove="setActive($item)"
              >
                <span
                  class="name"
                  v-text="item.name"
                />
                <span
                  class="screen-name"
                  v-text="item.phone"
                />
                <span
                  class="screen-name"
                  v-text="item.id_no"
                />
              </li>
            </ul>
            <ul
              v-show="!hasItems && !isEmpty"
              class="search-transporter-ul"
            >
              <span class="screen-no-details-found">
                {{ $t('createFreightOrder.no_details') }}
              </span>
            </ul>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.select_transporter') }}
            </p>
            <div class="transporters-select">
              <el-select
                v-model="container_option"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in goodsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('createFreightOrder.upload_terms') }}
            </p>
            <div class="document-image">
              <div class="download-uploaded-img">
                <el-upload
                  class="upload-demo"
                  drag
                  action="handleLandingCardPreview"
                  :before-upload="beforeTermsUpload"
                  :http-request="handleTermsCardPreview"
                  :on-remove="handleRemoveTerms"
                >
                  <img
                    id="imagePreview"
                    class="upload_image"
                    src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                  >
                  <i class="el-icon-upload" />
                  <div v-if="termsName !== ''">
                    {{ terms_text }}
                  </div>
                  <div v-else>
                    {{ $t('createFreightOrder.drop_file') }}
                    <em>{{ $t('createFreightOrder.click_upload') }}</em>
                  </div>
                </el-upload>
                <div
                  v-if="termsName !== '' && terms_text === 'Change'"
                  class="underate"
                >
                  <span class="document-upload-label">
                    {{ $t('createFreightOrder.terms_of_delivery_uploaded') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label upload-landing">
              {{ $t('createFreightOrder.upload_bill_lading') }}
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
                    {{ $t('createFreightOrder.drop_file')
                    }}<em>{{ $t('createFreightOrder.click_upload') }}</em>
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

          <div
            v-for="(val, index) in stored_documents"
            v-if="index >= 0"
          >
            <div class="">
              <p class="freight-input--label upload-landing">
                {{ val.document_name }} {{ $t('createFreightOrder.document') }}
              </p>
              <div class="documents--flex">
                <div class="document-image-extra">
                  <div class="download-uploaded-img-extra">
                    <div
                      class="upload-demo"
                      drag
                    >
                      <img
                        class="upload_image-extra"
                        src="https://images.sendyit.com/web_platform/freight/complete.svg"
                      >
                    </div>
                    <div class="success-extra">
                      <span class="document-upload-label">
                        {{ val.document_name }} {{ $t('createFreightOrder.name_document_upload') }}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="delete-upload"
                  @click="removeRecord(index)"
                >
                  X
                </div>
              </div>
            </div>
          </div>

          <div
            class="document-upload-extra"
            @click="showExtraDocModal"
          >
            <i class="el-icon-circle-plus" /> {{ $t('createFreightOrder.add_document') }}
          </div>

          <div class="next-terms-holder">
            <input
              v-model="submit_text"
              class="button-primary terms-btn-color create-order-submit"
              type="submit"
              @click="createOrder"
            >
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
          :visible.sync="displayExtraDocument"
          class="uploadDocumentOptions"
        >
          <div class="">
            <div class="decline-text-option  upload-document-header">
              {{ $t('createFreightOrder.add_new_document') }}
            </div>
          </div>
          <div class="">
            <div class="documents-highlight-label">
              {{ $t('createFreightOrder.additiona_doc_type') }}
            </div>
            <el-select
              v-model="doc_name"
              placeholder=""
              class="select-documents"
              filterable
            >
              <el-option
                v-for="item in documents"
                :key="item.document_type"
                :label="item.document_name"
                :value="item.document_type"
              />
            </el-select>
          </div>

          <div
            v-if="doc_name === 1"
            class=""
          >
            <div class="documents-highlight-label">
              {{ $t('createFreightOrder.additional_doc_name') }}
            </div>
            <el-input
              v-model="new_doc_name"
              placeholder=""
              class="select-documents"
              filterable
            />
          </div>

          <div class="upload-new-doc--outer">
            <div class="">
              <p class="documents-highlight-label">
                {{ $t('createFreightOrder.upload_doc') }}
              </p>
              <div class="add-document-image">
                <div class="download-uploaded-img">
                  <el-upload
                    class="add-upload-demo"
                    drag
                    action="handleLandingCardPreview"
                    :before-upload="beforeAddUpload"
                    :http-request="handleAddCardPreview"
                    :on-remove="handleRemoveAdd"
                  >
                    <img
                      id="addImagePreview"
                      class="add-upload-image"
                      src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg"
                    >
                    <i class="el-icon-upload" />
                    <div v-if="addNewName !== ''">
                      {{ add_text }}
                    </div>
                    <div v-else>
                      {{ $t('createFreightOrder.drop_file') }}
                      <em>{{ $t('createFreightOrder.click_upload') }}</em>
                    </div>
                  </el-upload>
                  <div v-if="addNewName !== '' && add_text === 'Change'">
                    <span class="document-upload-label align-new-doc">
                      {{ $t('createFreightOrder.doc_added_successfully') }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="decline-documemt-extend decline-button-align">
            <button
              type="button"
              name="button"
              class="decline-action--slide-button"
              @click="submitNewData"
            >
              {{ $t('createFreightOrder.done') }}
            </button>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import S3 from 'aws-s3';
import $ from 'jquery';
import VueTypeahead from 'vue-typeahead';
import Axios from 'axios';
import NotificationMxn from '../../../mixins/notification_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';

Vue.prototype.$http = Axios;

let s3 = '';

export default {
  name: 'CreateFreightOrder',
  extends: VueTypeahead,
  mixins: [NotificationMxn, MixpanelMixin],
  data() {
    return {
      submit_text: this.$t('createFreightOrder.create_freight_btn'),
      quote_text: this.$t('createFreightOrder.request_quote'),
      locations: [],
      map_options: {
        componentRestrictions: {
          country: ['ke', 'ug', 'tz'],
        },
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
      pick_up: '',
      destination: '',
      pick_up_time: '',
      default_value: this.moment().format('HH:mm:ss'),
      truck_type: '',
      container_option: '',
      search: '',
      transporter_name: '',
      load_weight: '',
      freight_selector: false,
      select_transporter: false,
      amount: '',
      billOfLandingData: {},
      landing_text: this.$t('createFreightOrder.change'),
      billOfLandingName: '',
      termsData: {},
      terms_text: this.$t('createFreightOrder.change'),
      termsName: '',
      add_text: this.$t('createFreightOrder.change'),
      addNewDocData: {},
      addNewName: '',
      ownerDisplay: '',
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      hide: '',
      hideInput: 'hide',
      goodsOptions: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
      order_path: [],
      query: '',
      classes: 'typeahead',
      queryParamName: 'keyword',
      limit: 5,
      data: {},
      selectFirst: false,
      minChars: 2,
      owner_id: '',
      displayExtraDocument: false,
      documents: [],
      doc_name: '',
      new_doc_name: '',
      stored_documents: [],
    };
  },
  computed: {
    ...mapGetters({}),
    query_string() {
      return this.query;
    },
    src() {
      return `${process.env.CONFIGS_ENV.OWNER_SEARCH}select?q=(name:*${
        this.query_string
      }*+OR+id_no:*${this.query_string}*+OR+phone:*${
        this.query_string
      }*) AND freight_status:*2* &wt=json&indent=true&row=10&sort=id%20desc&jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJyV01HZVR2WWZMVnlBSWwxOHFPVGFWMnRxMnFDVmpJZiIsIm5hbWUiOiJzb2xyIn0.p7uW30OQBaSEduNerbIaSbaQTdUAa-VkVMQUF4LAPFQ`;
    },
    getCurrency() {
      const session = this.$store.getters.getSession;

      return session[session.default].default_currency;
    },
  },
  watch: {
    displayExtraDocument(val) {
      if (!val) {
        this.closeExtraDocumentDialog();
      }
    },
  },
  created() {
    this.initiateS3();
    this.fetchDocumentTypes();
  },
  methods: {
    ...mapActions({
      createFreightOrder: '$_freight/createFreightOrder',
      getDocumentTypes: '$_freight/getDocumentTypes',
    }),
    trigger() {
      this.transporter_name = '';
      this.hideInput = 'hide';
      this.hide = '';
    },
    closeExtraDocumentDialog() {
      this.add_text = this.$t('createFreightOrder.change');
      this.addNewDocData = {};
      this.addNewName = '';
      this.displayExtraDocument = false;
      const imageId = 'addImagePreview';
      const src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
      $(`#${imageId}`).attr('src', src);
      this.doc_name = '';
      this.new_doc_name = '';
    },
    submitNewData() {
      if (this.doc_name === 1 && this.new_doc_name === '') {
        this.doNotification(
          2,
          this.$t('createFreightOrder.upload_document'),
          this.$t('createFreightOrder.additional_document'),
        );
      } else if (this.doc_name === '' || this.addNewName === '') {
        this.doNotification(
          2,
          this.$t('createFreightOrder.upload_document'),
          this.$t('createFreightOrder.missing_data'),
        );
      } else {
        this.setToStore();
      }
    },
    setToStore() {
      const data = {
        document_type: this.doc_name,
        url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.addNewName}`,
      };

      const val = this.documents.find(position => position.document_type === this.doc_name);

      if (this.doc_name === 1) {
        data.document_name = this.new_doc_name;
      } else {
        data.document_name = val.document_name;
      }

      this.stored_documents.push(data);
      this.closeExtraDocumentDialog();
    },
    removeRecord(val) {
      this.stored_documents.splice(val, 1);
      this.doNotification(1, this.$t('createFreightOrder.doc_removed'), '');
    },
    fetchDocumentTypes() {
      const fullPayload = {
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/documents',
      };

      this.getDocumentTypes(fullPayload).then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.documents = workingResponse.documents;
          } else {
            this.doNotification(
              2,
              this.$t('createFreightOrder.doc_type_unable'),
              this.$t('createFreightOrder.doc_type_unavailable'),
            );
            this.documents = [];
            this.displayExtraDocument = false;
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('createFreightOrder.doc_type_unable'),
            this.$t('createFreightOrder.doc_type_unavailable'),
          );
          this.documents = [];
          this.displayExtraDocument = false;
        },
      );
    },
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
    onHit(item) {
      this.hide = 'hide';
      this.hideInput = '';
      this.ownerDisplay = `${item.name}`;
      this.transporter_name = item.name;
      this.owner_id = item.id;
    },
    prepareResponseData(data) {
      if (data.response.docs.length === 0) {
        this.hasItems = false;
      }
      return data.response.docs;
    },
    viewTransporterInfo() {
      const transporterId = 2;
      this.$router.push(`/freight/transporters/info/${transporterId}`);
    },
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    backToOrders() {
      this.$router.push('/freight/orders');
    },
    beforeLandingUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(
          2,
          this.$t('createFreightOrder.doc_upload_error'),
          this.$t('createFreightOrder.doc_in_pdf'),
        );
      }
      return isPdf;
    },
    beforeTermsUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(
          2,
          this.$t('createFreightOrder.doc_upload_error'),
          this.$t('createFreightOrder.doc_in_pdf'),
        );
      }
      return isPdf;
    },
    beforeAddUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(
          2,
          this.$t('createFreightOrder.doc_upload_error'),
          this.$t('createFreightOrder.doc_in_pdf'),
        );
      }
      return isPdf;
    },
    handleLandingCardPreview(file) {
      this.billOfLandingData = file;
      this.uploadBillOfLanding();
    },
    handleTermsCardPreview(file) {
      this.termsData = file;
      this.uploadTermsAndCondition();
    },
    handleAddCardPreview(file) {
      this.addNewDocData = file;
      this.uploadAddNewDocument();
    },
    handleRemoveLanding() {
      this.billOfLandingName = '';
      this.billOfLandingData = {};
      this.landing_text = this.$t('createFreightOrder.change');
    },
    handleRemoveAdd() {
      this.addNewName = '';
      this.addNewDocData = {};
      this.add_text = this.$t('createFreightOrder.change');
    },
    handleRemoveTerms() {
      this.termsName = '';
      this.termsData = {};
      this.terms_text = this.$t('createFreightOrder.change');
    },
    uploadBillOfLanding() {
      if (Object.keys(this.billOfLandingData).length === 0) {
        this.doNotification(2, this.$t('createFreightOrder.upload_bill'), '');
      } else {
        const imageId = 'ladingImagePreview';
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.landing_text = this.$t('createFreightOrder.uploading');
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
              this.landing_text = this.$t('createFreightOrder.change');
              console.log('There was an error uploading your document: ', err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.landing_text = this.$t('createFreightOrder.change');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    uploadTermsAndCondition() {
      if (Object.keys(this.termsData).length === 0) {
        this.doNotification(2, this.$t('createFreightOrder.kindly_upload'), '');
      } else {
        const imageId = 'imagePreview';
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.terms_text = this.$t('createFreightOrder.uploading');
        const { file } = this.termsData;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name, 'terms');
        this.termsName = fileName;
        const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
        const photoKey = albumPhotosKey + fileName;
        this.termsName = photoKey;
        s3.upload(
          {
            Key: photoKey,
            Body: file,
            ACL: 'public-read',
            ContentType: fileType,
          },
          (err) => {
            if (err) {
              this.terms_text = this.$t('createFreightOrder.change');
              console.log('There was an error uploading your document: ', err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.terms_text = this.$t('createFreightOrder.change');
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    uploadAddNewDocument() {
      if (Object.keys(this.addNewDocData).length === 0) {
        this.doNotification(2, this.$t('createFreightOrder.kindly_upload_doc'), '');
      } else {
        const imageId = 'addImagePreview';
        let src = 'https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/grey_bg_01.jpg';
        $(`#${imageId}`).attr('src', src);

        this.add_text = this.$t('createFreightOrder.uploading');
        const { file } = this.addNewDocData;
        const fileType = file.type;
        const fileName = this.sanitizeFilename(file.name, 'other');
        this.addNewName = fileName;
        const albumPhotosKey = `${encodeURIComponent('freight_docs')}/`;
        const photoKey = albumPhotosKey + fileName;
        this.addNewName = photoKey;
        s3.upload(
          {
            Key: photoKey,
            Body: file,
            ACL: 'public-read',
            ContentType: fileType,
          },
          (err) => {
            if (err) {
              this.add_text = 'Change';
              console.log('There was an error uploading your document: ', err.message);
            } else {
              src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.add_text = 'Change';
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
    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = place.address_components.findIndex(country_code => country_code.types.includes('country'));
      const pathObj = {
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        waypoint_details_status: true,
        type: 'coordinates',
        country_code: place.address_components[countryIndex].short_name,
        more: {
          Address: place.formatted_address,
          Estate: '',
          FlatName: '',
          HouseDoor: '',
          Label: '',
          Otherdescription: '',
          Road: '',
          Typed: '',
          Vicinity: 'Not Indicated',
          landmark: '',
          place_idcustom: place.place_id,
          viewport: {
            northeast: {
              lat: 0,
              lng: 0,
            },
            southwest: {
              lat: 0,
              lng: 0,
            },
          },
        },
      };
      const pathPayload = {
        index,
        path: pathObj,
      };
      this.resetPathLocation(index);
      this.order_path.splice(pathPayload.index, pathPayload.index === 0 ? 0 : 1, pathPayload.path);
      this.setLocationInModel(index, `${place.name}`);
    },
    setLocationInModel(index, name) {
      this.locations.splice(index, 0, name);
    },
    resetPathLocation(index) {
      if (index === 0) {
        this.order_path.splice(index, 1);
      }
      this.deleteLocationInModel(index);
    },
    deleteLocationInModel(index) {
      this.locations.splice(index, 1);
    },
    createOrder() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.pick_up_time !== ''
        && this.load_weight !== ''
        && this.amount !== ''
        && this.transporter_name !== ''
        && this.container_option !== ''
        && this.termsName !== ''
        && this.billOfLandingName !== ''
      ) {
        this.doCompleteOrder();
      } else {
        this.doNotification(
          2,
          this.$t('createFreightOrder.create_order_error'),
          this.$t('createFreightOrder.provide_all'),
        );
      }
    },
    doCompleteOrder() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        cop_id: 'cop_id' in acc ? acc.cop_id : null,
        cop_user_id: 'cop_id' in acc ? acc.user_id : null,
        peer_id: 'cop_id' in acc ? null : acc.user_id,
        owner_id: this.owner_id,
        created_by: 'cop_id' in acc ? 1 : 3,
        pick_up: this.order_path[0],
        destination: this.order_path[1],
        path: this.order_path,
        pick_up_time: this.moment(this.pick_up_time).format('YYYY-MM-DD HH:mm:ss'),
        load_weight: this.load_weight,
        carrier_type: 1,
        amount: this.amount,
        currency: session[session.default].default_currency,
        return: this.container_option,
        documents: [
          {
            document_type: 2,
            document_name: this.$t('createFreightOrder.terms'),
            url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.termsName}`,
          },
          {
            document_type: 3,
            document_name: this.$t('createFreightOrder.bol'),
            url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.billOfLandingName}`,
          },
        ],
      };
      if (this.stored_documents.length > 0) {
        for (let i = 0; i < this.stored_documents.length; i++) {
          payload.documents.push(this.stored_documents[i]);
        }
      }

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order',
      };
      this.createFreightOrder(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
            workingResponse = response[0];
          }
          if (workingResponse.status) {
            this.doNotification(1, this.$t('createFreightOrder.success_freight_order'), '');
            this.backToOrders();
          } else {
            this.doNotification(
              2,
              this.$t('createFreightOrder.order_completions_failure'),
              workingResponse.message,
            );
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'message')) {
            this.doNotification(2, this.$t('createFreightOrder.order_failed'), error.message);
          } else {
            this.doNotification(
              2,
              this.$t('createFreightOrder.order_failed'),
              this.$t('createFreightOrder.order_failed_text'),
            );
          }
        },
      );
    },
    showExtraDocModal() {
      this.displayExtraDocument = true;
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
@import '../../../assets/styles/nav.css';
</style>
