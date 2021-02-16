/* eslint-disable max-len */ /* eslint-disable camelcase */
<template lang="html">
  <div class="">
    <main-header />

    <div
      id="orders_container"
      class="box"
    >
      <div
        v-if="activeClass > -1 && tourViewStatus && getDedicatedAccessStatus"
        class="pointer-container"
        :style="{ top: offsettop() + 'px', left: offsetleft() + 'px' }"
      >
        <div class="tour-pointer" />
        <div class="tour-actions">
          <p class="tour-title">
            {{ dedicatedTourPoints[activeClass].title }}
          </p>
          <p class="tour-description">
            {{ dedicatedTourPoints[activeClass].description }}
          </p>
          <p
            v-if="activeClass === 0 || activeClass === dedicatedTourPoints.length - 1"
            class="tour-end"
            @click="skipTour()"
          >
            End tour
          </p>
          <p
            v-if="activeClass === 1"
            class="tour-end"
            @click="selectPickup()"
          >
            NEXT
          </p>
        </div>
      </div>
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
        <div
          v-if="tour_status"
          class="tour-popup"
        >
          <p class="tour-popup-description">
            Hello! We’ve added a new feature, the open destination orders. We’d like to give you a
            quick tour of this new feature.
          </p>
          <p
            class="tour-popup-get-started"
            @click="startTour()"
          >
            Let’s get started!
          </p>
          <p
            class="tour-popup-skip"
            @click="skipTour()"
          >
            Skip tour
          </p>
        </div>
        <div
          v-if="locations_status"
          class="locations-popup"
        >
          <div class="locations-popup-title">
            <p class="locations-popup-title-text">
              Manage saved {{ waypointType }} locations
            </p>
            <i
              slot="suffix"
              class="close-variant el-input__icon el-icon-close"
              @click="hideLocationsManagement()"
            />
          </div>
          <div class="locations-popup-input">
            <font-awesome-icon
              icon="circle"
              size="xs"
              class="homeview--row__font-awesome homeview--input-bundler__img fa-icon-position-override sendy-orange"
              width="10px"
            />
            <gmap-autocomplete
              v-model="location"
              :options="map_options"
              :placeholder="`Enter a ${waypointType} location`"
              :select-first-on-enter="true"
              class="input-control homeview--input-bundler__input input-control manage-locations-input"
              @place_changed="setLocation($event)"
            />
          </div>
          <button
            :class="
              location && !locationSavingStatus
                ? 'locations-popup-button-active'
                : 'locations-popup-button-inactive'
            "
            @click="saveLocation()"
          >
            {{ locationSavingStatus ? 'Saving' : 'Save' }} Location
          </button>
          <div>
            <p class="locations-popup-saved-title">
              Saved locations
            </p>
            <div class="locations-popup-saved-list">
              <div
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="homeview--input-suggestion-rows"
                :class="activeRow === index ? 'homeview--input-suggestion-rows-active' : ''"
                @mouseover="activeRow = index"
                @mouseout="activeRow = ''"
              >
                <span class="homeview--input-suggestion-icon-holder">
                  <font-awesome-icon
                    icon="star"
                    size="xs"
                    class="homeview--input-suggestion-icon"
                    width="10px"
                  />
                </span>
                <span class="locations-popup-saved-name">
                  <span class="homeview--input-suggestion-place-name">
                    {{ suggestion.name }},
                  </span>
                  <span class="homeview--input-suggestion-address-name">
                    {{ suggestion.address }}
                  </span>
                </span>
                <span
                  class="locations-popup-saved-remove"
                  @click="removeLocation(suggestion)"
                >
                  Remove
                </span>
              </div>
              <div
                v-if="suggestions.length === 0"
                class="saved-locations-message"
              >
                No saved {{ waypointType }} locations
              </div>
            </div>
          </div>
        </div>
      </div>
      <map-component />
      <FbuChildOrders v-if="this.$route.name === 'freight_order_placement'" />
      <ongoing-component
        v-if="
          this.$route.name !== 'freight_order_tracking' &&
            this.$route.name !== 'freight_order_placement'
        "
      />
      <NPSFooter v-if="!nps_status" />
      <transition
        name="fade"
        mode="out-in"
      >
        <router-view />
      </transition>
      <transition
        v-if="showSocialMediaApprovalDialog"
        name="fade"
        mode="out-in"
      >
        <approval-dialog
          :approval-status="socialMediaApprovalStatus"
          :cop-id="copId"
        />
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
                <div v-if="updateKraSection">
                  <div class="">
                    <label
                      class="final-label"
                    >Does your business file VAT returns? (optional)</label>
                    <div class="final-upper-padding">
                      <el-select
                        v-model="tax_compliance"
                        placeholder="Select"
                        class="compliance-select-final"
                      >
                        <el-option
                          v-for="item in selectOptions"
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
                    <div class="final-upper-padding">
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

                  <div class="final-upper-padding">
                    <label class="final-label">
                      Select the primary vehicle you will be using for your business.
                    </label>
                    <p class="final-inner">
                      (This will not restrict you from using other vehicles)
                    </p>
                    <div class="final-upper-padding">
                      <div class="vendors-final-outerline">
                        <div
                          class="vendor-final-cards"
                          :class="{ vendor_active_final: activeTab === 'mbu' }"
                          @click="selectCard('mbu', 1)"
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
                          @click="selectCard('ebu', 2)"
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
                          @click="selectCard('fbu', 3)"
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
                </div>
                <div
                  v-if="updateSetIndustry"
                  class="final-upper-padding"
                >
                  <div class="final-upper-padding">
                    <label class="final-label">What industry is your business in?</label>
                    <div class="final-upper-padding">
                      <el-select
                        v-model="industry_type"
                        placeholder="Select"
                        class="compliance-select-final"
                      >
                        <el-option
                          v-for="item in industriesOptions"
                          :key="item.industry_id"
                          :label="item.name"
                          :value="item.industry_id"
                        />
                      </el-select>
                    </div>
                  </div>

                  <div class="final-upper-padding">
                    <label class="final-label">Is social media your main source of clients?</label>
                    <div class="final-upper-padding">
                      <el-select
                        v-model="social_media_option"
                        placeholder="Select"
                        class="compliance-select-final"
                      >
                        <el-option
                          v-for="item in selectOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </div>
                  </div>

                  <div
                    v-if="social_media_option"
                    class="final-upper-padding"
                  >
                    <label class="final-label">What is your business instragram handle?</label>
                    <div class="final-upper-padding">
                      <input
                        v-model="ig_media_handle"
                        class="input-control upgrade-final"
                        type="text"
                        placeholder="@mystore"
                        autocomplete="on"
                      >
                    </div>
                  </div>

                  <div
                    v-if="social_media_option"
                    class="final-upper-padding"
                  >
                    <label
                      class="final-label"
                    >What is the link to your business facebook page?</label>
                    <div class="final-upper-padding">
                      <input
                        v-model="facebook_media_handle"
                        class="input-control upgrade-final"
                        type="text"
                        placeholder="www.facebook.com/pages/mystore"
                        autocomplete="on"
                      >
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
import { mapMutations, mapGetters, mapActions } from 'vuex';
import S3 from 'aws-s3';
import orderStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import MapComponent from './_components/MapComponent.vue';
import OngoingComponent from './_components/OngoingComponent.vue';
import ApprovalDialog from './_components/social_media_business/ApprovalDialog.vue';
import FbuChildOrders from './_components/FbuChildOrders.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';

let interval = '';

export default {
  name: 'Orders',
  components: {
    MainHeader,
    MapComponent,
    OngoingComponent,
    FbuChildOrders,
    ApprovalDialog,
    NPSFooter,
  },
  mixins: [RegisterStoreModule, NpsMixin, SessionMxn, NotificationMxn],
  data() {
    return {
      showSocialMediaApprovalDialog: false,
      socialMediaApprovalStatus: 0,
      copId: 0,
      icon_class: '',
      message: '',
      loading_status: false,
      blinder_status: false,
      countdown_status: false,
      discount_status: false,
      upload_status: false,
      tour_status: false,
      locations_status: false,
      location: '',
      uploadButton: '',
      success_status: false,
      countdown: '',
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      updateCrmData: false,
      updateKraSection: false,
      updateSetIndustry: false,
      tax_compliance: '',
      social_media_option: '',
      ig_media_handle: '',
      facebook_media_handle: '',
      industry_type: '',
      kra_pin: '',
      activeTab: '',
      primary_business_unit: '',
      activeRow: 0,
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
      industriesOptions: [],
      selectOptions: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
      activeClass: -1,
      waypoint_type: '',
      locationSavingStatus: false,
      dedicatedTourPoints: [
        {
          title: 'Order Type: Dedicated vehicles',
          description:
            'Get a truck for a whole day to do all your deliveries. We handle your logistics while you focus on your core business',
          class: '.tour-pointer-1',
        },
        {
          title: 'Order Type: No Destination',
          description:
            'With no destination vehicles you can skip adding a destination or add a general region to deliver in and the driver will check off each delivery stop. Enter the pick up location input to continue',
          class: '.tour-pointer-2',
        },
        {
          title: 'Vehicle Type',
          description:
            'Select multiple vehicle types and multiple vehicles of the same vehicle type',
          class: '.tour-pointer-3',
        },
        {
          title: 'Select Vehicle type',
          description: 'Select open or closed vehicles for pick ups and bikes',
          class: '.tour-pointer-4',
        },
        {
          title: 'Schedule',
          description: 'Select the date for your deliveries',
          class: '.tour-pointer-5',
        },
        {
          title: 'Schedule: Time',
          description: 'Select the time-frame you’d like your deliveries done',
          class: '.tour-pointer-6',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getNPSStatus: 'getNPSStatus',
      getDedicatedAccessStatus: 'getDedicatedAccessStatus',
      get_session: 'getSession',
      getSuggestions: '$_orders/getSuggestions',
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
    suggestions() {
      const rows = [];
      this.getSuggestions.forEach((row) => {
        if (row.location_type === 'saved' && row.waypoint_type === this.waypoint_type) {
          rows.push(row);
        }
      });
      return rows;
    },
    waypointType() {
      return this.waypoint_type === 'PICKUP' ? 'pick up' : 'drop off';
    },
  },
  watch: {
    $route(to, from) {
      this.$store.commit('$_orders/removePolyline', []);
      this.$store.commit('$_orders/removeMarkers', []);
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', '');
      this.clearVendorMarkers();
      this.checkTourStatus();
      if (
        to.path === '/orders/dedicated/no-destination'
        && this.tourViewStatus
        && this.getDedicatedAccessStatus
      ) {
        this.activeClass = -1;
        setTimeout(() => {
          this.activeClass = 1;
        }, 1000);
      }
      if (to.path === '/orders' && this.tourViewStatus && this.getDedicatedAccessStatus) {
        this.activeClass = -1;
        setTimeout(() => {
          this.activeClass = 0;
        }, 1000);
      }
    },
    activeClass() {
      clearInterval(interval);
      if (this.activeClass > 2 && this.tourViewStatus && this.getDedicatedAccessStatus) {
        interval = setInterval(() => {
          this.offset();
        }, 10);
      }
    },
    get_session: {
      handler(val) {
        if (val.default === 'biz') {
          this.setDedicatedAccessStatus(true);
        } else {
          this.setDedicatedAccessStatus(false);
          this.redirectToOrders();
        }
      },
      deep: true,
    },
  },

  created() {
    this.registerOrdersStore();
    // const STORE_KEY = '$_orders';
    // this.register_store_module(STORE_KEY, orderStore);
    this.$nextTick(() => {
      this.checkTourStatus();
      if (this.$route.path === '/orders' && this.tourViewStatus && this.getDedicatedAccessStatus) {
        this.blinder_status = true;
        this.tour_status = true;
      }
      if (
        this.$route.path === '/orders/dedicated/no-destination'
        && this.tourViewStatus
        && this.getDedicatedAccessStatus
      ) {
        setTimeout(() => {
          this.activeClass = 1;
        }, 1000);
      }
    });
  },
  mounted() {
    this.checkSession();
    this.rootListener();
    this.isNewCopAcc();
    this.sessionFrefill();
    this.triggerFetchsuggestions();
    const session = this.$store.getters.getSession;
    if (session.default === 'biz') {
      this.setDedicatedAccessStatus(true);
      this.checkSocialMediaApproval();
    }
    this.redirectToOrders();
  },
  destroyed() {
    clearInterval(this.countdown);
    const session = this.$store.getters.getSession;
    if (
      localStorage.jwtToken
      && !['order_placement', 'by_pass', 'rating', 'tracking'].includes(this.$route.name)
      && Object.prototype.hasOwnProperty.call(session, 'admin_details')
    ) {
      this.$router.push('/orders');
    }
  },
  methods: {
    ...mapActions({
      requestIndustries: '$_orders/requestIndustries',
    }),
    ...mapMutations({
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      setDedicatedAccessStatus: 'setDedicatedAccessStatus',
    }),
    ...mapActions({
      fetchSuggestions: '$_orders/fetchSuggestions',
      saveSuggestions: '$_orders/saveSuggestions',
      removeSuggestions: '$_orders/removeSuggestions',
    }),
    checkSocialMediaApproval() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (session.default === 'biz') {
          const bizSession = session[session.default];
          this.copId = bizSession.cop_id;
          const {
            verified_social_media_business,
            social_media_business_approval_status,
          } = bizSession;
          if (social_media_business_approval_status === 0) {
            this.showSocialMediaApprovalDialog = true;
            this.socialMediaApprovalStatus = verified_social_media_business;
          }
        }
      }
    },
    isNewCopAcc() {
      let isSet = false;
      let kraSection = false;
      let setIndustry = false;
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (session.default === 'biz') {
          // Admin

          if (session[session.default].user_type === 2) {
            if (
              session[session.default].primary_business_unit === 0
              || session[session.default].primary_business_unit === null
            ) {
              isSet = true;
              kraSection = true;
            }
            if (session[session.default].industry_id === null) {
              isSet = true;
              setIndustry = true;
              this.fetchIndustries();
            }
          }
        }
      }

      this.updateCrmData = isSet;
      this.updateKraSection = kraSection;
      this.updateSetIndustry = setIndustry;
    },
    fetchIndustries() {
      const payload = {
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'industries?isActive=1',
      };
      this.requestIndustries(payload).then(
        (response) => {
          this.industriesOptions = response;
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          this.industriesOptions = [];
        },
      );
    },
    checkTourStatus() {
      if (
        process.browser
        && Object.prototype.hasOwnProperty.call(localStorage, 'tourViewStatus')
        && JSON.parse(localStorage.tourViewStatus)
      ) {
        this.tourViewStatus = false;
      } else {
        this.tourViewStatus = true;
      }
    },
    redirectToOrders() {
      if (
        (this.$route.path === '/orders/dedicated/no-destination'
          || this.$route.path === '/orders/dedicated/multi-destination')
        && !this.getDedicatedAccessStatus
      ) {
        this.$router.push('/orders');
      }
    },
    startTour() {
      localStorage.tourViewStatus = false;
      this.activeClass = 0;
      this.blinder_status = false;
      this.tour_status = false;
      this.checkTourStatus();
    },
    skipTour() {
      localStorage.tourViewStatus = true;
      this.blinder_status = false;
      this.tour_status = false;
      this.checkTourStatus();
      this.activeClass = -1;
    },
    offset() {
      const tourClass = this.activeClass > -1
        ? document.querySelector(this.dedicatedTourPoints[this.activeClass].class)
        : null;
      if (tourClass === null) {
        this.activeClass = -1;
      }
      document.querySelector('.pointer-container').style.top = `${
        tourClass === null
          ? 0
          : tourClass.getBoundingClientRect().top
            - document.querySelector('#orders_container').getBoundingClientRect().top
      }px`;
      document.querySelector('.pointer-container').style.left = `${
        tourClass === null
          ? 0
          : tourClass.getBoundingClientRect().left
            - document.querySelector('#orders_container').getBoundingClientRect().left
      }px`;
    },
    offsettop() {
      const tourClass = this.activeClass > -1
        ? document.querySelector(this.dedicatedTourPoints[this.activeClass].class)
        : null;
      if (tourClass === null) {
        this.activeClass = -1;
      }
      return tourClass === null
        ? 0
        : tourClass.getBoundingClientRect().top
            - document.querySelector('#orders_container').getBoundingClientRect().top;
    },
    offsetleft() {
      const tourClass = this.activeClass > -1
        ? document.querySelector(this.dedicatedTourPoints[this.activeClass].class)
        : null;
      if (tourClass === null) {
        this.activeClass = -1;
      }
      return tourClass === null
        ? 0
        : tourClass.getBoundingClientRect().left
            - document.querySelector('#orders_container').getBoundingClientRect().left;
    },
    triggerFocus(element) {
      const eventType = 'onfocusin' in element ? 'focusin' : 'focus';
      const bubbles = 'onfocusin' in element;
      let event;

      if ('createEvent' in document) {
        event = document.createEvent('Event');
        event.initEvent(eventType, bubbles, true);
      } else if ('Event' in window) {
        event = new Event(eventType, { bubbles, cancelable: true });
      }

      element.focus();
      element.dispatchEvent(event);
    },
    selectPickup() {
      document.querySelector('#homeview--pick-up-location-input').click();
      this.triggerFocus(document.querySelector('#homeview--pick-up-location-input'));
    },
    sessionFrefill() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (
          session.default === 'biz'
          && Object.prototype.hasOwnProperty.call(session[session.default], 'tax_authority_pin')
        ) {
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
      this.$root.$on('tour class', (arg1, arg2) => {
        if (this.tourViewStatus && this.getDedicatedAccessStatus) {
          if (this.activeClass === 5) {
            clearInterval(interval);
          }
          if (this.activeClass === 0) {
            this.activeClass = -1;
          }
          setTimeout(() => {
            this.activeClass = arg1;
          }, arg2);
        }
      });
      this.$root.$on('tour class hidden', () => {
        if (this.tourViewStatus && this.getDedicatedAccessStatus) {
          if (this.activeClass === 5) {
            this.skipTour();
          }
          this.activeClass = -1;
        }
      });
      this.$root.$on('Countdown status', (arg1, arg2) => {
        this.blinder_status = arg1;
        this.countdown_status = arg1;
        clearInterval(this.countdown);
        if (arg1) {
          this.start_countdown(arg2);
        }
      });
      this.$root.$on('Locations status', (arg1, arg2) => {
        this.blinder_status = arg1;
        this.locations_status = arg1;
        this.waypoint_type = arg2;
      });
    },
    hideLocationsManagement() {
      this.blinder_status = false;
      this.locations_status = false;
      this.waypoint_type = '';
    },
    saveLocation() {
      const session = this.$store.getters.getSession;
      const userId = session[session.default].user_id;
      const copId = session.default === 'biz' ? session[session.default].cop_id : 0;
      const countryIndex = this.suggestion.address_components.findIndex(countryCode => countryCode.types.includes('country'));
      const cityIndex = this.suggestion.address_components.findIndex(city => city.types.includes('administrative_area_level_1'));
      const data = {
        user_id: userId,
        cop_id: copId,
        location: {
          name: this.suggestion.name,
          waypoint_type: this.waypoint_type,
          coordinates: `${this.suggestion.geometry.location.lat()},${this.suggestion.geometry.location.lng()}`,
          waypoint_details_status: true,
          type: 'coordinates',
          country_code: this.suggestion.address_components[countryIndex].short_name,
          city_name: this.suggestion.address_components[cityIndex].short_name,
          locality: {
            name: this.suggestion.vicinity,
            coordinates: `${this.suggestion.geometry.location.lat()},${this.suggestion.geometry.location.lng()}`,
          },
          more: {
            Address: this.suggestion.formatted_address,
            Estate: '',
            FlatName: '',
            HouseDoor: '',
            Label: '',
            Otherdescription: '',
            Road: '',
            Typed: '',
            Vicinity: '',
            landmark: '',
            place_idcustom: this.suggestion.place_id,
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
        },
      };
      this.locationSavingStatus = true;
      this.saveSuggestions(data).then((response) => {
        if (response.status) {
          const notification = {
            title: '',
            level: 1,
            message: response.message,
          };
          this.displayNotification(notification);
          this.location = '';
          this.suggestion = '';
          this.triggerFetchsuggestions();
        } else {
          const notification = {
            title: '',
            level: 3,
            message:
              response.message === 'Location limit exceeded'
                ? `Limit allowed for saved ${this.waypointType} locations has been reached`
                : response.message,
          };
          this.displayNotification(notification);
        }
        this.locationSavingStatus = false;
      });
    },
    removeLocation(suggestion) {
      const session = this.$store.getters.getSession;
      const userId = session[session.default].user_id;
      const copId = session.default === 'biz' ? session[session.default].cop_id : 0;
      const data = {
        user_id: userId,
        cop_id: copId,
        location_id: suggestion.location_id,
      };
      this.removeSuggestions(data).then((response) => {
        if (response.status) {
          const notification = {
            title: '',
            level: 1,
            message: response.message,
          };
          this.displayNotification(notification);
          this.location = '';
          this.suggestion = '';
          this.triggerFetchsuggestions();
        } else {
          const notification = {
            title: '',
            level: 3,
            message: response.message,
          };
          this.displayNotification(notification);
        }
      });
    },
    triggerFetchsuggestions() {
      const session = this.$store.getters.getSession;
      const userId = session[session.default].user_id;
      const copId = session.default === 'biz' ? session[session.default].cop_id : 0;
      this.fetchSuggestions({
        user_id: userId,
        cop_id: copId,
        type: 1,
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
        dirName: 'CSV' /* optional */,
        region: 'eu-west-1',
        accessKeyId: 'AKIAWZQTKIQ27IYWPMFE',
        secretAccessKey: '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',
        s3Url: '' /* optional */,
      };
      const S3Client = new S3(config);
      const fileName = `${new Date().getTime()}_${this.uploadButton.name
        .split('.')[0]
        .toLowerCase()
        .replace(/\s/g, '')}`;
      S3Client.uploadFile(this.uploadButton, fileName)
        .then((data) => {
          this.uploadButton = '';
          this.succesfullUpload(data);
        })
        .catch((err) => {
          this.doNotification(
            2,
            'Failed to upload file',
            'Please check your connection and try again',
          );
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
        this.displayNotification(notification);
        setTimeout(() => {
          localStorage.removeItem('_sessionSnack');
          localStorage.removeItem('jwtToken');
          this.$router.replace({ name: 'sign_in' });
        }, 5000);
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
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
    handleKraAndIndustry() {
      if (this.primary_business_unit === '') {
        this.doNotification(2, 'Final set up error !', 'Please select primary type vehicle');
      } else if ((this.tax_compliance && this.kra_pin === '') || !this.valid_kra_pin) {
        this.doNotification(2, 'Final set up error !', 'Please enter valid KRA PIN');
      } else if (this.industry_type === '' || this.social_media_option === '') {
        this.doNotification(2, 'Final set up error !', 'Please select industry preference');
      } else if (
        this.social_media_option
        && (this.ig_media_handle === '' && this.facebook_media_handle === '')
      ) {
        this.doNotification(2, 'Final set up error !', 'Please provide social media handle');
      } else {
        const session = this.$store.getters.getSession;
        const payload = {
          cop_id: session[session.default].cop_id,
          cop_name: session[session.default].cop_name,
          cop_contact_person: session[session.default].cop_contact_person,
          cop_email: session[session.default].cop_biz_email,
          cop_phone: session[session.default].cop_biz_phone,
          tax_authority_pin: this.kra_pin,
          primary_business_unit: this.primary_business_unit,
          social_media_business: this.social_media_option,
          industry_id: this.industry_type,
        };
        if (this.ig_media_handle !== '') {
          payload.instagram_handle = this.ig_media_handle;
        }
        if (this.facebook_media_handle !== '') {
          payload.facebook_link = this.facebook_media_handle;
        }
        this.finalSetUp(payload);
      }
    },
    handleKraSetUp() {
      if (this.primary_business_unit === '') {
        this.doNotification(2, 'Final set up error !', 'Please select primary type vehicle');
      } else if ((this.tax_compliance && this.kra_pin === '') || !this.valid_kra_pin) {
        this.doNotification(2, 'Final set up error !', 'Please enter valid KRA PIN');
      } else {
        const session = this.$store.getters.getSession;
        const payload = {
          cop_id: session[session.default].cop_id,
          cop_name: session[session.default].cop_name,
          cop_contact_person: session[session.default].cop_contact_person,
          cop_email: session[session.default].cop_biz_email,
          cop_phone: session[session.default].cop_biz_phone,
          tax_authority_pin: this.kra_pin,
          primary_business_unit: this.primary_business_unit,
        };
        this.finalSetUp(payload);
      }
    },
    handleIndustrySetUp() {
      if (this.industry_type === '' || this.social_media_option === '') {
        this.doNotification(2, 'Final set up error !', 'Please select industry preference');
      } else if (
        this.social_media_option
        && (this.ig_media_handle === '' && this.facebook_media_handle === '')
      ) {
        this.doNotification(2, 'Final set up error !', 'Please provide social media handle');
      } else {
        const session = this.$store.getters.getSession;
        const payload = {
          cop_id: session[session.default].cop_id,
          cop_name: session[session.default].cop_name,
          cop_contact_person: session[session.default].cop_contact_person,
          cop_email: session[session.default].cop_biz_email,
          cop_phone: session[session.default].cop_biz_phone,
          social_media_business: this.social_media_option,
          industry_id: this.industry_type,
        };
        if (this.ig_media_handle !== '') {
          payload.instagram_handle = this.ig_media_handle;
        }
        if (this.facebook_media_handle !== '') {
          payload.facebook_link = this.facebook_media_handle;
        }
        this.finalSetUp(payload);
      }
    },
    finalSetUp(payload) {
      const session = this.$store.getters.getSession;

      this.$store.dispatch('$_orders/requestCopInfo', payload).then(
        (response) => {
          if (response.status) {
            const updatedSession = session;
            if (this.updateKraSection && this.updateSetIndustry) {
              updatedSession[session.default].primary_business_unit = this.primary_business_unit;
              updatedSession[session.default].tax_authority_pin = this.kra_pin;
              updatedSession[session.default].industry_id = this.industry_type;
            } else if (this.updateKraSection) {
              updatedSession[session.default].primary_business_unit = this.primary_business_unit;
              updatedSession[session.default].tax_authority_pin = this.kra_pin;
            } else if (this.updateSetIndustry) {
              updatedSession[session.default].industry_id = this.industry_type;
            }

            if (this.social_media_option) {
              this.showSocialMediaApprovalDialog = true;
            }

            const newSession = JSON.stringify(updatedSession);
            this.setSession(newSession);

            const level = 1; // success
            const notification = {
              title: 'Final set up complete!',
              level,
              message: 'Details saved successfully',
            };
            this.isNewCopAcc();
            this.displayNotification(notification);
          } else {
            const level = 3;
            this.message = 'Something went wrong.';
            const notification = {
              title: '',
              level,
              message: this.message,
            };
            this.displayNotification(notification);
          }
        },
        (error) => {
          const level = 3;
          const notification = { title: '', level, message: 'Something went wrong.' }; // notification object
          this.displayNotification(notification);
        },
      );
    },
    submit() {
      if (this.updateKraSection && this.updateSetIndustry) {
        this.handleKraAndIndustry();
      } else if (this.updateKraSection) {
        this.handleKraSetUp();
      } else if (this.updateSetIndustry) {
        this.handleIndustrySetUp();
      }
    },
    setLocation(place) {
      this.location = document.querySelector('.manage-locations-input').value;
      this.suggestion = place;
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
  color: #EE7D00;
  font-size: 14px;
}
.final-upper-padding{
  padding-top: 2%;
}
.finish-setup-outer{
  margin-left: 6%;
  margin-right: 6%;
}
.tour-pointer {
  width: 20px;
    height: 20px;
    background: #F44B54;
    border-radius: 20px;
    z-index: 2000;
    position: relative;
    box-shadow: 0px 0px 12px 2px rgba(253, 1, 1, 0.77);
}
.pointer-container {
  position: relative;
  display: flex;
  width: max-content;
  margin-top: -10px;
  margin-left: -10px;
}
.tour-actions {
  z-index: 2000;
  height: max-content;
  background: white;
  margin-left: 10px;
  box-shadow: 0px 0px 12px 2px rgba(142, 140, 140, 0.55);
  border-radius: 5px;
  padding: 10px 15px 10px 20px;
  font-size: 12px;
  width: max-content;
}
.tour-description {
  width: 200px;
  font-size: 13px;
}
.tour-title {
  color: #F28226;
  font-size: 14px;
}
.tour-popup-description {
  font-size: 15px;
  font-weight: 400;
  padding: 10px 30px 10px 30px;
}
.tour-popup-get-started {
  font-size: 15px;
  font-weight: 500;
  color: #007FFF;
  cursor: pointer;
  margin: 20px 0px 10px 0px;
}
.tour-popup-skip {
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin: 10px 0px 20px 0px;
}
.tour-end {
  font-weight: 500;
  color: #007FFF;
  cursor: pointer;
}
.saved-locations-message {
  font-size: 14px;
  margin: 10px;
}
</style>
