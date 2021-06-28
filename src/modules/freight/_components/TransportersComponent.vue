<template lang="html">
  <div class="transporters-main">
    <div class="transporters-container transporters-main--inner">
      <div class="transporters-content">
        <div class="transporters-find-section">
          <div class="">
            <p class="freight-input--label">
              {{ $t('transporterComponent.pickup_location') }}
            </p>
            <gmap-autocomplete
              id="pickup"
              v-model="locations[0]"
              :options="map_options"
              :placeholder="$t('transporterComponent.enter_pickup_location')"
              :select-first-on-enter="true"
              class="input-control"
              @place_changed="setLocation($event, 0)"
            />
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('transporterComponent.destination') }}
            </p>
            <gmap-autocomplete
              id="destination"
              v-model="locations[1]"
              :options="map_options"
              :placeholder="$t('transporterComponent.enter_destination')"
              :select-first-on-enter="true"
              class="input-control"
              @place_changed="setLocation($event, 1)"
            />
          </div>
          <div class="">
            <p class="freight-input--label">
              {{ $t('transporterComponent.pickup_time') }}
            </p>
            <div class="transporters-select">
              <el-date-picker
                v-model="pick_up_time"
                class="bids-time"
                type="datetime"
                format="dd-MM-yyyy h:mm a"
                :placeholder="$t('transporterComponent.select_time')"
                prefix-icon="el-icon-date"
                :default-time="default_value"
                :picker-options="dueDatePickerOptions"
              />
            </div>
          </div>

          <div class="">
            <p class="freight-input--label">
              {{ $t('transporterComponent.truck_type') }}
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
              {{ $t('transporterComponent.item_transported') }}
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
          <div v-if="loader">
            <loading-component />
          </div>
          <div v-else>
            <div v-if="ownersListing.length === 0">
              <img
                src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/freight_truck.svg"
                class="no-transporters-img "
              >
              <div class="no-transporters-label">
                {{ $t('transporterComponent.no_transport_found') }}
              </div>
            </div>
            <div v-else>
              <div class="transporters-filters align-filters-section">
                <div class="quote-flex">
                  <div v-if="show_quote">
                    <div class="transporter-listing-outer">
                      <div class="listing-info">
                        <div class="listing-info-count">
                          {{ ownersListing.length }}
                          {{ $t('transporterComponent.transporters_found') }}
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
                    :placeholder="$t('transporterComponent.search_by_name')"
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
                      {{ $t('transporterComponent.no_details') }}
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
                          {{ $t('transporterComponent.view') }}
                          <i class="el-icon-arrow-right view-transporter-info" />
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
                {{ $t('transporterComponent.create_shipment_request') }}
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                {{ $t('transporterComponent.where_pickup_facility') }} {{ locations[0] }}
              </p>
              <div class="block">
                <el-input
                  v-model="facility_location"
                  type="textarea"
                  :rows="2"
                  :placeholder="$t('transporterComponent.please_input')"
                />
              </div>
            </div>

            <div
              v-for="(val, index) in carrier_options"
              v-if="goods === 1 && carrier_options.length > 0"
              :key="val.id"
              class=""
            >
              <div class="decline-documemt-extend decline-documemt-input">
                <p class="shipment-input--label">
                  {{ val.description }}
                </p>
                <div
                  v-if="val.data_type === 'boolean'"
                  class="block"
                >
                  <el-select
                    v-model="carrier_option_value[index]"
                    placeholder=""
                    class="transporters-element-inputs"
                    filterable
                    @change="setCarrierOptionValue(index)"
                  >
                    <el-option
                      v-for="item in returnOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
                <div
                  v-else
                  class="block"
                >
                  <el-input-number
                    v-model.trim="carrier_option_value[index]"
                    :min="0"
                    @change="setCarrierOptionValue(index)"
                  />
                </div>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                {{ $t('transporterComponent.how_many_trucks_need') }}
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
                {{ $t('transporterComponent.tonnes_truck_carry_per_move') }}
              </p>
              <div class="block">
                <el-input-number
                  v-model="load_weight"
                  class="freight-load-weight"
                  :min="1"
                />
                <span class="tonage-value-text">Tonnes</span>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                {{ $t('transporterComponent.transaction_currency') }}
              </p>
              <div class="block">
                <el-select
                  v-model="currency"
                  placeholder=""
                  class="transporters-element-inputs"
                  filterable
                >
                  <el-option
                    v-for="item in supported_currencies"
                    :key="item.code"
                    :label="item.currency_code"
                    :value="item.currency_code"
                  />
                </el-select>
              </div>
            </div>

            <div class="decline-documemt-extend decline-documemt-input">
              <p class="shipment-input--label">
                {{ $t('transporterComponent.make_offer') }}
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
                  {{ $t('transporterComponent.how_much_pay_per_truck') }}
                </p>
                <div class="block">
                  <input
                    v-model="bid_amount"
                    class="input-control freight-load-weight"
                    type="number"
                    :placeholder="$t('transporterComponent.input_amount_placeholder')"
                    autocomplete="on"
                    min="0"
                  >
                  <span class="tonage-value-text" />
                </div>
              </div>

              <div class="decline-documemt-extend decline-documemt-input">
                <p class="shipment-input--label">
                  {{ $t('transporterComponent.is_this_price_negotiable') }}
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
                {{ $t('transporterComponent.when_bids_submitted') }}
              </p>
              <div class="block">
                <el-date-picker
                  v-model="quotation_time"
                  class="transporters-element-inputs"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  :placeholder="$t('transporterComponent.select_time')"
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
                {{ $t('transporterComponent.submit') }}
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
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';

Vue.prototype.$http = Axios;

export default {
  name: 'Transporters',
  components: { LoadingComponent },
  extends: VueTypeahead,
  mixins: [NotificationMxn, MixpanelMixin],
  data() {
    return {
      submit_text: this.$t('transporterComponent.find_transporter'),
      quote_text: this.$t('transporterComponent.create_shipment_request'),
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
      load_weight: 28,
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
          label: this.$t('orderDetailsComponent.valid'),
        },
        {
          value: false,
          label: this.$t('orderDetailsComponent.invalid'),
        },
      ],
      shipmentOffer: [
        {
          value: true,
          label: this.$t('transporterComponent.yes_want_to_make_price_offer'),
        },
        {
          value: false,
          label: this.$t('transporterComponent.want_tranporters_bid'),
        },
      ],
      trucks_no: 1,
      facility_location: '',
      shipment_offer: '',
      negotiability: '',
      bid_amount: '',
      loader: true,
      DOM: '',
      pickup_value: '',
      destination_value: '',
      processing: false,
      process_shipment: false,
      carrier_options: [],
      carrier_option_value: [],
      currency: 'USD',
      supported_currencies: [
        {
          country_id: 2,
          currency_code: 'USD',
        },
      ],
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
    goods(val) {
      if (val === 1) {
        const filteredData = this.goodsType.filter(pack => pack.id === val);
        if (filteredData[0].options.length > 0) {
          filteredData[0].options.map(v => Object.assign(v, { value: v.data_type === 'boolean' ? 'No' : 1 }));
          this.carrier_options = filteredData[0].options;
        } else {
          this.carrier_options = [];
        }
      } else {
        this.carrier_options = [];
      }
    },
  },
  created() {
    this.DOM = process;
  },
  mounted() {
    this.loader = true;
    this.fetchOwnersListing();
    this.fetchGoodsTypes();
    this.fetchCarrierTypes();
    this.fetchCurrencies();
    const session = this.$store.getters.getSession;
    this.trackMixpanelEvent('Transporters Page Viewed', {
      'User Id': session[session.default].user_id,
      Email: session[session.default].user_email,
      Phone: session[session.default].user_phone,
      Name: session[session.default].user_name,
      'Client Type': 'Web',
      'Client Mode': session.default === 'peer' ? 'Peer' : 'Cop',
      Device: 'Desktop',
    });
  },
  methods: {
    ...mapActions({
      getOwnersListing: '$_freight/getOwnersListing',
      getCargoTypes: '$_freight/getCargoTypes',
      getCarrierTypes: '$_freight/getCarrierTypes',
      getFilteredOwnersListing: '$_freight/getFilteredOwnersListing',
      sendCustomerQuote: '$_freight/sendCustomerQuote',
    }),
    fetchCurrencies() {
      this.$store.dispatch('$_freight/requestSupportedCountries').then(
        (response) => {
          if (response.length > 0) {
            for (let i = 0; i < response.length; i++) {
              this.supported_currencies.push(response[i]);
            }
          } else {
            this.supported_currencies = [
              {
                country_id: 2,
                currency_code: 'USD',
              },
            ];
          }
        },
        (error) => {
          this.supported_currencies = [
            {
              country_id: 2,
              currency_code: 'USD',
            },
          ];
        },
      );
    },
    setCarrierOptionValue(index) {
      this.carrier_options[index].value = this.carrier_option_value[index];
    },
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
          this.loader = false;
        },
        (error) => {
          this.owners_list = [];
          this.loader = false;
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
        this.doNotification(
          2,
          this.$t('transporterComponent.transporter_error'),
          this.$t('transporterComponent.provide_all'),
        );
      }
    },
    doFilterOwners() {
      const payload = {
        cargo_type: parseInt(this.goods, 10),
        carrier_type: parseInt(this.truck_type, 10),
        pick_up: this.order_path[0].address_components,
        destination: this.order_path[1].address_components,
      };

      const session = this.$store.getters.getSession;
      this.trackMixpanelEvent('Transporters Searched', {
        userId: session[session.default].user_id,
        email: session[session.default].user_email,
        phone: session[session.default].user_phone,
        name: session[session.default].user_name,
        pickUp: this.order_path[0].address_components,
        destination: this.order_path[1].address_components,
        carrierType: parseInt(this.truck_type, 10),
        cargoType: parseInt(this.goods, 10),
        clientType: 'Web',
        clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
        device: 'Desktop',
      });

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
                this.$t('transporterComponent.no_available'),
                this.$t('transporterComponent.no_available_text'),
              );
              this.handleCheckAllChange(false);
              this.checkAll = false;
            }
          } else {
            this.doNotification(
              2,
              this.$t('transporterComponent.unable_filter'),
              workingResponse.message,
            );
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
          this.$t('transporterComponent.unable_request'),
          this.$t('transporterComponent.select_transporter'),
        );
      }
    },
    sendFinalQuote() {
      if (
        this.filteredCheckedOwners.length === 0
        || this.facility_location === ''
        || this.trucks_no === ''
        || this.load_weight === ''
        || this.shipment_offer === ''
        || this.quotation_time === ''
        || (this.shipment_offer && (this.bid_amount === '' || this.negotiability === ''))
      ) {
        this.doNotification(
          2,
          this.$t('transporterComponent.unable_create_shipment_request'),
          this.$t('transporterComponent.provide_all'),
        );
      } else if (this.goods === 1) {
        this.checkCarrierOptionValue();
      } else {
        this.processShipment();
      }
    },
    checkCarrierOptionValue() {
      if (
        this.carrier_option_value[0] === undefined
        || this.carrier_option_value[1] === undefined
        || this.carrier_option_value[2] === undefined
      ) {
        this.doNotification(
          2,
          this.$t('transporterComponent.unable_create_shipment_request'),
          this.$t('transporterComponent.provide_all'),
        );
      } else if (this.carrier_option_value[1] === 0 && this.carrier_option_value[2] === 0) {
        this.doNotification(
          2,
          this.$t('transporterComponent.unable_create_shipment_request'),
          this.$t('transporterComponent.container_missing_error'),
        );
      } else {
        this.processShipment();
      }
    },
    processShipment() {
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
        currency: this.currency,
        pickup_facility: this.facility_location,
        total_trucks: this.trucks_no,
        tonnes_per_truck: parseInt(this.load_weight, 10),
      };

      if (this.shipment_offer) {
        payload.offer_amount = this.bid_amount;
        payload.is_negotiable = this.negotiability;
      }
      if (this.goods === 1) {
        payload.cargo_type_options = this.carrier_options;
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
            this.trackMixpanelEvent('Shipment Request Placed', {
              userId: session[session.default].user_id,
              email: session[session.default].user_email,
              phone: session[session.default].user_phone,
              name: session[session.default].user_name,
              isNegotiable: this.negotiability,
              amountPerTruck: this.bid_amount,
              currency: this.currency,
              pickupFacility: this.main_order_path[0],
              destinationFacility: this.main_order_path[1],
              trucksNeeded: this.trucks_no,
              transporters: this.filteredCheckedOwners,
              clientType: 'Web',
              clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
              device: 'Desktop',
            });
          } else {
            this.doNotification(
              2,
              this.$t('transporterComponent.unable_request_shipment'),
              workingResponse.data.message,
            );
          }
          this.resetQuatationDialog();
          this.process_shipment = false;
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'message')) {
            this.doNotification(
              2,
              this.$t('transporterComponent.shipment_request_failed'),
              error.message,
            );
          } else {
            this.doNotification(
              2,
              this.$t('transporterComponent.shipment_request_failed'),
              this.$t('transporterComponent.something_went_wrong'),
            );
            this.resetQuatationDialog();
          }
          this.process_shipment = false;
        },
      );
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
@import '../../../assets/styles/transporters_component.css';
@import '../../../assets/styles/nav.css';
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
  margin-bottom: 2%;
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
