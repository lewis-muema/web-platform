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
            {{ $t('general.end_tour') }}
          </p>
          <p
            v-if="activeClass === 1"
            class="tour-end"
            @click="selectPickup()"
          >
            {{ $t('general.next') }}
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
            >{{ $t('general.click_here') }}</span>
            {{ $t('general.to_upload') }}
          </p>
          <p class="no-margin upload-text">
            ({{ $t('general.we_support_file_formats') }})
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
            {{ $t('general.upload_csv') }}
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
            {{ $t('general.files_uploaded') }}
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
              {{ $t('general.sendy_freight') }}
            </p>
            <p class="countdown-par">
              {{ $t('general.launching_soon') }}
            </p>
            <div class="timer">
              <span class="countdown-time">
                <p class="timer-digits">{{ days }}</p>
                <p class="timer-description">{{ $t('general.days') }}</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ hours }}</p>
                <p class="timer-description">{{ $t('general.hours') }}</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ minutes }}</p>
                <p class="timer-description">{{ $t('general.minutes') }}</p>
              </span>
              <span class="countdown-divider">:</span>
              <span class="countdown-time">
                <p class="timer-digits">{{ seconds }}</p>
                <p class="timer-description">{{ $t('general.seconds') }}</p>
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="tour_status"
          class="tour-popup"
        >
          <p class="tour-popup-description">
            {{ $t('general.new_feature_added') }}
          </p>
          <p
            class="tour-popup-get-started"
            @click="startTour()"
          >
            {{ $t('general.get_started') }}
          </p>
          <p
            class="tour-popup-skip"
            @click="skipTour()"
          >
            {{ $t('general.skip_tour') }}
          </p>
        </div>
        <div
          v-if="locations_status"
          class="locations-popup"
        >
          <div class="locations-popup-title">
            <p class="locations-popup-title-text">
              {{ $t('general.manage_saved_locations', { waypointType: waypointType }) }}
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
              :placeholder="
                $t('general.enter_waypoint_type_location', { waypointType: waypointType })
              "
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
            {{ locationSavingStatus ? `${$t('general.saving')}` : `${$t('general.save')}` }}
            {{ $t('general.location_capital') }}
          </button>
          <div>
            <p class="locations-popup-saved-title">
              {{ $t('general.saved_locations') }}
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
                  {{ $t('general.remove') }}
                </span>
              </div>
              <div
                v-if="suggestions.length === 0"
                class="saved-locations-message"
              >
                {{ $t('general.no_saved_locations', { waypointType: waypointType }) }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="pairing_status"
          class="pairing-popup"
        >
          <div class="pair-vehicles-popup">
            <div class="pair-vehicles-title">
              {{ $t('general.pair_with_driver') }}
              <i
                slot="suffix"
                class="close el-input__icon el-icon-error"
                @click="closePairingPopup()"
              />
            </div>
            <div class="pair-vehicles-title-description">
              {{ $t('general.enter_phone_number_vehicle_to_pair') }}
            </div>
            <div class="pair-vehicles-list">
              <div
                v-for="(activeVendor, index) in pairing_data"
                :key="index"
                class="pair-vehicle-rows"
              >
                <div
                  :key="renderKey"
                  :name="activeVendor.pair_rider_name"
                />
                <div class="pair-vehicles-vendor-title">
                  <span>{{ $t('general.pair_with_driver_single') }} {{ index + 1 }}</span><span class="pair-vehicles-vendor-id">({{ activeVendor.vendor_name }})</span>
                </div>
                <div class="">
                  <el-input
                    :id="`input${index}`"
                    v-model="activeVendor.vehicle_plate"
                    :placeholder="vehicleDetailsPlaceholder"
                    autocomplete="true"
                    @input="checkVehicleDetails(activeVendor, index)"
                  >
                    <i
                      v-if="activeVendor.searchOption"
                      slot="suffix"
                      class="el-icon-loading el-input__icon"
                    />
                    <i
                      v-if="activeVendor.pair_status !== ''"
                      slot="suffix"
                      class="el-icon-close el-input__icon"
                      @click="clearVehicleDetails(activeVendor, index)"
                    />
                  </el-input>
                  <div
                    v-if="activeVendor.searchOption"
                    class="pair-info-loading"
                  >
                    <div class="pairing-loading-holder">
                      <i class="el-icon-loading pairing-alert-icon" />
                      <div class="pair-model-info-variant">
                        {{ $t('general.finding_driver_details') }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="activeVendor.visible2"
                    class="pair_info_text_content"
                  >
                    <div
                      v-if="activeVendor.pair_status === '1'"
                      class="pair-info-warning"
                    >
                      <div class="pairing-error-icon-holder">
                        <i class="el-icon-warning pairing-alert-icon" />
                      </div>
                      <div class="share-option pairing-error-holder">
                        <div class="pairing-error-header pairing-error-header-variant">
                          {{ $t('general.driver_not_found') }}
                        </div>
                        <div class="pair-model-info-variant">
                          {{ activeVendor.failure_text }}
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="activeVendor.pair_status === '2'"
                      class="pair-info-success"
                    >
                      <div class="pair-info-rider-details">
                        <img
                          align="middle"
                          class="display_paired_rider_img"
                          :src="activeVendor.pair_rider_image"
                        >
                        <div class="display_paired_rider_details">
                          <div class="pair-rider-name pair-rider-name-variant">
                            {{ activeVendor.pair_rider_name }}
                          </div>
                          <div class="pair-rider-rating-icons">
                            <div class="pair-rider-rating-icons-val">
                              {{
                                `${activeVendor.pair_rider_rating}${
                                  Number.isInteger(activeVendor.pair_rider_rating) ? '.0' : ''
                                }`
                              }}
                            </div>
                            <div class="pair-rider-rating-icons-holder">
                              <el-rate
                                v-model="activeVendor.pair_rider_rating"
                                disabled
                                disabled-void-color="#C0C4CC"
                                :colors="['#1782C5', '#1782C5', '#1782C5']"
                                class="pair-info-rider-rate-icons"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="share-option pair-info-vehicle-details">
                        <div class="pair-model-info">
                          {{ activeVendor.pair_rider_make }} {{ activeVendor.pair_rider_model }}
                        </div>
                        <div>
                          {{ activeVendor.pair_rider_plate }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pair-button-section">
              <button
                class="button-primary pair-button"
                @click="closePairingPopup()"
              >
                {{ $t('general.done_capital') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        :visible.sync="automaticRescheduleStatus"
        width="30%"
        class="updateNotificationsDialog"
        :modal-append-to-body="false"
      >
        <div class="add-instructions-outer">
          <p class="add-instructions-setup schedule_time_outer reschedule-header">
            {{ $t('general.order_has_been_rescheduled') }}
          </p>
          <div>
            <div class="dotted-divider" />
            <div class="reschedule-location-icons">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="sendy-orange"
                width="10px"
              />
              <p class="reschedule-location-title">
                {{ rescheduleNotification ? rescheduleNotification.data.pickup_name : '' }}
              </p>
            </div>
            <div class="reschedule-location-icons">
              <font-awesome-icon
                icon="circle"
                size="xs"
                class="location-icons sendy-blue"
                width="10px"
              />
              <p class="reschedule-location-title">
                {{ rescheduleNotification ? rescheduleNotification.data.destination_name : '' }}
              </p>
            </div>
          </div>
          <p class="reschedule-locations-message">
            {{ rescheduleNotification ? rescheduleNotification.notification.body : '' }}
          </p>
          <div class="solid-divider" />
          <p class="reschedule-locations-prompt-message">
            {{ $t('general.reschedule_pick_up_to_another_time') }}
          </p>
          <div class="">
            <div
              class="instructions--inner-section"
            >
              <div class="">
                <div
                  class=""
                >
                  <el-date-picker
                    v-model="schedule_time"
                    class="vendor_component-actions__element-date"
                    type="datetime"
                    format="dd-MM-yyyy h:mm a"
                    :placeholder="$t('general.select_date_and_time')"
                    prefix-icon="el-icon-date"
                    :default-time="default_value"
                    :picker-options="dueDatePickerOptions"
                    @change="dispatchScheduleTime"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="">
            <div class="">
              <input
                class="button-primary add-instructions-submit reschedule-button"
                type="submit"
                :value="$t('general.reschedule_order')"
                @click="updateScheduledTime()"
              >
            </div>
          </div>
        </div>
      </el-dialog>
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
                {{ $t('general.finish_account_setup') }}
              </p>

              <div
                v-if="updateSetIndustry"
                class="final-upper-padding"
              >
                <label class="final-label">{{ $t('general.industry') }}</label>
                <div class="final-upper-padding">
                  <el-select
                    v-model="industry_type"
                    filterable
                    popper-append-to-body="false"
                    :placeholder="$t('general.select')"
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
                <label class="final-label">{{ $t('general.business_categories') }}</label>
                <p class="final-inner">
                  ({{ $t('general.finetune') }})
                </p>
                <div class="final-upper-padding">
                  <el-select
                    v-model="business_category_option"
                    :placeholder="$t('general.select')"
                    class="compliance-select-final"
                    popper-class="business-categories-options"
                  >
                    <el-option
                      v-for="item in businessCategories"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                      <p class="business-categories-options-titles">
                        {{ item.name }}
                      </p> <br>
                      <p class="business-categories-options-definitions">
                        {{ item.description }}
                      </p>
                    </el-option>
                  </el-select>
                </div>
              </div>

              <div
                v-if="social_media_option"
                class="final-upper-padding"
              >
                <label class="final-label">{{ $t('general.biz_insta_handle') }}</label>
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
                <label class="final-label">{{ $t('general.link_business_face_book_page') }}</label>
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

              <div class="final-upper-padding">
                <label class="final-label">
                  {{ $t('general.delivery_option') }}
                </label>
                <p class="final-inner">
                  ({{ $t('general.not_restrict_other_delivery_options') }})
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
                      <p class="vendor-type-icon-labels">
                        {{ $t('general.bikes') }}
                      </p>
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
                      <p class="vendor-type-icon-labels">
                        {{ $t('general.pickups_trucks_and_vans') }}
                      </p>
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
                      <p class="vendor-type-icon-labels">
                        {{ $t('general.freight') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="updateKraSection">
                <div class="">
                  <label class="final-label">{{ $t('general.does_biz_file_vat_optional') }}</label>

                  <div class="final-upper-padding">
                    <el-select
                      v-model="tax_compliance"
                      :placeholder="$t('general.select')"
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
              </div>

              <div
                v-if="tax_compliance"
                class="final-upper-padding"
              >
                <label
                  class="final-label"
                >{{ $t('general.enter_your_business') }} {{ fetchKraHeader }}</label>
                <div class="final-upper-padding">
                  <input
                    v-model="kra_pin"
                    class="input-control upgrade-final"
                    type="text"
                    name="kra_pin"
                    :placeholder="$t('general.pin')"
                    autocomplete="on"
                  >
                  <span
                    v-show="!valid_kra_pin"
                    class="invalid-kra"
                  >
                    {{ kraFailResponse }}
                  </span>
                </div>
              </div>

              <div class="">
                <input
                  class="button-primary final-step-submit"
                  type="submit"
                  :value="$t('general.submit')"
                  @click="submit"
                >
              </div>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapMutations, mapGetters, mapActions } from 'vuex';
import S3 from 'aws-s3';
import orderStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import MainHeader from '../../components/headers/MainHeader.vue';
import MapComponent from './_components/MapComponent.vue';
import OngoingComponent from './_components/OngoingComponent.vue';
import ApprovalDialog from './_components/social_media/ApprovalDialog.vue';
import FbuChildOrders from './_components/FbuChildOrders.vue';
import NPSFooter from '../../components/footers/NPSFooter.vue';
import NpsMixin from '../../mixins/nps_mixin';
import SessionMxn from '../../mixins/session_mixin';
import TimezoneMxn from '../../mixins/timezone_mixin';
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
  mixins: [RegisterStoreModule, NpsMixin, SessionMxn, TimezoneMxn, NotificationMxn],
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
      pairing_status: false,
      pairing_data: '',
      location: '',
      suggestion: '',
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
      business_category_option: '',
      ig_media_handle: '',
      facebook_media_handle: '',
      industry_type: '',
      kra_pin: '',
      activeTab: '',
      primary_business_unit: '',
      activeRow: 0,
      renderKey: 1,
      focusedInput: '',
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
      businessCategories: [],
      activeClass: -1,
      waypoint_type: '',
      locationSavingStatus: false,
      automaticRescheduleStatus: false,
      rescheduleNotification: '',
      schedule_time: '',
      default_value: this.moment().format('HH:mm:ss'),
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      dedicatedTourPoints: [
        {
          title: this.$t('general.order_type_dedicated_vehicles'),
          description: this.$t('general.get_truck_whole_day'),
          class: '.tour-pointer-1',
        },
        {
          title: this.$t('general.order_type_no_destination'),
          description: this.$t('general.skip_adding_destination'),
          class: '.tour-pointer-2',
        },
        {
          title: this.$t('general.vehicle_type'),
          description: this.$t('general.select_multiple_vehicle'),
          class: '.tour-pointer-3',
        },
        {
          title: this.$t('general.select_vehicle_type'),
          description: this.$t('general.select_open_or_closed_vehicles'),
          class: '.tour-pointer-4',
        },
        {
          title: this.$t('general.schedule'),
          description: this.$t('general.select_date_for_delivery'),
          class: '.tour-pointer-5',
        },
        {
          title: this.$t('general.schedule_time_capital'),
          description: this.$t('general.select_time_frame'),
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
      getExpandedActiveVendorTally: '$_orders/getExpandedActiveVendorTally',
    }),
    uploadBtn() {
      if (this.uploadButton) {
        return 'button-primary';
      }
      return 'button--primary-inactive inactive-1';
    },
    fetchKraHeader() {
      let kraName = this.$t('general.tin_number');
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        kraName = this.$t('general.kra_pin');
      }
      let resp = `${this.$t('general.enter_your_business')} ${kraName}`;
      if (session.default === 'peer') {
        resp = `${this.$t('general.enter_your ')} ${kraName}`;
      }
      return resp;
    },
    kraFailResponse() {
      let resp = 'Please enter a valid TIN number';
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        resp = 'Please enter a valid KRA PIN';
      }
      return resp;
    },
    valid_kra_pin() {
      const pin = this.kra_pin;
      const session = this.$store.getters.getSession;

      if (pin !== '') {
        if (session[session.default].country_code === 'KE') {
          return /^[apAP]\d{9}[a-zA-Z]$/.test(pin);
        }
        return /^\d{10}$/.test(pin);
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
      return this.waypoint_type === 'PICKUP'
        ? this.$t('general.pickup_lowercase')
        : this.$t('general.drop_off_lowercase');
    },
    vehicleDetailsPlaceholder() {
      return this.$t('general.enter_no_plate');
    },
    order_is_scheduled() {
      return this.moment(this.current_time).isBefore(this.schedule_time);
    },
    current_time() {
      return this.moment().format('YYYY-MM-DD HH:mm:ss');
    },
    scheduled_time() {
      return this.moment(this.schedule_time, 'YYYY-MM-DD HH:mm:ss Z').format(
        'YYYY-MM-DD HH:mm:ss',
      );
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
    business_category_option(val) {
      this.social_media_option = val === 6;
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
    this.fetchBusinessCategories();
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
      requestPairRider: '$_orders/$_home/requestPairRider',
    }),
    ...mapMutations({
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      setDedicatedAccessStatus: 'setDedicatedAccessStatus',
      setPairWithRiderStatus: '$_orders/$_home/setPairWithRiderStatus',
      setPairWithRiderState: '$_orders/$_home/setPairWithRiderState',
      setPairSerialNumber: '$_orders/$_home/setPairSerialNumber',
      setPairRiderPhone: '$_orders/$_home/setPairRiderPhone',
      setVehicleDetails: '$_orders/$_home/setVehicleDetails',
      setPairErrorMessage: '$_orders/$_home/setPairErrorMessage',
      setExpandedActiveVendorTally: '$_orders/setExpandedActiveVendorTally',
      setPairedDriversTally: '$_orders/setPairedDriversTally',
    }),
    ...mapActions({
      fetchSuggestions: '$_orders/fetchSuggestions',
      saveSuggestions: '$_orders/saveSuggestions',
      removeSuggestions: '$_orders/removeSuggestions',
    }),
    dispatchScheduleTime() {
      this.default_value = this.moment(this.schedule_time).format('HH:mm:ss');
    },
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
          if (social_media_business_approval_status === 1) {
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
    fetchBusinessCategories() {
      const payload = {
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'growth_business_categories',
      };
      this.requestIndustries(payload).then(
        (response) => {
          this.businessCategories = response;
        },
        (error) => {
          this.businessCategories = [];
        },
      );
    },
    parseRating(data) {
      parseInt(data, 10);
    },
    pairTally() {
      let tally = 0;
      this.getExpandedActiveVendorTally.forEach((row) => {
        if (row.vehicle_plate && row.pair_status === '2') {
          tally += 1;
        }
      });
      return tally;
    },
    closePairingPopup() {
      this.setPairedDriversTally(this.pairTally());
      this.blinder_status = false;
      this.pairing_status = false;
    },
    vendorOptions(id) {
      if (this.small_vendors.includes(id)) {
        return this.smallVendorOptions;
      }
      return this.baseTruckOptions;
    },
    clearVehicleDetails(vehicle, i) {
      this.pairing_data[i].vehicle_plate = '';
      this.pairing_data[i].visible2 = false;
      this.pairing_data[i].pair_status = '';
      this.setExpandedActiveVendorTally(this.pairing_data);
      this.forceUpdate();
    },
    // eslint-disable-next-line func-names
    checkVehicleDetails: _.debounce(function (vehicle, i) {
      const vehicleDetails = vehicle.vehicle_plate;
      this.focusedInput = i;
      this.forceUpdate();
      if (vehicleDetails === '') {
        this.doNotification(
          '2',
          this.$t('general.vehicle_number_plate'),
          this.$t('general.please_provide_the_vehicle_details_to_pair'),
        );
        this.pairing_data[i].visible2 = false;
        this.pairing_data[i].searchOption = false;
        this.pairing_data[i].pair_status = '';
      } else {
        this.pairing_data[i].searchOption = true;
        this.handlePairRequest(vehicleDetails, vehicle, i);
      }
    }, 500),
    updateData(value, vehicle, i) {
      const val = value;
      this.pairing_data[i].pair_rider_image = val.rider_photo;
      this.pairing_data[i].pair_rider_name = val.rider_name;
      this.pairing_data[i].pair_rider_rating = parseFloat(val.rider_rating);
      this.pairing_data[i].pair_rider_make = val.make;
      this.pairing_data[i].pair_rider_model = val.model;
      this.pairing_data[i].pair_rider_plate = val.registration_no;
      this.pairing_data[i].pair_rider_sim_card_sn = val.sim_card_sn;
      this.pairing_data[i].pair_rider_phone = val.rider_phone;
      this.pairing_data[i].visible2 = true;
      this.pairing_data[i].pair_status = '2';
      this.setExpandedActiveVendorTally(this.pairing_data);
    },
    handlePairRequest(plate, vehicle, i) {
      this.pairing_data[i].visible2 = false;
      this.pairing_data[i].pair_status = '';
      const checkInputType = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');
      const res = checkInputType.test(plate.replace(/\s/g, ''));
      const payload = {};
      payload.vendor_type = vehicle.vendor_id;
      if (res) {
        payload.phone_no = plate.replace(/\s/g, '');
      } else {
        payload.registration_no = plate.replace(/\s/g, '');
      }
      const fullPayload = {
        values: payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'pair_order_rider_details',
      };
      this.requestPairRider(fullPayload).then(
        (response) => {
          if (response.status) {
            this.trackMixpanelEvent('Paired Open Destination Order With Rider', {
              'Paired Rider': plate,
            });
            this.triggerGAEvent('Paired Open Destination Order With Rider', {
              'Paired Rider': plate,
            });
            this.updateData(response.data, vehicle, i);
          } else {
            this.pairing_data[i].pair_status = '1';
            this.pairing_data[i].failure_text = response.message;
            this.pairing_data[i].visible2 = true;
            this.setExpandedActiveVendorTally(this.pairing_data);
          }
          this.pairing_data[i].searchOption = false;
          this.forceUpdate();
        },
        (error) => {
          const msg = error.response.data.message;
          this.pairing_data[i].pair_status = '1';
          this.pairing_data[i].failure_text = msg;
          this.pairing_data[i].visible2 = true;
          this.setExpandedActiveVendorTally(this.pairing_data);
          this.pairing_data[i].searchOption = false;
          this.forceUpdate();
        },
      );
    },
    forceUpdate() {
      this.renderKey += 1;
    },
    triggerGAEvent(field, value) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          window.ga('send', 'event', {
            eventCategory: 'Order Placement',
            eventAction: 'Click',
            eventLabel: field,
            eventValue: value,
          });
        }
      } catch (er) {
        // ...
      }
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Price Request',
          //   eventLabel: name,
          //   eventValue: 14,
          // });
        }
      } catch (er) {
        // ...
      }
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
          this.kra_pin = session[session.default].tax_authority_pin;
          if (session[session.default].tax_authority_pin === null) {
            this.tax_compliance = '';
            this.kra_pin = '';
          } else if (session[session.default].tax_authority_pin !== '' && !this.valid_kra_pin) {
            this.tax_compliance = false;
            this.kra_pin = session[session.default].tax_authority_pin;
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
    updateScheduledTime() {
      if (this.schedule_time !== '') {
        const time = this.order_is_scheduled
          ? this.convertToUTC(this.scheduled_time)
          : this.convertToUTC(this.current_time);

        const scheduleTime = this.moment(time).utc().format('YYYY-MM-DD HH:mm:ss');

        const value = {
          order_no: this.rescheduleNotification.data.order_no,
          client_type: 'corporate',
          date_time: scheduleTime,
        };

        const payload = {
          values: value,
          app: 'ORDERS_APP',
          endpoint: 'schedule_order',
        };

        this.$store.dispatch('$_orders/requestEditOrder', payload).then(
          (response) => {
            if (response.status) {
              this.automaticRescheduleStatus = false;
              this.schedule_time = '';
              this.doNotification(
                1,
                this.$t('general.pickup_time_updated'),
                '',
              );
            } else {
              this.doNotification(
                2,
                this.$t('general.pickup_time_update_failed'),
                this.$t('general.please_try_again'),
              );
            }
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
              this.doNotification(2, this.$t('general.pickup_time_update_failed'), error.response.data.reason);
            } else {
              this.doNotification(
                2,
                this.$t('general.pickup_time_update_failed'),
                this.$t('general.something_went_wrong_please_try_again'),
              );
            }
          },
        );
      } else {
        this.doNotification(
          2,
          this.$t('general.edit_pickup_time'),
          this.$t('general.kindly_provide_pickup_time'),
        );
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
      this.$root.$on('Show reschedule dialogue', (arg1) => {
        this.automaticRescheduleStatus = true;
        this.rescheduleNotification = arg1;
      });
      this.$root.$on('Pairing status', (arg1) => {
        this.blinder_status = arg1;
        this.pairing_status = arg1;
        this.pairing_data = this.getExpandedActiveVendorTally;
        this.pairing_data.forEach((row, i) => {
          this.pairing_data[i].vehicle_plate = row.vehicle_plate ? row.vehicle_plate : '';
          this.pairing_data[i].pair_status = row.pair_status ? row.pair_status : '';
          this.pairing_data[i].failure_text = row.failure_text ? row.failure_text : '';
          this.pairing_data[i].pair_rider_image = row.pair_rider_image ? row.pair_rider_image : '';
          this.pairing_data[i].pair_rider_name = row.pair_rider_name ? row.pair_rider_name : '';
          this.pairing_data[i].pair_rider_rating = row.pair_rider_rating
            ? row.pair_rider_rating
            : '';
          this.pairing_data[i].pair_rider_make = row.pair_rider_make ? row.pair_rider_make : '';
          this.pairing_data[i].pair_rider_model = row.pair_rider_model ? row.pair_rider_model : '';
          this.pairing_data[i].pair_rider_plate = row.pair_rider_plate ? row.pair_rider_plate : '';
          this.pairing_data[i].pair_rider_sim_card_sn = row.pair_rider_sim_card_sn
            ? row.pair_rider_sim_card_sn
            : '';
          this.pairing_data[i].pair_rider_phone = row.pair_rider_phone ? row.pair_rider_phone : '';
          this.pairing_data[i].visible2 = row.visible2 ? row.visible2 : false;
          this.pairing_data[i].searchOption = row.searchOption ? row.searchOption : false;
        });
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
          this.trackMixpanelEvent('Save location suggestion', data);
          this.triggerGAEvent('Save location suggestion', data);
          this.location = '';
          this.suggestion = '';
          this.triggerFetchsuggestions();
        } else {
          const notification = {
            title: '',
            level: 3,
            message: response.message,
          };
          this.location = '';
          this.suggestion = '';
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
          this.trackMixpanelEvent('Remove location suggestion', data);
          this.triggerGAEvent('Remove location suggestion', data);
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
            this.$t('general.failed_upload_file'),
            this.$t('general.check_connection_try_again'),
          );
        });
    },
    checkSession() {
      const session = this.$store.getters.getSession;
      const sessionData = Object.keys(session).length;
      if (sessionData === 0) {
        const notification = {
          title: this.$t('general.session_has_expired'),
          level: 2,
          message: this.$t('general.redirected_to_login'),
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
      let kraName = 'TIN number';
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        kraName = 'KRA PIN';
      }

      if (this.primary_business_unit === '') {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.select_primary_type_vehicle'),
        );
      } else if ((this.tax_compliance && this.kra_pin === '') || !this.valid_kra_pin) {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.enter_valid_kra'),
        );
      } else if (this.industry_type === '' || this.social_media_option === '' || this.business_category_option === '') {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.select_industry_preference'),
        );
      } else if (
        this.social_media_option
        && (this.ig_media_handle === '' && this.facebook_media_handle === '')
      ) {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.social_media_handle'),
        );
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
          growth_business_category_id: this.business_category_option,
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
      let kraName = 'TIN number';
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        kraName = 'KRA PIN';
      }
      if (this.primary_business_unit === '') {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.select_primary_type_vehicle'),
        );
      } else if ((this.tax_compliance && this.kra_pin === '') || !this.valid_kra_pin) {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.enter_valid_kra'),
        );
      } else {
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
      if (this.industry_type === '' || this.social_media_option === '' || this.business_category_option === '') {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.select_industry_preference'),
        );
      } else if (
        this.social_media_option
        && (this.ig_media_handle === '' && this.facebook_media_handle === '')
      ) {
        this.doNotification(
          2,
          this.$t('general.final_setup_error'),
          this.$t('general.social_media_handle'),
        );
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
          growth_business_category_id: this.business_category_option,
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
            this.message = this.$t('general.something_went_wrong');
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
          const notification = {
            title: '',
            level,
            message: this.$t('general.something_went_wrong'),
          }; // notification object
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
  color: #0062DB;
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
  border: 2px solid #0062DB;
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
  margin-top: 5px;
}
.invalid-kra {
  display: block;
  color: #f57f20;
  font-size: 14px;
}
.final-upper-padding{
  padding: 2% 0%;
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
  color: #1782c5;
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
  color: #1782c5;
  cursor: pointer;
}
.saved-locations-message {
  font-size: 14px;
  margin: 10px;
}
.pair-vehicles-popup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5%;
}
.pair-vehicle-rows {
  padding: 0px;
  width: -webkit-fill-available;
}
.pair-vehicles-list {
  max-height: 370px;
  overflow-y: auto;
  width: -webkit-fill-available;
}
.pair-vehicles-title {
  width: -webkit-fill-available;
  text-align: left;
}
.pair-button {
  width: -webkit-fill-available;
}
.pair-button-section {
  width: -webkit-fill-available;
  padding: 15px 0px 5px 0px;
}
.pair-info-warning, .pair-info-success, .pair-info-loading {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #dcdfe4;
}
.pair-info-rider-details {
  display: flex;
  align-items: center;
  padding: 5%;
}
.pair-info-vehicle-details {
  padding: 5%;
  border-left: 1px solid #dcdfe4;
}
.pair-info-rider-rate-icons span i {
  font-size: 10px !important;
  margin-right: 3px;
}
.pair-rider-rating-icons {
  display: flex;
  align-items: baseline;
  padding: 0px 8px;
}
.pair-rider-rating-icons-val {
  font-size: 14px;
  margin-right: 5px;
  font-weight: 500;
  color: #1682c5;
}
.pair-rider-name-variant {
  text-align: left;
}
.display_paired_rider_details {
  padding-left: 8px;
}
.pair-rider-rating-icons-holder {
  width: max-content;
}
.pair-model-info-variant {
  font-size: 12px;
  font-weight: 400;
}
.pairing-error-header-variant {
  font-size: 14px;
  font-weight: 500;
}
.pairing-error-holder {
  text-align: left;
  padding: 8px;
}
.pairing-error-icon-holder {
  padding: 15px;
}
.pairing-loading-holder {
  width: -webkit-fill-available;
  padding: 15px;
}
.pair-vehicles-title-description {
  text-align: left;
  font-size: 13px;
  margin: 15px 0px;
}
.pair-vehicles-vendor-title {
  text-align: left;
  font-size: 13px;
  padding: 10px 0px;
}
.pair-vehicles-vendor-id {
  color: #1682c5;
  padding-left: 4px;
  font-size: 14px;
}
.reschedule-location-icons {
  display: flex;
  align-items: center;
}
.reschedule-location-title {
  margin-left: 15px;
}
.dotted-divider {
  width: 0px;
  height: 18px;
  border-left: 1px dashed #767474;
  position: absolute;
  margin-top: 9%;
  margin-left: 5px;
}
.reschedule-locations-message {
  margin-top: 5px;
  font-size: 15px;
  margin-bottom: 10px;
}
.solid-divider {
  border-top: 1px solid #D6D6D6;
  margin: 20px 0px;
}
.reschedule-button {
  font-size: 15px !important;
}
.reschedule-header {
  color: black !important;
  margin-bottom: 15px !important;
  font-size: 20px !important;
}
.business-categories-options div div ul li {
  height: 60px;
  line-height: 10px;
  color: black !important;
  background: white !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.business-categories-options-titles {
  margin: 0px;
  font-size: 15px;
}
.business-categories-options-definitions {
  font-size: 12px;
  margin: 0px;
}
.vendor-type-icon-labels {
  text-align: center;
  margin: 0px 0px 7px 0px;
  font-size: 12px;
}
</style>
