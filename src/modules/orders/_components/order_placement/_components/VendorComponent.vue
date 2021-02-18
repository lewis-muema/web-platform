<template lang="html">
  <div
    v-if="getOrderState === 1"
    class="home-view-vendor-and-optins-wrappper"
    :class="
      $route.path === '/orders/dedicated/multi-destination' ? 'dedicated-vendors-wrapper' : dedicatedClass
    "
  >
    <div class="home-view--seperator" />
    <div class="homeview--form__header homeview--form__header-lower">
      {{$t('general.load_size_and_delivery_type')}}
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
                      {{$t('general.price_to_be_confirmed')}}
                    </span>
                    <span v-else> {{ getVendorCurrency(j) }} {{ getVendorPrice(j) }} </span>
                  </div>
                  <div
                    v-if="$route.path === '/orders/dedicated/multi-destination'"
                    class="home-view-vendor-types-item--cost-wrapper_time"
                  >
                    {{$t('general.type')}}: {{ formatPriceType(j.price_type) }}
                  </div>
                  <div
                    v-else
                    class="home-view-vendor-types-item--cost-wrapper_time"
                  >
                    <span v-if="isStandardUnavailable(j)">
                      {{ scheduleTimeFrame(j) }}
                    </span>
                    <span v-else> {{$t('general.pickup_by')}} {{ transformDate(j) }} </span>
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
        {{$t('general.continue')}}
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
                  {{$t('general.price_to_be_confirmed')}}
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
                <span v-else> {{$t('general.pickup_by')}} {{ transformDate(activeVendorPriceData) }}</span>
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
                <p>{{$t('general.add_notes_each_destination')}}</p>
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
                    :placeholder="$t('general.notes')"
                    @input="addDestinationNotes($event, path, index)"
                  />
                </div>
              </div>
            </div>

            <!-- Intercounty Flow  -->

            <div v-if="activeVendorPriceData.vendor_id === 26">
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.want_delivered')}}
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="intercounty_load"
                    placeholder=""
                    filterable
                    @change="dispatchInterCountyLoad"
                  >
                    <el-option
                      v-for="item in interCountyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper" v-if="intercounty_load === 'PARCEL'">
                <div class="home-view-truck-options-label">
                  {{$t('general.approximate_package_weight')}}
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="parcel_size"
                    placeholder=""
                    filterable
                    @change="dispatchInterCountyParcelSize"
                  >
                    <el-option
                      v-for="item in parcelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>

              <div class="" v-if="hubCoordinator">
                <div class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    {{$t('general.sender_of_package')}}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="button-additional-notes"
                      name="button"
                      @click="openNotesDialog(0)"
                    >
                      <a class="instructions-holder">
                        {{$t('general.add_senders_info')}}
                      </a>
                      <i class="el-icon-circle-plus-outline align-instructions-icon" />
                    </button>
                  </div>
                </div>
                <div v-if="isSenderDataSet()" class="instructions-set">
                  <i class="el-icon-success" /> {{$t('general.added_senders_info')}}
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.want_package_picked')}}
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="package_pickup"
                    placeholder=""
                    filterable
                    @change="dispatchInterCountyPackagePickup"
                  >
                    <el-option
                      v-for="item in pickupOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$('general.nearest_collection_center')}}
                </div>
                <div>
                  <textarea
                    v-model.trim="pickUpCollectionCentreInfo"
                    class="textarea-control collection_centre"
                    type="text"
                  />
                </div>
              </div>

              <div v-if="pickupInstructions">
                <div class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    {{$t('general.pickup_instructions_at')}} {{ orderPath[0].name }}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="button-additional-notes"
                      name="button"
                      @click="openNotesDialog(1)"
                    >
                      <a class="instructions-holder">
                        {{$t('general.add_pickup_instructions')}}
                      </a>
                      <i class="el-icon-circle-plus-outline align-instructions-icon" />
                    </button>
                  </div>
                </div>
                <div v-if="isPickUpSet()" class="instructions-set">
                  <i class="el-icon-success" /> {{$t('general.pickup_instructions_added')}}
                </div>
              </div>

              <div class="">
                <div class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    {{$t('general.package_recipient')}}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="button-additional-notes "
                      name="button"
                      @click="openNotesDialog(2)"
                    >
                      <a class="instructions-holder">
                        {{$t('general.add_reciept_information')}}
                      </a>
                      <i class="el-icon-circle-plus-outline align-instructions-icon" />
                    </button>
                  </div>
                </div>
                <div v-if="isDropOffSet()" class="instructions-set">
                  <i class="el-icon-success" /> {{$t('general.drop_off_instructions_added')}}
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.how_delivered')}}
                </div>
                <div class="home-view-truck-options-inner--full-select">
                  <el-select
                    v-model="package_delivery"
                    placeholder=""
                    filterable
                    @change="dispatchInterCountyPackageDelivery"
                  >
                    <el-option
                      v-for="item in deliveryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.will_be_delivered_to_cc_at')}}
                </div>
                <div>
                  <textarea
                    v-model.trim="collectionCentreInfo"
                    class="textarea-control collection_centre"
                    type="text"
                  />
                </div>
              </div>

              <div class="home-view-truck-options-inner-wrapper price-estimate-container">
                <div class="delivery-estimate-info">
                  <div class="estimate-icon-container">
                    {{$t('general.delivery_estimate')}}
                  </div>
                  <div class="estimate-value">
                    <p class="estimate-info-body">
                      {{getVendorCurrency(activeVendorPriceData)}}<span class="estimate-currency-highlight">{{dispatchInterCountyPrice()}}</span>
                    </p>
                  </div>
                </div>

                <div class="extra-intercounty-info">
                  {{$t('general.notified_of_actual_cost')}}
                </div>
              </div>

            </div>

            <!-- Other Vendor Options Flow -->

            <div v-else>
              <div class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.want_delivered')}}
                </div>
                <div>
                  <el-input
                    v-model.trim="delivery_item"
                    autocomplete="true"
                    @change="dispatchDeliveryItem"
                  />
                </div>
              </div>

              <div v-if="isTestAccount()" class="home-view-truck-options-inner-wrapper">
                <div class="home-view-truck-options-label">
                  {{$t('general.test_specifications')}}
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

              <div v-if="small_vendors.includes(activeVendorPriceData.vendor_id)">
                <div
                  v-if="
                    !vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)
                  "
                  class="home-view-truck-options-inner-wrapper"
                >
                  <div class="home-view-truck-options-label">
                    {{$t('general.bike_type')}}
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
                  v-if="
                    !vendors_with_fixed_carrier_type.includes(activeVendorPriceData.vendor_name)
                  "
                  class="home-view-truck-options-inner-wrapper"
                >
                  <div
                    v-if="large_vendors.includes(activeVendorPriceData.vendor_id)"
                    class="home-view-truck-options-label"
                  >
                    {{$t('general.truck_type')}}
                  </div>
                  <div v-else class="home-view-truck-options-label">
                    <!-- What type of {{ getVendorNameOnCarrierType }} do you want? -->
                    {{$t('general.carrier_type',{getVendorNameOnCarrierType: getVendorNameOnCarrierType})}}
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
                  {{$t('general.weight_load')}}
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
                  />
                  <span class="tonage-value-text">{{$t('general.tonnes')}}</span>
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
                    :placeholder="$t('general.asap')"
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
                 {{$t('general.delivery_2_4_hours')}}
                </span>
              </div>
              <div v-if="displayNotesAddition()">
                <div class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    {{$t('general.pickup_instructions_at')}}  {{ orderPath[0].name }}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="button-additional-notes"
                      name="button"
                      @click="openNotesDialog(1)"
                    >
                      <a class="instructions-holder">
                        {{$t('general.add_pickup_instructions')}}
                      </a>
                      <i class="el-icon-circle-plus-outline align-instructions-icon" />
                    </button>
                  </div>
                </div>
                <div v-if="isPickUpSet()" class="instructions-set">
                  <i class="el-icon-success" /> {{$t('general.pickup_instructions_added')}}
                </div>
                <div class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    {{ destinationNotesLabel() }}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="button-additional-notes "
                      name="button"
                      @click="openNotesDialog(2)"
                    >
                      <a class="instructions-holder">
                        {{$t('general.add_drop_off_instructions')}}
                      </a>
                      <i class="el-icon-circle-plus-outline align-instructions-icon" />
                    </button>
                  </div>
                </div>
                <div v-if="isDropOffSet()" class="instructions-set">
                  <i class="el-icon-success" /> {{$t('general.drop_off_instructions_added')}}
                </div>
              </div>
              <div class="home-view-truck-options-inner-wrapper recipient-section">
                <p class="home-view-truck-options-label no-margin">
                  {{$t('general.recipient_details')}}
                </p>
                <input
                  v-model="recipientName"
                  type="text"
                  :placeholder="$t('general.name')"
                  class="el-input__inner bottom-spacer"
                />
                <input
                  v-model="recipientPhone"
                  type="number"
                  :placeholder="$t('general.phone_no')"
                  class="el-input__inner"
                />
              </div>

              <!-- show large and medium extended options -->
              <div v-if="large_vendors.includes(activeVendorPriceData.vendor_id)">
                <div
                  v-if="Number(carrier_type) === 3"
                  class="home-view-truck-options-inner-wrapper"
                >
                  <div class="home-view-truck-options-label">
                    {{$t('general.temperature_should_not_exceed')}}
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
                    {{$t('general.offer_to_pay_for_order')}}
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
                    {{$t('general.provide_with_loaders')}}
                  </div>
                  <div class="">
                    <el-radio
                      v-model="additional_loader"
                      label="1"
                      @change="dispatchAdditionalLoaderStatus"
                    >
                      {{$t('general.yes')}}
                    </el-radio>
                    <el-radio
                      v-model="additional_loader"
                      label="0"
                      @change="dispatchAdditionalLoaderStatus"
                    >
                      {{$t('general.no')}}
                    </el-radio>
                  </div>
                </div>

                <div
                  v-if="Number(additional_loader) === 1"
                  class="home-view-truck-options-inner-wrapper"
                >
                  <div class="home-view-truck-options-label">
                    {{$t('general.loaders_required')}}
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
                    <!-- {{ $t('general.have_preffered') }} {{ riderNameDisplay }} {{ $t('general.at_your_location') }} -->
                    {{ $t('general.have_preffered_rider', { riderNameDisplay: riderNameDisplay } )}}
                  </div>
                  <div class="">
                    <el-select
                      v-model="pair_rider"
                      class="pair_rider_section"
                      :placeholder="$t('general.select')"
                      filterable
                      @change="dispatchPairStatus"
                    >
                      <el-option :label="$t('general.yes')" value="1" />
                      <el-option :label="$t('general.no')" value="2" />
                    </el-select>
                  </div>
                </div>
                <div v-if="pair_rider === '1'" class="home-view-truck-options-inner-wrapper">
                  <div class="home-view-truck-options-label">
                    <div v-if="[21].includes(activeVendorPriceData.vendor_id)">
                      {{$t('general.enter_phone_number_pair')}}
                    </div>
                    <div v-else>
                      {{$t('general.enter_phone_number_pair_text')}}
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
                            <el-col :span="1" class="pairing-alert">
                              <div>
                                <i class="el-icon-warning pairing-alert-icon" />
                              </div>
                            </el-col>
                            <el-col :span="8" class="pairing-error-display">
                              <div class="share-option">
                                <div class="pairing-error-header">
                                  <!-- {{ riderNameDisplay }} not found -->
                                  {{$t('general.rider_name_not_displayed',{riderNameDisplay: riderNameDisplay})}}
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
                                    :colors="['#007FFF', '#007FFF', '#007FFF']"
                                  />
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
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="add-instructions-pop-up">
        <el-dialog
          :visible.sync="addDeliveryInfo"
          width="30%"
          class="updateNotificationsDialog"
          :modal-append-to-body="false"
        >
          <div class="add-instructions-outer">
            <p class="add-instructions-setup" v-if="activeVendorPriceData.vendor_id === 26">

              <span v-if="route_point === 1">
                {{$t('general.add_inter_county_pickup_instructions')}}
              </span>

              <span v-else>
                {{$t('general.add_inter_recipient_instructions')}}
              </span>

            </p>
            <p class="add-instructions-setup" v-else>
              {{ instructionsOuterLabel() }}
            </p>
            <div class="">
              <div v-if="route_point === 1"  class="instructions--inner-section">
                <div class="">
                  <div class="add-instructions-setup-label" v-if="activeVendorPriceData.vendor_id === 26">
                    {{ instructionsInnerLabel() }} {{ get_order_path[0].name }}
                  </div>
                  <div class="" />
                  <div class="">
                    <textarea
                      v-model="notes[0]"
                      name="name"
                      rows="5"
                      class="textarea-control add-notes"
                      :placeholder="additionalInstructionsPlaceholder"
                      @input="addInstructionNotes(get_order_path[0], 0)"
                    />
                  </div>
                </div>
                <div class="">
                  <div class="add-instructions-setup-contact">
                    {{$t('general.contact_person')}}
                  </div>
                  <div class="" />
                  <div
                    class=""
                    @change="addInstructionContact(get_order_path[0], 0)"
                  >
                    <vue-tel-input
                      v-model.trim="contact[0]"
                      v-validate="'required|check_phone'"
                      class="input-control sign-up-form"
                      type="number"
                      name="phone"
                      value=""
                      data-vv-validate-on="blur"
                      v-bind="phoneInputProps"
                    />
                  </div>
                </div>
                <div class="notify_recipient" v-if="activeVendorPriceData.vendor_id !== 26">
                  <input
                    v-model="send_sms[0]"
                    type="checkbox"
                    name="u_terms"
                    class="send_sms-checkbox"
                    :onclick="setSendSms(get_order_path[0], 0)"
                  />
                  <span>
                    {{$t('general.notify_them_of_pickup')}}
                  </span>
                </div>
              </div>
              <div v-else-if="route_point === 0" class="instructions--inner-section">
                <div class="">
                  <div class="add-instructions-setup-label" v-if="activeVendorPriceData.vendor_id === 26">
                    {{$t('general.name_of_sender')}}
                  </div>
                  <div class="" />
                  <div class="">
                    <textarea
                      v-model="sender_name"
                      name="name"
                      rows="3"
                      class="textarea-control add-notes"
                      placeholder=""
                    />
                  </div>
                </div>
                <div class="">
                  <div class="add-instructions-setup-contact">
                    {{$t('general.contact_person')}}
                  </div>
                  <div class="" />
                  <div class="" @change="addRecipientContact()">
                    <vue-tel-input
                      v-model.trim="sender_phone"
                      v-validate="'required|check_phone'"
                      class="input-control sign-up-form"
                      type="number"
                      name="phone"
                      value=""
                      data-vv-validate-on="blur"
                      v-bind="phoneInputProps"
                    />
                  </div>
                </div>
              </div>
              <div
                v-for="(data, index) in getInstructionsPath()"
                v-else
                :key="index"
                class="instructions--inner-section"
              >
                <div class="">
                  <div class="add-instructions-setup-label" v-if="activeVendorPriceData.vendor_id === 26">
                    {{$t('general.recipient_info')}}
                  </div>
                  <div class="add-instructions-setup-label" v-else>
                    {{ instructionsInnerLabel() }} {{ data.name }}
                  </div>
                  <div class="" />
                  <div class="">
                    <textarea
                      v-model="notes[index + 1]"
                      name="name"
                      rows="5"
                      class="textarea-control add-notes"
                      :placeholder="additionalInstructionsPlaceholder"
                      @input="addInstructionNotes(data, index + 1)"
                    />
                  </div>
                </div>
                <div class="">
                  <div class="add-instructions-setup-contact">
                    {{$t('general.contact_person')}}
                  </div>
                  <div class="" />
                  <div
                    class=""
                    @change="addInstructionContact(data, index + 1)"
                  >
                    <vue-tel-input
                      v-model.trim="contact[index + 1]"
                      v-validate="'required|check_phone'"
                      class="input-control sign-up-form"
                      type="number"
                      name="phone"
                      value=""
                      data-vv-validate-on="blur"
                      v-bind="phoneInputProps"
                    />
                  </div>
                </div>
                <div class="notify_recipient" v-if="activeVendorPriceData.vendor_id !== 26">
                  <input
                    v-model="send_sms[index + 1]"
                    type="checkbox"
                    name="u_terms"
                    class="send_sms-checkbox"
                    :onclick="setSendSms(data, index + 1)"
                  />
                  <span>
                    {{ $t('general.notify_them_of_Pickup') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="">
              <div class="">
                <input
                  class="button-primary add-instructions-submit"
                  type="submit"
                  :value="$t('general.done')"
                  @click="saveAdditionaNotes(route_point)"
                />
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import numeral from 'numeral';
import _ from 'lodash';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import PaymentOptions from './PaymentOptions.vue';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

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
      vendors_with_fixed_carrier_type: [
        'Standard',
        'Runner',
        'Van',
        '3T Truck',
        '5T Truck',
        '7T Truck',
        '10T Truck',
        '14T Truck',
        '20T Truck',
        '24T Truck',
      ],
      vendors_without_return: ['Standard', 'Runner'],
      baseTruckOptions: [
        {
          value: '0',
          label: this.$t('general.open'),
        },
        {
          value: '1',
          label: this.$t('general.closed'),
        },
      ],
      smallVendorOptions: [
        {
          value: '2',
          label: this.$t('general.any'),
        },
        {
          value: '1',
          label: this.$t('general.bike_with_box'),
        },
        {
          value: '0',
          label: this.$t('general.bike_without_box'),
        },
      ],
      freightVendorOptions: [
        {
          value: '1',
          label: this.$t('general.closed_boxed_body'),
        },
        {
          value: '4',
          label: this.$t('general.flatbed_skeleton'),
        },
        {
          value: '5',
          label: this.$t('general.tipper'),
        },
        {
          value: '6',
          label: this.$t('general.refeer'),
        },
        {
          value: '7',
          label: this.$t('general.highside'),
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
      orderPath: [],
      addDeliveryInfo: false,
      locations_data: [],
      route_point: 0,
      instructions_data: [],
      notes: [],
      contact: [],
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('general.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['ke', 'ug', 'tz'],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      validPhone: true,
      send_sms: [],
      intercounty_load: '',
      parcel_size: '',
      package_pickup : '',
      package_delivery : '',
      parcelOptions: [
        {
          value: 5,
          label: '0 - 5kgs',
        },
        {
          value: 10,
          label: '6 - 10kgs',
        },
        {
          value: 15,
          label: '11 - 15kgs',
        },
        {
          value: 16,
          label: '16kgs plus',
        },
      ],
      interCountyOptions: [
        {
          value: 'PARCEL',
          label: this.$t('general.parcel'),
        },
        {
          value: 'DOCUMENT',
          label: this.$t('general.documents'),
        },
      ],
      estimate_amount : 0 ,
      sender_name : '',
      sender_phone : '' ,
      pickupInstructions : false,
      hubCoordinator : false,
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
      get_order_path: '$_orders/$_home/getOrderPath',
      getInstructionNotes: '$_orders/$_home/getInstructionNotes',
      getDedicatedAccessStatus: 'getDedicatedAccessStatus',
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

    dedicatedClass() {
      return this.getDedicatedAccessStatus ? 'dedicated-wrapper-override' : '';
    },
    pickupOptions(){

      let options = [
        {
          value: '',
          label: this.$t('general.take_to_nearest_collection_center'),
        }
      ] ;

      let intercountyPickUp = this.activeVendorPriceData.inter_county_info.pickup_deliveries ;

      if (intercountyPickUp !== null) {

        if (Object.keys(intercountyPickUp).length > 0) {
          for (let i = 0; i < intercountyPickUp.length; i++) {
            options.push({
              amount : intercountyPickUp[i].cost,
              value: intercountyPickUp[i].id,
              label : this.$t('general.like_vendor_to_pick_it_up_at', {vendor_name:intercountyPickUp[i].vendor_name, name:this.get_order_path[0].name } ),
              vendor_name : intercountyPickUp[i].vendor_name,
            })
            }
        }

      }

      return options ;

    },
    deliveryOptions(){
      let options = [
        {
          value: '',
          label: this.$t('general.pick_it_up_from_cc_near_them'),
        }
      ] ;

      if (this.activeVendorPriceData.inter_county_info.partner_delivery_available) {

            options.push({
              value: -1,
              label: this.$t('general.door_step_delivery_to') + this.get_order_path[1].name,
            })

      }
      else {

        let intercountyDeliveries = this.activeVendorPriceData.inter_county_info.destination_deliveries ;

        if (Object.keys(intercountyDeliveries).length > 0) {
          for (let i = 0; i < intercountyDeliveries.length; i++) {
            options.push({
              amount : intercountyDeliveries[i].cost,
              value: intercountyDeliveries[i].id,
              label: this.$t('general.door_step_delivery_to') + this.get_order_path[1].name + this.$t('general.by_a_sendy') + intercountyDeliveries[i].vendor_name + this.$t('general.delivery_fee_charged'),
              vendor_name : intercountyDeliveries[i].vendor_name,
            })
            }
        }

      }

      return options ;

    },
    collectionCentreInfo (){
      let resp = '' ;

      if (this.activeVendorPriceData.inter_county_info.destination_collection_center !== null) {

        resp = this.activeVendorPriceData.inter_county_info.destination_collection_center.address ;

      }

      return resp ;

    },
    pickUpCollectionCentreInfo (){
      let resp = '' ;

      if (this.activeVendorPriceData.inter_county_info.pickup_collection_center !== null) {

        resp = this.activeVendorPriceData.inter_county_info.pickup_collection_center.address ;

      }

      return resp ;

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
          label: this.$t('general.any'),
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
            customVendorOptions.label = this.$t('general.refrigirated');
          }

          if (this.activeVendorPriceData.available_options.flatbed) {
            customVendorOptions.value = '4';
            customVendorOptions.label = this.$t('general.flatbed');
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
      let displayPairName = this.$t('general.rider');
      if (this.small_vendors.includes(this.activeVendorPriceData.vendor_id)) {
        displayPairName = this.$t('general.rider');
      } else {
        displayPairName = this.$t('general.driver');
      }
      return displayPairName.toLowerCase();
    },
    additionalInstructionsPlaceholder() {
      let display = this.$t('general.pickup_package');
      if (this.small_vendors.includes(this.activeVendorPriceData.vendor_id)) {
        display = this.$t('general.pickup_package');
      }
      else if (this.activeVendorPriceData.vendor_id === 26 ) {
        display = '';
      }
      else {
        display = this.$t('general.pick_up_load');
      }
      return display;
    },
  },
  watch: {
    recipientName(data) {
      this.debounceRecipientName(data);
    },
    recipientPhone(data) {
      this.debounceRecipientPhone(data);
    },
    package_pickup(data){
      if (data === '') {
        this.pickupInstructions = false ;
      }
      else {
        this.pickupInstructions = true ;
      }
    }
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
      saveInstructionNotes: '$_orders/$_home/setInstructionNotes',
      clearInstructionNotes: '$_orders/$_home/clearInstructionNotes',
      saveInterCountySenderInfo: '$_orders/$_home/setInterCountySenderInfo',
      setIntercountyLoadType: '$_orders/$_home/setIntercountyLoadType',
      setIntercountyParcelSize: '$_orders/$_home/setIntercountyParcelSize',
      setInterCountyRecipientInfo: '$_orders/$_home/setInterCountyRecipientInfo',
      setInterCountyWaypointInfo: '$_orders/$_home/setInterCountyWaypointInfo',
      setInterCountyPickUpStatus: '$_orders/$_home/setInterCountyPickUpStatus',
      setInterCountyPickUpId: '$_orders/$_home/setInterCountyPickUpId',
      setInterCountyDeliveryStatus: '$_orders/$_home/setInterCountyDeliveryStatus',
      setInterCountyDeliveryId: '$_orders/$_home/setInterCountyDeliveryId',
      setInterCountyDeliveryMode: '$_orders/$_home/setInterCountyDeliveryMode',
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
      this.triggerGAEvent(
        'Client recipient phone number input - Order Placement Page - WebApp',
        data,
      );
    }, 500),
    dispatchCarrierType() {
      this.setCarrierType(this.carrier_type);
    },
    dispatchScheduleTime() {
      const dateTime = new Date();
      this.trackMixpanelEvent('Schedule Order', { 'Scheduled Time': this.schedule_time });
      if (this.schedule_time && dateTime > this.schedule_time) {
        this.schedule_time = new Date();
      }
      this.setScheduleTime(this.schedule_time);
      this.default_value = this.moment(this.schedule_time).format('HH:mm:ss');
    },
    addDestinationNotes(note, pathObj, i) {
      this.trackMixpanelEvent('Add A Note', { 'Destination Note': note });
      this.setWaypointNotes({
        index: i,
        notes: note,
      });
    },
    formatPriceType(type) {
      const name = type.replace(/_/g, ' ');
      return name.charAt(0).toUpperCase() + name.slice(1);
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
      this.checkHubCoordinator();
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
        } else if (
          this.medium_vendors.includes(this.activeVendorPriceData.vendor_id)
          && this.activeVendorPriceData.vendor_id === 2
        ) {
          this.carrier_type = '0';
        } else if (
          this.medium_vendors.includes(this.activeVendorPriceData.vendor_id)
          && this.activeVendorPriceData.vendor_id === 3
        ) {
          this.carrier_type = '2';
        } else if (copStatus) {
          this.carrier_type = session[session.default].default_carrier_type.toString(10);
        } else {
          this.carrier_type = '2';
        }
      } else {
        this.carrier_type = this.getCarrierType;
      }

      this.setCarrierType(this.carrier_type);
      this.vendor_id = this.activeVendorPriceData.vendor_id;
    },
    goBackToHome() {
      this.schedule_time = '';
      this.setOrderState(1);
      this.setExtendOptions(false);
      this.pair_rider = '';
      this.vehicle_plate = '';
      this.clearOuterActiveVendorDetails();
      this.clearInstructionNotes();
    },
    dispatchDeliveryItem() {
      this.setDeliveryItem(this.delivery_item);
    },
    dispatchInterCountyLoad() {
      this.setIntercountyLoadType(this.intercounty_load);
      if (this.intercounty_load === 'DOCUMENT') {
        this.setIntercountyParcelSize(this.activeVendorPriceData.inter_county_info.max_weight);
      }
    },
    dispatchInterCountyParcelSize() {
      this.dispatchInterCountyPrice();
      this.setIntercountyParcelSize(this.parcel_size);
    },
    dispatchInterCountyPackagePickup() {
      this.dispatchInterCountyPrice();
      if (this.package_pickup === '') {
        this.setInterCountyPickUpStatus(false);
        this.setInterCountyPickUpId('');
      }
      else {
        this.setInterCountyPickUpStatus(true);
        this.setInterCountyPickUpId(this.package_pickup);
      }
    },
    dispatchInterCountyPackageDelivery() {
      this.dispatchInterCountyPrice();
      if (this.package_delivery === '') {
        this.setInterCountyDeliveryStatus(false);
        this.setInterCountyDeliveryId('');
        this.setInterCountyDeliveryMode('');

      }
      else if (this.package_delivery === -1) {
        this.setInterCountyDeliveryStatus(true);
        this.setInterCountyDeliveryId('');
        this.setInterCountyDeliveryMode('PARTNER');
      }
      else {
        this.setInterCountyDeliveryStatus(true);
        this.setInterCountyDeliveryId(this.package_delivery);
        this.setInterCountyDeliveryMode('SENDY');
      }
    },
    dispatchInterCountyPrice(){
      let baseAmount = 0 ;
      let packageWeightExtraFee = 0 ;
      let deliveryPickUpCharge = 0 ;
      let deliveryDeliveryCharge = 0 ;
      let cost = this.activeVendorPriceData.cost;
      let weightLimit = this.activeVendorPriceData.inter_county_info.max_weight ;
      let limitChargePerKg = this.activeVendorPriceData.inter_county_info.cost_per_kg.value ;

      baseAmount = cost ;


      if (this.parcel_size > weightLimit) {

        packageWeightExtraFee = (this.parcel_size - weightLimit) * limitChargePerKg;

      }

      if (this.package_pickup !== '') {

        let pickupOptions = this.activeVendorPriceData.inter_county_info.pickup_deliveries;

        let val = pickupOptions.find(position => position.id === this.package_pickup );

        deliveryPickUpCharge = val.cost;

      }

      if (this.package_delivery !== '') {

        let deliveryOptions = this.activeVendorPriceData.inter_county_info.destination_deliveries;

        if (this.package_delivery !== -1) {

          let val = deliveryOptions.find(position => position.id === this.package_delivery );

          deliveryDeliveryCharge = val.cost;
        }

      }

      let totalDeliveryAmount = (baseAmount + packageWeightExtraFee + deliveryPickUpCharge + deliveryDeliveryCharge) ;


      return totalDeliveryAmount ;

    },
    dispatchTestSpecs() {
      this.setTestSpecs(this.test_specifications);
    },
    dispatchLoadWeight() {
      this.setLoadWeightStatus(false);
      const val = this.load_weight;
      if (val === '') {
        this.pass_msg = this.$t('general.enter_load_weight');
      } else if (val >= 18.0 && val <= 33.0) {
        this.handleLoadweight(val);
        this.setLoadWeightStatus(true);
        this.pass_msg = '';
      } else {
        this.setLoadWeightStatus(false);
        this.pass_msg = this.$t('general.load_weight_limits');
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
        ? this.trackMixpanelEvent('Selected Loader For Order', { 'Number of Loaders': val })
        : '';
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
          this.$t('general.vehicle_number_plate'),
         this.$t('general.please_provide_the_vehicle_details_to_pair'),
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
            this.triggerGAEvent('Paired Order With Rider', { 'Paired Rider': plate });
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
      const bidVendors = [20, 25, 26];
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
        this.triggerGAEvent(
          'Order Placement with Recipient Inputs - Order Placement Page - WebApp',
          '',
        );
      }
      this.setActiveVendorName('');
      this.setActiveVendorDetails({});
      this.setCarrierType(this.carrier_type);
      this.$emit('vendorComponentDestroyed');
      this.$destroy();
    },

    getCarrierBoxName() {
      return this.get_active_package_class === 'small' ? this.$t('general.box') : this.$t('general.closed');
    },

    getCarrierNoBoxName() {
      return this.get_active_package_class === 'small' ? this.$t('general.no_box') : this.$t('general.open');
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
      this.orderPath = this.get_order_path;
      this.instructions_data = this.getInstructionNotes;
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
        return this.$t('general.unavailable_right_now');
      }
      if (standardOrders.includes(vendorObject.vendor_id)) {
        return this.$t('general.in_2_4_hours');
      }
      if (vendorObject.vendor_id === 25) {
        return this.$t('general.from_18_tonnes');
      }
      if (vendorObject.vendor_id === 26) {
        return this.$t('general.send_package_upcountry');
      }

      return vendorObject.vendor_description;
    },
    getPickUpDescriptText(vendorObject) {
      if (this.standardOptions.includes(vendorObject.vendor_id) && !vendorObject.available) {
        return this.$t('general.schedule_time');
      }
      return this.$t('general.pickup_time_for_order');
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
    destinationNotesLabel() {
      let name = this.$t('general.drop_off_instructions');

      if (this.get_order_path.length <= 2) {
        name = this.$t('general.drop_off_instructions_at') + this.get_order_path[1].name;
      }
      return name;
    },
    instructionsInnerLabel() {
      let name = this.$t('general.drop_off_instructions_at');

      if (this.route_point === 1) {
        name = this.$t('general.pickup_instructions_at');
      }

      return name;
    },
    openNotesDialog(value) {
      this.route_point = value;
      this.locations_data = this.get_order_path;
      this.addDeliveryInfo = true;
    },
    instructionsOuterLabel() {
      let name = this.$t('general.add_drop_off_instructions');

      if (this.route_point === 1) {
        name = this.$t('general.add_pickup_instructions');
      }

      return name;
    },
    getInstructionsPath() {
      return this.locations_data.slice(1);
    },
    setSendSms(pathObj, i) {
      if (typeof this.send_sms[i] === 'boolean') {
        let data = {};
        if (
          this.send_sms[i]
          && (this.contact[i] === undefined || this.contact[i] === '')
          && (this.notes[i] === undefined || this.notes[i] === '')
        ) {
          data = {};
        } else {
          data = {
            coordinates: pathObj.coordinates,
            name: pathObj.name,
            notes: this.notes[i] === undefined ? '' : this.notes[i],
            recipient_phone: this.contact[i] === undefined ? '' : this.contact[i],
            notify:
              this.contact[i] === undefined || this.contact[i] === '' ? false : this.send_sms[i],
          };
        }
        this.instructions_data[i] = data;
      }
    },
    addInstructionNotes(pathObj, i) {
      let data = {};
      if (
        (this.contact[i] === undefined || this.contact[i] === '')
        && (this.notes[i] === undefined || this.notes[i] === '')
      ) {
        data = {};
      } else {
        data = {
          coordinates: pathObj.coordinates,
          name: pathObj.name,
          notes: this.notes[i],
          recipient_phone: this.contact[i] === undefined ? '' : this.contact[i],
          notify: this.send_sms[i] === undefined ? false : this.send_sms[i],
        };
      }

      this.instructions_data[i] = data;
    },
    addInstructionContact(pathObj, i) {
      let data = {};
      let phoneValid = false;
      if (this.contact[i] === '') {
        this.validPhone = true;
        this.contact[i] = '';
        if (
          (this.notes[i] === undefined || this.notes[i] === '')
          && (this.send_sms[i] === undefined || this.send_sms[i] === '')
        ) {
          data = {};
        } else {
          data = {
            coordinates: pathObj.coordinates,
            name: pathObj.name,
            notes: this.notes[i],
            recipient_phone: '',
            notify: this.send_sms[i],
          };
        }
      } else {
        this.validPhone = false;
        phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.contact[i]));
      }

      if (phoneValid) {
        this.validPhone = true;
        data = {
          coordinates: pathObj.coordinates,
          name: pathObj.name,
          notes: this.notes[i] === undefined ? '' : this.notes[i],
          notify: this.send_sms[i] === undefined ? false : this.send_sms[i],
          recipient_phone: this.contact[i],
        };
      }
      this.instructions_data[i] = data;
    },
    addRecipientContact() {
      let data = {};
      let phoneValid = false;
      if (this.sender_phone === '') {
        this.validPhone = true;
        this.sender_phone = '';
        if (
          (this.sender_name === undefined || this.sender_name === '')
        ) {
          data = {};
        } else {
          data = {
            name: this.sender_name,
            phone_number: '',
          };
        }
      } else {
        this.validPhone = false;
        phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.sender_phone));
      }

      if (phoneValid) {
        this.validPhone = true;
        data = {
          name: this.sender_name === undefined ? '' : this.sender_name,
          phone_number: this.sender_phone,
        };
      }
    },
    saveAdditionaNotes(val) {
      if (val === 0) {
        if (this.sender_name === '' || this.sender_phone === '' || !this.validPhone) {
          this.doNotification(
            2,
            this.$t('general.sender_info_error'),
            this.$t('general.kindly_provide_valid_details'),
          );
        }
        else {

          let payload ={
            "name": this.sender_name,
            "phone_number": this.sender_phone
          }

          this.saveInterCountySenderInfo(payload);

          this.addDeliveryInfo = false;
        }
      }
      else {
        if (this.activeVendorPriceData.vendor_id === 26) {
          setTimeout(() => {
            if (this.instructions_data.length === 0) {
              this.doNotification(
                2,
                this.$t('general.add_instructions_error'),
                this.$t('general.provide_instructions_to_submit'),
              );
            } else if (this.validPhone) {
              this.doNotification(1, this.$t('general.additional_instructions_saved_successfully'));

              if (this.activeVendorPriceData.vendor_id === 26) {
                this.handleIntercountyAdditionalDetails(val , this.instructions_data);
              }
              else {
                this.saveInstructionNotes(this.instructions_data);
              }

              this.addDeliveryInfo = false;
            } else {
              this.doNotification(
                2,
                this.$t('general.phone_verification_error'),
                this.$t('general.provide_valid_phone_no'),
              );
            }
          }, 2000);
        }
        else {
          if (this.instructions_data.length === 0 || !this.validPhone) {
            this.doNotification(
              2,
              this.$t('general.add_instructions_error'),
              this.$t('general.provide_instructions_to_submit'),
            );
          }
          else {
            this.saveInstructionNotes(this.instructions_data);
            this.addDeliveryInfo = false;
          }
        }
      }

    },
    handleIntercountyAdditionalDetails(index , val){

      if (index === 2) {
        let payload = {
          name: val[1].notes,
          phone_number: val[1].recipient_phone
        }
        this.setInterCountyRecipientInfo(payload);
      }
      else {
        this.setInterCountyWaypointInfo(val);
      }
    },
    displayNotesAddition() {
      let state = false;
      if (this.$route.path !== '/orders/dedicated/multi-destination' && this.orderPath.length > 0) {
        state = true;
      }
      return state;
    },
    validate_phone() {
      this.$validator.validate();
    },
    isDropOffSet() {
      const data = this.instructions_data.slice(1);
      let value = true;
      if (data.filter(val => Object.keys(val).length !== 0).length === 0 || !this.validPhone) {
        value = false;
      }
      return value;
    },
    isPickUpSet() {
      let value = true;
      if (
        this.instructions_data[0] === ''
        || this.instructions_data[0] === undefined
        || Object.keys(this.instructions_data[0]).length === 0
        || !this.validPhone
      ) {
        value = false;
      }
      return value;
    },
    isSenderDataSet() {
      let value = true;
      if (
        this.sender_phone === ''
        || this.sender_name === '' || !this.validPhone
      ) {
        value = false;
      }
      return value;
    },
    handleClose() {
      // Do nothing ...
    },
    interCountyExtraInfo(val){
      let resp = false ;
      if (this.route_point === 2 && val === 26) {

        resp = true

      }
      return resp;
    },
    checkHubCoordinator() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {

        if (session.default === 'biz') {

          if (session[session.default].cop_user_type === 2) {
            this.hubCoordinator = true ;
          } else{
            this.hubCoordinator = false ;
          }
        } else {
          this.hubCoordinator = false ;
        }
      }
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../../assets/styles/orders_order_placement_vendors.css?v=1.0';
.collection_centre{
min-height: 45px;
 background: rgba(231, 231, 231, 0.42);
 font-size: 11px;
 display: block;
 word-break: break-all;
 pointer-events: none;
}
.estimatetitle{
 display: flex;
 flex: 2;
 align-items: center;
 height: 37px;
 font-weight: 400;
 font-size: 13px;
 color: #007FFF;
}
.delivery-estimate-info{
 display: flex;
 justify-content: flex-start;
 flex: 1;
 color: rgb(85, 85, 85);
 font-size: 14px;
 box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
 border-radius: 6px;
 width: 100%;
 height: 64px;
}
.estimate-icon-container{
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  margin: 10px 7% 10px 20px;
  color: #527CBD;
  font-size: 14px;
}
.estimate-value {
 display: block;
 margin: 10px 0% 10px 11px;
 width: 43%;
 text-align: center;
}
.estimate-currency-highlight{
  padding: 0px 5px;
}
.estimate-info-body{
  color: #000000;
  font-weight: 500;
}
.price-estimate-container{
  margin-top: 5%;
}
.extra-intercounty-info{
  margin-top: 3%;
  color: #3D3C3C;
  font-weight: 300;
  font-size: 12px;
}

</style>
