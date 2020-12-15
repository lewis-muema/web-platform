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
              <input
                v-model="quote_text"
                class="request-quote-btn-color request-quote-btn"
                type="submit"
              >
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
            <input
              v-model="freight_selector"
              type="checkbox"
              name="u_terms"
              class="hiddeny"
            >
            <span class="">
              Select all
            </span>
          </div>
          <div class="transporter-outer">
            <div class="transporter-listing">
              <div
                v-for="(val, index) in ownersListing"
                v-if="index >= 0"
                class="transporter-detail"
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
                  <div class="select-transporter">
                    <input
                      v-model="select_transporter"
                      type="checkbox"
                      name="u_terms"
                      class="hiddeny"
                    >
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
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
      ownersListing: [],
      truckTypes: [],
      goodsType: [],
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
    }),
    fetchOwnersListing() {
      const payload = {};

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/owners',
      };

      this.getOwnersListing(fullPayload).then(
        (response) => {
          if (response.status) {
            this.ownersListing = response.owners_listing;
          } else {
            this.ownersListing = [];
          }
        },
        (error) => {
          this.ownersListing = [];
        },
      );
    },
    fetchGoodsTypes() {
      const payload = {};

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/cargo_types',
      };

      this.getCargoTypes(fullPayload).then(
        (response) => {
          if (response.status) {
            this.goodsType = response.cargo_types;
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
      const payload = {};

      const fullPayload = {
        values: payload,
        app: 'ORDERS_APP',
        endpoint: 'v2/freight/carrier_types',
      };

      this.getCarrierTypes(fullPayload).then(
        (response) => {
          if (response.status) {
            this.truckTypes = response.carrier_types;
          } else {
            this.truckTypes = [];
          }
        },
        (error) => {
          this.truckTypes = [];
        },
      );
    },
    viewTransporterInfo() {
      const transporterId = 2;
      this.$router.push(`/freight/transporters/info/${transporterId}`);
    },
    onHit(item) {
      console.log('item', item);
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
      const pathObj = {
        address_components: place.address_components,
      };
      const pathPayload = {
        index,
        path: pathObj,
      };
      this.resetPathLocation(index);
      this.order_path.splice(pathPayload.index, pathPayload.index === 0 ? 0 : 1, pathPayload.path);
      this.setLocationInModel(index, `${place.name}`);
    },
    setLocationInModel(index, name) {
      this.locations.splice(index, 0, name);
    },
    resetPathLocation(index) {
      if (index === 0) {
        this.order_path.splice(index, 1);
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
          if (response.status) {
            this.ownersListing = response.owners_listing;
          } else {
            this.doNotification(2, 'Unable to filter transporters!', response.message);
            this.fetchOwnersListing();
          }
        },
        (error) => {
          this.fetchOwnersListing();
        },
      );
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
  height: 500px;
  margin: 0em;
  overflow-y: auto;
}
.freight-select{
  margin-bottom: 3%;
}
</style>
