<template lang="html">
  <div class="" id="order_details_container">
      <div class="order_details_wrap">
          <div class="order_details_map">
              <Img src="https://maps.googleapis.com/maps/api/staticmap?path=color:100x1782C5|weight:5|-1.3001097,36.772822099999985|-1.300035,36.772876&size=257x257&markers=color:red%7Clabel:P%7C-1.3001097,36.772822099999985&markers=color:blue%7Clabel:D%7C-1.300035,36.772876&key=AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc"/>
          </div>
          <div class="order_details_desc">
              <div class="order_details_price">
                    KES 250
              </div>
              <div class="order_details_desc_item">
                    Kilometers : 1kms
              </div>
              <div class="order_details_desc_item">
                    Duration :
              </div>
              <div class="order_details_desc_item">
                    Date :
              </div>
              <div class="order_details_desc_item">
                    <img src="https://apptest.sendyit.com/biz/style3/comp/maroon_button.png" class="order_details_desc_image">
              </div>
              <div class="order_details_desc_item">
                    <img src="https://apptest.sendyit.com/biz/style3/comp/blue_button.png" class="order_details_desc_image">
              </div>

          </div>
      </div>
      <div class="rider_details_wrap">
          <div class="rider_details_image">
              <img src="https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1532011239303img_20180719_163637_174.jpg">
          </div>
          <div class="rider_details_items">
              <div class="rider_details_item">
                  Rider name : Phil Samoei
              </div>
              <div class="rider_details_item">
                  Number plate : {{order_details.order_no}}
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
        }
    },
    methods:{

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
        width: 20px;
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
</style>
