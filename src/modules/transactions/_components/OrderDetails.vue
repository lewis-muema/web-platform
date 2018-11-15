<template lang="html">
  <div class="" id="order_details_container">
      <div class="order_details_wrap">
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
                    Date :{{order_details.order_date}}
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
              <div class="rider_details_item rating" v-html="renderRiderRating(order_details.rider_details.rating)">
              </div>
          </div>

          <div class="rider_details_actions">
              <div class="rider_details_actions_completed" v-if="order_details.pending_delivery.delivery_status !== 3">
                <div class="rider_details_action">
                        <el-button class="rider_details_action_btn" type="primary">TRACK</el-button>
                </div>
                <!-- <div class="rider_details_action">
                        <el-button class="rider_details_action_btn">FAVORITE</el-button>
                </div>
                <div class="rider_details_action">
                        <el-button class="rider_details_action_btn">SCHEDULE</el-button>
                </div> -->
                <div class="rider_details_action">
                    <el-dropdown>
                    <el-button type="primary">
                        <i class="el-icon-more el-icon--center"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>Print Receipt</el-dropdown-item>
                        <el-dropdown-item>Delivery Docs</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                </div>
              </div>
              <div class="rider_details_actions_ongoing" v-else>
                <div class="rider_details_action">
                        <el-button class="rider_details_action_btn" type="primary" @click="activateRating">RATE</el-button>
                </div>
                <!-- <div class="rider_details_action">
                        <el-button class="rider_details_action_btn">FAVORITE</el-button>
                </div>
                <div class="rider_details_action">
                        <el-button class="rider_details_action_btn">SCHEDULE</el-button>
                </div> -->
                <div class="rider_details_action">
                    <el-dropdown>
                    <el-button type="primary">
                        <i class="el-icon-more el-icon--center"></i>
                    </el-button>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name:'order-details',
    data() {
        return {
          order_id:'',
          show_rating:false,
        }
    },
    methods:{
        createStaticMapUrl(from_cordinates, to_cordinates) {
            let google_key = "AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc";

            return "https://maps.googleapis.com/maps/api/staticmap?path=color:100x1782C5|weight:5|"+from_cordinates+"|"+to_cordinates+"&size=257x257&markers=color:red%7Clabel:P%7C"+from_cordinates+"&markers=color:blue%7Clabel:D%7C "+to_cordinates+ "&key="+google_key;
        },
        renderRiderRating(rating) {
            let rating_template ='';
            for(let i =0 ; i < 5; i++){
                if(i < rating){
                    rating_template += '<span class="fa fa-star rating_checked"></span>';
                } else {
                    rating_template += '<span class="fa fa-star"></span>'
                }
            }
            return rating_template;
        },
        activateRating() {
            this.show_rating = true;
        },
        rateOrder() {
            this.show_rating = false;
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
    .order_details_wrap {
        width: 50%;
        border-right: 1px solid #ccc;
        min-height: 257px;
        float: left;
        display: inline-block;
    }
    .order_details_map {
        width: 50%;
        display: inline-block;
        float: left;
    }
    .order_details_desc {
        display: inline-block;
        width: 50%;
        padding-left: 20px;
        font-size: 15px;
    }
    .order_details_desc_item {
        margin-top: 10px;
    }
    .order_details_desc_image {
        width: 13px;
        height: auto;
        margin-top: 10px;
    }
    .order_details_price {
        margin-top: 10px;
        font-weight: 500;
        font-size: 25px;
        margin-bottom:10px;
    }

    .rider_details_wrap {
        width: 50%;
        float: right;
        display: inline-block;
        padding-left: 20px;
    }
    .rider_details_image {
        display: inline-block;
        width: 30%;
        float: left;
    }
    .rider_details_image img {
        width: 100%;
        height: auto;
    }
    .rider_details_items {
        width: 70%;
        display: inline-block;
        float: right;
        font-size: 15px;
        padding-left: 10px;
    }
    .rider_details_item {
        margin-top: 10px;
    }
    .rider_details_item .rating{
       font-size:20px;
    }
    
    .rating_checked {
        color: #1782c5;
    }
    .rider_details_actions {
        width: 100%;
        display: block;
        float: left;
        margin-left: 30%;
        margin-top: 10px;
    }
    .rider_details_action {
        display: inline-block
    }
    .rider_details_rating {
        margin-top: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        padding-left: 20px;
        background: #f4f4f4;
    }
    .rider_details_rating .el-rate {
        display: inline-block;
    }
    .el-rate__icon {
        font-size: 30px;
    }
    
</style>
