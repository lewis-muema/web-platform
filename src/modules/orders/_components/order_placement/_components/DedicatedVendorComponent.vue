<template lang="html">
  <div
    v-if="getOrderState === 1"
    class="home-view-vendor-and-optins-wrappper dedicated-vendors-wrapper"
  >
    <div class="home-view--seperator" />
    <div class="homeview--form__header homeview--form__header-lower">
      {{ $t('general.load_size_and_delivery_type') }}
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
          <span class="tour-pointer-3" />
          <!-- start vendor types loop -->
          <div
            v-for="(j, i) in activePackageClassPriceData.price_tiers"
            :key="j.order_no"
          >
            <div
              class="home-view-vendor-types--item home-view-vendor-types-item-wrap"
              :class="[
                getScheduledVendorTypeClass(j, 1),
                getCurrentActiveTendorTypeClass(j.tally),
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
              <div
                class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper"
                :class="vendorCounter === 'select' ? 'dedicated-vendor-items-select': ''"
              >
                <div
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left"
                  :class="isFixedCost(j) && vendorCounter === 'increment' ? 'dedicated-vendor-items-divider': ''"
                >
                  <div class="home-view-vendor-types-item--cost-wrapper__cost">
                    <span v-if="!isFixedCost(j)">
                      {{ $t('general.price_to_be_confirmed') }}
                    </span>
                    <span v-else> {{ getVendorCurrency(j) }} {{ getVendorPrice(j) }} </span>
                  </div>
                  <div class="home-view-vendor-types-item--cost-wrapper_time">
                    <span v-if="j.price_type">
                      {{ $t('general.type') }}: {{ formatPriceType(j.price_type) }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="isFixedCost(j) && !isStandard(j) && vendorCounter === 'increment'"
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right"
                >
                  <span>
                    <i
                      class="el-icon-minus dedicated-minus-icon"
                      :class="getScheduledVendorTypeClass(j, 4)"
                      @click="vendorTally(j, i, '-')"
                    />
                  </span>
                  <span :class="getScheduledVendorTypeClass(j, 1)">
                    {{ j.tally }}
                  </span>
                  <span>
                    <i
                      class="el-icon-plus dedicated-plus-icon"
                      :class="getScheduledVendorTypeClass(j, 4)"
                      @click="vendorTally(j, i, '+')"
                    />
                  </span>
                </div>
                <div v-if="isFixedCost(j) && !isStandard(j) && vendorCounter === 'select'">
                  <el-select
                    v-model="j.tally"
                    class="home-view-vendor-select-vendor-number"
                    @change="changeTally(j, i, $event)"
                  >
                    <el-option
                      v-for="(number, v) in numberArray"
                      :key="v"
                      :value="number.value"
                      :label="number.label"
                    >
                      {{ number.label }}
                    </el-option>
                  </el-select>
                </div>
                <div
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right info-icon-spacer"
                >
                  <el-popover
                    :placement="$t('general.right')"
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
        {{ $t('general.continue') }}
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
        >
          <div
            class=""
            @click="goBackToHome"
          >
            <i class="el-icon-back back-to-home-btn" />
          </div>
          <i
            v-if="activeVendorTally.length > 3"
            class="el-icon-caret-left"
            @click="scroll('right')"
          />
          <div class="home-view-vendor-types-carrier-container">
            <div
              v-for="activeVendor in activeVendorTally"
              :key="activeVendor.vendor_id"
              class="home-view-vendor-types-carrier"
            >
              <div class="vendor__img_pstn">
                <img
                  class="home-view-vendor-types-item__image home-view-vendor-types-item__image-dedicated"
                  :src="getVendorIcon(activeVendor.vendor_id)"
                  alt=""
                >
              </div>
              <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                <div class="home-view-vendor-types-item-vendor--vendor-formal-name-dedicated">
                  {{ activeVendor.vendor_name }} ({{ activeVendor.tally }})
                </div>
              </div>
            </div>
          </div>
          <i
            v-if="activeVendorTally.length > 3"
            class="el-icon-caret-right"
            @click="scroll('left')"
          />
          <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
            <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left">
              <div class="home-view-vendor-types-item--cost-wrapper__cost">
                <span>
                  {{ getPriceRequestObject.currency }}
                  {{ getTallyVendorPrice() }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <!-- start carrier type section -->
        <div class="home-view-carrier-type">
          <!-- start large /medium vendors -->
          <div class="home-view-truck-options-wrapper">
            <div class="home-view-truck-options-divider" />
            <span class="tour-pointer-4" />
            <div
              v-if="!vehicleDetailsStatus"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-label home-view-truck-options-vehicle-type">
                <div
                  class="home-view-truck-options-vehicle-type-title"
                  @click="vehicleDetailsStatus = !vehicleDetailsStatus; $root.$emit('tour class hidden', 1);"
                >
                  {{ $t('general.vehicle_type') }}
                  <i class="el-icon-arrow-down home-view-truck-options-vehicle-arrow" />
                </div>
              </div>
            </div>
            <div
              v-if="vehicleDetailsStatus"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-label home-view-truck-options-vehicle-type">
                <div
                  class="home-view-truck-options-vehicle-type-title"
                  @click="vehicleDetailsStatus = !vehicleDetailsStatus"
                >
                  {{ $t('general.vehicle_type') }}
                  <i class="el-icon-arrow-up home-view-truck-options-vehicle-arrow" />
                </div>
                <div
                  v-for="(activeVendor, index) in expandedActiveVendorTally"
                  :key="index"
                  class="dedicated-vendor-container"
                >
                  <img
                    class="home-view-vendor-types-item__image dedicated-vendor-icon"
                    :src="getVendorIcon(activeVendor.vendor_id)"
                    alt=""
                  >
                  <el-select
                    v-model="expandedActiveVendorTally[index].carrier_type"
                    :disabled="vendors_with_fixed_carrier_type.includes(activeVendor.vendor_name)"
                    class="dedicated-vendor-select"
                    popper-class="dedicated-vendor-popper-class"
                    @change="changeCarrierType($event, index)"
                  >
                    <el-option
                      v-for="option in vendorOptions(activeVendor.vendor_id)"
                      :key="option.value"
                      :value="option.value"
                      :label="`${![3].includes(activeVendor.vendor_id) ? option.label : ''} ${![1].includes(activeVendor.vendor_id) ? activeVendor.vendor_name : ''}`"
                    >
                      {{ ![3].includes(activeVendor.vendor_id) ? option.label : '' }} {{ ![1].includes(activeVendor.vendor_id) ? activeVendor.vendor_name : '' }}
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                {{ $t('general.want_delivered') }}
              </div>
              <div>
                <el-input
                  v-model.trim="delivery_item"
                  autocomplete="true"
                  @change="dispatchDeliveryItem"
                  @blur="sendGA4Events('add_item_details')"
                />
              </div>
            </div>
            <div
              v-if="isTestAccount()"
              class="home-view-truck-options-inner-wrapper"
            >
              <div class="home-view-truck-options-label">
                {{ $t('general.test_specifications') }}
              </div>
              <div>
                <el-input
                  v-model.trim="test_specifications"
                  autocomplete="true"
                  :placeholder="$t('general.specification')"
                  @change="dispatchTestSpecs"
                />
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                {{ $t('general.pickup_time_for_order') }}
              </div>
              <div class="block">
                <el-date-picker
                  v-model="schedule_time"
                  class="vendor_component-actions__element-date"
                  type="date"
                  format="dd-MM-yyyy"
                  :placeholder="$t('general.asap')"
                  prefix-icon="el-icon-date"
                  :picker-options="dueDatePickerOptions"
                  @change="dispatchScheduleTime"
                />
                <span class="tour-pointer-5" />
              </div>
              <div
                v-if="StartTime && EndTime && schedule_time"
                class="block vendor_component-actions__element-time"
              >
                <p class="vendor_component-actions__title">
                  {{ $t('general.select_time') }}
                </p>
                <el-time-picker
                  v-model="time_range_from"
                  arrow-control
                  class="vendor_component-actions__input-time"
                  type="date"
                  format="hh:mm:ss a"
                  :placeholder="$t('general.from')"
                  :picker-options="{selectableRange: `${StartTime} - ${EndTime}`}"
                  @change="setStartHours"
                />
                <span class="vendor_component-actions__divider">-</span>
                <el-time-picker
                  v-model="time_range_to"
                  arrow-control
                  class="vendor_component-actions__input-time"
                  type="date"
                  format="hh:mm:ss a"
                  :placeholder="$t('general.to')"
                  :picker-options="{selectableRange: `${toStartTime} - ${EndTime}`}"
                  @change="setEndHours"
                />
                <span class="tour-pointer-6" />
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper recipient-section">
              <p class="home-view-truck-options-label no-margin">
                {{ $t('general.recipient_details') }}
              </p>
              <input
                v-model="recipientName"
                type="text"
                :placeholder="$t('general.name')"
                class="el-input__inner bottom-spacer"
              >
              <input
                v-model="recipientPhone"
                type="number"
                :placeholder="$t('general.phone_number')"
                class="el-input__inner"
              >
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                {{ $t('general.additional_instructions') }}
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
                  :placeholder=" $t('general.instructions')"
                />
              </div>
            </div>

            <!-- show large and medium extended options -->
            <div v-if="hasLargeVendor">
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{ $t('general.provide_with_loaders') }}
                </div>
                <div class="">
                  <el-radio
                    v-model="additional_loader"
                    label="1"
                    @change="dispatchAdditionalLoaderStatus"
                  >
                    {{ $t('general.yes') }}
                  </el-radio>
                  <el-radio
                    v-model="additional_loader"
                    label="0"
                    @change="dispatchAdditionalLoaderStatus"
                  >
                    {{ $t('general.no') }}
                  </el-radio>
                </div>
              </div>

              <div
                v-if="Number(additional_loader) === 1"
                class="home-view-truck-options-inner-wrapper"
              >
                <div class="home-view-truck-options-label">
                  {{ $t('general.loaders_required') }}
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
            <div v-if="![22, 24].includes(activeVendorPriceData.vendor_id)">
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{ $t('general.have_preffered_drivers') }}
                </div>
                <div class="">
                  <div
                    class="pair_rider_section-variant"
                    @click="pairWithDrivers()"
                  >
                    {{ $t('general.pair_with_driver') }}
                    <i class="el-icon-circle-plus-outline pair-plus-icon" />
                  </div>
                </div>
                <div
                  v-if="pairedDriversTally > 0"
                  class="pair-success-container"
                >
                  <i class="el-icon-success pair-success-icon" />
                  {{ $t('general.you_have_selected_to_pair',{pairedDriversTally: pairedDriversTally}) }}
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
import PaymentOptions from './DedicatedPaymentOptions.vue';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';

export default {
  components: {
    PaymentOptions,
  },
  mixins: [TimezoneMxn, EventsMixin],
  data() {
    return {
      first_time: false,
      popover_visible: false,
      additional_loader: false,
      carrier_type: '1',
      number_of_loaders: 1,
      delivery_item: '',
      discount_timed_out: false,
      vendors_with_fixed_carrier_type: ['Standard', 'Runner', 'Van', '3T Truck', '5T Truck', '7T Truck', '10T Truck', '14T Truck', '20T Truck', '24T Truck'],
      vendors_without_return: ['Standard', 'Runner'],
      schedule_time: '',
      time_range_from: '',
      time_range_to: '',
      order_notes: '',
      small_vendors: [1, 22, 21, 23, 28],
      medium_vendors: [2, 3],
      large_vendors: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      baseTruckOptions: [
        {
          value: '0',
          label: this.$t('general.open'),
        },
        {
          value: '1',
          label: this.$t('general.closed'),
        },
        {
          value: '2',
          label: this.$t('general.any'),
        },
      ],
      smallVendorOptions: [
        {
          value: '0',
          label: this.$t('general.bike_without_box'),
        },
        {
          value: '1',
          label: this.$t('general.bike_with_box'),
        },
        {
          value: '2',
          label: this.$t('general.any'),
        },
      ],
      visible2: false,
      showScheduledDiscountsMessage: false,
      triger: false,
      searchOption: false,
      failure_text: '',
      test_specifications: '',
      pass_msg: '',
      loadWeightSet: false,
      loadWeightMask: '##.##',
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      startHour: '06:00:00',
      EndTime: '18:00:00',
      StartTime: '',
      standardOptions: [21, 22, 24],
      orderDiscountStatus: false,
      discountPercentage: 0,
      fullPayload: {},
      activeClass: 'small',
      recipientName: '',
      recipientPhone: '',
      vendor_id: 0,
      priceRequestData: [],
      activeVendorTally: [],
      expandedActiveVendorTally: [],
      vehicleDetailsStatus: false,
      selectStatus: true,
      vendorCounter: 'select',
    };
  },
  computed: {
    ...mapGetters({
      get_max_destinations: '$_orders/$_home/getMaxDestinations',
      get_active_package_class: '$_orders/$_home/getActivePackageClass',
      get_vendor_carrier_type: '$_orders/$_home/getCarrierType',
      getPriceRequestObject: '$_orders/$_home/getPriceRequestObject',
      getOuterPriceRequestObject: '$_orders/getOuterPriceRequestObject',
      getReturnStatus: '$_orders/$_home/getReturnStatus',
      activeVendorPriceData: '$_orders/$_home/getActiveVendorDetails',
      getDeliveryItem: '$_orders/$_home/getDeliveryItem',
      getAdditionalLoaderStatus: '$_orders/$_home/getAdditionalLoaderStatus',
      getNOOfLoaders: '$_orders/$_home/getNOOfLoaders',
      getOrderState: '$_orders/$_home/getOrderState',
      getPairRiderNextStep: '$_orders/$_home/getPairRiderNextStep',
      getOuterActiveVendorDetails: '$_orders/getOuterActiveVendorDetails',
      getOuterActivePackageClass: '$_orders/getOuterActivePackageClass',
      getOrderNotes: '$_orders/$_home/getOrderNotes',
      getVehicleDetails: '$_orders/$_home/getVehicleDetails',
      getCarrierType: '$_orders/$_home/getCarrierType',
      getExpandedActiveVendorTally: '$_orders/getExpandedActiveVendorTally',
      pairedDriversTally: '$_orders/getPairedDriversTally',

    }),

    activePackageClassPriceData() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class,
        );
      }
      return '';
    },

    numberArray() {
      const numberArray = [];
      for (let i = 0; i < this.get_max_destinations + 1; i++) {
        numberArray.push({
          label: `${i}`,
          value: i,
        });
      }
      return numberArray;
    },

    toStartTime() {
      if (this.time_range_from) {
        return this.moment(this.time_range_from).format('HH:mm:ss');
      }
      return this.StartTime;
    },

    hasLargeVendor() {
      const vendors = [];
      this.activeVendorTally.forEach((row) => {
        if (this.large_vendors.includes(row.vendor_id)) {
          vendors.push(row.vendor_id);
        }
      });
      return vendors.length > 0;
    },

  },
  watch: {
    recipientName(data) {
      this.debounceRecipientName(data);
    },
    recipientPhone(data) {
      this.debounceRecipientPhone(data);
    },
    schedule_time(val) {
      if (val) {
        this.$root.$emit('tour class', 5, 0);
      } else {
        this.$root.$emit('tour class', 4, 0);
      }
    },
  },
  created() {
    this.setFirstTimeUser();
    this.initializeVendorComponent();
    this.initiateStoreData();
  },

  methods: {
    ...mapMutations({
      setActivePackageClass: '$_orders/$_home/setActivePackageClass',
      setActiveVendorName: '$_orders/$_home/setActiveVendorName',
      setActiveVendorDetails: '$_orders/$_home/setActiveVendorDetails',
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
      setScheduleEndTime: '$_orders/$_home/setScheduleEndTime',
      setOrderNotes: '$_orders/$_home/setOrderNotes',
      setPairWithRiderStatus: '$_orders/$_home/setPairWithRiderStatus',
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
      setOuterPriceRequestObject: '$_orders/setOuterPriceRequestObject',
      setActiveVendorTally: '$_orders/setActiveVendorTally',
      setExpandedActiveVendorTally: '$_orders/setExpandedActiveVendorTally',
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
    dispatchScheduleTime() {
      const dateTime = new Date();
      if (this.schedule_time) {
        const startingHours = new Date(this.schedule_time.getFullYear(), this.schedule_time.getMonth(), this.schedule_time.getDate(), this.startHour.split(':')[0], 0);
        const endingHours = new Date(this.schedule_time.getFullYear(), this.schedule_time.getMonth(), this.schedule_time.getDate(), this.EndTime.split(':')[0], 0);
        if (dateTime < endingHours && dateTime > startingHours) {
          this.schedule_time = new Date();
          this.time_range_from = this.schedule_time;
          this.time_range_to = endingHours;
          this.StartTime = this.moment(this.schedule_time).format('HH:mm:ss');
        } else {
          this.time_range_from = startingHours;
          this.time_range_to = endingHours;
          this.StartTime = this.moment(this.startHour, 'HH:mm:ss').format('HH:mm:ss');
        }
        this.setScheduleTime(this.time_range_from);
        this.setScheduleEndTime(this.time_range_to);
        this.sendGA4Events('add_delivery_date', {from_date: this.moment(this.schedule_time).format('DD-MM-YYYY')});
      } else {
        this.setScheduleTime('');
        this.setScheduleEndTime('');
      }
    },

    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

    formatPriceType(type) {
      const name = type.replace(/_/g, ' ');
      return name.charAt(0).toUpperCase() + name.slice(1);
    },

    pairWithDrivers() {
      this.$root.$emit('Pairing status', true);
      this.sendGA4Events('select_pair_with_driver');
    },

    vendorOptions(id) {
      if (this.small_vendors.includes(id)) {
        return this.smallVendorOptions;
      }
      return this.baseTruckOptions;
    },
    changeCarrierType(option, index) {
      this.expandedActiveVendorTally[index].carrier_type = option;
      this.selectStatus = false;
      this.selectStatus = true;
      this.$root.$emit('tour class', 4, 0);
      const carrierName = this.vendorOptions(this.expandedActiveVendorTally[index].vendor_id).filter(
        data => data.value === option,
      );
      this.sendGA4Events('select_carrier_type', {vendor_id: this.expandedActiveVendorTally[index].vendor_id, carrier_type: carrierName[0].label});
    },
    setStartHours() {
      this.setScheduleTime(this.time_range_from);
      this.sendGA4Events('add_delivery_time', {from_time: this.moment(this.time_range_from).format('HH:mm:ss')});
    },
    setEndHours() {
      this.setScheduleEndTime(this.time_range_to);
    },
    dispatchOrderNotes() {
      this.setOrderNotes(this.order_notes);
      this.sendGA4Events('add_instruction');
    },
    goToNextStep() {
      this.activeVendorTally = [];
      this.expandedActiveVendorTally = [];
      this.getPriceRequestObject.economy_price_tiers.forEach((row) => {
        row.price_tiers.forEach((row1) => {
          if (row1.tally > 0) {
            this.activeVendorTally.push(row1);
            for (let i = 0; i < row1.tally; i++) {
              if (row1.vendor_id === 3) {
                row1.carrier_type = '0';
              } else if (this.vendors_with_fixed_carrier_type.includes(row1.vendor_name)) {
                row1.carrier_type = '1';
              } else {
                row1.carrier_type = '';
              }
              this.expandedActiveVendorTally.push(row1);
            }
          }
        });
      });
      this.$root.$emit('tour class', 3, 0);
      const tallyObject = [];
      this.expandedActiveVendorTally.forEach((row, x) => {
        const vendorObject = {};
        Object.keys(row).forEach((row1, i) => {
          vendorObject[row1] = Object.values(row)[i];
        });
        vendorObject.index = x;
        tallyObject.push(vendorObject);
      });
      this.expandedActiveVendorTally = tallyObject;
      if (this.activeVendorTally.length > 0) {
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
        this.setActiveVendorTally(this.activeVendorTally);
        this.setExpandedActiveVendorTally(this.expandedActiveVendorTally);
        this.setOrderState(2);
        this.setExtendOptions(true);
      } else {
        this.doNotification(
          2,
          this.$t('general.no_vendor_selected'),
          this.$t('general.select_no_of_vehicles_per_vendor'),
        );
      }
    },
    scroll(side) {
      if (side === 'left') {
        document.querySelector('.home-view-vendor-types-carrier-container').scrollLeft += 60;
      } else {
        document.querySelector('.home-view-vendor-types-carrier-container').scrollLeft -= 60;
      }
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

    goBackToHome() {
      this.schedule_time = '';
      this.setOrderState(1);
      this.setExtendOptions(false);
      this.clearOuterActiveVendorDetails();
      this.$root.$emit('tour class', 2, 500);
    },
    dispatchDeliveryItem() {
      this.setDeliveryItem(this.delivery_item);
    },
    dispatchTestSpecs() {
      this.setTestSpecs(this.test_specifications);
    },

    dispatchAdditionalLoaderStatus(val) {
      this.setAdditionalLoaderStatus(val);
      if (val === '1') {
        this.sendGA4Events('select_loaders');
      }
    },

    handleChangeInNumberOfLoaders(val) {
      this.setNOOfLoaders(val);
      this.sendGA4Events('add_loaders', {add_loaders: val});
    },

    setActivePackageClassWrapper(name) {
      this.sendGA4Events(`select_size_${name}_load`);
      this.setActivePackageClass(name);
      this.setOuterActivePackageClass(name);
      this.trackMixpanelEvent(`Switch To Size: ${name}`);
      this.delivery_item = '';
      this.order_notes = '';
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

    getCurrentActiveTendorTypeClass(tally) {
      return {
        'home-view-vendor-types--item__active': tally > 0,
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
        if (code === 4) {
          return ['home-view-vendor-types--picker__unavailable'];
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

    getTallyVendorPrice() {
      let total = 0;
      this.activeVendorTally.forEach((row) => {
        total = (this.getPlainVendorPrice(row) * row.tally) + total;
      });
      return total;
    },

    getVendorPrice(vendorObject) {
      return numeral(this.getPlainVendorPrice(vendorObject)).format('0,0');
    },
    getVendorCurrency(vendorObject) {
      return vendorObject.currency;
    },

    isFixedCost(vendorObject) { // gone
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
    isStandard(vendorObject) {
      if (this.standardOptions.includes(vendorObject.vendor_id)) {
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
        return this.$t('general.schedule_for_tommorow');
      }
      if (day === 'Saturday' && timeHrs >= '17') {
        return this.$t('general.schedule_for_monday_eight');
      }
      if (timeHrs < '07') {
        return this.$t('general.schedule_for_eight');
      }
      if (timeHrs >= '17') {
        return this.$t('general.schedule_for_tommorow');
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
      this.$emit('vendorComponentDestroyed');
      this.$destroy();
    },

    vendorTally(vendorObject, index, type) {
      if (type === '+') {
        vendorObject.tally += 1;
      } else if (type === '-') {
        vendorObject.tally = vendorObject.tally > 0 ? vendorObject.tally - 1 : 0;
      }
      const tier = this.get_active_package_class;
      this.getPriceRequestObject.economy_price_tiers.forEach((row, i) => {
        if (row.tier_group === this.get_active_package_class) {
          row.price_tiers[index].tally = vendorObject.tally;
          row.price_tiers[index].economy_price_tiers_index = i;
          row.price_tiers[index].price_tiers_index = index;
        }
      });
      this.sendGA4Events(`select_${vendorObject.vendor_name.replace(' ', '_').toLowerCase()}`);
      this.sendGA4Events('add_number_vehicles', {vehicle_type: vendorObject.vendor_name, number_of_vehicles: vendorObject.tally});
      this.setOuterPriceRequestObject(this.getPriceRequestObject);
      this.setActivePackageClass('');
      this.setActivePackageClass(tier);

    },
    changeTally(vendorObject, index, value) {
      vendorObject.tally = value;
      const tier = this.get_active_package_class;
      this.getPriceRequestObject.economy_price_tiers.forEach((row, i) => {
        if (row.tier_group === this.get_active_package_class) {
          row.price_tiers[index].tally = vendorObject.tally;
          row.price_tiers[index].economy_price_tiers_index = i;
          row.price_tiers[index].price_tiers_index = index;
        }
      });
      this.sendGA4Events(`select_${vendorObject.vendor_name.replace(' ', '_').toLowerCase()}`);
      this.sendGA4Events('add_number_vehicles', {vehicle_type: vendorObject.vendor_name, number_of_vehicles: vendorObject.tally})
      this.setOuterPriceRequestObject(this.getPriceRequestObject);
      this.setActivePackageClass('');
      this.setActivePackageClass(tier);
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
      this.number_of_loaders = this.getNOOfLoaders;
      this.delivery_item = this.getDeliveryItem;
      this.additional_loader = this.getAdditionalLoaderStatus;
      this.order_notes = this.getOrderNotes;
    },
    initiateStoreData() {
      this.priceRequestData = this.getPriceRequestObject.economy_price_tiers;
      const activeVendorName = this.getOuterActiveVendorDetails;
      const activeVendorClass = this.getOuterActivePackageClass;
      this.sendGA4Events(`select_size_${activeVendorClass}_load`);
      this.$root.$emit('tour class', 2, 0);
      if ('vendor_name' in activeVendorName && activeVendorClass !== '') {
        this.setActiveVendorName(activeVendorName.vendor_name);
        this.setActivePackageClass(activeVendorClass);
        this.setActiveVendorDetails(activeVendorName);
        this.setOrderState(2);
        this.setExtendOptions(true);
      }
    },

    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = {
        title,
        level,
        message,
      };
      this.$store.commit('setNotification', notification);
    },

    getVendorDescription(vendorObject) {
      const standardOrders = [22, 24];
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        return this.$t('general.unavailable_right_now');
      }
      if (standardOrders.includes(vendorObject.vendor_id)) {
        return this.$t('general.in_2_4_hours');
      }
      if (vendorObject.vendor_id === 25) {
        return this.$t('general.from_eighteen_tonnes');
      }
      const description = vendorObject.vendor_description.replace("<p>", "").replace("</p>", "");
      return description;
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
      const dateTime = new Date();
      if (this.moment(dateTime).format('HH:mm:ss') > this.moment(this.EndTime, 'HH:mm:ss').format('HH:mm:ss')) {
        return date.getTime() < Date.now() || date.getTime() > Date.now() + 8.64e7 * 31;
      }
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
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
@import '../../../../../assets/styles/orders_order_placement_vendors.css';
.tour-pointer-3 {
  float: right;
  position: relative;
  left: 10px;
}
.tour-pointer-4 {
  float: right;
  position: relative;
  right: 5px;
  top: 5px;
}
.info-icon-spacer {
  padding: 0px 0px 0px 5px;
}
</style>
