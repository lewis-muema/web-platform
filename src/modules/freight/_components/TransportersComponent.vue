<template lang="html">
  <div class="transporters-main">
    <div class="transporters-container transporters-main--inner">
      <div class="transporters-content">
        <div class="transporters-find-section">
          <div class="">
            <p class="freight-input--label">
              Pick up location
            </p>
            <input
              v-model="pick_up"
              class="input-control"
              type="text"
              name="name"
              value=""
            >
          </div>

          <div class="">
            <p class="freight-input--label">
              Destination
            </p>
            <input
              v-model="destination"
              class="input-control"
              type="text"
              name="name"
              value=""
            >
          </div>

          <div class="">
            <p class="freight-input--label">
              Pick up time
            </p>
            <div class="block">
              <el-date-picker
                v-model="pick_up_time"
                class="transporters-pickup-time"
                type="datetime"
                format="dd-MM-yyyy h:mm a"
                placeholder="As soon as possible"
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
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
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
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="next-terms-holder">
            <input
              v-model="submit_text"
              class="button-primary terms-btn-color search-transporter"
              type="submit"
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

Vue.prototype.$http = Axios;

export default {
  name: 'Transporters',
  extends: VueTypeahead,
  data() {
    return {
      submit_text: 'Find Transporters',
      quote_text: 'Request for quote',
      pick_up: '',
      destination: '',
      pick_up_time: '',
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
      truckTypes: [
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
      goodsType: [
        {
          value: '1',
          label: 'Sugar',
        },
        {
          value: '4',
          label: 'Sand',
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
  },
  watch: {},
  mounted() {
    this.fetchOwnersListing();
  },
  methods: {
    ...mapActions({
      getOwnersListing: '$_freight/getOwnersListing',
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
