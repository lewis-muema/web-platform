<template lang="html">
  <div class="transporters-main">
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
                Umoja Transporters
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
                  20 completed orders
                </div>
              </div>

              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info truck-add-rating-align">
                  <img
                    src="https://images.sendyit.com/web_platform/freight/vehicle.svg"
                    alt=""
                    class="transporters-img highlight-icon"
                  >
                  28 Truck
                </div>
              </div>
              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info truck-add-rating-align">
                  <img
                    src="https://images.sendyit.com/web_platform/freight/rating.svg"
                    alt=""
                    class="transporters-img highlight-icon"
                  >
                  5 (13 Reviews)
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
                  +2547027474455
                </div>
              </div>
              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info truck-add-rating-align">
                  <img
                    src="https://images.sendyit.com/web_platform/freight/email.svg"
                    alt=""
                    class="transporters-img highlight-icon"
                  >
                  Jamesdoe@gmail.com
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <div class="transporter-doucuments-title align-contacts-data">
              Documents
            </div>
            <div class="transporters-filters transporters-highlight">
              <div class="truck-add-info">
                <i class="el-icon-circle-check check-tranporters" />
                Certificate of incorporation
              </div>
            </div>
            <div class="transporters-filters transporters-highlight">
              <div class="truck-add-info">
                <i class="el-icon-circle-check check-tranporters" />
                KRA PIN
              </div>
            </div>
            <div class="transporters-filters transporters-highlight">
              <div class="truck-add-info">
                <i class="el-icon-circle-check check-tranporters" />
                Company CR12
              </div>
            </div>
          </div>

          <div class="">
            <div class="transporter-doucuments-title align-contacts-data">
              Vehicles
            </div>
            <div class="">
              <div class="truck-title-info">
                28 Truck
              </div>
              <div class="transporter-vehicle-info">
                KCA 347V
              </div>
              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info">
                  <i class="el-icon-circle-check check-tranporters" />
                  log book
                </div>
              </div>
              <div class="vehicles-split" />
            </div>
          </div>

          <div class="">
            <div class="transporter-doucuments-title align-contacts-data reviews-section">
              Reviews
            </div>
            <div class="transporter-detail reviews-outer">
              <div class="">
                Mombasa port to Bidco warehouse
              </div>
              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info">
                  <el-rate
                    v-model="rating"
                    disabled
                    show-score
                    disabled-void-color="#C0C4CC"
                    :colors="['#1782C5', '#1782C5', '#1782C5']"
                    score-template="{value}"
                  />
                </div>
              </div>

              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info">
                  The delivery was seamless.
                </div>
              </div>

              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info transporter-name-inner">
                  Bidco
                </div>
              </div>
              <div class="transporters-filters transporters-highlight">
                <div class="truck-add-info">
                  11/10/2020
                </div>
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
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Transporters',
  data() {
    return {
      quote_text: 'Request for quote',
      financing_text: 'Create order',
      rating: 5.0,
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    backToTransporters() {
      this.$router.push('/freight/transporters');
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
</style>
