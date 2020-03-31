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
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import S3 from 'aws-s3';
import orderStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import MapComponent from './_components/MapComponent.vue';
import OngoingComponent from './_components/OngoingComponent.vue';
import FbuChildOrders from './_components/FbuChildOrders.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';


export default {
  name: 'Orders',
  components: {
    MainHeader, MapComponent, OngoingComponent, FbuChildOrders, NPSFooter,
  },
  mixins: [RegisterStoreModule, NpsMixin],
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
  },
};
</script>

<style lang="css">
@import '../../assets/styles/section_headers.css?v=1';

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
</style>
