<template lang="html">
  <div class="transporters-main">
    <div class="transporters-container transporters-main--inner">
      <div class="transporters-content">
        <div class="transporters-find-section">
          <div class="">
            <p class="freight-input--label">
              Pick up location
            </p>
            <gmap-autocomplete
              id="pickup"
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
              id="destination"
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
            <div class="transporters-select">
              <el-date-picker
                v-model="pick_up_time"
                class="bids-time"
                type="datetime"
                format="dd-MM-yyyy h:mm a"
                placeholder="Select time"
                prefix-icon="el-icon-date"
                :default-time="default_value"
                :picker-options="dueDatePickerOptions"
              />
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              Type of truck
            </p>
            <div class="transporters-select">
              <el-select
                v-model="truck_type"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in truckTypes"
                  :key="item.id"
                  :label="item.carrier_type"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              What is being transported?
            </p>
            <div class="transporters-select">
              <el-select
                v-model="goods"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="item in goodsType"
                  :key="item.id"
                  :label="item.cargo_type"
                  :value="item.id"
                />
              </el-select>
            </div>
          </div>

          <div
            v-if="processing"
            v-loading="processing"
            class="freight-loading-container"
          />

          <div
            v-if="!processing"
            class="next-terms-holder"
          >
            <input
              v-model="submit_text"
              class="button-primary terms-btn-color search-transporter"
              type="submit"
              @click="filterTransporters"
            >
          </div>
        </div>
        <div
          class="transporters-results-section
          transporters-details-section"
        >
          <div v-if="loading">
            <loading-component />
          </div>
          <div v-else>
            <div v-if="ownersListing.length === 0">
              <img
                src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/freight_truck.svg"
                class="no-transporters-img "
              >
              <div class="no-transporters-label">
                No Transporters found at the moment, Try again with other details.
              </div>
            </div>
            <div v-else>
              <div class="transporters-filters align-filters-section">
                <div class="quote-flex">
                  <div v-if="show_quote">
                    <div class="transporter-listing-outer">
                      <div class="listing-info">
                        <div class="listing-info-count">
                          {{ ownersListing.length }} Transporters Found
                        </div>
                        <div class="shipment-dialog">
                          <input
                            v-model="quote_text"
                            class="request-shipment-btn-color"
                            type="submit"
                            @click="showQuoteDialog"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="!show_quote"
                  class="search-flex"
                >
                  <el-input
                    v-model="query"
                    placeholder="Search for a Transporter"
                    autocomplete="off"
                    :prepare-response-data="prepareResponseData"
                    @keydown.down="down"
                    @keydown.up="up"
                    @keydown.enter="hit"
                    @keydown.esc="reset"
                    @blur="reset"
                    @input="update"
                  >
                    <i
                      slot="suffix"
                      class="el-input__icon el-icon-search freight-search"
                    />
                  </el-input>

                  <ul
                    v-show="hasItems"
                    class="search-results-ul"
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
                    class="search-results-ul"
                  >
                    <span class="screen-no-details-found">
                      No Details Found
                    </span>
                  </ul>
                </div>
              </div>
              <div class="transporter-outer">
                <div class="transporter-listing">
                  <el-checkbox-group
                    v-model="checkedOwners"
                    class="minnne"
                    @change="handleCheckedCitiesChange"
                  >
                    <el-checkbox
                      v-for="(val, index) in ownersListing"
                      :key="index"
                      :label="val"
                      class="transporter-detail transporters-segment"
                    >
                      <div class="transporter-name">
                        {{ ownersListing[index].name }}
                        <img
                          src="https://images.sendyit.com/web_platform/freight/verified.svg"
                          alt=""
                          class="transporters-img highlight-icon"
                        >
                      </div>
                      <div class="transporters-filters transporters-highlight">
                        <div class="truck-add-info truck-add-info-align">
                          <img
                            src="https://images.sendyit.com/web_platform/freight/vehicle.svg"
                            alt=""
                            class="transporters-img highlight-icon"
                          >
                          {{ returnCount(ownersListing[index].vehicle_count) }}
                        </div>
                        <div class="truck-add-info trans-completed_orders">
                          <img
                            src="https://images.sendyit.com/web_platform/freight/highlight.svg"
                            alt=""
                            class="transporters-img highlight-icon"
                          >
                          {{ ownersListing[index].complete_orders }} completed orders
                        </div>
                        <div
                          class="truck-add-info view-transporter-info"
                          @click="viewTransporterInfo(ownersListing[index].id)"
                        >
                          View <i class="el-icon-arrow-right view-transporter-info" />
                        </div>
                      </div>
                      <div class="transporters-filters transporters-highlight">
                        <div class="truck-add-info truck-add-rating-align">
                          <img
                            src="https://images.sendyit.com/web_platform/freight/rating.svg"
                            alt=""
                            class="transporters-img highlight-icon"
                          >
                          {{ ownersListing[index].avg_rating }} (
                          {{ ownersListing[index].avg_rating }} Reviews)
                        </div>
                      </div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="">
          <el-dialog
            :visible.sync="quoteDialogVisible"
            class="requestShipmentOptions"
          >
            <div class="">
              <div class="decline-text-option decline-documemt-extend request-shipment-header">
                Create a Shipment Request
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                Where is the pickup facility at {{ locations[0] }}
              </p>
              <div class="block">
                <el-input
                  v-model="facility_location"
                  type="textarea"
                  :rows="2"
                  placeholder="Please input"
                />
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                Will the container be returned to the pickup location?
              </p>
              <div class="block">
                <el-select
                  v-model="return_option"
                  placeholder=""
                  class="transporters-element-inputs"
                  filterable
                >
                  <el-option
                    v-for="item in returnOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                How many trucks do you need?
              </p>
              <div class="block">
                <el-input-number
                  v-model="trucks_no"
                  :min="1"
                />
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                How many tonnes should each truck carry per move?
              </p>
              <div class="block">
                <input
                  v-model="load_weight"
                  class="input-control freight-load-weight"
                  type="text"
                  placeholder=""
                  autocomplete="on"
                >
                <span class="tonage-value-text">Tonnes</span>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                Do you want to make an offer for this shipment?
              </p>
              <div class="block">
                <el-select
                  v-model="shipment_offer"
                  placeholder=""
                  class="transporters-element-inputs"
                  filterable
                >
                  <el-option
                    v-for="item in shipmentOffer"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>

            <div v-if="shipment_offer">
              <div class="decline-documemt-extend decline-documemt-input">
                <p class="shipment-input--label">
                  How much do you want to pay per truck?
                </p>
                <div class="freight-input">
                  <div class="freight-input-icon">
                    <span>USD</span>
                  </div>
                  <div class="freight-input-area">
                    <input
                      v-model.trim="bid_amount"
                      type="number"
                      name="amount"
                      class="transporter-selector freight-selector"
                    >
                  </div>
                </div>
              </div>

              <div class="decline-documemt-extend decline-documemt-input">
                <p class="shipment-input--label">
                  Is this price negotiable?
                </p>
                <div class="block">
                  <el-select
                    v-model="negotiability"
                    placeholder=""
                    class="transporters-element-inputs"
                    filterable
                  >
                    <el-option
                      v-for="item in returnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                By when should bids be submitted?
              </p>
              <div class="block">
                <el-date-picker
                  v-model="quotation_time"
                  class="transporters-element-inputs"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  placeholder="Select time"
                  prefix-icon="el-icon-date"
                  :default-time="default_value"
                  :picker-options="dueDatePickerOptions"
                />
              </div>
            </div>

            <div
              v-if="process_shipment"
              v-loading="process_shipment"
              class="freight-loading-container"
            />

            <div
              v-if="!process_shipment"
              class="decline-documemt-extend decline-button-align"
            >
              <button
                type="button"
                name="button"
                class="quote-action--slide-button"
                @click="sendFinalQuote()"
              >
                Submit
              </button>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import VueTypeahead from 'vue-typeahead';
import Axios from 'axios';
import NotificationMxn from '../../../mixins/notification_mixin';
import LoadingComponent from './LoadingComponent.vue';

Vue.prototype.$http = Axios;

export default {
  name: 'Transporters',
  components: { LoadingComponent },
  extends: VueTypeahead,
  mixins: [NotificationMxn],
  data() {
    return {
      submit_text: 'Find Transporters',
      quote_text: 'Create Shipment Request',
      locations: [],
      order_path: [],
      main_order_path: [],
      map_options: {
        componentRestrictions: {
          country: ['ke', 'ug', 'tz', 'ss', 'rw'],
        },
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
      default_value: this.moment().format('HH:mm:ss'),
      truck_type: '',
      goods: '',
      query: '',
      load_weight: '',
      freight_selector: false,
      select_transporter: false,
      classes: 'typeahead',
      queryParamName: 'keyword',
      limit: 5,
      data: {},
      selectFirst: false,
      minChars: 2,
      truckTypes: [],
      goodsType: [],
      owners_list: [],
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      checkAll: false,
      isIndeterminate: true,
      checkedOwners: [],
      filteredCheckedOwners: [],
      quoteDialogVisible: false,
      pick_up_time: '',
      quotation_time: '',
      returnOptions: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
      shipmentOffer: [
        {
          value: true,
          label: 'Yes, I want to make a price offer',
        },
        {
          value: false,
          label: 'No, I want transporters to bid',
        },
      ],
      trucks_no: 1,
      facility_location: '',
      return_option: '',
      shipment_offer: '',
      negotiability: '',
      bid_amount: '',
      loading: true,
      DOM: '',
      pickup_value: '',
      destination_value: '',
      processing: false,
      process_shipment: false,
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
    ownersListing() {
      return this.owners_list;
    },
    show_quote() {
      return (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.truck_type !== ''
        && this.goods !== ''
        && this.pick_up_time !== ''
        && this.owners_list.length > 0
        && this.checkAll
        && this.pickup_value !== ''
        && this.destination_value !== ''
      );
    },
  },
  watch: {
    DOM: {
      handler(val, oldVal) {
        this.addFocusListener();
      },
      deep: true,
    },
  },
  created() {
    this.DOM = process;
  },
  mounted() {
    this.loading = true;
    this.fetchOwnersListing();
    this.fetchGoodsTypes();
    this.fetchCarrierTypes();
  },
  methods: {
    ...mapActions({
      getOwnersListing: '$_freight/getOwnersListing',
      getCargoTypes: '$_freight/getCargoTypes',
      getCarrierTypes: '$_freight/getCarrierTypes',
      getFilteredOwnersListing: '$_freight/getFilteredOwnersListing',
      sendCustomerQuote: '$_freight/sendCustomerQuote',
    }),
    handleCheckAllChange(val) {
      this.checkedOwners = val ? this.owners_list : [];
      this.isIndeterminate = false;
    },
    addFocusListener() {
      document.addEventListener('keyup', this.keyUpInput, true);
    },
    keyUpInput() {
      if (document.activeElement.id === 'pickup') {
        this.pickup_value = document.getElementById('pickup').value;
      }

      if (document.activeElement.id === 'destination') {
        this.destination_value = document.getElementById('destination').value;
      }
    },
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    handleCheckedCitiesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.owners_list.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.owners_list.length;
    },
    fetchOwnersListing() {
      this.$store.dispatch('$_freight/getOwnersListing').then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.owners_list = workingResponse.owners_listing;
          } else {
            this.owners_list = [];
          }
          this.loading = false;
        },
        (error) => {
          this.owners_list = [];
          this.loading = false;
        },
      );
    },
    fetchGoodsTypes() {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'cargo_types',
      };

      this.getCargoTypes(fullPayload).then(
        (response) => {
          if (response.status) {
            this.goodsType = response.data;
          } else {
            this.goodsType = [];
          }
        },
        (error) => {
          this.goodsType = [];
        },
      );
    },
    fetchCarrierTypes() {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'carrier_types',
      };

      this.getCarrierTypes(fullPayload).then(
        (response) => {
          if (response.status) {
            this.truckTypes = response.data;
          } else {
            this.truckTypes = [];
          }
        },
        (error) => {
          this.truckTypes = [];
        },
      );
    },
    viewTransporterInfo(val) {
      this.$router.push(`/freight/transporters/info/${val}`);
    },
    onHit(item) {
      this.$router.push(`/freight/transporters/info/${item.id}`);
    },
    prepareResponseData(data) {
      if (data.response.docs.length === 0) {
        this.hasItems = false;
      }
      return data.response.docs;
    },
    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = place.address_components.findIndex(country_code => country_code.types.includes('country'));
      const mainPathObj = {
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
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

      const pathObj = {
        address_components: place.address_components,
      };
      const pathPayload = {
        index,
        path: pathObj,
      };
      const mainPathPayload = {
        index,
        path: mainPathObj,
      };
      this.resetPathLocation(index);
      this.order_path.splice(pathPayload.index, pathPayload.index === 0 ? 0 : 1, pathPayload.path);
      this.main_order_path.splice(
        mainPathPayload.index,
        mainPathPayload.index === 0 ? 0 : 1,
        mainPathPayload.path,
      );
      this.setLocationInModel(index, `${place.name}`);
    },
    setLocationInModel(index, name) {
      this.locations.splice(index, 0, name);
    },
    resetPathLocation(index) {
      if (index === 0) {
        this.order_path.splice(index, 1);
        this.main_order_path.splice(index, 1);
      }
      this.deleteLocationInModel(index);
    },
    deleteLocationInModel(index) {
      this.locations.splice(index, 1);
    },
    filterTransporters() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.truck_type !== ''
        && this.goods !== ''
        && this.pick_up_time !== ''
        && this.pickup_value !== ''
        && this.destination_value !== ''
      ) {
        this.processing = true;
        this.doFilterOwners();
      } else {
        this.doNotification(2, 'Find transporters error !', 'Kindly provide all values');
      }
    },
    doFilterOwners() {
      const payload = {
        cargo_type: parseInt(this.goods, 10),
        carrier_type: parseInt(this.truck_type, 10),
        pick_up: this.order_path[0].address_components,
        destination: this.order_path[1].address_components,
      };

      const fullPayload = {
        values: payload,
        app: 'PARTNERS_APP',
        endpoint: 'transporters',
      };

      this.getFilteredOwnersListing(fullPayload).then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            if (workingResponse.owners_listing.length > 0) {
              this.doNotification(1, workingResponse.message, '');
              this.owners_list = workingResponse.owners_listing;
              this.handleCheckAllChange(true);
              this.checkAll = true;
            } else {
              this.owners_list = workingResponse.owners_listing;
              this.doNotification(
                2,
                'No available Transporters ',
                'No available transporters based on the filters',
              );
              this.handleCheckAllChange(false);
              this.checkAll = false;
            }
          } else {
            this.doNotification(2, 'Unable to filter transporters!', workingResponse.message);
            this.owners_list = [];
          }
          this.processing = false;
        },
        (error) => {
          this.fetchOwnersListing();
          this.processing = false;
        },
      );
    },
    showQuoteDialog() {
      if (this.checkedOwners.length > 0) {
        this.filteredCheckedOwners = [];
        for (let i = 0; i < this.checkedOwners.length; i++) {
          this.filteredCheckedOwners.push(this.checkedOwners[i].id);
        }
        setTimeout(() => {
          this.quoteDialogVisible = true;
        }, 800);
      } else {
        this.doNotification(
          2,
          'Unable to request for quotation!',
          'Kindly select a transporter to request quotation',
        );
      }
    },
    sendFinalQuote() {
      if (
        this.filteredCheckedOwners.length === 0
        || this.facility_location === ''
        || this.return_option === ''
        || this.trucks_no === ''
        || this.load_weight === ''
        || this.shipment_offer === ''
        || this.quotation_time === ''
        || (this.shipment_offer && (this.bid_amount === '' || this.negotiability === ''))
      ) {
        this.doNotification(
          2,
          'Unable to create shipment request!',
          'Kindly provide all values for request to be submitted',
        );
      } else {
        this.process_shipment = true;
        let acc = {};
        const session = this.$store.getters.getSession;
        if ('default' in session) {
          acc = session[session.default];
        }
        const payload = {
          cop_id: 'cop_id' in acc ? acc.cop_id : null,
          cop_user_id: 'cop_id' in acc ? acc.user_id : null,
          peer_id: 'cop_id' in acc ? null : acc.user_id,
          transporters: this.filteredCheckedOwners,
          cargo_type: parseInt(this.goods, 10),
          carrier_type: parseInt(this.truck_type, 10),
          pickup: this.main_order_path[0],
          destination: this.main_order_path[1],
          pickup_time: this.moment(this.pick_up_time).format('DD-MM-YYYY HH:mm:ss'),
          bidding_deadline: this.moment(this.quotation_time).format('DD-MM-YYYY HH:mm:ss'),
          currency: 'USD',
          pickup_facility: this.facility_location,
          is_return: this.return_option,
          total_trucks: this.trucks_no,
          tonnes_per_truck: this.load_weight,
        };

        if (this.shipment_offer) {
          payload.offer_amount = this.bid_amount;
          payload.is_negotiable = this.negotiability;
        }

        const fullPayload = {
          values: payload,
          app: 'FREIGHT_APP',
          operator: '?',
          endpoint: 'shipments',
        };
        this.sendCustomerQuote(fullPayload).then(
          (response) => {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

            let workingResponse = response;
            if (response.length > 1) {
              workingResponse = response[0];
            }

            if (workingResponse.status) {
              this.doNotification(1, 'Shipment sent successfully!', '');
              this.$router.push('/freight/orders');
            } else {
              this.doNotification(
                2,
                'Unable to request for shipment!',
                workingResponse.data.message,
              );
            }
            this.resetQuatationDialog();
            this.process_shipment = false;
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error, 'message')) {
              this.doNotification(2, 'Shipment request failed', error.message);
            } else {
              this.doNotification(
                2,
                'Shipment request failed',
                'Something went wrong.Please try again',
              );
              this.resetQuatationDialog();
            }
            this.process_shipment = false;
          },
        );
      }
    },
    resetQuatationDialog() {
      this.quoteDialogVisible = false;
      this.quotation_time = '';
      this.facility_location = '';
      this.return_option = '';
      this.trucks_no = '';
      this.load_weight = '';
      this.shipment_offer = '';
      this.bid_amount = '';
      this.negotiability = '';
    },
    returnCount(val) {
      let resp = `${val} Trucks`;

      if (val === 1) {
        resp = `${val} Truck`;
      }
      return resp;
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
.search-transporter{
  width: 100%;
  margin-top: 4%;
}
.transporter-outer{
  height: 90%;
  margin: 0em;
  overflow-y: auto;
}
.freight-select{
  margin-bottom: 3%;
}
.bids-time{
  width: 100%;
}
.no-transporters-label{
  text-align: center;
}
.no-transporters-img  {
  width: 42%;
  display: block;
  margin: auto;
}
.transporter-listing-outer{
  margin: 0em;
  overflow-y: auto;
}
.listing-info{
  border: 1px solid #1B7FC3;
  padding: 1rem;
  border-radius: 4px;
  width: 94% !important;
  margin-left: 0% !important;
}
.listing-info-count{
  font-size: 13px;
  color: #000000;
  margin-left: 5%;
}
.shipment-dialog{
  margin-left: 5%;
  margin-top: 3%;
}
.request-shipment-btn-color{
  color: #FFFFFF;
  border-width: 0px !important;
  cursor: pointer;
  position: relative;
  display: block;
  height: 40px;
  transition: background-color 0.3s;
  font-size: 13px;
  border-color: #1B7FC3;
  background: #1B7FC3;
  border-radius: 4px;
  width: 30%;
}
.request-shipment-header{
  display: flex;
  align-items: center;
  color: #000000;
  font-weight: 500;
  font-size: 17px;
  line-height: 18px;
}
.shipment-input--label{
  margin-bottom: 2%;
  font-size: 13px;
  font-weight: 300;
  color: #000;
}
.transporters-element-inputs{
  background-color: white !important;
  width: 100% !important;
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
.transporter-selector {
  border: 0px solid #dcdfe6;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  width: 100%;
}
.align-filters-section{
  margin-bottom: 4%;
}
.freight-loading-container {
  height: 1rem;
  margin-bottom: 10px;
  margin-top: 15%;
}
.freight-search{
  color : #1782c5;
}
</style>
