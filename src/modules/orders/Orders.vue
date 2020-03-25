<template lang="html">
  <div class="">
    <main-header />

    <div
      id="orders_container"
      class="box"
    >
      <div
        v-if="blinder_status"
        class="blinder"
        :class="countdown_status ? 'blinder-override' : ''"
      >
        <div
          v-if="upload_status"
          class="upload-popup"
        >
          <i
            slot="suffix"
            class="close el-input__icon el-icon-error"
            @click="closePopup()"
          />
          <img
            src="https://images.sendyit.com/web_platform/orders/upload.png"
            class="upload-photo"
          >
          <p class="no-margin upload-par">
            <span
              class="upload-link"
              @click="simulateClick()"
            >Click here</span> to upload
          </p>
          <p class="no-margin upload-text">
            (We support .csv .xlsx and .xml)
          </p>
          <input
            id="upload-input"
            ref="uploadbttn"
            type="file"
            accept=".xls,.xlsx,.csv,.xml"
            @change="attachUpload"
          >
          <button
            id="upload-button"
            class="upload-csv-button"
            :class="uploadBtn"
            :disabled="uploadBtn === 'button--primary-inactive inactive-1'"
            @click="upload()"
          >
            Upload CSV
          </button>
        </div>
        <div
          v-if="success_status"
          class="upload-popup"
        >
          <i
            slot="suffix"
            class="close el-input__icon el-icon-error"
            @click="closePopup()"
          />
          <img
            src="https://images.sendyit.com/web_platform/orders/OrderConfirmation.svg"
            class="upload-photo"
          >
          <p class="no-margin upload-par">
            Your file has been uploaded! An order will be generated shortly.
          </p>
        </div>
        <div
          v-if="countdown_status"
          class="countdown-popup"
        >
          <img
            class="countdown-img"
            src="https://images.sendyit.com/web_platform/orders/countdown.png"
          >
          <div class="countdown-container">
            <p class="countdown-heading">
              SENDY FREIGHT
            </p>
            <p class="countdown-par">
              LAUNCHING SOON
            </p>
            <div class="timer">
              <span class="countdown-time">
                <p class="timer-digits">{{ days }}</p>
                <p class="timer-description">DAYS</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ hours }}</p>
                <p class="timer-description">HOURS</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ minutes }}</p>
                <p class="timer-description">MINUTES</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ seconds }}</p>
                <p class="timer-description">SECONDS</p>
              </span>
            </div>
          </div>
        </div>
      </div>
      <map-component />
      <FbuChildOrders v-if="this.$route.name === 'freight_order_placement'" />
      <ongoing-component v-if="this.$route.name !== 'freight_order_tracking' && this.$route.name !== 'freight_order_placement'" />
      <NPSFooter v-if="!nps_status" />
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="cancel-pop-up">
          <el-dialog
            :visible.sync="updateCrmData"
            width="30%"
            class="updateCrmDialog"
            :before-close="handleClose"
            :modal-append-to-body="false"
          >
            <div class="finish-setup-outer">
              <p class="crm-setup">
                Finish account set up
              </p>
              <div class="">
                <div class="">
                  <label class="final-label">Does your business file VAT returns? (optional)</label>
                  <div
                    class="final-upper-padding"
                  >
                    <el-select
                      v-model="tax_compliance"
                      placeholder="Select"
                      class="compliance-select-final"
                    >
                      <el-option
                        v-for="item in taxOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </div>
                </div>

                <div
                  v-if="tax_compliance"
                  class="final-upper-padding"
                >
                  <label class="final-label">Enter your business KRA pin</label>
                  <div
                    class="final-upper-padding"
                  >
                    <input
                      v-model="kra_pin"
                      class="input-control upgrade-final"
                      type="text"
                      name="kra_pin"
                      placeholder="KRA PIN"
                      autocomplete="on"
                    >
                    <span
                      v-show="!valid_kra_pin"
                      class="invalid-kra"
                    >
                      Please enter a valid KRA PIN
                    </span>
                  </div>
                </div>
                <div
                  class="final-upper-padding"
                >
                  <label class="final-label">
                    Select the primary vehicle you will be using for your business.
                  </label>
                  <p class="final-inner">
                    (This will not restrict you from using other vehicles)
                  </p>
                  <div
                    class="final-upper-padding"
                  >
                    <div class="vendors-final-outerline">
                      <div
                        class="vendor-final-cards"
                        :class="{ vendor_active_final: activeTab === 'mbu' }"
                        @click="selectCard('mbu',1)"
                      >
                        <img
                          class="vendor-types-final"
                          :src="getVendorIcon(1)"
                          alt=""
                        >
                      </div>
                      <div
                        class="vendor-final-cards"
                        :class="{ vendor_active_final: activeTab === 'ebu' }"
                        @click="selectCard('ebu',2)"
                      >
                        <img
                          class="vendor-types-final"
                          :src="getVendorIcon(6)"
                          alt=""
                        >
                      </div>
                      <div
                        class="vendor-final-cards"
                        :class="{ vendor_active_final: activeTab === 'fbu' }"
                        @click="selectCard('fbu',3)"
                      >
                        <img
                          class="vendor-types-final"
                          :src="getVendorIcon(25)"
                          alt=""
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="">
                  <input
                    class="button-primary final-step-submit"
                    type="submit"
                    value="Submit"
                    @click="submit"
                  >
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import S3 from 'aws-s3';
import orderStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import MapComponent from './_components/MapComponent.vue';
import OngoingComponent from './_components/OngoingComponent.vue';
import FbuChildOrders from './_components/FbuChildOrders.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';
import SessionMxn from '../../mixins/session_mixin';


export default {
  name: 'Orders',
  components: {
    MainHeader, MapComponent, OngoingComponent, FbuChildOrders, NPSFooter,
  },
  mixins: [RegisterStoreModule, NpsMixin, SessionMxn],
  data() {
    return {
      icon_class: '',
      message: '',
      loading_status: false,
      blinder_status: false,
      countdown_status: false,
      discount_status: false,
      upload_status: false,
      uploadButton: '',
      success_status: false,
      countdown: '',
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      updateCrmData: false,
      tax_compliance: '',
      kra_pin: '',
      activeTab: '',
      primary_business_unit: '',
      taxOptions: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getNPSStatus: 'getNPSStatus',
    }),
    uploadBtn() {
      if (this.uploadButton) {
        return 'button-primary';
      }
      return 'button--primary-inactive inactive-1';
    },
    valid_kra_pin() {
      const pin = this.kra_pin;

      if (pin !== '') {
        return /^[apAP]\d{9}[a-zA-Z]$/.test(pin);
      }
      return true;
    },
  },
  watch: {
    $route(to, from) {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', '');
      this.clearVendorMarkers();
    },
  },

  created() {
    this.registerOrdersStore();
    // const STORE_KEY = '$_orders';
    // this.register_store_module(STORE_KEY, orderStore);
  },
  mounted() {
    this.checkSession();
    this.rootListener();
    this.isNewCopAcc();
    this.sessionFrefill();
  },
  destroyed() {
    clearInterval(this.countdown);
    const session = this.$store.getters.getSession;
    if (localStorage.jwtToken && !['order_placement', 'by_pass', 'rating', 'tracking'].includes(this.$route.name) && Object.prototype.hasOwnProperty.call(session, 'admin_details')) {
      this.$router.push('/orders');
    }
  },
  methods: {
    ...mapMutations({
      clearVendorMarkers: '$_orders/clearVendorMarkers',
    }),
    isNewCopAcc() {
      let isSet = false;
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (session.default === 'biz') {
          if (session[session.default].primary_business_unit === 0
            || session[session.default].primary_business_unit === null) {
            isSet = true;
          }
        }
      }
      this.updateCrmData = isSet;
    },
    sessionFrefill() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (session.default === 'biz'
        && Object.prototype.hasOwnProperty.call(session[session.default], 'tax_authority_pin')) {
          console.log('type', session[session.default].tax_authority_pin);
          if (session[session.default].tax_authority_pin === null) {
            this.tax_compliance = '';
            this.kra_pin = '';
          } else if (session[session.default].tax_authority_pin !== '') {
            this.tax_compliance = true;
            this.kra_pin = session[session.default].tax_authority_pin;
          } else {
            this.tax_compliance = false;
            this.kra_pin = '';
          }
        }
      }
    },
    rootListener() {
      this.$root.$on('Upload status', (arg1) => {
        this.blinder_status = arg1;
        this.upload_status = arg1;
        this.success_status = false;
      });
      this.$root.$on('Countdown status', (arg1, arg2) => {
        this.blinder_status = arg1;
        this.countdown_status = arg1;
        clearInterval(this.countdown);
        if (arg1) {
          this.start_countdown(arg2);
        }
      });
    },
    start_countdown(time) {
      let secs = time.seconds;
      this.countdown = setInterval(() => {
        this.days = this.moment.duration(secs, 'seconds').get('days');
        this.hours = this.moment.duration(secs, 'seconds').get('hours');
        this.minutes = this.moment.duration(secs, 'seconds').get('minutes');
        this.seconds = this.moment.duration(secs, 'seconds').get('seconds');
        if (secs === 0) {
          this.blinder_status = false;
          this.countdown_status = false;
        } else {
          secs -= 1;
        }
      }, 1000);
    },
    registerOrdersStore() {
      const moduleIsRegistered = this.$store._modules.root._children.$_orders !== undefined;
      if (!moduleIsRegistered) {
        this.$store.registerModule('$_orders', orderStore);
      }
    },
    simulateClick() {
      this.$refs.uploadbttn.click();
    },
    attachUpload(event) {
      this.uploadButton = event.target.files[0];
    },
    succesfullUpload() {
      this.upload_status = false;
      this.success_status = true;
    },
    upload() {
      const config = {
        bucketName: 'sendy-freight',
        dirName: 'CSV', /* optional */
        region: 'eu-west-1',
        accessKeyId: 'AKIAWZQTKIQ27IYWPMFE',
        secretAccessKey: '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',
        s3Url: '', /* optional */
      };
      const S3Client = new S3(config);
      const fileName = `${new Date().getTime()}_${this.uploadButton.name.split('.')[0].toLowerCase().replace(/\s/g, '')}`;
      S3Client
        .uploadFile(this.uploadButton, fileName)
        .then((data) => {
          this.uploadButton = '';
          this.succesfullUpload(data);
        })
        .catch((err) => {
          this.doNotification(2, 'Failed to upload file', 'Please check your connection and try again');
        });
    },
    checkSession() {
      const session = this.$store.getters.getSession;
      const sessionData = Object.keys(session).length;
      if (sessionData === 0) {
        const notification = {
          title: 'Your session has expired!',
          level: 2,
          message: 'You will be redirected to the login page within 5 seconds.',
        };
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);
        setTimeout(() => {
          localStorage.removeItem('_sessionSnack');
          localStorage.removeItem('jwtToken');
          this.$router.replace({ name: 'sign_in' });
        }, 5000);
      }
    },
    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },
    closePopup() {
      this.blinder_status = false;
    },
    handleClose() {
      // Do nothing ...
    },
    selectCard(tab, code) {
      this.activeTab = tab;
      this.primary_business_unit = code;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },
    submit() {
      if (this.primary_business_unit === '') {
        this.doNotification(2, 'Final set up error !', 'Please select primary type vehicle');
      } else if ((this.tax_compliance && this.kra_pin === '') || !this.valid_kra_pin) {
        this.doNotification(2, 'Final set up error !', 'Please enter valid KRA PIN');
      } else {
        const session = this.$store.getters.getSession;
        const values = {
          cop_id: session[session.default].cop_id,
          cop_name: session[session.default].cop_name,
          cop_contact_person: session[session.default].cop_contact_person,
          cop_email: session[session.default].cop_biz_email,
          cop_phone: session[session.default].cop_biz_phone,
          tax_authority_pin: this.kra_pin,
          primary_business_unit: this.primary_business_unit,
        };

        this.$store
          .dispatch('$_orders/requestCopInfo', values)
          .then((response) => {
            if (response.status) {
              const updatedSession = session;
              updatedSession[session.default].primary_business_unit = this.primary_business_unit;
              updatedSession[session.default].tax_authority_pin = this.kra_pin;


              const newSession = JSON.stringify(updatedSession);
              this.setSession(newSession);

              const level = 1; // success
              const notification = {
                title: 'Final set up complete!',
                level,
                message: 'Details saved successfully',
              };
              this.isNewCopAcc();

              this.$store.commit('setNotification', notification);
              this.$store.commit('setNotificationStatus', true);
            } else {
              const level = 3;
              this.message = 'Something went wrong.';
              const notification = {
                title: '',
                level,
                message: this.message,
              };

              this.$store.commit('setNotification', notification);
              this.$store.commit('setNotificationStatus', true);
            }
          },
          (error) => {
            const level = 3;
            const notification = { title: '', level, message: 'Something went wrong.' }; // notification object
            this.$store.commit('setNotification', notification);
            this.$store.commit('setNotificationStatus', true);
          });
      }
    },
  },
};
</script>

<style lang="css">
@import '../../assets/styles/section_headers.css';

.module-container {
  margin: 8px;
}

.title {
  font-size: 22px;
  padding-bottom: 0px;
  border-bottom: 1px solid #ccc;
  color: #999;
  padding-top: 15px;
  margin-bottom: 30px;
}

.title__text {
  font-weight: 300;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.blinder-override {
  background: white !important;
}
.countdown-popup {
  justify-content: center;
  align-items: center;
  display: flex;
  height: inherit;
}
.countdown-img {
  width: 80vw;
  display: block;
  position: absolute;
  margin: auto;
  bottom: -100%;
  left: -100%;
  top: -100%;
  right: -100%;
}
.countdown-container {
  background: white;
  width: 30%;
  z-index: 80;
  padding: 40px;
  border-radius: 25px;
  text-align: center;
  margin-top: -50px;
}
.countdown-heading {
  font-weight: 500;
  font-size: 25px;
}
.countdown-par {
  font-size: 15px;
}
.countdown-par, .countdown-heading {
  text-align: center;
  color: #1B7FC3;
  margin: 10px;
}
.timer {
  display: flex;
  color: #1a7fc3;
}
.countdown-time {
  width: 25%;
}
.timer-digits {
  font-size: 50px;
  margin: 0;
  font-weight: 500;
  text-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
}
.timer-description {
  margin: 0px;
  font-size: 10px;
  text-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
}
.countdown-divider {
  margin-top: 10px;
  font-size: 25px;
  font-weight: 500;
  text-shadow: 0px 3px 1px rgba(0, 0, 0, 0.2);
}
.cancel-pop-up > div > div > div.el-dialog__header > button{
  display: none ;
}
.updateCrmDialog{

}
.cancel-pop-up > div > div > div.el-dialog__body{
  padding-top: 0 !important;
}
.crm-setup{
  font-size: 19px;
  color: #000000;
  font-weight: 400;
}
cancel-pop-up > div > div > div.el-dialog__header{
  padding-top: 0 !important;
}
.compliance-select-final{
  width: 100% !important;
}
.upgrade-final{
  width: 100% !important;
  margin-bottom: 2%;
}
.vendors-final-outerline{
  display: flex;
  justify-content: space-between;
  width: 89% ;
  margin-left: 2%;
  margin-top: 2%;
}
.vendor-final-cards{
  border: 1.0945px solid #D8D8D8;
  box-sizing: border-box;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  width: 31% ;
  margin-right: 7%;
}
.vendor-types-final {
  height: 43px;
  min-width: 63px;
  padding: 20%;
  cursor: pointer;
}
.vendor_active_final{
  background: #EDF8FF;
  border: 2px solid #1B7FC3;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  animation: flip-scale-down-diag-2 0.5s linear ;
}
@keyframes flip-scale-down-diag-2 {
  0% {
    transform: scale(1) rotate3d(-1, 1, 0, 0deg);
  }
  50% {
    transform: scale(0.4) rotate3d(-1, 1, 0, -90deg);
  }
  100% {
    transform: scale(1) rotate3d(-1, 1, 0, -180deg);
  }
}
.final-step-submit{
  margin-top: 6% !important;
  width: 100% !important;
}
.final-label{
 margin-bottom: 2%;
 font-size: 14px;
 font-weight: 200;
 color: #000;
}
.final-inner{
 font-size: 12px;
 color: #8F8F8F;
 margin-bottom: 0;
}
.invalid-kra {
  display: block;
  color: #f57f20;
  font-size: 14px;
}
.final-upper-padding{
  padding-top: 2%;
}
.finish-setup-outer{
  margin-left: 6%;
  margin-right: 6%;
}
</style>
