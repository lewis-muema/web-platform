<template lang="html">
  <div class="create-order-main">
    <div
      class="back-order-btn"
      @click="backToOrders()"
    >
      <i class="el-icon-arrow-left view-transporter-info" /> Back
    </div>
    <div class="create-order-upper">
      Create order
    </div>
    <div class="transporters-container transporters-main--inner">
      <div class="transporters-content">
        <div class="create-order-section">
          <div class="">
            <p class="freight-input--label">
              Pick up location
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
              Destination
            </p>
            <gmap-autocomplete
              v-model="locations[1]"
              :options="map_options"
              placeholder="Enter a destination location"
              :select-first-on-enter="true"
              class="input-control"
              @place_changed="setLocation($event, 1)"
            />
          </div>

          <div class="">
            <p class="freight-input--label">
              Pick up time
            </p>
            <div class="block">
              <el-date-picker
                v-model="pick_up_time"
                class="transporters-pickup-time"
                type="datetime"
                format="dd-MM-yyyy h:mm a"
                placeholder="As soon as possible"
                prefix-icon="el-icon-date"
                :default-time="default_value"
              />
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              What is the weight of the load?
            </p>
            <div>
              <input
                v-model.trim="load_weight"
                class="input-control freight-create-load-weight"
                type="number"
                placeholder=""
                autocomplete="on"
              >
              <span class="freight-tonage-value-text">Tonnes</span>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              What is the cost for this order?
            </p>
            <div class="freight-input">
              <div class="freight-input-icon">
                <span>KES</span>
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
              Select the transporter to assign this order
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
                placeholder="Search by name"
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
                No Details Found
              </span>
            </ul>
          </div>

          <div class="">
            <p class="freight-input--label">
              Will the container be returned?
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
              Upload the terms of the delivery
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
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
                <div
                  v-if="termsName !== '' && terms_text === 'Change'"
                  class="underate"
                >
                  <span class="document-upload-label">
                    Terms of delivery uploaded successfully .
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label upload-landing">
              Upload the bill of lading
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
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
                <div v-if="billOfLandingName !== '' && landing_text === 'Change'">
                  <span class="document-upload-label">
                    Bill of lading successfully .
                  </span>
                </div>
              </div>
            </div>
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

Vue.prototype.$http = Axios;

let s3 = '';

export default {
  name: 'CreateFreightOrder',
  extends: VueTypeahead,
  mixins: [NotificationMxn],
  data() {
    return {
      submit_text: 'Create Order',
      quote_text: 'Request for quote',
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
      landing_text: 'Change',
      billOfLandingName: '',
      termsData: {},
      terms_text: 'Change',
      termsName: '',
      ownerDisplay: '',
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
  },
  created() {
    this.initiateS3();
  },
  methods: {
    ...mapActions({
      createFreightOrder: '$_freight/createFreightOrder',
    }),
    trigger() {
      this.transporter_name = '';
      this.hideInput = 'hide';
      this.hide = '';
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
    backToOrders() {
      this.$router.push('/freight/orders');
    },
    beforeLandingUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(2, 'Document upload error !', 'Document must be in PDF format');
      }
      return isPdf;
    },
    beforeTermsUpload(file) {
      const isPdf = file.type === 'application/pdf';

      if (!isPdf) {
        this.doNotification(2, 'Document upload error !', 'Document must be in PDF format');
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
    handleRemoveLanding() {
      this.billOfLandingName = '';
      this.billOfLandingData = {};
      this.landing_text = 'Change';
    },
    handleRemoveTerms() {
      this.termsName = '';
      this.termsData = {};
      this.terms_text = 'Change';
    },
    uploadBillOfLanding() {
      if (Object.keys(this.billOfLandingData).length === 0) {
        this.doNotification(2, 'Kindly upload bill of landing document', '');
      } else {
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
              const imageId = 'ladingImagePreview';
              const src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.landing_text = 'Change';
            }
            // eslint-disable-next-line comma-dangle
          }
        );
      }
    },
    uploadTermsAndCondition() {
      if (Object.keys(this.termsData).length === 0) {
        this.doNotification(2, 'Kindly upload terms and condition document', '');
      } else {
        this.terms_text = 'Uploading ...';
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
              this.terms_text = 'Change';
              console.log('There was an error uploading your document: ', err.message);
            } else {
              const imageId = 'imagePreview';
              const src = 'https://images.sendyit.com/web_platform/freight/complete.svg';
              $(`#${imageId}`).attr('src', src);
              this.terms_text = 'Change';
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
        this.doNotification(2, 'Create order error !', 'Kindly provide all values');
      }
    },
    doCompleteOrder() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        cop_user_id: 'cop_id' in acc ? acc.user_id : 0,
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
            document_name: 'Terms of delivery',
            url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.termsName}`,
          },
          {
            document_type: 3,
            document_name: 'Bill Of Lading',
            url: `https://sendy-partner-docs.s3-eu-west-1.amazonaws.com/${this.billOfLandingName}`,
          },
        ],
      };
      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/order',
      };
      this.createFreightOrder(fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(1, 'Successfully placed freight order', '');
            this.backToOrders();
          } else {
            this.doNotification(2, 'Order Completion Failure', response.message);
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'message')) {
            this.doNotification(2, 'Order completion failed', error.message);
          } else {
            this.doNotification(
              2,
              'Order completion failed',
              'Order completion failed. Please check your internet connection and try again.',
            );
          }
        },
      );
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
@import '../../../assets/styles/nav.css?v=1';
.view-transporter-info{
  cursor :pointer ;
}
.create-order-submit{
  width: 100%;
  margin-top: 4%;
}
.create-order-upper{
  color: #000000;
  margin-left: 7%;
}
.create-order-section{
   padding-top: 1% !important;
  -webkit-box-flex: 1;
   flex: 1;
   -webkit-box-orient: vertical;
   flex-direction: column;
   display: flex;
   -webkit-box-direction: normal;
   margin-right: 2%;
   padding: 2rem;
}
.create-order-main{
   border-radius: 4px;
   font-family: 'Helvetica Nueu', 'Helvetica', 'Arial', 'sans-serif';
   width: 44% !important;
   padding-bottom: 0;
   margin-top: 0;
   padding-top: 3%;
}
.back-order-btn{
   margin-left: 7%;
   font-size: 13px;
   margin-bottom: 6%;
   cursor: pointer;
}
.freight-input {
  width: 100%;
  display: flex;
  align-items: stretch;
}
.freight-input>div {
  display: table-cell;
  border: 1px solid #ddd;
  vertical-align: middle;
}
.freight-input-icon {
  padding: 3%;
  border-radius: .25rem 0 0 .25rem;
  background: #eee;
  color: #777;
  width: 11%;
  text-align: center;
  font-size: 12px;
}
.freight-input-area {
  width: 90%;
  border-radius: 0 .25rem .25rem 0;
}
.freight-selector{
  border: 0px solid #dcdfe6;
}
.freight-create-load-weight{
  width: 80% !important;
  font-style: italic;
}
.freight-tonage-value-text{
  color: #555 !important;
  padding-left: 36px;
  width: 20% !important;
  font-size: 12px;
  font-style: italic;
}
.drag-image > div > div:nth-child(1) > div > input {
  display: none;
}
.document-image> div > div:nth-child(1) > div > input {
  display: none;
}
.download-uploaded-img {
  height: 200px;
}
.el-icon-upload {
  font-size: 15px!important;
  margin: 0!important;
  line-height: 0!important;
}
.upload_image {
  width: 100%;
  height: 132px;
  margin-top: 2%;
  margin-bottom: 2%;
}
.document-upload-label {
  font-style: italic;
  font-size: 14px;
  color: #f18327;
  font-weight: 700;
  cursor: pointer;
}
.upload-demo{
  font-size: 13px !important;
}
.upload-landing{
  margin-top: 12%;
}
.transporter-input-name{
  pointer-events: none;
}
.hide {
  display: none!important;
}

li.suggestions_solr {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li.suggestions_solr:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li.suggestions_solr:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
</style>
