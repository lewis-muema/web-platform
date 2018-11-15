<template lang="html">
  <div class="" id="order_details_container">
      <div class="order-details-wrapper">
          <div class="order_details_map">
              <Img :src="createStaticMapUrl(order_details.full_order_details.values.from, order_details.full_order_details.values.to)"/>
          </div>
          <div class="order_details_desc">
              <div class="order_details_price">
                    KES {{order_details.order_cost}}
              </div>

              <div class="order_details_desc_item">
                    Kilometers : {{order_details.full_order_details.values.distance_read}} KMs
              </div>
              <div class="order_details_desc_item">
                    Duration : {{order_details.full_order_details.values.duration_read}}
              </div>
              <div class="order_details_desc_item">
                    Date :{{order_details.order_date | moment }}
              </div>
              <div class="order_details_desc_item">
                    <img src="../../../assets/img/maroon_button.png" class="order_details_desc_image">
                    {{order_details.full_order_details.values.from_name}}
              </div>
              <div class="order_details_desc_item">
                    <img src="../../../assets/img/blue_button.png" class="order_details_desc_image">
                    {{order_details.full_order_details.values.to_name }}
              </div>

          </div>
      </div>
      <div class="rider_details_wrap">
          <div class="rider_details_image">
              <img :src="order_details.rider_details.photo_base+'photo/'+order_details.rider_details.photo"/>
          </div>
          <div class="rider_details_items">
              <div class="rider_details_item">
                  Rider name : {{order_details.rider_details.name }}
              </div>
              <div class="rider_details_item">
                  Number plate : {{order_details.rider_details.number_plate }}
              </div>
              <div class="rider_details_item">
                  <font-awesome-icon icon="star" class="rating_checked" v-for="index in order_details.rider_details.rating" :key="index"/>
                  <font-awesome-icon icon="star" class="" v-for="index in (5-order_details.rider_details.rating)" :key="index"/>
              </div>

              <div class="rider_details_actions">
                <div class="rider_details_actions_completed" v-if="order_details.pending_delivery.delivery_status !== 3">
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="trackOrder">TRACK</button>
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
                    </div>
                </div>
                <div class="rider_details_actions_ongoing" v-else>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn" type="button" @click="activateRating">RATE</button>
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
                    </div>
                </div>
                <div class="rider_details_rating" v-if="show_rating">
                    <div class="block">
                        <el-rate
                            v-model="orderRating"
                            :colors="['#99A9BF', '#f57f20', '#1b7fc3']">
                        </el-rate>
                        <el-button class="rider_details_rate_btn" @click="rateOrder"> RATE </el-button>
                    </div>
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
        createStaticMapUrl(from_cordinates, to_cordinates) {
            let google_key = "AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc";

            return "https://maps.googleapis.com/maps/api/staticmap?path=color:100x1782C5|weight:5|"+from_cordinates+"|"+to_cordinates+"&size=257x257&markers=color:red%7Clabel:P%7C"+from_cordinates+"&markers=color:blue%7Clabel:D%7C "+to_cordinates+ "&key="+google_key;
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
            return this.getOrderDetails.find( order => order.order_no ===  this.$route.params.id);
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
        border-right: 1px solid #b7b8ba;
        padding-right: 20px;
    }
</style>
