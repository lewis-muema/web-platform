<template lang="html">
  <div class="" id="order_details_container" v-if="order_details">
      <div class="order-details-wrapper">
          <div class="order_details_map">
              <Img :src="createStaticMapUrl(order_details.path)"/>
          </div>
          <div class="order_details_desc">
              <div class="order_details_price">
                    KES {{order_details.order_cost}}
              </div>

              <div class="order_details_desc_item">
                    Distance : {{order_details.order_details.distance}} KMs
              </div>
              <!-- TODO: add this in later with the duration the order took -->
              <!-- <div class="order_details_desc_item">
                    Duration : {{order_details.order_details.duration}}
              </div>-->

              <div class="order_details_desc_item">
                    Date :{{order_details.order_date | moment }}
              </div>
              <div class="order_details_desc_item">
                    <img src="../../../assets/img/maroon_button.png" class="order_details_desc_image">
                    {{getOrderToName(order_details.path)}}
              </div>
              <div class="order_details_desc_item">
                    <img src="../../../assets/img/blue_button.png" class="order_details_desc_image">
                    {{getOrderFromName(order_details.path)}}
              </div>

          </div>
      </div>
      <div class="rider_details_wrap">
          <div class="rider_details_image">
              <img :src="order_details.rider.rider_photo"/>
          </div>
          <div class="rider_details_items">
              <div class="rider_details_item">
                  {{order_details.rider.rider_name }}
              </div>
              <div class="rider_details_item">
                  {{order_details.rider.number_plate }}
              </div>
              <div class="rider_details_item">
                  <font-awesome-icon icon="star" class="rating_checked" v-for="index in order_details.rider.rider_rating+1" :key="index"/>
                  <font-awesome-icon icon="star" class="rating_unchecked" v-for="index in (5-order_details.rider.rider_rating)" :key="index"/>
              </div>

              <div class="rider_details_actions">
                <div class="rider_details_actions_completed" v-if="order_details.order_details.delivery_status !== 3">
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="trackOrder">Track</button>
                    </div>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="printReceipt">Print Receipt</button>
                    </div>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="deliveryDocs">Delivery Docs</button>
                    </div>
                    
                    <!-- <div class="rider_details_action">
                        <el-dropdown>
                        <button type="button" class="button-primary">
                            <i class="el-icon-more el-icon--center"></i>
                        </button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>Print Receipt</el-dropdown-item>
                            <el-dropdown-item>Delivery Docs</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                    </div> -->
                </div>
                <div class="rider_details_actions_ongoing" v-else>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="printReceipt">Print Receipt</button>
                    </div>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="deliveryDocs">Delivery Docs</button>
                    </div>

                    <div class="rider_details_action">
                        <el-popover
                        placement="bottom"
                        trigger="click">
                       <div class="rider_details_rating">
                            <el-rate
                                v-model="orderRating"
                                :colors="['#99A9BF', '#f57f20', '#1b7fc3']">
                            </el-rate>
                            <button class="button-primary--naked rate--action-btn" @click="rateOrder"> RATE </button>
                        </div>
                        <button class="button-primary rider_details_action_btn" type="button" slot="reference">RATE</button>

                        </el-popover>

                    </div>
                    <div class="rider_details_action">
                        <el-dropdown>
                        <button type="button" class="button-primary">
                            <i class="el-icon-more el-icon--center"></i>
                        </button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>Print Receipt</el-dropdown-item>
                            <el-dropdown-item>Delivery Docs</el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                    </div> -->
                </div>
            </div>

          </div>


        </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
const moment = require('moment');
export default {
    name:'order-details',
    data() {
        return {
          order_id:'',
          show_rating:false,
        }
    },
    filters: {
        moment: function (date) {
            return moment(date).format('MMM Do YYYY, h:mm a');
        }
    },
    methods:{
        moment: function () {
          return moment();
        },
        createStaticMapUrl(path) {
            //TODO:get google_key from configs
            let google_key = "AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc";
            let from_cordinates = path[0]['coordinates'];
            let to_cordinates = path[path.length-1]['coordinates'];
            return "https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|"+from_cordinates+"|"+to_cordinates+"&size=257x257&markers=color:0xF17F3A%7Clabel:P%7C"+from_cordinates+"&markers=color:0x2c82c5%7Clabel:D%7C "+to_cordinates+ "&key="+google_key;
        },
        getOrderFromName(path) {
          return path[0].name;
        },
        getOrderToName(path) {
          let path_length = path.length;
          return path[path_length-1].name;
        },

        activateRating() {
            this.show_rating = true;
        },
        rateOrder() {
            this.show_rating = false;
        },
        trackOrder() {

        }


    },
    computed:{
        ...mapGetters({
          getOrderDetails:'$_transactions/getOrderHistoryOrders',
        }),
        order_details (){
            return this.getOrderDetails.find( order => order.order_id ===  this.$route.params.id);
        }
    },
    mounted(){

    },
    created(){
        this.order_id  = this.$route.params.id;
    }
}
</script>

<style lang="css">
    @import '../../../assets/styles/order_details.css';
    .order-details-wrapper{
        width: 50%;
        display: inline-block;
        border-right: 1px solid #f0f0f0;
        padding-right: 20px;
    }
    .rating-star {
        background:transparent !important;
        color:inherit;
    }
    .rate--action-btn {
        display: inline-block;
        margin-left: 30px;
    }
</style>
