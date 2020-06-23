<template lang="html">
  <div
    v-if="getOrderState === 1"
    class="home-view-vendor-and-optins-wrappper"
    :class="$route.path === '/orders/dedicated/multi-destination' ? 'dedicated-vendors-wrapper' : ''"
  >
    <div class="home-view--seperator" />
    <div class="homeview--form__header homeview--form__header-lower">
      Load Size And Delivery Type
    </div>
    <div class="home-view-vendor-classes">
      <div class="home-view-vendor-classes--body">
        <div class="">
          <div class="home-view-vendor-classes--label home-view--outline">
            <div
              v-for="(vendor_class, index) in getPriceRequestObject.economy_price_tiers"
              v-if="vendor_class.price_tiers.length > 0"
              :key="index"
              class="home-view-vendor-classes-label-item"
              @click="setActivePackageClassWrapper(vendor_class.tier_group)"
            >
              <a
                class="home-view-vendor-classes-menu section__link"
                :class="getCurrentActivePackageClass(vendor_class.tier_group)"
              >
                <img
                  :src="getPackageIcon(vendor_class.tier_group)"
                  class="home-view-vendor-classes-menu--img"
                  alt="vendor_class.tier_group"
                >
                <span class="home-view-vendor-classes-menu--span">
                  {{ vendor_class.tier_group }}
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- start vendor types wrapper -->
        <div
          v-if="activePackageClassPriceData !== ''"
          class="home-view-vendor-types"
        >
          <!-- start vendor types loop -->
          <div
            v-for="j in activePackageClassPriceData.price_tiers"
            :key="j.order_no"
            @click="setVendorDetails(j)"
          >
            <div
              class="home-view-vendor-types--item home-view-vendor-types-item-wrap"
              :class="[
                getScheduledVendorTypeClass(j, 1),
                getCurrentActiveTendorTypeClass(j.vendor_name),
              ]"
            >
              <!-- start vendor wrapper -->
              <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
                <div class="home-view-vendor-types-item--vendor-wrapper__img">
                  <img
                    class="home-view-vendor-types-item__image"
                    :src="getVendorIcon(j.vendor_id)"
                    :class="getScheduledVendorTypeClass(j, 2)"
                    alt=""
                  >
                </div>
                <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                  <div class="home-view-vendor-types-item-vendor--vendor-formal-name">
                    {{ j.vendor_name }}
                  </div>
                  <div
                    class="home-view-vendor-types-item-vendor--vendor-local-name"
                    :class="getScheduledVendorTypeClass(j, 1)"
                  >
                    {{ getVendorDescription(j) }}
                  </div>
                </div>
              </div>
              <!-- end vendor wrapper -->

              <!-- start cost wrapper -->
              <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
                <div
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left"
                >
                  <div class="home-view-vendor-types-item--cost-wrapper__cost">
                    <span v-if="!isFixedCost(j)">
                      Price to be confirmed
                    </span>
                    <span v-else> {{ getVendorCurrency(j) }} {{ getVendorPrice(j) }} </span>
                  </div>
                  <div class="home-view-vendor-types-item--cost-wrapper_time">
                    <span v-if="isStandardUnavailable(j)">
                      {{ scheduleTimeFrame(j) }}
                    </span>
                    <span v-else> Pickup by {{ transformDate(j) }} </span>
                  </div>
                </div>

                <div
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right"
                >
                  <el-popover
                    placement="right"
                    width="350"
                    trigger="hover"
                    popper-class="vendorExtraInfo"
                  >
                    <div
                      class="reset-font"
                      v-html="j.tier_description"
                    />
                    <span
                      slot="reference"
                      class="extra_info_background"
                    >
                      <i
                        class="el-icon-info"
                        :class="getScheduledVendorTypeClass(j, 2)"
                      />
                    </span>
                  </el-popover>
                </div>
              </div>
              <!-- end cost wrapper -->
            </div>
          </div>
          <!-- end vendor type loop -->
        </div>
        <!-- end vendor types wrapper -->
      </div>
    </div>
    <div
      v-if="get_active_package_class !== ''"
      class=""
    >
      <button
        type="button"
        class="button-primary home-view--place-order"
        name="button"
        @click="goToNextStep"
      >
        Continue
      </button>
    </div>
  </div>

  <div
    v-else-if="getOrderState === 2"
    class="extended-options-wrappper"
  >
    <!-- start carrier type transition -->
    <transition name="home-carrier-type-fade">
      <div class="home-view-vendor-types-item-wrap home-next-step">
        <div
          class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper"
          :class="getScheduledVendorTypeClass(activeVendorPriceData, 2)"
        >
          <div
            class=""
            @click="goBackToHome"
          >
            <i class="el-icon-back back-to-home-btn" />
          </div>
          <div class="home-view-vendor-types-item--vendor-wrapper__img vendor__img_pstn">
            <img
              class="home-view-vendor-types-item__image"
              :src="getVendorIcon(activeVendorPriceData.vendor_id)"
              alt=""
            >
          </div>
          <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
            <div class="home-view-vendor-types-item-vendor--vendor-formal-name">
              {{ activeVendorPriceData.vendor_name }}
            </div>
            <div class="home-view-vendor-types-item-vendor--vendor-local-name">
              {{ getVendorDescription(activeVendorPriceData) }}
            </div>
          </div>
          <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
            <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left">
              <div class="home-view-vendor-types-item--cost-wrapper__cost">
                <span v-if="!isFixedCost(activeVendorPriceData)">
                  Price to be confirmed
                </span>
                <span v-else>
                  {{ getVendorCurrency(activeVendorPriceData) }}
                  {{ getVendorPrice(activeVendorPriceData) }}
                </span>
              </div>
              <div class="home-view-vendor-types-item--cost-wrapper_time">
                <span v-if="isStandardUnavailable(activeVendorPriceData)">
                  {{ scheduleTimeFrame(activeVendorPriceData) }}
                </span>
                <span v-else> Pickup by {{ transformDate(activeVendorPriceData) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- start carrier type section -->
        <div class="home-view-carrier-type">
          <!-- start large /medium vendors -->
          <div class="home-view-truck-options-wrapper">
            <div class="home-view-truck-options-divider" />
            <div
              v-if="$route.path === '/orders/dedicated/multi-destination'"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-dedicated-notes">
                <p>Add notes for each destination (optional)</p>
                <div
                  v-for="(path, index) in getStoreOrderPath"
                  :key="index"
                >
                  <div 
                    v-if="index > 0"
                    class="home-view-truck-options-dedicated-notes-label"
                  >
                    <div class="home-view-truck-options-dedicated-notes-icon" />
                    <p class="no-margin">
                      {{ path.name }}
                    </p>
                  </div>
                  <el-input
                    v-if="index > 0"
                    class=""
                    autocomplete="true"
                    placeholder="Notes"
                    @input="addDestinationNotes($event, path, index)"
                  />
                </div>
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                What do you want delivered?
              </div>
              <div>
                <el-input
                  v-model.trim="delivery_item"
                  autocomplete="true"
                  @change="dispatchDeliveryItem"
                />
              </div>
            </div>
            <div
              v-if="isTestAccount()"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-label">
                Test Specifications
              </div>
              <div>
                <el-input
                  v-model.trim="test_specifications"
                  autocomplete="true"
                  placeholder="Specifications ..."
                  @change="dispatchTestSpecs"
                />
              </div>
            </div>
            <div v-if="small_vendors.includes(activeVendorPriceData.vendor_id)">
              <div
                v-if="!vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  What type of bike do you want?
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="carrier_type"
                    placeholder=""
                    filterable
                    @change="dispatchCarrierType"
                  >
                    <el-option
                      v-for="item in smallVendorOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="!vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)"
                class="home-view-truck-options-inner-wrapper"
              >
                <div
                  v-if="large_vendors.includes(activeVendorPriceData.vendor_id)"
                  class="home-view-truck-options-label"
                >
                  What type of truck do you want?
                </div>
                <div
                  v-else
                  class="home-view-truck-options-label"
                >
                  What type of {{ getVendorNameOnCarrierType }} do you want?
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="carrier_type"
                    placeholder=""
                    filterable
                    @change="dispatchCarrierType"
                  >
                    <el-option
                      v-for="item in truckOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>
            <div
              v-if="activeVendorPriceData.vendor_id === 25"
              class="home-view-truck-options-inner-wrapper load-weight-outer"
            >
              <div class="home-view-truck-options-label">
                What is the weight of your load?
              </div>
              <div>
                <input
                  v-model.trim="load_weight"
                  v-mask="loadWeightMask"
                  class="input-control load-weight"
                  type="text"
                  placeholder="From 18.00 to 33.00"
                  autocomplete="on"
                  min="18"
                  max="33"
                  @keyup="dispatchLoadWeight"
                >
                <span class="tonage-value-text">Tonnes</span>
              </div>
              <p class="tonnage-validate-error">
                {{ pass_msg }}
              </p>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                {{ getPickUpDescriptText(activeVendorPriceData) }}
              </div>
              <div class="block">
                <el-date-picker
                  v-model="schedule_time"
                  class="vendor_component-actions__element-date"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  placeholder="As soon as possible"
                  prefix-icon="el-icon-date"
                  :default-time="default_value"
                  :picker-options="dueDatePickerOptions"
                  @change="dispatchScheduleTime"
                />
              </div>
              <span
                v-if="isStandardUnavailable(activeVendorPriceData)"
                class="vendor_component-schedule"
              >
                Delivery is in 2 to 4 hours from the scheduled time
              </span>
            </div>
            <div class="home-view-truck-options-inner-wrapper recipient-section">
              <p class="home-view-truck-options-label no-margin">
                Recipient Details
              </p>
              <input
                v-model="recipientName"
                type="text"
                placeholder="Name"
                class="el-input__inner bottom-spacer"
              >
              <input
                v-model="recipientPhone"
                type="number"
                placeholder="Phone number"
                class="el-input__inner"
              >
            </div>
            <div
              v-if="$route.path !== '/orders/dedicated/multi-destination'"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-label">
                Additional Instructions
              </div>
              <div class="" />
              <div
                class=""
                @change="dispatchOrderNotes"
              >
                <textarea
                  v-model="order_notes"
                  name="name"
                  rows="5"
                  class="textarea-control"
                  placeholder=" Instructions.."
                />
              </div>
            </div>

            <!-- show large and medium extended options -->
            <div v-if="large_vendors.includes(activeVendorPriceData.vendor_id)">
              <div
                v-if="Number(carrier_type) === 3"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  Temperature shouldn't exceed? (°C)
                </div>
                <div class="home-view-truck-options-inner--number-of-loaders">
                  <el-input-number
                    v-model.trim="max_temperature"
                    :min="1"
                    :max="10"
                    @change="handleChangeInMaxTemperature"
                  />
                </div>
              </div>

              <div
                v-if="!isFixedCost(activeVendorPriceData)"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  How much are you offering to pay for this order?
                </div>
                <div>
                  <el-input
                    v-model.trim="customer_min_amount"
                    :min="0"
                    type="number"
                    placeholder="Kes"
                    @change="handleChangeInMinAmount"
                  />
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  Do you want us to provide you with Loader/s?
                </div>
                <div class="">
                  <el-radio
                    v-model="additional_loader"
                    label="1"
                    @change="dispatchAdditionalLoaderStatus"
                  >
                    Yes
                  </el-radio>
                  <el-radio
                    v-model="additional_loader"
                    label="0"
                    @change="dispatchAdditionalLoaderStatus"
                  >
                    No
                  </el-radio>
                </div>
              </div>

              <div
                v-if="Number(additional_loader) === 1"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  How many Loaders do you require?
                </div>
                <div class="home-view-truck-options-inner--number-of-loaders">
                  <el-input-number
                    v-model="number_of_loaders"
                    :min="0"
                    :max="10"
                    @change="handleChangeInNumberOfLoaders"
                  />
                </div>
              </div>
            </div>

            <!-- Pair with rider  -->
            <div v-if="![22, 24].includes(activeVendorPriceData.vendor_id)">
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  Do you have a preferred {{ riderNameDisplay }} at your pick up location ?
                </div>
                <div class="">
                  <el-select
                    v-model="pair_rider"
                    class="pair_rider_section"
                    placeholder="Select"
                    filterable
                    @change="dispatchPairStatus"
                  >
                    <el-option
                      label="Yes"
                      value="1"
                    />
                    <el-option
                      label="No"
                      value="2"
                    />
                  </el-select>
                </div>
              </div>
              <div
                v-if="pair_rider === '1'"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  <div v-if="[21].includes(activeVendorPriceData.vendor_id)">
                    Enter their phone number to pair
                  </div>
                  <div v-else>
                    Enter their phone number or the {{ getVendorNameOnCarrierType }}'s number plate
                    to pair
                  </div>
                </div>
                <div class="">
                  <el-popover
                    v-model="visible2"
                    placement="right"
                    width="200"
                    trigger="manual"
                    popper-class="pop-over-layout"
                  >
                    <el-input
                      slot="reference"
                      v-model.trim="vehicle_plate"
                      :placeholder="vehicleDetailsPlaceholder"
                      autocomplete="true"
                      @input="checkVehicleDetails"
                    >
                      <i
                        v-if="searchOption"
                        slot="suffix"
                        class="el-icon-loading el-input__icon"
                      />
                      <i
                        v-if="pair_status !== ''"
                        slot="suffix"
                        class="el-icon-close el-input__icon"
                        @click="clearVehicleDetails"
                      />
                    </el-input>
                    <div class="pair_info_text_content">
                      <div v-if="pair_status === '1'">
                        <el-row :gutter="20">
                          <el-col
                            :span="1"
                            class="pairing-alert"
                          >
                            <div>
                              <i class="el-icon-warning pairing-alert-icon" />
                            </div>
                          </el-col>
                          <el-col
                            :span="8"
                            class="pairing-error-display"
                          >
                            <div class="share-option">
                              <div class="pairing-error-header">
                                {{ riderNameDisplay }} not found
                              </div>
                              <div class="pair-model-info">
                                {{ failure_text }}
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                      <div v-if="pair_status === '2'">
                        <el-row :gutter="20">
                          <el-col
                            :span="8"
                            class="display_rider_inline"
                          >
                            <div class="">
                              <img
                                align="middle"
                                class="display_paired_rider_img"
                                :src="pair_rider_image"
                              >
                              <div class="pair-rider-name">
                                {{ pair_rider_name }}
                              </div>
                              <div>
                                <el-rate
                                  v-model="pair_rider_rating"
                                  disabled
                                  disabled-void-color="#C0C4CC"
                                  :colors="['#1782C5', '#1782C5', '#1782C5']"
                                />
                              </div>
                            </div>
                          </el-col>
                          <el-col
                            :span="6"
                            class="pair_right_more_info"
                          >
                            <div class="share-option">
                              <div class="pair-model-info">
                                {{ pair_rider_make }} {{ pair_rider_model }}
                              </div>
                              <div>
                                {{ pair_rider_plate }}
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-vendor-classes--label">
                <payment-options @destroyOrderOptions="destroyVendorComponent()" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end carrier type section -->
    </transition>
    <!-- end carrier type transition -->
  </div>
</template>

<script>
import numeral from 'numeral';
import _ from 'lodash';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PaymentOptions from './PaymentOptions.vue';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  components: {
    PaymentOptions,
  },
  mixins: [TimezoneMxn, NotificationMxn],
  data() {
    return {
      first_time: false,
      popover_visible: false,
      additional_loader: false,
      carrier_type: '1',
      number_of_loaders: 1,
      max_temperature: 4,
      delivery_item: '',
      load_units: '',
      discount_timed_out: false,
      customer_min_amount: '',
      vendors_with_fixed_carrier_type: ['Standard', 'Runner', 'Van', '3T Truck', '5T Truck', '7T Truck', '10T Truck', '14T Truck', '20T Truck', '24T Truck'],
      vendors_without_return: ['Standard', 'Runner'],
      baseTruckOptions: [
        {
          value: '0',
          label: 'Open',
        },
        {
          value: '1',
          label: 'Closed',
        },
      ],
      smallVendorOptions: [
        {
          value: '2',
          label: 'Any',
        },
        {
          value: '1',
          label: 'Bike with box',
        },
        {
          value: '0',
          label: 'Bike without box',
        },
      ],
      freightVendorOptions: [
        {
          value: '1',
          label: 'Closed/Boxed body',
        },
        {
          value: '4',
          label: 'Flatbed/Skeleton',
        },
        {
          value: '5',
          label: 'Tipper',
        },
        {
          value: '6',
          label: 'Refeer',
        },
        {
          value: '7',
          label: 'Highside',
        },
      ],
      schedule_time: '',
      default_value: this.moment().format('HH:mm:ss'),
      order_notes: '',
      small_vendors: [1, 22, 21, 23],
      medium_vendors: [2, 3],
      large_vendors: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      pair_status: '',
      vehicle_plate: '',
      pair_rider: '',
      visible2: false,
      showScheduledDiscountsMessage: false,
      pair_rider_image: '',
      pair_rider_name: '',
      pair_rider_rating: '',
      pair_rider_make: '',
      pair_rider_model: '',
      pair_rider_plate: '',
      triger: false,
      searchOption: false,
      failure_text: '',
      test_specifications: '',
      pass_msg: '',
      load_weight: '',
      loadWeightSet: false,
      loadWeightMask: '##.##',
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      standardOptions: [21, 22, 24],
      orderDiscountStatus: false,
      discountPercentage: 0,
      fullPayload: {},
      activeClass: 'small',
      recipientName: '',
      recipientPhone: '',
      vendor_id: 0,
    };
  },
  computed: {
    ...mapGetters({
      get_active_package_class: '$_orders/$_home/getActivePackageClass',
      get_active_vendor_name: '$_orders/$_home/getActiveVendorName',
      get_vendor_carrier_type: '$_orders/$_home/getCarrierType',
      getPriceRequestObject: '$_orders/$_home/getPriceRequestObject',
      getReturnStatus: '$_orders/$_home/getReturnStatus',
      activeVendorPriceData: '$_orders/$_home/getActiveVendorDetails',
      getMaxTemperature: '$_orders/$_home/getMaxTemperature',
      getCustomerMinAmount: '$_orders/$_home/getCustomerMinAmount',
      getDeliveryItem: '$_orders/$_home/getDeliveryItem',
      getLoadWeight: '$_orders/$_home/getLoadWeight',
      getLoadUnits: '$_orders/$_home/getLoadUnits',
      getAdditionalLoaderStatus: '$_orders/$_home/getAdditionalLoaderStatus',
      getNOOfLoaders: '$_orders/$_home/getNOOfLoaders',
      getOrderState: '$_orders/$_home/getOrderState',
      getPairRiderNextStep: '$_orders/$_home/getPairRiderNextStep',
      getOuterActiveVendorDetails: '$_orders/getOuterActiveVendorDetails',
      getOuterActivePackageClass: '$_orders/getOuterActivePackageClass',
      getOrderNotes: '$_orders/$_home/getOrderNotes',
      getPairWithRiderStatus: '$_orders/$_home/getPairWithRiderStatus',
      getVehicleDetails: '$_orders/$_home/getVehicleDetails',
      getCarrierType: '$_orders/$_home/getCarrierType',
      getStoreOrderPath: '$_orders/getStorePath',
    }),

    vehicleDetailsPlaceholder() {
      return 'Enter Full Number plate / Phone Number';
    },

    activePackageClassPriceData() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class,
        );
      }
      return '';
    },

    truckOptions() {
      if (this.get_active_package_class === 'medium') {
        return this.mediumOptions;
      }
      return this.largeOptions;
    },
    mediumOptions() {
      const customVendorOptions = [
        {
          value: '2',
          label: 'Any',
        },
      ];

      return customVendorOptions.concat(this.baseTruckOptions);
    },
    largeOptions() {
      if (this.activeVendorPriceData.vendor_id !== 25) {
        const customVendorOptions = {};
        if (Object.prototype.hasOwnProperty.call(this.activeVendorPriceData, 'available_options')) {
          if (this.activeVendorPriceData.available_options.refrigerated) {
            customVendorOptions.value = '3';
            customVendorOptions.label = 'Refrigerated';
          }

          if (this.activeVendorPriceData.available_options.flatbed) {
            customVendorOptions.value = '4';
            customVendorOptions.label = 'Flatbed';
          }
        }

        return this.baseTruckOptions.concat(customVendorOptions);
      }
      return this.freightVendorOptions;
    },

    getVendorNameOnCarrierType() {
      let vendorDispName = 'motorbike';
      if (this.get_active_package_class === 'medium') {
        vendorDispName = this.get_active_vendor_name;
      } else if (this.get_active_package_class === 'large') {
        vendorDispName = this.get_active_vendor_name;
      }
      return vendorDispName.toLowerCase();
    },

    getMaxAllowedWeight() {
      if (this.get_active_package_class === 'large') {
        const weight = Number(this.get_active_vendor_name.slice(0, -10));
        if (this.getLoadUnits !== 'tonnes') {
          return weight * 1000;
        }
        return weight;
      }
    },
    riderNameDisplay() {
      let displayPairName = 'rider';
      if (this.small_vendors.includes(this.activeVendorPriceData.vendor_id)) {
        displayPairName = 'rider';
      } else {
        displayPairName = 'driver';
      }
      return displayPairName.toLowerCase();
    },
  },
  watch: {
    recipientName(data) {
      this.debounceRecipientName(data);
    },
    recipientPhone(data) {
      this.debounceRecipientPhone(data);
    },
  },
  created() {
    this.setFirstTimeUser();
    this.initializeVendorComponent();
    this.initiateStoreData();
    this.reCheckCarrierType();
  },

  methods: {
    ...mapMutations({
      setActivePackageClass: '$_orders/$_home/setActivePackageClass',
      setActiveVendorName: '$_orders/$_home/setActiveVendorName',
      setActiveVendorDetails: '$_orders/$_home/setActiveVendorDetails',
      setCarrierType: '$_orders/$_home/setCarrierType',
      setMaxTemperature: '$_orders/$_home/setMaxTemperature',
      setCustomerMinAmount: '$_orders/$_home/setCustomerMinAmount',
      setDeliveryItem: '$_orders/$_home/setDeliveryItem',
      setLoadWeight: '$_orders/$_home/setLoadWeight',
      setLoadUnits: '$_orders/$_home/setLoadUnits',
      setAdditionalLoaderStatus: '$_orders/$_home/setAdditionalLoaderStatus',
      setNOOfLoaders: '$_orders/$_home/setNOOfLoaders',
      setOrderState: '$_orders/$_home/setOrderState',
      setExtendOptions: '$_orders/$_home/setExtendOptions',
      setScheduleTime: '$_orders/$_home/setScheduleTime',
      setOrderNotes: '$_orders/$_home/setOrderNotes',
      setPairWithRiderStatus: '$_orders/$_home/setPairWithRiderStatus',
      setPairWithRiderState: '$_orders/$_home/setPairWithRiderState',
      setPairSerialNumber: '$_orders/$_home/setPairSerialNumber',
      setPairRiderPhone: '$_orders/$_home/setPairRiderPhone',
      setOuterActiveVendorDetails: '$_orders/setOuterActiveVendorDetails',
      setOuterActivePackageClass: '$_orders/setOuterActivePackageClass',
      clearOuterActiveVendorDetails: '$_orders/clearOuterActiveVendorDetails',
      setTestSpecs: '$_orders/$_home/setTestSpecs',
      setLoadWeightStatus: '$_orders/$_home/setLoadWeightStatus',
      setLoadWeightValue: '$_orders/$_home/setLoadWeightValue',
      setVendorPrice: '$_orders/$_home/setVendorPrice',
      setVehicleDetails: '$_orders/$_home/setVehicleDetails',
      setStorePath: '$_orders/setStorePath',
      clearStorePath: '$_orders/clearStorePath',
      unsetStorePath: '$_orders/unsetStorePath',
      setWaypointNotes: '$_orders/setWaypointNotes',
      setPairErrorMessage: '$_orders/$_home/setPairErrorMessage',
    }),
    ...mapActions({
      requestPairRider: '$_orders/$_home/requestPairRider',
    }),
    // eslint-disable-next-line func-names
    debounceRecipientName: _.debounce(function (data) {
      this.triggerGAEvent('Client recipient name input - Order Placement Page - WebApp', data);
    }, 500),
    // eslint-disable-next-line func-names
    debounceRecipientPhone: _.debounce(function (data) {
      this.triggerGAEvent('Client recipient phone number input - Order Placement Page - WebApp', data);
    }, 500),
    dispatchCarrierType() {
      this.setCarrierType(this.carrier_type);
    },
    dispatchScheduleTime() {
      const dateTime = new Date();
      this.trackMixpanelEvent('Set Order Schedule Time', { 'Scheduled Time': this.schedule_time });
      if (this.schedule_time && dateTime > this.schedule_time) {
        this.schedule_time = new Date();
      }
      this.setScheduleTime(this.schedule_time);
      this.default_value = this.moment(this.schedule_time).format('HH:mm:ss');
    },
    addDestinationNotes(note, pathObj, i) {
      this.setWaypointNotes({
        index: i,
        notes: note,
      });
    },
    dispatchOrderNotes() {
      this.trackMixpanelEvent('Set Order Notes', { 'Order Notes': this.order_notes });
      this.setOrderNotes(this.order_notes);
    },
    dispatchPairStatus() {
      const status = this.pair_rider;
      if (status === '1') {
        // pair with rider
        this.setPairWithRiderStatus(true);
        this.setPairWithRiderState(true);
      } else {
        // do not pair
        this.setPairWithRiderStatus(false);
        this.setPairWithRiderState(false);
        this.setPairErrorMessage('');
      }
    },
    goToNextStep() {
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
            eventLabel: 'Continue Button - Order Placement Page - WebApp',
          });
        }
      } catch (er) {
        // ...
      }
      this.setDefaultCarrierType();
      this.setOrderState(2);
      this.setExtendOptions(true);
      this.handleScheduledTime();
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
    setDefaultCarrierType() {
      const session = this.$store.getters.getSession;
      let copStatus = false;
      if (session.default === 'biz') {
        const bizData = session[session.default];
        const data = Object.prototype.hasOwnProperty.call(bizData, 'default_carrier_type');
        if (data) {
          copStatus = true;
        }
      }

      if (this.vendor_id !== this.activeVendorPriceData.vendor_id) {
        if (this.large_vendors.includes(this.activeVendorPriceData.vendor_id)) {
          this.carrier_type = '1';
        } else if (this.medium_vendors.includes(this.activeVendorPriceData.vendor_id) && this.activeVendorPriceData.vendor_id === 2) {
          this.carrier_type = '0';
        } else if (this.medium_vendors.includes(this.activeVendorPriceData.vendor_id) && this.activeVendorPriceData.vendor_id === 3) {
          this.carrier_type = '2';
        } else if (copStatus) {
          this.carrier_type = session[session.default].default_carrier_type.toString(10);
        } else {
          this.carrier_type = '2';
        }
      } else {
        this.carrier_type = this.getCarrierType;
      }

      this.vendor_id = this.activeVendorPriceData.vendor_id;
    },
    goBackToHome() {
      this.schedule_time = '';
      this.setOrderState(1);
      this.setExtendOptions(false);
      this.pair_rider = '';
      this.vehicle_plate = '';
      this.clearOuterActiveVendorDetails();
    },
    dispatchDeliveryItem() {
      this.setDeliveryItem(this.delivery_item);
    },
    dispatchTestSpecs() {
      this.setTestSpecs(this.test_specifications);
    },
    dispatchLoadWeight() {
      this.setLoadWeightStatus(false);
      const val = this.load_weight;
      if (val === '') {
        this.pass_msg = 'Please enter the weight of your load';
      } else if (val >= 18.0 && val <= 33.0) {
        this.handleLoadweight(val);
        this.setLoadWeightStatus(true);
        this.pass_msg = '';
      } else {
        this.setLoadWeightStatus(false);
        this.pass_msg = 'The input should be between 18.00 and 33.00 Tonnes';
      }
    },
    handleLoadweight(val) {
      this.setLoadWeightStatus(true);
      const floatVal = parseFloat(val);
      if (floatVal === Math.floor(floatVal)) {
        const newValue = `${floatVal}.00`;
        this.setLoadWeightValue(newValue);
      } else {
        const newValue = floatVal.toFixed(2);
        this.setLoadWeightValue(newValue);
      }
    },
    dispatchLoadUnits(val) {
      this.setLoadUnits(val);
    },

    dispatchAdditionalLoaderStatus(val) {
      const track = this.additional_loader === 1
        ? this.trackMixpanelEvent('Selected Loader For Order', { 'Number of Loaders': val }) : '';
      this.setAdditionalLoaderStatus(val);
    },

    handleChangeInNumberOfLoaders(val) {
      this.setNOOfLoaders(val);
    },

    handleChangeInMaxTemperature(val) {
      this.setMaxTemperature(val);
    },

    handleChangeInMinAmount(val) {
      this.setCustomerMinAmount(val);
    },

    setActivePackageClassWrapper(name) {
      this.setActivePackageClass(name);
      this.setOuterActivePackageClass(name);
      this.reCheckCarrierType();
      this.trackMixpanelEvent(`Switch To Size: ${name}`);
      const activeData = this.activePackageClassPriceData.price_tiers[0];
      this.setVendorDetails(activeData);
      this.delivery_item = '';
      this.order_notes = '';
    },
    clearVehicleDetails() {
      this.vehicle_plate = '';
      this.setPairWithRiderStatus(false);
      this.visible2 = false;
      this.pair_status = '';
    },
    checkVehicleDetails() {
      const vehicleDetails = this.vehicle_plate;
      this.setPairRiderPhone('');
      this.setPairErrorMessage('');
      if (vehicleDetails === '') {
        this.doNotification(
          '2',
          'Vehicle number plate is not provided',
          'Please provide the vehicle details to pair',
        );
        this.setPairWithRiderStatus(false);
        this.visible2 = false;
        this.searchOption = false;
        this.pair_status = '';
      } else {
        this.searchOption = true;
        if (vehicleDetails.length > 6) {
          this.handlePairRequest(vehicleDetails);
        }
      }
    },
    updateData(value) {
      const val = value;
      this.pair_rider_image = val.rider_photo;
      this.pair_rider_name = val.rider_name;
      this.pair_rider_rating = parseInt(val.rider_rating, 10);
      this.pair_rider_make = val.make;
      this.pair_rider_model = val.model;
      this.pair_rider_plate = val.registration_no;

      this.visible2 = true;
      this.pair_status = '2';

      this.setPairWithRiderStatus(true);
      this.setPairSerialNumber(val.sim_card_sn);
      this.setPairRiderPhone(val.rider_phone);
      this.setVehicleDetails(this.vehicle_plate);
    },
    handlePairRequest(plate) {
      this.visible2 = false;
      this.pair_status = '';
      const checkInputType = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$');
      const res = checkInputType.test(plate);
      const payload = {};
      payload.vendor_type = this.activeVendorPriceData.vendor_id;
      if (res) {
        payload.phone_no = plate;
      } else {
        payload.registration_no = plate;
      }

      const fullPayload = {
        values: payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'pair_order_rider_details',
      };
      this.requestPairRider(fullPayload).then(
        (response) => {
          if (response.status) {
            this.trackMixpanelEvent('Paired Order With Rider', { 'Paired Rider': plate });
            this.updateData(response.data);
          } else {
            this.pair_status = '1';
            this.failure_text = response.message;
            this.setPairErrorMessage(response.message);
            this.visible2 = true;
            this.setPairWithRiderStatus(false);
          }
        },
        (error) => {
          const msg = error.response.data.message;
          this.pair_status = '1';
          this.failure_text = msg;
          this.setPairErrorMessage(msg);
          this.visible2 = true;
          this.setPairWithRiderStatus(false);
        },
      );
      this.searchOption = false;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },

    getPackageIcon(name) {
      return `https://images.sendyit.com/web_platform/vendor_size/v2/${name}.svg`;
    },

    getCurrentActivePackageClass(name) {
      return {
        'router-link-active': name === this.get_active_package_class,
      };
    },

    getCurrentActiveTendorTypeClass(name) {
      return {
        'home-view-vendor-types--item__active': name === this.get_active_vendor_name,
      };
    },
    getScheduledVendorTypeClass(vendorObject, code) {
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        if (code === 1) {
          return ['home-view-vendor-types--item__unavailable'];
        }
        if (code === 2) {
          return ['home-view-vendor-types--icon__unavailable'];
        }
        if (code === 3) {
          return ['home-view-vendor-types--extra__unavailable'];
        }
      }
      return '';
    },
    transformDate(vendorDetails) {
      if (Object.prototype.hasOwnProperty.call(vendorDetails, 'customer_eta')) {
        const localTime = this.convertToUTCToLocal(vendorDetails.customer_eta);
        return this.moment(localTime, 'YYYY-MM-DD HH:mm:ss').format('hh.mm a');
      }
      return this.moment()
        .add(vendorDetails.eta, 'seconds')
        .format('hh.mm a');
    },

    getPlainVendorPrice(vendorObject) {
      if (!this.getReturnStatus || this.vendors_without_return.includes(vendorObject.vendor_name)) {
        return vendorObject.cost;
      }
      return vendorObject.return_cost;
    },

    getVendorPrice(vendorObject) {
      return numeral(this.getPlainVendorPrice(vendorObject)).format('0,0');
    },
    getVendorCurrency(vendorObject) {
      return vendorObject.currency;
    },
    getMinVendorPrice(vendorObject) {
      const price = this.getPlainVendorPrice(vendorObject) * ((100 - vendorObject.price_variance) / 100);
      return numeral(price).format('0');
    },

    getMaxVendorPrice(vendorObject) {
      const price = this.getPlainVendorPrice(vendorObject) * ((100 + vendorObject.price_variance) / 100);
      return numeral(price).format('0');
    },

    isFixedCost(vendorObject) {
      const bidVendors = [20, 25];
      if (bidVendors.includes(vendorObject.vendor_id)) {
        if (!vendorObject.fixed_cost) {
          return false;
        }
        return true;
      }
      return true;
    },
    isStandardUnavailable(vendorObject) {
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        return true;
      }
      return false;
    },
    scheduleTimeFrame(vendorObject) {
      const dateTime = vendorObject.current_time;
      const localTime = this.convertToUTCToLocal(dateTime);
      const day = this.moment(localTime, 'YYYY-MM-DD HH:mm:ss').format('dddd');
      const timeHrs = this.moment(localTime, 'YYYY-MM-DD HH:mm:ss').format('HH');

      if (day === 'Sunday' && timeHrs >= '17') {
        return 'Schedule for tommorow';
      }
      if (day === 'Saturday' && timeHrs >= '17') {
        return 'Schedule for Monday 8:00 AM';
      }
      if (timeHrs < '07') {
        return 'Schedule for 8:00 AM';
      }
      if (timeHrs >= '17') {
        return 'Schedule for tommorow';
      }
      return '';
    },

    setFirstTimeUser() {
      const session = this.$store.getters.getSession;

      if (Object.prototype.hasOwnProperty.call(session, 'first_time')) {
        if (session.first_time) {
          this.first_time = true;
        }
      }
    },

    destroyVendorComponent() {
      if (this.recipientPhone && this.recipientName) {
        this.submitMail();
        this.triggerGAEvent('Order Placement with Recipient Inputs - Order Placement Page - WebApp', '');
      }
      this.setActiveVendorName('');
      this.setActiveVendorDetails({});
      this.setCarrierType(this.carrier_type);
      this.$emit('vendorComponentDestroyed');
      this.$destroy();
    },

    getCarrierBoxName() {
      return this.get_active_package_class === 'small' ? 'Box' : 'Closed';
    },

    getCarrierNoBoxName() {
      return this.get_active_package_class === 'small' ? 'No Box' : 'Open';
    },

    expandVendorOptions(vendor) {
      return (
        !this.vendors_with_fixed_carrier_type.includes(vendor.vendor_name)
        && vendor.vendor_name === this.get_active_vendor_name
      );
    },

    setVendorDetails(vendorObject) {
      this.setActiveVendorName(vendorObject.vendor_name);
      this.setActiveVendorDetails(vendorObject);
      this.setOuterActiveVendorDetails(vendorObject);
      this.reCheckCarrierType();
      this.trackMixpanelEvent(`Select Vendor: ${vendorObject.vendor_name}`);
    },

    reCheckCarrierType() {
      if (this.get_active_package_class === 'large') {
        this.carrier_type = '1';
      } else if (this.get_active_package_class === 'medium') {
        this.carrier_type = '2';
      } else {
        this.carrier_type = '2';
      }
      this.dispatchCarrierType();
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
    initializeVendorComponent() {
      this.carrier_type = this.get_vendor_carrier_type;
      this.number_of_loaders = this.getNOOfLoaders;
      this.max_temperature = this.getMaxTemperature;
      this.delivery_item = this.getDeliveryItem;
      this.load_weight = this.getLoadWeight;
      this.load_units = this.getLoadUnits;
      this.additional_loader = this.getAdditionalLoaderStatus;
      this.customer_min_amount = this.getCustomerMinAmount;
      this.order_notes = this.getOrderNotes;
      this.pair_rider = this.getPairWithRiderStatus ? '1' : '';
      this.vehicle_plate = this.getVehicleDetails;
    },
    initiateStoreData() {
      const activeVendorName = this.getOuterActiveVendorDetails;
      const activeVendorClass = this.getOuterActivePackageClass;
      if ('vendor_name' in activeVendorName && activeVendorClass !== '') {
        this.setActiveVendorName(activeVendorName.vendor_name);
        this.setActivePackageClass(activeVendorClass);
        this.setActiveVendorDetails(activeVendorName);
        this.setDefaultCarrierType();
        this.setOrderState(2);
        this.setExtendOptions(true);
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

    getVendorDescription(vendorObject) {
      const standardOrders = [22, 24];
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        return 'Unavailable right now';
      }
      if (standardOrders.includes(vendorObject.vendor_id)) {
        return 'In 2 to 4 hours';
      }
      if (vendorObject.vendor_id === 25) {
        return 'From 18 Tonnes';
      }
      return vendorObject.vendor_description;
    },
    getPickUpDescriptText(vendorObject) {
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        return 'Schedule time';
      }
      return 'Pick up time for your order';
    },
    isTestAccount() {
      const session = this.$store.getters.getSession;
      const testAccount = session.test_account;
      if (testAccount) {
        return true;
      }
      return false;
    },
    disabledDueDate(date) {
      if (this.standardOptions.includes(this.activeVendorPriceData.vendor_id)) {
        return date.getDay() === 0 || date.getTime() < Date.now() - 8.64e7;
      }
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    handleScheduledTime() {
      if (Object.prototype.hasOwnProperty.call(this.activeVendorPriceData, 'current_time')) {
        const dateTime = this.activeVendorPriceData.current_time;
        const day = this.moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('dddd');
        const timeHrs = this.moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format('HH');

        if (this.standardOptions.includes(this.activeVendorPriceData.vendor_id)) {
          if (day === 'Sunday' && timeHrs >= '17') {
            const newDate = `${this.moment(dateTime)
              .add(1, 'days')
              .format('YYYY-DD-MM')} 07:00`;
            this.schedule_time = this.moment(newDate, 'YYYY-DD-MM HH:mm').format(
              'YYYY-MM-DD HH:mm:ss Z',
            );
          } else if (day === 'Saturday' && timeHrs >= '17') {
            const newDate = `${this.moment(dateTime)
              .add(2, 'days')
              .format('YYYY-DD-MM')} 07:00`;
            this.schedule_time = this.moment(newDate, 'YYYY-DD-MM HH:mm').format(
              'YYYY-MM-DD HH:mm:ss Z',
            );
          } else if (timeHrs < '07') {
            const newDate = `${this.moment(dateTime).format('YYYY-DD-MM')} 07:00`;
            this.schedule_time = this.moment(newDate, 'YYYY-DD-MM HH:mm').format(
              'YYYY-MM-DD HH:mm:ss Z',
            );
          } else if (timeHrs >= '17') {
            const newDate = `${this.moment(dateTime)
              .add(1, 'days')
              .format('YYYY-DD-MM')} 07:00`;
            this.schedule_time = this.moment(newDate, 'YYYY-DD-MM HH:mm').format(
              'YYYY-MM-DD HH:mm:ss Z',
            );
          }
          this.dispatchScheduleTime();
        }
      }
    },
    submitMail() {
      // eslint-disable-next-line global-require
      const portalId = '4951975';
      const formId = 'c2ffd971-6f9b-43e0-a8b2-30fd94f29d4b';
      const fields = {
        fields: [
          {
            name: 'recipient_name',
            value: this.recipientName,
          },
          {
            name: 'firstname',
            value: this.recipientName,
          },
          {
            name: 'recipient_phone',
            value: this.recipientPhone,
          },
          {
            name: 'phone',
            value: this.recipientPhone,
          },
        ],
      };
      const payload = {
        values: fields,
        app: 'HUBSPOT_URL',
        vm: this,
        endpoint: `${portalId}/${formId}`,
      };

      this.$store
        .dispatch('requestAxiosPost', payload)
        .then(response => response)
        .catch(err => err);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=3';
</style>
