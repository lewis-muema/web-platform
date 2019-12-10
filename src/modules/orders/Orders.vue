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
      >
        <div class="discounts_popup" v-if="discount_status">
          <div class="discount-status">
            <i
              v-if="!loading_status"
              slot="suffix"
              class="close el-input__icon el-icon-error"
              @click="closeDiscountPopup()"
            />
            <img
              v-if="icon_class === 'el-icon-close'"
              src="https://images.sendyit.com/web_platform/orders/Frown.svg"
              class="frown-icon-class"
            >
            <i
              v-else
              id="icon_override"
              slot="suffix"
              class="el-input__icon"
              :class="icon_class"
            />
            <p class="discounts-description">
              {{ message }}
            </p>
            <button
              v-if="!loading_status"
              class="discount-popup-dismiss"
              @click="closeDiscountPopup()"
            >
              OK
            </button>
          </div>
        </div>
        <div class="upload-popup" v-if="upload_status">
          <i
            slot="suffix"
            class="close el-input__icon el-icon-error"
            @click="closeDiscountPopup()"
          />
          <img src="https://images.sendyit.com/web_platform/orders/upload.png" class="upload-photo" />
          <p class="no-margin upload-par">Drag and drop your file or <span @click="simulateClick()">click here</span> to upload</p>
          <p class="no-margin upload-text">(We support .csv .xlsx .xml and .ods)</p>
          <input type="file" id="upload-input" accept=".xls,.xlsx,.csv,.xml" @change="attachUpload" ref="uploadbttn">
          <button @click="upload()" class="upload-csv-button" :class="uploadBtn" :disabled="uploadBtn === 'button--primary-inactive'" id="upload-button">Upload CSV</button>
        </div>
        <div class="upload-popup" v-if="success_status">
          <i
            slot="suffix"
            class="close el-input__icon el-icon-error"
            @click="closeDiscountPopup()"
          />
          <img src="https://images.sendyit.com/web_platform/orders/OrderConfirmation.svg" class="upload-photo" />
          <p class="no-margin upload-par">Your file has been uploaded, and an order as been generated!</p>
        </div>        
      </div>
      <map-component />
      <FbuChildOrders v-if="this.$route.path === '/orders/freight'" />
      <ongoing-component v-else />
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

export default {
  name: 'Orders',
  components: { MainHeader, MapComponent, OngoingComponent, FbuChildOrders },
  mixins: [RegisterStoreModule],
  data() {
    return {
      icon_class: '',
      message: '',
      loading_status: false,
      blinder_status: false,
      discount_status: false,
      upload_status: false,
      uploadButton: '',
      success_status: false,
    };
  },
  computed: {
    uploadBtn() {
      if (this.uploadButton) {
        return 'button-primary';
      }
      return 'button--primary-inactive';
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
    const session = this.$store.getters.getSession;
    if (localStorage.jwtToken && !['order_placement', 'by_pass', 'rating', 'tracking'].includes(this.$route.name) && Object.prototype.hasOwnProperty.call(session, 'admin_details')) {
      this.$router.push('/orders');
    }
  },
  methods: {
    ...mapGetters({
      getDiscountLoadingStatus: '$_orders/$_components/$_home/getDiscountLoadingStatus',
    }),
    ...mapMutations({
      clearVendorMarkers: '$_orders/clearVendorMarkers',
    }),
    rootListener() {
      this.$root.$on('Discount loading status', (arg1, arg2, arg3, arg4) => {
        this.icon_class = arg1;
        this.message = arg2;
        this.loading_status = arg3;
        this.blinder_status = arg4;
        this.discount_status = arg4;
      });
      this.$root.$on('Upload status', (arg1) => {
        this.blinder_status = arg1;
        this.upload_status = arg1;
        this.success_status = false;
      });
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
      const fileName = new Date().getTime() + this.uploadButton.name.split('.')[0].toLowerCase().replace(/\s/g, '');
      S3Client
        .uploadFile(this.uploadButton, fileName)
        .then((data) => {
          this.succesfullUpload(data);
        })
        .catch(err => console.error(err));
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
    closeDiscountPopup() {
      this.blinder_status = false;
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
</style>
