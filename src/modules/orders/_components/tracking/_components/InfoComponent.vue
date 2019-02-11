<template lang="html">
  <div>
   <div class="truck-info-component" v-if="this.truckMoreInfo">
  <transition
    name="fade"
    mode="out-in"
  >
    <div v-if="loading == false" class="infobar--truck--outer">
       <div class="infobar-content infobar--content-padded" key="prime">

         <el-row :gutter="20" class="infobar-content infobar--truck-item  infobar--item-truck-bordered infobar-truck-pstn">
           <el-col :span="6">
             <div class="">
               <i class="el-icon-success top-bar-info"></i>
                ORDER : {{ tracking_data.order_no }}
             </div>
           </el-col>
           <el-col :span="6">
             <div class="">
               <img src="https://images.sendyit.com/web_platform/tracking/status.svg" alt="" class="top-bar-img">
               <span>
                 STATUS : {{ getStatus }}
               </span>
             </div>
           </el-col>
           <el-col :span="6">
             <div class="">
               <div class="topbar-text">
                 <font-awesome-icon icon="wallet" class="top-bar-info" />
                 <span v-if="this.getStatus == 'Pending'">
                   COST : KES {{ tracking_data.price_tier.cost - tracking_data.price_tier.price_variance}} - {{ tracking_data.price_tier.cost + tracking_data.price_tier.price_variance}}
                 </span>
                 <span v-else>
                   COST : KES {{ tracking_data.price_tier.cost}}

                 </span>
               </div>
             </div>
           </el-col>
           <el-col :span="5">
             <div class="">
               <div class="topbar-text">
                   ORDER TIMELINE
               </div>
             </div>
           </el-col>
           <el-col :span="1">
             <div v-if="this.truckMoreInfo"
               class="infobar--actions-hover"
               @click="minimiseInfoDetails()"
             >
               <div class="infobar--actions-icon">
                 <i class="el-icon-remove-outline" />
               </div>
             </div>
           </el-col>
         </el-row>
            <el-row :gutter="20" class="infobar-content infobar--truck-cont-item" style="padding-bottom: 5px;">
            <el-col :span="5">
              <div class="infobar--item-truck-cont-bordered inforbar--item-scrollable">
                <ul class="timeline" style="">
                  <li>
                    <p>PICKUP LOCATION</p>
                    <p>{{tracking_data.path[0].name}}</p>
                  </li>
                     <div class="" style="padding-left: 30px;">
                       <p>PICKUP DATE</p>
                       <p>{{ tracking_data.date_time | moment }}</p>
                     </div>
                  <li>
                    <p>DESTINATION</p>
                    <p v-for="(val, index) in tracking_data.path" v-if="index > 0" > {{val.name}}</p>
                  </li>
                </ul>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="infobar--item-truck-cont-bordered" style="padding-left: 30px;">
                <div class="" style="padding-bottom: 10px;">
                  <div class="" style="">
                    <img src="https://images.sendyit.com/web_platform/vendor_type/side/20.svg" alt="" class="infobar-truck-img">
                    <span>
                      TRUCK
                    </span>
                  </div>
                  <div class="" style="padding-left:35px;">
                       {{tracking_data.price_tier.vendor_name}}
                  </div>
                </div>
                <div class="" style="padding-bottom: 10px;">
                  <div class="">
                    <img src="https://images.sendyit.com/web_platform/tracking/goods.svg" alt="" class="infobar-truck-img">
                    <span>
                      GOODS TO BE DELIVERED
                    </span>
                  </div>
                  <div class="" style="padding-left:35px;" v-if="('load_weight' in tracking_data.package_details )">
                        {{tracking_data.package_details.delivery_item}}
                  </div>
                  <div style="padding-left:35px;" v-else>
                        Not Indicated
                  </div>
                </div>
                <div class="" style="padding-bottom: 10px;">
                  <div class="">
                    <img src="https://images.sendyit.com/web_platform/tracking/load_weight.svg" alt="" class="infobar-truck-img">
                    <span>
                      LOAD WEIGHT
                    </span>
                  </div>
                  <div class="" style="padding-left:35px;" v-if="('load_weight' in tracking_data.package_details )">
                      {{tracking_data.package_details.load_weight}} {{tracking_data.package_details.load_units}}
                  </div>
                  <div v-else style="padding-left:35px;">
                       Not Indicated
                  </div>
                </div>
                <div class="" style="padding-bottom: 10px;">
                  <div class="">
                    <img src="https://images.sendyit.com/web_platform/tracking/loader.svg" alt="" class="infobar-truck-img">
                    <span>
                      DO YOU NEED A LOADER
                    </span>
                  </div>
                  <div class="" style="padding-left:35px;" v-if="tracking_data.package_details.additional_loader == true">
                        Yes, {{tracking_data.package_details.no_of_loaders}}
                  </div>
                  <div v-else class="" style="padding-left:35px;">
                          No
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="infobar--item-truck-cont-bordered" style="padding-bottom: 10px;padding-left: 30px;" >
                <div class="">
                      NOTES
                </div>
                <div v-if="tracking_data.order_notes.length > 0 " class="" style="max-width: 80%!important;">
                  <div v-for="(val, index) in tracking_data.order_notes" v-if="index >= 0" >
                    <div v-for="(val,index) in tracking_data.order_notes[0].msg" v-if="index >= 0">
                            {{val}}
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="">
                <div class="inforbar--item-scrollable">
                  <ul class="timeline" style="">
                   <li>
                     <div class="">
                       <p>ORDER PLACED</p>
                       <p>Your order has been received and we shall notify you on the actual cost shortly</p>
                        <p>{{ tracking_data.date_time | moment }}</p>
                     </div>
                   </li>
                   <li>
                     <div class="" v-if="this.getStatus != 'Pending'">
                       <p>PRICE CONFIRMATION</p>
                       <div class="">
                         <div class="" v-if="this.accType == 1">
                           <p>Price has been confirmed to be Ksh {{tracking_data.amount}}</p>
                         </div>
                         <div class="" v-else>
                           <div v-if= "this.myRb <= 0">
                              <p>Price has been confirmed to be Ksh {{tracking_data.amount}}</p>
                           </div>
                           <div v-else>
                             <p>Price has been confirmed to be Ksh {{tracking_data.amount}}.Choose payment option below</p>
                             <div class="">
                               <el-radio v-model="paymentOption" label="1">M-Pesa</el-radio>
                             </div>
                             <div class="">
                               <el-radio v-model="paymentOption" label="2">Card</el-radio>
                             </div>
                             <div class="" style="padding-left: 5px; padding-top: 10px;">
                               <input type="submit" class="button-primary"  @click="takeMeToPayment()" style="width:200px;"
                                      value="Make Payment"/>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                    </li>
                    <li v-for="(val, index) in tracking_data.delivery_log" v-if="index > 0" >
                      <div class="">
                        <p>{{val.description}}</p>
                        <p>{{ val.log_time | moment }}</p>
                      </div>
                    </li>
                 </ul>
              </div>
              </div>
            </el-col>

          </el-row>
          <div class="save-option" v-if="this.getStatus == 'Pending'">
            <el-row :gutter="20" class="infobar-content infobar--truck-item  infobar--item-truck-bordered-top" style="padding-bottom: 5px;padding-top: 10px;text-align:center;max-width:70%;margin-left: -35px;">
              <!-- <el-col :span="6">
                <div class="">
                  <img src="https://images.sendyit.com/web_platform/tracking/save.svg" alt="" class="infobar-truck-img">
                  <span> SAVE DETAILS </span>
                </div>
              </el-col> -->
              <el-col :span="6">
                <div class="" style="padding-top:4px;cursor:pointer;" @click="canceldialog()">
                  <i class="el-icon-circle-close top-bar-info"></i>
                     CANCEL ORDER
                </div>
              </el-col>
            </el-row>
          </div>

          <div class="rider-info" v-if="this.getStatus !== 'Pending'">
            <el-row :gutter="20" class="infobar-content infobar--truck-item  infobar--item-truck-bordered-top" style="padding-bottom: 5px;padding-top: 10px;text-align:center;max-width:70%">
              <el-col :span="8">
                <div class="">
                  <img
                    class="rimg"
                    :src="tracking_data.rider.rider_photo" style="height: 55px;vertical-align: middle;"
                  >
                  <span>{{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}</span>

                </div>
              </el-col>
              <el-col :span="6">
                <div class="">
                  <img
                    class="rimg"
                    :src="tracking_data.rider.rider_photo" style="height: 55px;vertical-align: middle;"
                  >
                  <span>{{ tracking_data.rider.vehicle_name }} - {{ tracking_data.rider.number_plate }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="" style="padding-top: 20px;">
                  <i class="el-icon-share top-bar-info" ></i>
                     SHARE
                </div>
              </el-col>
            </el-row>
          </div>
       </div>
       <el-dialog :visible.sync="cancelOption" class="cancelOptions">
         <div class="">
           <div class="" style="text-align:center;">
             Cancel this order?
           </div>
           <div class="" style="text-align:center;">
             You can place another one at any time.
           </div>
         </div>
         <div class="" style="padding-left: 30%;margin-bottom: 10px;margin-top: 10px;">
           <div class="">
               <el-radio v-model="cancel_reason" label="4">I placed the wrong locations</el-radio>
             </div>
             <div class="">
               <el-radio v-model="cancel_reason" label="5">My order is not ready</el-radio>
             </div>
             <div class="">
                 <el-radio v-model="cancel_reason" label="7">No driver has been allocated</el-radio>
               </div>
               <div class="">
                 <el-radio v-model="cancel_reason" label="8">I placed this order twice</el-radio>
               </div>
         </div>
         <div class="action--slide-desc">
           <button
             type="button"
             name="button"
             class="action--slide-button"
             @click="cancelOrder()"
           >
             Yes
           </button>
           <button
             type="button"
             name="button"
             class="action--slide-button"
             @click="cancelToggle()"
           >
             No
           </button>
         </div>
         </el-dialog>

    </div>
  </transition>
</div>

  <div>
    <transition
      name="fade"
      mode="out-in"
    >
    <div v-if="!(this.truckMoreInfo)">
    <div
      v-if="loading == false"
      class="infobar--outer"
    >
      <div class="infobar--content infobar--content-padded">
        <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
          <img
            class="rimg"
            :src="tracking_data.rider.rider_photo"
          >
        </div>
        <div class="infobar--content infobar--item infobar--driver infobar--item-bordered">
          <div
            v-if="tracking_data.confirm_status > 0"
            class="infobar--driver-details"
          >
            <div class="">
              {{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}
            </div>
            <div class="">
              {{ tracking_data.rider.vehicle_name }} - {{ tracking_data.rider.number_plate }}
            </div>
          </div>
          <div
            v-else
            class="infobar--driver-details"
          >
            <div class="">
              {{ tracking_data.description_head }}
            </div>
            <div class="">
              {{ tracking_data.marketing_message }}
            </div>
          </div>
        </div>
        <div class="infobar--content infobar--item infobar--order infobar--item-bordered">
          <div class="" v-if="this.getStatus == 'Pending'">
            <div v-if="([6,10,13,14,17,18,19,20].includes(tracking_data.rider.vendor_id))">
              KES {{ tracking_data.price_tier.cost - tracking_data.price_tier.price_variance}} - {{ tracking_data.price_tier.cost + tracking_data.price_tier.price_variance}}
            </div>
            <div v-else>
              KES {{ tracking_data.amount }}
            </div>
          </div>
          <div v-else>
              KES {{ tracking_data.amount }}
          </div>
          <div class="">
            <div class="">
              {{ tracking_data.order_no }}
            </div>
          </div>
        </div>

        <div class="infobar--content infobar--item infobar--status infobar--item-bordered">
          <div class="">
            {{ getStatus }}
          </div>
          <div class="">
            <span
              v-if="tracking_data.delivery_status < 2"
              class=""
            >
              A Rider will pick and deliver your order by <span class="">
                {{ moment(tracking_data.date_time).format("h:mm a") }}
              </span>
            </span>
            <span class="" v-else>
              Estimated Delivery: <span class=""> {{this.tracking_data.etd}} </span>
            </span>
          </div>
        </div>
        <div
          v-if="this.$route.name != 'tracking_external'"
          class="infobar--content infobar--item infobar--actions"
        >
          <transition
            name="fade"
            mode="out-in"
          >
            <div
              v-if="cancel_popup"
              class="infobar--action-slide"
            >
              <div class="">
                <div class="">
                  Cancel this order?
                </div>
                <div class="">
                  You can place another one at any time.
                </div>
              </div>
              <div class="">
                <el-radio-group
                  v-model="cancel_reason"
                  class=""
                  @input="cancelChange"
                >
                  <el-radio :label="4">
                    I placed the wrong locations
                  </el-radio>
                  <el-radio :label="5">
                    My order is not ready
                  </el-radio>
                  <el-radio :label="7">
                    No driver has been allocated
                  </el-radio>
                  <el-radio :label="8">
                    I placed this order twice
                  </el-radio>
                </el-radio-group>
              </div>
              <div class="action--slide-desc">
                <button
                  type="button"
                  name="button"
                  class="action--slide-button"
                  @click="cancelOrder()"
                >
                  Yes
                </button>
                <button
                  type="button"
                  name="button"
                  class="action--slide-button"
                  @click="cancelToggle()"
                >
                  No
                </button>
              </div>
              <div class="actions--caret" />
            </div>
          </transition>
          <div v-if="false">
            <div class="infobar--actions-icon">
              <i class="el-icon-sold-out" />
            </div>
            <div class="infobar--actions-text">
              Free delivery
            </div>
          </div>
          <div v-if="false">
            <div class="infobar--actions-icon">
              <i class="el-icon-share" />
            </div>
            <div class="infobar--actions-text">
              Share Status
            </div>
          </div>
          <div
            v-if="([6,10,13,14,17,18,19,20].includes(tracking_data.rider.vendor_id))"
            class="infobar--actions-hover"
            @click="maximiseInfoDetails()"
          >
            <div class="infobar--actions-icon">
              <i class="el-icon-circle-plus-outline" />
            </div>
            <div class="infobar--actions-text">
              Expand Info
            </div>
          </div>
          <div
            v-if=""
            class="infobar--actions-hover"
            @click="cancelToggle()"
          >
            <div class="infobar--actions-icon">
              <i class="el-icon-circle-close-outline" />
            </div>
            <div class="infobar--actions-text">
              Cancel Order
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </transition>
  </div>
</div>
</template>

<script>
import { mapGetters} from 'vuex';
const moment = require('moment');

export default {
  name: 'InfoWindow',
  filters: {
    moment(date) {
      return moment(date).format('MMM Do YYYY, h:mm a');
    },
  },
  data() {
    return {
      loading: true,
      order_number: '',
      cancel_popup: 0,
      cancel_reason: -1,
      cancel_desc: '',
      maximiseInfo: 0,
      cancelOption:false,
      paymentOption:'',
      truckMoreInfo:false,
      myRb:'',
      accType:'',
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/get_tracking_data',
      tracked_order: '$_orders/$_tracking/get_tracked_order',
    }),
    getStatus() {
      if (this.loading === false) {
        switch (this.tracking_data.delivery_status) {
          case 3:
          {
            return 'Delivered';
          }
          case 2:
          {
            return 'In Transit';
          }
          default:
          {
            switch (this.tracking_data.confirm_status) {
              case 1:
              {
                return 'Confirmed';
              }
              default:
              {
                return 'Pending';
              }
            }
          }
        }
      } else {
        return '';
      }
    },
  },
  watch: {
    '$route.params.order_no': function trackedOrder(from) {
      this.order_number = from;
      this.loading = true;
      this.$store.commit('$_orders/$_tracking/set_tracked_order', from);
      this.poll(from);
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/set_tracked_order', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.checkRunningBalance();
  },
  created() {
    this.order_number = this.$route.params.order_no;

  },
  methods: {
    moment() {
      return moment();
    },
    cancelChange(reason) {
      switch (reason) {
        case 4: {
          this.cancel_desc = 'I placed the wrong locations';
          break;
        }
        case 5: {
          this.cancel_desc = 'My order is not ready';
          break;
        }
        case 7: {
          this.cancel_desc = 'No driver has been allocated';
          break;
        }
        case 8: {
          this.cancel_desc = 'I placed this order twice';
          break;
        }
        default:
      }
    },
    poll(from) {
      const that = this;
      this.$store.dispatch('$_orders/$_tracking/get_tracking_data', { order_no: from })
        .then((response) => {
          if (response) {
            if (this.tracking_data.delivery_status === 3) {
              that.doNotification('1', 'Order delivered', 'Your order has been delivered.');
              if (that.$route.name !== 'tracking_external') {
                that.$router.push(`/orders/rating/${from}`);
              } else {
                that.$router.push(`/external/rating/${from}`);
              }
            } else if (this.tracking_data.main_status === 2) {
              that.doNotification('2', 'Order cancelled', 'Your order has been cancelled.');
              that.place();
            } else if (this.tracked_order === from) {
              setTimeout(() => {
                that.poll(from);
              }, 15000);
            }
          } else {
            that.place();
          }
          that.loading = false;
        });
    },
    cancelToggle() {
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
    },
    maximiseInfoDetails() {
      this.truckMoreInfo = true;
    },
    minimiseInfoDetails() {
      this.truckMoreInfo = false;
    },
    checkRunningBalance(){
     let session = this.$store.getters.getSession;
      let payload = {
        cop_id : session[session.default]['cop_id'],
        user_phone:session[session.default]['user_phone'],
      };
      this.$store.dispatch('$_orders/$_tracking/running_balance', payload)
        .then((response) => {
          if(response.status){
            this.myRb = response.running_balance;
            this.accType = response.payment_plan;
          }
        });
    },
    takeMeToPayment(){
      if(this.paymentOption === 1){
         this.$router.push('/payment/mpesa');
      }
      else if (this.paymentOption === 2){
         this.$router.push('/payment/card');
      }
      else{
          this.doNotification(
            '2',
            'Payment Failure',
            'Choose a Payment Option.',
          );
      }
    },
    canceldialog(){
      this.cancelOption = true ;
    },
    place() {
      if (this.$route.name !== 'tracking_external') {
        this.$router.push('/orders');
      } else {
        this.$router.push('/');
      }
    },
    doNotification(level, title, message) {
      this.$store.commit('setNotificationStatus', true);
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
    },
    cancelOrder() {
      const payload = {
        order_no: this.tracking_data.order_no,
        cancel_reason_id: this.cancel_reason,
        reason_description: this.cancel_desc,
        client_type: this.$store.getters.getSession.default,
      };
      const that = this;
      this.$store.dispatch('$_orders/$_tracking/cancel_order', payload)
        .then((response) => {
          if (response.status === true) {
            that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
            that.cancelToggle();
            this.$store.dispatch('$_orders/fetch_ongoing_orders');
            that.place();
          } else {
            const payload2 = {
              order_no: that.$route.params.order_no,
              cancel_reason_id: 4,
              reason_description: 'I placed the wrong locations',
              client_type: that.$store.getters.getSession.default,
            };
            this.$store.dispatch('$_orders/$_tracking/cancel_order', payload2)
              .then((response2) => {
                if (response2.status === true) {
                  that.doNotification('1', 'Order cancelled', 'Order cancelled successfully.');
                  that.cancelToggle();
                  this.$store.dispatch('$_orders/fetch_ongoing_orders');
                  that.place();
                } else {
                  that.doNotification('3', 'Order cancellation failed', 'Could not cancel the order. Please contact Customer Care at 0709779779.');
                }
              });
          }
        });
    },
    dateFormat(date) {
      return this.moment(date).calendar(null, {
        lastWeek: 'MMM-D hh:mm a',
        sameDay: '[Today] hh:mm a',
        nextDay: '[Tomorrow] hh:mm a',
        nextWeek: 'ddd',
        sameElse() {
          return 'MMM D, hh:mm a';
        },
      });
    },
  },
};
</script>

<style lang="css">
.infobar--outer
{
  display: flex;
  position: fixed;
  bottom: 20px;
  width: 98%;
  margin: 0 1%;
  background-color: #fff;
  color: #555;
  font-size: 13px;
  min-height: 90px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  border-radius: 3px;
}
.infobar--content
{
  display: flex;
  flex: 1 1 auto;
}
.infobar--content-padded
{
  padding: 15px 0;
}
.infobar--item
{
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.infobar--item-bordered
{
  border-right: 1px solid #74696942;
}
.infobar--item-start
{
  align-items: flex-start;
}
.infobar--photo img
{
  margin-top: -29px;
  height: 72px;
  width: auto !important;
  margin-bottom: -29px;
  border-radius: 9px;
}
.infobar--driver-details
{
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
}
.infobar--driver a
{
  color: #1782c5;
  text-decoration: none;
  font-size: 80%;
}
.infobar--actions
{
  flex-direction: row;
  padding: 0 1rem;
  text-transform: capitalize;
  justify-content: space-around;
  text-align: center;
  position: relative;
}
.infobar--actions img
{
  display: block;
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
.infobar--actions-hover:hover
{
  cursor: pointer;
  color:#1782C5;
}
.infobar--action-slide
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #74696929;
  position: absolute;
  background-color: #fff;
  top: -255px;
  width: 100%;
  min-width: 215px;
  border-radius: 3px;
}
.actions--caret
{
  width: 20px;
  height: 20px;
  z-index: 50;
  background-color: #fff;
  position: absolute;
  bottom: -11px;
  border-bottom: 1px solid #74696942;
  border-right: 1px solid #74696942;
  transform: rotate(45deg);
}
.infobar--terms
{
  display: flex;
  flex: 1;
}
.infobar--actions-text
{
  font-size: 13px;
  font-weight: 400;
  padding-top: 11px;
}
.action--slide-text
{
  padding: 10px 0px;
  line-height: 1.5;
  text-transform: none;
}
.action--slide-text:hover
{
  color: #333;
  cursor: auto;
}
.action--slide-desc
{
  display: flex;
  justify-content: center;
  width: 100%;
}
.action--slide-button
{
  margin: 0px 10px 10px 10px;
    text-transform: capitalize;
    font-size: 14px;
    letter-spacing: 1.1px;
    background-color: #1782c5;
    color: #fff;
    width: 100%;
    height: 30px;
    cursor: pointer;
    border: 0px solid;
    border-radius: 2px;
}
.infobar--actions-icon
{
  font-size: 23px;
  margin-bottom: -10px;

}

.carets
{
  width: 10px;
  margin-right: 4px;
}
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
.infobar--action-slide .el-radio
{
  padding: 10px 0px;
  margin: 0px;
}
.infobar--action-slide .el-radio-group
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.infobar--truck--outer{
  display: flex;
  position: fixed;
  bottom: 20px;
  width: 98%;
  margin: 0 1%;
  background-color: #fff;
  color: #555;
  font-size: 13px;
  min-height: 90px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  border-radius: 3px;

}
.infobar--truck-content{
  display: flex;
  flex: 1 1 auto;
}
.infobar--truck-content-padded{
  padding: 15px 0;
}
.infobar--truck-item{
  flex-direction: row;
  justify-content: space-evenly;
  padding-left: 8%;
}
.infobar-content{
  flex: 1 1 auto;
}
.infobar--item-truck-bordered{
  border-bottom: 1px solid #74696942;
}
.infobar--item-truck-bordered-top{
  border-top: 1px solid #74696942;
}
.infobar-content{
  flex: 1 1 auto;
}
.infobar--truck-cont-item{
  flex-direction: row;
  justify-content: space-evenly;
  padding-left: 8%;
}
.infobar--item-truck-cont-bordered{
  border-right: 1px solid #74696942;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
ul.timeline {
    list-style-type: none;
    position: relative;
}
ul.timeline:before {
    content: ' ';
    background: #d4d9df;
    display: inline-block;
    position: absolute;
    left: 29px;
    width: 2px;
    height: 100%;
    z-index: 400;
}
ul.timeline > li {
    margin: 20px 0;
    padding-left: 20px;
    max-height: 300px;
}
ul.timeline > li:before {
    content: ' ';
    background: white;
    display: inline-block;
    position: absolute;
    border-radius: 50%;
    border: 3px solid #22c0e8;
    left: 20px;
    width: 14px;
    height: 14px;
    z-index: 400;
}
.cancelOptions > div
{
  margin-top: 16em !important;
  width: 30% !important;
}
.v-modal{
  opacity: 0 !important;
}
.infobar-truck-pstn{
  padding-bottom: 15px;
}
.topbar-text{
  padding-bottom: 10px;
}
.top-bar-info{
  color: #1782C5;
  font-size: 15px;
}
.top-bar-img{
  height:15px;
  vertical-align:middle;
}
.inforbar--item-scrollable{
  overflow-y: scroll;
  height: 170px;
}
.infobar-truck-img{
  height:20px;
  vertical-align:middle;
}
</style>
