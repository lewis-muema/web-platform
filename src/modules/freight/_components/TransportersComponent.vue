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
              What is the weight of the load?
            </p>
            <div>
              <input
                v-model.trim="load_weight"
                class="input-control freight-load-weight"
                type="text"
                placeholder=""
                autocomplete="on"
              >
              <span class="tonage-value-text">Tonnes</span>
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

          <div class="next-terms-holder">
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
          <div class="transporters-filters">
            <div class="quote-flex">
              <div v-if="show_quote">
                <input
                  v-model="quote_text"
                  class="request-quote-btn-color request-quote-btn"
                  type="submit"
                  @click="showQuoteDialog"
                >
              </div>
            </div>
            <div class="search-flex">
              <el-input
                v-model="query"
                placeholder="Search by name"
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
                  class="el-input__icon el-icon-search"
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
          <div class="freight-terms freight-select">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              Select all
            </el-checkbox>
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
                      28 Truck
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
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="">
          <el-dialog
            :visible.sync="quoteDialogVisible"
            class="declineDocumentOptions"
          >
            <div class="">
              <div class="decline-text-option decline-documemt-extend request-quote-header">
                Request for quote
              </div>
            </div>
            <div class="">
              <div class="decline-text-option decline-documemt-extend">
                <span class="transporters-no-highlight">{{ filteredCheckedOwners.length }}</span>
                Selected Transporters
              </div>
            </div>
            <div class="decline-documemt-extend decline-documemt-input">
              <p class="freight-input--label">
                By when should bids be submitted?
              </p>
              <div class="block">
                <el-date-picker
                  v-model="quotation_time"
                  class="transporters-pickup-time"
                  type="datetime"
                  format="dd-MM-yyyy h:mm a"
                  placeholder="Select time"
                  prefix-icon="el-icon-date"
                  :default-time="default_value"
                />
              </div>
            </div>

            <div class="decline-documemt-extend decline-button-align">
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

Vue.prototype.$http = Axios;

export default {
  name: 'Transporters',
  extends: VueTypeahead,
  mixins: [NotificationMxn],
  data() {
    return {
      submit_text: 'Find Transporters',
      quote_text: 'Request for quote',
      locations: [],
      order_path: [],
      main_order_path: [],
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
      checkAll: false,
      isIndeterminate: true,
      checkedOwners: [],
      filteredCheckedOwners: [],
      quoteDialogVisible: false,
      pick_up_time: '',
      quotation_time: '',
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
        && this.load_weight !== ''
        && this.goods !== ''
        && this.pick_up_time !== ''
      );
    },
  },
  watch: {},
  mounted() {
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
        },
        (error) => {
          this.owners_list = [];
        },
      );
    },
    fetchGoodsTypes() {
      const fullPayload = {
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/cargo_types',
      };

      this.getCargoTypes(fullPayload).then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.goodsType = workingResponse.cargo_types;
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
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/carrier_types',
      };

      this.getCarrierTypes(fullPayload).then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.truckTypes = workingResponse.carrier_types;
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
        waypoint_details_status: true,
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
        && this.load_weight !== ''
        && this.goods !== ''
        && this.pick_up_time !== ''
      ) {
        this.doFilterOwners();
      } else {
        this.doNotification(2, 'Find transporters error !', 'Kindly provide all values');
      }
    },
    doFilterOwners() {
      const payload = {
        cargo_type: parseInt(this.goods, 10),
        load_weight: parseInt(this.load_weight, 10),
        carrier_type: parseInt(this.truck_type, 10),
        pick_up: this.order_path[0].address_components,
        destination: this.order_path[1].address_components,
      };

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/owners',
      };

      this.getFilteredOwnersListing(fullPayload).then(
        (response) => {
          let workingResponse = response;
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            if (workingResponse.owners_listing.length === 0) {
              this.doNotification(2, workingResponse.message, '');
              this.fetchOwnersListing();
            }
            this.owners_list = workingResponse.owners_listing;
          } else {
            this.doNotification(2, 'Unable to filter transporters!', workingResponse.message);
            this.fetchOwnersListing();
          }
        },
        (error) => {
          this.fetchOwnersListing();
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
      if (this.filteredCheckedOwners.length === 0 || this.quotation_time === '') {
        this.doNotification(
          2,
          'Unable to request for quotation!',
          'Kindly provide time for quotation to to submitted',
        );
      } else {
        let acc = {};
        const session = this.$store.getters.getSession;
        if ('default' in session) {
          acc = session[session.default];
        }
        const payload = {
          cop_id: 'cop_id' in acc ? acc.cop_id : 0,
          cop_user_id: 'cop_id' in acc ? acc.user_id : 0,
          peer_id: 'cop_id' in acc ? null : acc.user_id,
          owners: this.filteredCheckedOwners,
          cargo_type: parseInt(this.goods, 10),
          load_weight: parseInt(this.load_weight, 10),
          carrier_type: parseInt(this.truck_type, 10),
          pick_up: this.main_order_path[0],
          destination: this.main_order_path[1],
          pick_up_time: this.moment(this.pick_up_time).format('YYYY-MM-DD HH:mm:ss'),
          quotation_deadline: this.moment(this.quotation_time).format('YYYY-MM-DD HH:mm:ss'),
        };

        const fullPayload = {
          values: payload,
          app: 'ORDERS_APP',
          endpoint: 'v2/freight/quotations',
        };
        this.sendCustomerQuote(fullPayload).then(
          (response) => {
            if (response.status) {
              this.doNotification(1, 'Quotations sent successfully!', '');
              this.fetchOwnersListing();
            } else {
              this.doNotification(2, 'Unable to request for quotation!', response.message);
            }
            this.resetQuatationDialog();
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error, 'message')) {
              this.doNotification(2, 'Quote request failed', error.message);
            } else {
              this.doNotification(
                2,
                'Quote request failed',
                'Quote request failed. Please check your internet connection and try again.',
              );
              this.resetQuatationDialog();
            }
          },
        );
      }
    },
    resetQuatationDialog() {
      this.quoteDialogVisible = false;
      this.quotation_time = '';
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
  height: 455px;
  margin: 0em;
  overflow-y: auto;
}
.freight-select{
  margin-bottom: 3%;
}
.bids-time{
  width: 100%;
}
</style>
