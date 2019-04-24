<template lang="html">
  <div class="home-view-vendor-and-optins-wrappper" v-if="getOrderState === 1">
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
                />
                <span class="home-view-vendor-classes-menu--span">
                  {{ vendor_class.tier_group }}
                </span>
              </a>
            </div>
          </div>
        </div>

        <!-- start vendor types wrapper -->
        <div v-if="activePackageClassPriceData !== ''" class="home-view-vendor-types">
          <!-- start vendor types loop -->
          <div
            v-for="j in activePackageClassPriceData.price_tiers"
            :key="j.order_no"
            @click="setVendorDetails(j)"
          >
            <div
              class="home-view-vendor-types--item home-view-vendor-types-item-wrap"
              :class="getCurrentActiveTendorTypeClass(j.vendor_name)"
            >
              <!-- start vendor wrapper -->
              <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
                <div class="home-view-vendor-types-item--vendor-wrapper__img">
                  <img
                    class="home-view-vendor-types-item__image"
                    :src="getVendorIcon(j.vendor_id)"
                    alt=""
                  />
                </div>
                <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                  <div class="home-view-vendor-types-item-vendor--vendor-formal-name">
                    {{ j.vendor_name }}
                  </div>
                  <div class="home-view-vendor-types-item-vendor--vendor-local-name">
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
                    <span v-else> Ksh {{ getVendorPrice(j) }} </span>
                  </div>
                  <div class="home-view-vendor-types-item--cost-wrapper_time">
                    Pickup by {{ transformDate(j) }}
                  </div>
                </div>

                <div
                  class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right"
                >
                  <el-popover placement="right" width="350" trigger="hover">
                    <div class="reset-font" v-html="j.tier_description" />
                    <span slot="reference">
                      <i class="el-icon-info" />
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
    <div v-if="get_active_package_class !== ''" class="">
      <button
        type="button"
        class="button-primary home-view--place-order"
        name="button"
        v-on:click="goToNextStep"
      >
        Continue
      </button>
    </div>
  </div>

  <div class="extended-options-wrappper" v-else>
    <!-- start carrier type transition -->
    <transition name="home-carrier-type-fade">
      <div class="home-view-vendor-types-item-wrap home-next-step">
        <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
          <div class="" v-on:click="goBackToHome">
            <i class="el-icon-back back-to-home-btn"></i>
          </div>
          <div class="home-view-vendor-types-item--vendor-wrapper__img vendor__img_pstn">
            <img
              class="home-view-vendor-types-item__image"
              :src="getVendorIcon(activeVendorPriceData.vendor_id)"
              alt=""
            />
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
                <span v-else> Ksh {{ getVendorPrice(activeVendorPriceData) }} </span>
              </div>
              <div class="home-view-vendor-types-item--cost-wrapper_time">
                Pickup by {{ transformDate(activeVendorPriceData) }}
              </div>
            </div>
          </div>
        </div>
        <!-- start carrier type section -->
        <div class="home-view-carrier-type">
          <!-- start large /medium vendors -->
          <div class="home-view-truck-options-wrapper">
            <div class="home-view-truck-options-divider" />
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
            <div v-if="small_vendors.includes(activeVendorPriceData.vendor_id)">
              <div
                class="home-view-truck-options-inner-wrapper"
                v-if="!vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)"
              >
                <div class="home-view-truck-options-label">
                  What type of bike do you want?
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select v-model="carrier_type" placeholder="" @change="dispatchCarrierType">
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
                class="home-view-truck-options-inner-wrapper"
                v-if="!vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)"
              >
                <div
                  v-if="large_vendors.includes(activeVendorPriceData.vendor_id)"
                  class="home-view-truck-options-label"
                >
                  What type of truck do you want?
                </div>
                <div v-else class="home-view-truck-options-label">
                  What type of {{ getVendorNameOnCarrierType }} do you want?
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select v-model="carrier_type" placeholder="" @change="dispatchCarrierType">
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
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                Pick up time for your order
              </div>
              <div class="block">
                <el-date-picker
                  v-model="schedule_time"
                  class="vendor_component-actions__element-date"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  placeholder="As soon as possible"
                  prefix-icon="el-icon-date"
                  @change="dispatchScheduleTime"
                />
              </div>
            </div>
            <div class="home-view-truck-options-inner-wrapper">
              <div class="home-view-truck-options-label">
                Additional Instructions
              </div>
              <div class="" />
              <div class="" @change="dispatchOrderNotes">
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
              <div v-if="Number(carrier_type) === 3" class="home-view-truck-options-inner-wrapper">
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

              <!-- <div class="home-view-truck-options-inner-wrapper">
                    <div class="home-view-truck-options-label">
                      What is the approximate weight of the load?
                    </div>
                    <div class="home-view-truck-options-inner--load-weight">
                      <el-input
                        v-model="load_weight"
                        type="number"
                        placeholder="(Enter load weight)"
                        :min="0"
                        :max="getMaxAllowedWeight"
                        @input="dispatchLoadWeight"
                      >
                        <el-select
                          slot="append"
                          v-model="load_units"
                          placeholder="Tonnes"
                          @change="dispatchLoadUnits"
                        >
                          <el-option label="KG" value="kgs" />
                          <el-option label="Tonnes" value="tonnes" />
                        </el-select>
                      </el-input>
                    </div>
                  </div> -->

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
                    :min="1"
                    :max="10"
                    @change="handleChangeInNumberOfLoaders"
                  />
                </div>
              </div>
            </div>

            <!-- Pair with rider  -->
            <div v-if="![22].includes(activeVendorPriceData.vendor_id)">
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  Do you have a specific {{ riderNameDisplay }} at your pick up location ?
                </div>
                <div class="">
                  <el-select
                    v-model="pair_rider"
                    class="pair_rider_section"
                    @change="dispatchPairStatus"
                    placeholder="Select"
                  >
                    <el-option label="Yes" value="1" />
                    <el-option label="No" value="2" />
                  </el-select>
                </div>
              </div>
              <div class="home-view-truck-options-inner-wrapper" v-if="this.pair_rider === '1'">
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
                    placement="right"
                    width="200"
                    trigger="manual"
                    v-model="visible2"
                    popper-class="pop-over-layout"
                  >
                    <el-input
                      v-model.trim="vehicle_plate"
                      :placeholder="vehicleDetailsPlaceholder"
                      autocomplete="true"
                      slot="reference"
                      @input="checkVehicleDetails"
                    >
                      <i
                        v-if="searchOption"
                        class="el-icon-loading el-input__icon"
                        slot="suffix"
                      ></i>
                      <i
                        v-if="pair_status !== ''"
                        class="el-icon-close el-input__icon"
                        slot="suffix"
                        @click="clearVehicleDetails"
                      ></i>
                    </el-input>
                    <div class="pair_info_text_content">
                      <div v-if="pair_status === '1'">
                        <p class="upper_scope_pair_text">Driver not found</p>
                        <p>{{ this.failure_text }}</p>
                      </div>
                      <div v-if="pair_status === '2'">
                        <el-row :gutter="20">
                          <el-col :span="8" class="display_rider_inline">
                            <div class="">
                              <img
                                align="middle"
                                class="display_paired_rider_img"
                                :src="pair_rider_image"
                              />
                              <div class="pair-rider-name">
                                {{ pair_rider_name }}
                              </div>
                              <div>
                                <el-rate
                                  v-model="pair_rider_rating"
                                  disabled
                                  disabled-void-color="#C0C4CC"
                                  :colors="['#1782C5', '#1782C5', '#1782C5']"
                                >
                                </el-rate>
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="6" class="pair_right_more_info">
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PaymentOptions from './PaymentOptions.vue';

export default {
  components: {
    PaymentOptions,
  },
  data() {
    return {
      first_time: false,
      popover_visible: false,
      additional_loader: false,
      carrier_type: '1',
      number_of_loaders: 1,
      max_temperature: 4,
      delivery_item: '',
      load_weight: '',
      load_units: '',
      customer_min_amount: '',
      vendors_with_fixed_carrier_type: ['Standard', 'Runner', 'Van'],
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
      schedule_time: '',
      order_notes: '',
      small_vendors: [1, 22, 21],
      medium_vendors: [2, 3],
      large_vendors: [6, 10, 13, 14, 17, 18, 19, 20],
      pair_status: '',
      vehicle_plate: '',
      pair_rider: '',
      visible2: false,
      pair_rider_image: '',
      pair_rider_name: '',
      pair_rider_rating: '',
      pair_rider_make: '',
      pair_rider_model: '',
      pair_rider_plate: '',
      triger: false,
      searchOption: false,
      failure_text: '',
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
    }),

    vehicleDetailsPlaceholder() {
      return 'Enter Full Number plate / Phone Number';
    },

    activePackageClassPriceData() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class
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
      const custom_vendor_options = [
        {
          value: '2',
          label: 'Any',
        },
      ];

      return custom_vendor_options.concat(this.baseTruckOptions);
    },
    largeOptions() {
      const custom_vendor_options = {};
      if (this.activeVendorPriceData.hasOwnProperty('available_options')) {
        if (this.activeVendorPriceData.available_options.refrigerated) {
          custom_vendor_options.value = '3';
          custom_vendor_options.label = 'Refrigerated';
        }

        if (this.activeVendorPriceData.available_options.flatbed) {
          custom_vendor_options.value = '4';
          custom_vendor_options.label = 'Flatbed';
        }
      }

      return this.baseTruckOptions.concat(custom_vendor_options);
    },

    getVendorNameOnCarrierType() {
      let vendor_disp_name = 'motorbike';
      if (this.get_active_package_class === 'medium') {
        vendor_disp_name = this.get_active_vendor_name;
      } else if (this.get_active_package_class === 'large') {
        vendor_disp_name = this.get_active_vendor_name;
      }
      return vendor_disp_name.toLowerCase();
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
      let display_pair_name = 'rider';
      if (this.small_vendors.includes(this.activeVendorPriceData.vendor_id)) {
        display_pair_name = 'rider';
      } else {
        display_pair_name = 'driver';
      }
      return display_pair_name.toLowerCase();
    },
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
      setPairSerialNumber: '$_orders/$_home/setPairSerialNumber',
      setPairRiderPhone: '$_orders/$_home/setPairRiderPhone',
    }),
    ...mapActions({
      requestPairRider: '$_orders/$_home/requestPairRider',
    }),

    dispatchCarrierType() {
      const type = this.carrier_type;
      this.setCarrierType(type);
    },
    dispatchScheduleTime() {
      this.setScheduleTime(this.schedule_time);
    },
    dispatchOrderNotes() {
      this.setOrderNotes(this.order_notes);
    },
    dispatchPairStatus() {
      const status = this.pair_rider;
      if (status === 1) {
        // pair with rider
        this.setPairWithRiderStatus(true);
      } else {
        // do not pair
        this.setPairWithRiderStatus(false);
      }
    },
    goToNextStep() {
      this.setDefaultCarrierType();
      this.setOrderState(2);
      this.setExtendOptions(true);
    },
    setDefaultCarrierType() {
      if (this.large_vendors.includes(this.activeVendorPriceData.vendor_id)) {
        this.carrier_type = '1';
      } else {
        if (this.medium_vendors.includes(this.activeVendorPriceData.vendor_id)) {
          this.carrier_type = '2';
        } else {
          this.carrier_type = '1';
        }
      }
    },
    goBackToHome() {
      this.setOrderState(1);
      this.setExtendOptions(false);
      this.pair_rider = '';
      this.vehicle_plate = '';
    },
    dispatchDeliveryItem() {
      this.setDeliveryItem(this.delivery_item);
    },

    dispatchLoadWeight(val) {
      val = Number(val);
      let dispatch_value = val;
      if (val > this.getMaxAllowedWeight) {
        this.doNotification(
          '2',
          'The weight of the load exceeds the truck capacity',
          `The weight of the load exceeds the capacity of the truck you selected, please select a truck that fits ${val} ${
            this.getLoadUnits
          }.`
        );
        dispatch_value = this.getMaxAllowedWeight;
        this.load_weight = dispatch_value;
      }
      this.setLoadWeight(dispatch_value);
    },

    dispatchLoadUnits(val) {
      this.setLoadUnits(val);
    },

    dispatchAdditionalLoaderStatus(val) {
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
      this.trackMixpanelEvent(`Switch To Size: ${name}`);
    },

    clearVehicleDetails() {
      this.vehicle_plate = '';
      this.setPairWithRiderStatus(false);
      this.visible2 = false;
      this.pair_status = '';
    },
    checkVehicleDetails(val) {
      let vehicle_details = this.vehicle_plate;
      if (vehicle_details === '') {
        this.doNotification(
          '2',
          'Vehicle number plate is not provided',
          'Please provide the vehicle details to pair'
        );
        this.setPairWithRiderStatus(false);
        this.visible2 = false;
        this.searchOption = false;
        this.pair_status = '';
      } else {
        this.searchOption = true;
        if (vehicle_details.length > 6) {
          this.handlePairRequest(vehicle_details);
        }
      }
    },
    updateData(value) {
      let val = value;
      this.pair_rider_image = val.rider_photo;
      this.pair_rider_name = val.rider_name;
      this.pair_rider_rating = parseInt(val.rider_rating);
      this.pair_rider_make = val.make;
      this.pair_rider_model = val.model;
      this.pair_rider_plate = val.registration_no;

      this.visible2 = true;
      this.pair_status = '2';

      this.setPairWithRiderStatus(true);
      this.setPairSerialNumber(val.sim_card_sn);
      this.setPairRiderPhone(val.rider_phone);
    },
    handlePairRequest(plate) {
      this.visible2 = false;
      this.pair_status = '';
      const checkInputType = new RegExp('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$');
      const res = checkInputType.test(plate);
      const payload = {};
      payload.vendor_type = this.activeVendorPriceData.vendor_id;
      if (res) {
        payload.phone_no = plate;
      } else {
        payload.registration_no = plate;
      }

      const full_payload = {
        values: payload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'pair_order_rider_details',
      };

      this.requestPairRider(full_payload).then(
        response => {
          if (response.status) {
            this.updateData(response.data);
          } else {
            this.pair_status = '1';
            this.failure_text = response.message;
            this.visible2 = true;
            this.setPairWithRiderStatus(false);
          }
        },
        error => false
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

    transformDate(vendor_details) {
      // let start = this.moment();
      // let end   = this.moment().add(eta, 'seconds');
      // return end.from(start);
      if (vendor_details.hasOwnProperty('customer_eta')) {
        return this.moment(vendor_details.customer_eta, 'YYYY-MM-DD HH:mm:ss').format('hh.mm a');
      }
      return this.moment()
        .add(vendor_details.eta, 'seconds')
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

    getMinVendorPrice(vendorObject) {
      const price =
        this.getPlainVendorPrice(vendorObject) * ((100 - vendorObject.price_variance) / 100);
      return numeral(price).format('0');
    },

    getMaxVendorPrice(vendorObject) {
      const price =
        this.getPlainVendorPrice(vendorObject) * ((100 + vendorObject.price_variance) / 100);
      return numeral(price).format('0');
    },

    isFixedCost(vendorObject) {
      if (vendorObject.vendor_id === 20 && !this.getPriceRequestObject.fixed_cost) {
        return false;
      }
      return true;
    },

    setFirstTimeUser() {
      const session = this.$store.getters.getSession;
      if (session.hasOwnProperty('first_time')) {
        if (session.first_time) {
          this.first_time = true;
        }
      }
    },

    destroyVendorComponent() {
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
        !this.vendors_with_fixed_carrier_type.includes(vendor.vendor_name) &&
        vendor.vendor_name === this.get_active_vendor_name
      );
    },

    setVendorDetails(vendorObject) {
      this.setActiveVendorName(vendorObject.vendor_name);
      this.setActiveVendorDetails(vendorObject);
      this.reCheckCarrierType();
      this.trackMixpanelEvent(`Select Vendor: ${vendorObject.vendor_name}`);
    },

    reCheckCarrierType() {
      if (this.get_active_package_class === 'large' && Number(this.carrier_type) === 2) {
        this.carrier_type = '1';
        this.dispatchCarrierType();
      } else if (this.get_active_package_class !== 'large') {
        const allowed_carrier_types = ['0', '1', '2'];
        if (!allowed_carrier_types.includes(this.carrier_type)) {
          this.carrier_type = '2';
          this.dispatchCarrierType();
        }
      } else {
      }
    },

    trackMixpanelEvent(name) {
      let analytics_env = '';
      try {
        analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {}

      try {
        if (analytics_env === 'production') {
          mixpanel.track(name);
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Price Request',
          //   eventLabel: name,
          //   eventValue: 14,
          // });
        }
      } catch (er) {}
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
      if (standardOrders.includes(vendorObject.vendor_id)) {
        return 'In 2 to 4 hours';
      }
      return vendorObject.vendor_description;
    },
  },

  watch: {
    get_active_package_class(new_val, old_val) {
      this.reCheckCarrierType();
    },
  },

  created() {
    this.setFirstTimeUser();
    this.initializeVendorComponent();
  },

  mounted() {
    this.reCheckCarrierType();
  },
};
</script>

<style lang="css" scoped>

@import "../../../../../assets/styles/orders_order_placement_vendors.css";
</style>
