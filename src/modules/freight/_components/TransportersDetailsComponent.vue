<template lang="html">
  <div class="transporters-main">
    <div v-if="loading">
      <loading-component />
    </div>
    <div v-else>
      <div class="transporters-container transporters-main--inner">
        <div class="transporters-content">
          <div
            class="transporters-results-section
            transporters-details-section"
          >
            <div
              class="back-freight-btn"
              @click="backToTransporters()"
            >
              <i class="el-icon-arrow-left view-transporter-info" /> Back
            </div>
            <div class="transporter-listing transporter-summary-data">
              <div class="transporter-detail--info">
                <div class="transporter-name">
                  {{ owner_details.name }}
                  <img
                    src="https://images.sendyit.com/web_platform/freight/verified.svg"
                    alt=""
                    class="transporters-img highlight-icon"
                  >
                </div>

                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info truck-add-rating-align">
                    <img
                      src="https://images.sendyit.com/web_platform/freight/highlight.svg"
                      alt=""
                      class="transporters-img highlight-icon"
                    >
                    {{ owner_details.place_orders }} completed orders
                  </div>
                </div>

                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info truck-add-rating-align">
                    <img
                      src="https://images.sendyit.com/web_platform/freight/rating.svg"
                      alt=""
                      class="transporters-img highlight-icon"
                    >
                    {{ owner_details.average_rating }} ({{ owner_details.review_count }} Reviews)
                  </div>
                </div>

                <div class="transporter-name align-contacts-data">
                  Contacts
                </div>
                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info truck-add-rating-align">
                    <img
                      src="https://images.sendyit.com/web_platform/freight/phone.svg"
                      alt=""
                      class="transporters-img highlight-icon"
                    >
                    {{ owner_details.phone_number }}
                  </div>
                </div>
                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info truck-add-rating-align">
                    <img
                      src="https://images.sendyit.com/web_platform/freight/email.svg"
                      alt=""
                      class="transporters-img highlight-icon"
                    >
                    {{ owner_details.email }}
                  </div>
                </div>
              </div>
            </div>
            <div class="">
              <div class="transporter-doucuments-title align-contacts-data">
                Documents
              </div>
              <div
                v-for="(val, index) in owner_details.documents"
                :key="index"
              >
                <div class="transporters-filters transporters-highlight">
                  <div class="truck-add-info">
                    <i class="el-icon-circle-check check-tranporters" />
                    {{ val.type }}
                  </div>
                </div>
              </div>
            </div>

            <div class="">
              <div class="transporter-doucuments-title align-contacts-data">
                Vehicles
              </div>
              <div v-if="owner_details.vehicles === null">
                <div class="transporter-detail-rating no-reviews-outer transporter-vehicle-rating">
                  No vehicle details available for transporter .
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(val, index) in owner_details.vehicles"
                  :key="index"
                >
                  {{ val }}
                  <div class="">
                    <div class="truck-title-info">
                      {{ val.vendor_type }}
                    </div>
                    <div class="transporter-vehicle-info">
                      {{ val.vehicle_registration }}
                    </div>
                    <div
                      v-if="val.verified"
                      class="transporters-filters transporters-highlight"
                    >
                      <div class="truck-add-info">
                        <i class="el-icon-circle-check check-tranporters" />
                        log book
                      </div>
                    </div>
                    <div class="vehicles-split" />
                  </div>
                </div>
              </div>
            </div>

            <div class="">
              <div class="transporter-doucuments-title align-contacts-data reviews-section">
                Reviews
              </div>
              <div
                v-if="owner_details.ratings === null || owner_details.ratings === 'null'"
                class=""
              >
                <div class="transporter-detail-rating no-reviews-outer transporter-vehicle-rating">
                  No ratings available for transporter .
                </div>
              </div>
              <div v-else-if="owner_details.ratings.length > 0">
                <div
                  v-for="(val, index) in owner_details.ratings"
                  :key="index"
                  class="transporter-detail reviews-outer"
                >
                  <div class="">
                    {{ val.pickup }} to {{ val.destination }}
                  </div>
                  <div class="transporters-filters transporters-highlight">
                    <div class="truck-add-info">
                      <el-rate
                        :value="val.rating"
                        disabled
                        show-score
                        disabled-void-color="#C0C4CC"
                        :colors="['#007FFF', '#007FFF', '#007FFF']"
                        score-template="{value}"
                      />
                    </div>
                  </div>

                  <div class="transporters-filters transporters-highlight">
                    <div class="truck-add-info">
                      {{ val.comment }}
                    </div>
                  </div>

                  <div
                    v-if="val.customer_name !== ''"
                    class="transporters-filters transporters-highlight"
                  >
                    <div class="truck-add-info transporter-name-inner">
                      {{ val.customer_name }}
                    </div>
                  </div>
                  <div class="transporters-filters transporters-highlight">
                    <div class="truck-add-info">
                      {{ moment(val.date).format('DD/MM/YYYY') }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="transporter-detail-rating no-reviews-outer transporter-vehicle-rating">
                  No ratings available for transporter .
                </div>
              </div>
            </div>
          </div>

          <div class="transporters-quote-section">
            <div class="">
              <p class="transporters-quotes-input--label">
                Quote
              </p>
              <input
                v-model="quote_text"
                class="quote-btn button-primary terms-btn-color next-freight-btn"
                type="submit"
                @click="showQuoteDialog()"
              >
            </div>

            <div class="">
              <p class="transporters-quotes-input--label">
                Link with this transporter to access financing
              </p>
              <input
                v-model="financing_text"
                class=" financing-btn button-primary terms-btn-color next-freight-btn"
                type="submit"
                @click="directToCreateOrder()"
              >
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
            :visible.sync="quoteDialog"
            class="sendQuoteOption"
          >
            <div class="">
              <div class="quote-text-option decline-documemt-extend">
                Request Quote
              </div>
            </div>
            <div class="quote-find-section">
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
                  By when should bids be submitted?
                </p>
                <div class="transporters-select">
                  <el-date-picker
                    v-model="quotation_time"
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
                  @click="sendQuote"
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
import { mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';
import LoadingComponent from './LoadingComponent.vue';

export default {
  name: 'Transporters',
  components: { LoadingComponent },
  mixins: [NotificationMxn],
  data() {
    return {
      quote_text: 'Request for quote',
      financing_text: 'Place Order',
      submit_text: 'Request',
      rating: 5.0,
      quoteDialog: false,
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
      pick_up_time: '',
      quotation_time: '',
      truckTypes: [],
      goodsType: [],
      owner_details: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters({}),
  },
  mounted() {
    this.loading = true;
    this.fetchOwnerDetail();
    this.fetchGoodsTypes();
    this.fetchCarrierTypes();
  },
  methods: {
    ...mapActions({
      getCargoTypes: '$_freight/getCargoTypes',
      getCarrierTypes: '$_freight/getCarrierTypes',
      sendCustomerQuote: '$_freight/sendCustomerQuote',
      getOwnersDetail: '$_freight/getOwnersDetail',
    }),
    fetchOwnerDetail() {
      this.loading = true;
      const fullPayload = {
        app: 'ORDERS_APP',
        endpoint: `v2/freight/owner/${parseInt(this.$route.params.id, 10)}`,
      };

      this.getOwnersDetail(fullPayload).then(
        (response) => {
          const workingResponse = response;
          if (workingResponse.status) {
            this.owner_details = workingResponse.owner_details;
            this.loading = false;
          } else {
            this.doNotification(
              2,
              'Failed to load transporter details !',
              'Unable to load transporter details',
            );
            this.backToTransporters();
            this.owner_details = [];
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Failed to load transporter details !',
            'Unable to load transporter details',
          );
          this.backToTransporters();
          this.owner_detail = [];
        },
      );
    },

    backToTransporters() {
      this.$router.push('/freight/transporters');
    },
    directToCreateOrder() {
      this.$router.push('/freight/orders/create');
    },
    showQuoteDialog() {
      this.quoteDialog = true;
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
    setLocation(place, index) {
      if (!place) {
        // console.log('not a place', index);
        return;
      }
      const countryIndex = place.address_components.findIndex(country_code => country_code.types.includes('country'));
      const pathObj = {
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
    sendQuote() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.truck_type !== ''
        && this.load_weight !== ''
        && this.goods !== ''
        && this.pick_up_time !== ''
        && this.quotation_time !== ''
      ) {
        this.sendQuoteFinal();
      } else {
        this.doNotification(2, 'Find transporters error !', 'Kindly provide all values');
      }
    },
    sendQuoteFinal() {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }
      const filteredOwner = [];
      filteredOwner.push(parseInt(this.$route.params.id, 10));

      const payload = {
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        cop_user_id: 'cop_id' in acc ? acc.user_id : 0,
        peer_id: 'cop_id' in acc ? null : acc.user_id,
        owners: filteredOwner,
        cargo_type: parseInt(this.goods, 10),
        load_weight: parseInt(this.load_weight, 10),
        carrier_type: parseInt(this.truck_type, 10),
        pick_up: this.order_path[0],
        destination: this.order_path[1],
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
          /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */

          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, 'Quotations sent successfully!', '');
          } else {
            this.doNotification(2, 'Unable to request for quotation!', workingResponse.message);
          }
          this.backToTransporters();
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
            this.backToTransporters();
          }
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

<style lang="css">
@import '../../../assets/styles/transporters_component.css?v=1';

.back-freight-btn{
  font-size: 14px;
  font-weight: 200;
  color: #000;
  cursor: pointer;
}
.transporter-summary-data{
  width: 89%;
  background: #F1F1F1;
}
.align-contacts-data{
  margin-top: 6%;
}
.quote-btn{
  width: 72%;
  margin-bottom: 6%;
}
.financing-btn{
  width: 72%;
  background-color: #EA7125 !important;
  border-color: #EA7125 !important;
}
.transporters-quote-section{
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  margin-right: 2%;
  padding: 2rem;
  width: 2%;
}
.check-tranporters{
  color: #1B7FC3;
}
.transporter-doucuments-title{
  color: #1B7FC3;
}
.truck-title-info{
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  display: flex;
  align-items: center;
  color: #000000;
  margin-top: 2%;
  text-transform: capitalize;
}
.transporter-vehicle-info{
  font-size: 12px;
  font-weight: 200;
  color: #000;
  margin-top: 2%;
}
.vehicles-split{
  border-bottom: 1px solid #BBB9B9;
  width: 90%;
  margin-top: 3%;
}
.transporter-name-inner{
  margin-top: 4%;
  font-size: 15px;
}
.reviews-section{
  margin-bottom: 2%;
}
.reviews-outer{
  width: 85%;
}
.quote-find-section{
  -webkit-box-flex: 1;
flex: 1;
-webkit-box-orient: vertical;
flex-direction: column;
display: flex;
-webkit-box-direction: normal;
margin-right: 2%;
padding: 1rem;
}
.quote-text-option{
  margin-bottom: 0%;
  margin-left: 3%;
  color: #000000;
  font-size: 20px;
}
.bids-time{
  width: 100% !important;
}
.no-reviews-outer{
  width: 73%;
  text-align: center;
}
.transporter-detail-rating{
  border: 1px solid #d8dfe6;
  padding: 4rem;
  border-radius: 4px;
  margin-bottom: 3%;
}
.transporter-vehicle-rating{
  font-size: 17px;
  font-weight: 200;
  color: #000;
  margin-top: 2%;
}
</style>
