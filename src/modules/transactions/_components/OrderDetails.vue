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
              <!-- <div class="order_details_desc_item">
                     Extra Distance Bill : KES 240
              </div>
              <div class="order_details_desc_item">
                    Waiting Time Charges : KES 100
              </div> -->

              <div class="order_details_desc_item">
                    Distance : {{order_details.order_details.distance}} KMs
              </div>
              <!-- TODO: add this in later with the duration the order took -->
              <!-- <div class="order_details_desc_item">
                    Duration : {{order_details.order_details.duration}}
              </div>-->
              <div class="order_details_desc_item--wrapper">
                <div class="order_details_desc_item">
                      Date : {{order_details.order_date | moment }}
                </div>
                <span v-for="j in order_details.logs">
                  <div class="order_details_desc_item" v-if="j.log_type == 3">
                        Picked : {{j.log_time | moment }}
                  </div>
                  <div class="order_details_desc_item" v-if="j.log_type == 4">
                        Delivered : {{j.log_time | moment }}
                  </div>
                </span>

              </div>

              <div class="order_details_desc_item">
                    <img src="../../../assets/img/maroon_button.png" class="order_details_desc_image">
                    {{getOrderFromName(order_details.path)}}
              </div>
              <template v-for="(locations,index) in order_details.path" v-if="index >= 1">
                <div class="order_details_desc_item order_details_desc_item--no-space">
                      <img src="../../../assets/img/blue_button.png" class="order_details_desc_image">
                      <span>{{order_details.path[index].name}}</span>
                      <div class="recepient-padded" v-if="order_details.rider_deliver_img != null">
                        Recieved by {{order_details.rider_deliver_img[index - 1].name}}
                      </div>
                </div>
              </template>
              <div class="order_details_desc_item--wrapper">
                 <div class="order_details_desc_item" v-if="order_details.extra_distance_amount > 0">
                      Extra Distance Bill : {{order_details.extra_distance_amount}}
                </div>
                 <div class="order_details_desc_item" v-if="order_details.waiting_time_amount > 0">
                      Waiting Time Charges : {{order_details.waiting_time_amount}}
                </div>
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
                        <button class="button-primary rider_details_action_btn" type="button" @click="trackOrder(order_details.order_no)">Track</button>
                    </div>
                </div>
                <div class="rider_details_actions_ongoing" v-else>
                    <div class="rider_details_action">
                        <button class="button-primary rider_details_action_btn rider_details--view-delivery-docs-btn" type="button" @click="dialogVisible = true">View Delivery Docs</button>
                    </div>
                    <el-dialog class="delivery_image_dialog"
                      :visible.sync="dialogVisible"
                      >
                      <span slot="title">Delivery Documents for {{order_details.order_no}} </span><br>
                      <template v-for="(locations,index) in order_details.path" v-if="index >= 1">
                        <div class="delivery_documents_info">
                          <div class="delivery_image_details">Delivery at {{order_details.path[index].name}}</div>

                          <div>
                              <img class="delivery-image-content" :src="deliveryImagePath(order_details.rider_deliver_img[index - 1].img)"/>
                          </div>
                          <div  v-if="order_details.rider_deliver_img != null" class="delivery_image_details" >
                                Delivery signature by : {{order_details.rider_deliver_img[index - 1].name}}
                          </div>
                        </div>
                      </template>
                      <div class="rider_details_action">
                          <button class="button-primary dispute-delivery-button" type="button" @click="disputeDocsOption">Dispute Delivery Docs</button>
                      </div>
                    </el-dialog>
                    <el-dialog  class="dispute_delivery_dialog" @close="closeDialog()"
                      :visible.sync="dialogFormVisible"
                      >
                      <span slot="title">Dispute Delivery Documents - Order {{order_details.order_no}} </span><br>
                      <div class="dispute_documents_body">
                        <div>

                         <select class="dispute_type_select" v-model="disputeType" >
                         <option value="" disabled selected> Dispute Type </option>

                           <option value="1" >  Waiting time  </option>
                           <option value="2" >  Extra distance  </option>

                         </select>

                       </div>
                       <div>
                         <select class="dispute_type_select" v-model="disputeReason" >
                         <option value="" disabled selected> Dispute Reason</option>

                           <option value="1">  I was overcharged for this order </option>
                           <option value="2">  My driver took too long  </option>
                           <option value="3">  My driver went to a wrong location  </option>
                           <option value="4">  I had a different issue   </option>

                         </select>
                     </div>
                       <textarea placeholder="Description" class="form-control dispute_description" v-model="disputeDescription">
                       </textarea>
                       <div class="rider_details_action">
                           <button class="button-primary dispute-delivery-submit" type="button" @click="disputeDeliveryDocs">Submit</button>
                       </div>
                      </div>
                    </el-dialog>
                </div>
              </div>

          </div>
        </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
const moment = require("moment");
export default {
  name: "order-details",
  data() {
    return {
      order_id: "",
      show_rating: false,
      dialogVisible : false,
      dialogFormVisible : false,
      disputeType : '',
      disputeReason : '',
      disputeDescription : '',
    };
  },
  filters: {
    moment: function(date) {
      return moment(date).format("MMM Do YYYY, h:mm a");
    }
  },
  methods: {
    moment: function() {
      return moment();
    },
    ...mapActions({
      requestDisputeDeliveryDocs: '$_transactions/requestDisputeDeliveryDocs',
    }),
    createStaticMapUrl(path) {
      //TODO:get google_key from configs
      let google_key = "AIzaSyDJ_S9JgQJSaHa88SXcPbh9JijQOl8RXpc";
      let from_cordinates = path[0]["coordinates"];
      let to_cordinates = path[path.length - 1]["coordinates"];
      return (
        "https://maps.googleapis.com/maps/api/staticmap?path=color:0x2c82c5|weight:5|" +
        from_cordinates +
        "|" +
        to_cordinates +
        "&size=257x257&markers=color:0xF17F3A%7Clabel:P%7C" +
        from_cordinates +
        "&markers=color:0x2c82c5%7Clabel:D%7C " +
        to_cordinates +
        "&key=" +
        google_key
      );
    },
    getOrderFromName(path) {
      return path[0].name;
    },
    getOrderToName(path) {
      let path_length = path.length;
      return path[path_length - 1].name;
    },

    activateRating() {
      this.show_rating = true;
    },
    rateOrder() {
      this.show_rating = false;
    },
    trackOrder(order_no) {
      console.log(order_no);
      this.$router.push({ name: "tracking", params: { order_no: order_no } });
    },
    getDeliveryDocsSrc(order){
      let env = '';
      try{
          env = process.env.CONFIGS_ENV.ENVIRONMENT;
      }
      catch(er){
      }
      if (env != 'production'){
           return "https://apptest.sendyit.com/biz/sendyconnect/verify/"+order;
      }
      return "https://oldapp.sendyit.com/biz/sendyconnect/verify/"+order;
    },
    printReceipt() {},
    deliveryDocs() {},
    closeDialog() {
      this.disputeType = '';
      this.disputeReason = '';
      this.disputeDescription = '';
      this.dialogFormVisible = false ;
      },
    deliveryImagePath(path){
        return `https://s3-eu-west-1.amazonaws.com/sendy-delivery-signatures/${path}` ;
      },
    disputeDocsOption(){
      if(this.order_details.extra_distance_amount = 0){
         this.dialogFormVisible = true;
      }
      else{
        this.doNotification(
           2,
          'Dispute delivery docs',
          'Sorry there were no extra charges for this order',
        );
      }
    },
    disputeDeliveryDocs(){
      if(this.disputeType !== '' && this.disputeReason !== '' && this.disputeDescription !== ''){
        let session = this.$store.getters.getSession;
        let values = {
            'dispute_type': this.disputeType,
            'dispute_reason_id': this.disputeReason,
            'dispute_description': this.disputeDescription,
            'order_no': this.order_details.order_no ,
            'name': session[session.default]['user_name'],
            'email': session[session.default]['user_email'],
            'phone': session[session.default]['user_phone'],
        };
        let full_payload = {
            'values': values,
            'app': 'PRIVATE_API',
            'endpoint': 'dispute_order'
        };
        this.requestDisputeDeliveryDocs(full_payload).then(
          response => {
            if(response.status){
              this.doNotification(
                 2,
                 'Delivery dispute',
                 'Delivery dispute successful !',
              );
              this.closeDialog();
            }
            else{
              this.doNotification(
                 2,
                'Delivery dispute',
                 response.message,
              );
            }
          },
          error => {
            console.log(error);
          }
        );

      }
      else{
        this.message = 'Please provide all details';
        this.doNotification(
          2,
         'Delivery dispute failed',
         'Provide all details',
        );
      }
  },
  doNotification(level, title, message) {
    let notification = {
      title: title,
      level: level,
      message: message,
    };
    this.$store.commit('setNotification', notification);
    this.$store.commit('setNotificationStatus', true);
  },
},
  computed: {
    ...mapGetters({
      getOrderDetails: '$_transactions/getOrderHistoryOrders',
    }),
    order_details() {
      return this.getOrderDetails.find(
        order => order.order_id === this.$route.params.id
      );
    }
  },
  mounted() {},
  created() {
    this.order_id = this.$route.params.id;
  }
};
</script>

<style lang="css">
@import "../../../assets/styles/order_details.css";
.order-details-wrapper {
  width: 50%;
  display: inline-block;
  border-right: 1px solid #f0f0f0;
  padding-right: 20px;
}
.rating-star {
  background: transparent !important;
  color: inherit;
}
.rate--action-btn {
  display: inline-block;
  margin-left: 30px;
}
.delivery_documents_info{
  width: 50%;
  height: 310px;
  margin: 3%;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.delivery-image-content{
  width: 60%;
}
.delivery_image_details{
  margin-top: 7%;
  margin-left: 7%;
}
.dispute-delivery-button{
  margin-top: 20px;
  margin-left: 15%;
  width: 100% !important;
}
.dispute_type_select{
  width: 100% !important;
  margin-bottom: 10px;
  height: 35px;
}
.dispute_description{
  padding: 12px;
  margin-right: -6px;
  width: 100% !important;
  height: 100px;
}
.dispute-delivery-submit{
  margin-top: 20px;
  width: 320px;
}
.delivery_image_dialog{
  width: 100%;
  height: 100%;
}
.dispute_delivery_dialog{
  width: 83%;
  height :100%;
  margin-left: 10%;
}
.dispute_documents_body{
  width: 60%;
  margin-left:19%;
}
</style>
