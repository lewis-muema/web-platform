<template lang="html">
    <div class="">
        <div class="home-view--seperator">
        </div>
        <div class="home-view-actions">
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('payment')" @click="do_set_active_order_option('payment')">
                <i class="el-icon-goods"></i>
                <span class="home-view-actions--items__span" >Payment</span>
            </div>
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('note')" @click="do_set_active_order_option('note')">

                <i class="el-icon-edit-outline"></i>
                <span class="home-view-actions--items__span">Note</span>
            </div>
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('schedule')" @click="do_set_active_order_option('schedule')">

                <i class="el-icon-time"></i>
                <span class="home-view-actions--items__span">Schedule</span>
            </div>
        </div>
        <div class="home-view--seperator">
        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'payment'">
            <div class="">

            </div>
            <div class="home-view-notes-wrapper">

                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <!-- <font-awesome-icon icon="star" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                        <div class="home-view-notes-wrapper--item__option-div">
                          Your balance is KES {{getRB()}}.
                        </div>
                    </div>

                </div>
                <div class="home-view--seperator home-view--seperator__mini"></div>
                <span v-if="allowCash != true">
                    <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                        <div class="home-view-notes-wrapper--item__option">
                            <!-- <font-awesome-icon icon="dollar-sign" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                            <div class="home-view-notes-wrapper--item__option-div">
                                <el-radio v-model="payment_method" label="3">Payment on delivery</el-radio>
                            </div>
                        </div>
                        <div class="home-view-notes-wrapper--item__value">
                            <!-- <input type="checkbox" name="" value=""> -->

                        </div>
                    </div>
                    <div class="home-view--seperator home-view--seperator__mini">
                    </div>
                </span>
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <!-- <font-awesome-icon icon="mobile-alt" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                        <div class="home-view-notes-wrapper--item__option-div">
                            <el-radio v-model="payment_method" label="1">M-Pesa</el-radio>
                        </div>
                    </div>
                    <div class="home-view-notes-wrapper--item__value">
                        <!-- <input type="checkbox" name="" value=""> -->

                    </div>
                </div>
                <div class="home-view--seperator home-view--seperator__mini">
                </div>
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <!-- <font-awesome-icon icon="star" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                        <div class="home-view-notes-wrapper--item__option-div">
                            <el-radio v-model="payment_method" label="5">Redeem promo code</el-radio>
                        </div>
                    </div>

                </div>

            </div>
            <div class="home-view--seperator">
            </div>
            <div class="">

            </div>

        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'note'">
            <div class="">

            </div>
            <div class="">
                <textarea name="name" rows="5" class="textarea-control" v-model="order_notes"></textarea>
            </div>
            <div class="">

            </div>
        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'schedule'">
            <div class="">

            </div>
            <div class="">
                <div class="block">
                  <!-- <span class="demonstration">Date</span> -->
                  <el-date-picker class="home-view-actions__element-date"
                    v-model="schedule_time"
                    type="datetime"
                    placeholder="Select date and time">
                  </el-date-picker>
                </div>
            </div>
            <div class="">

            </div>
        </div>
        <div class="home-view-place-order">
            <div v-if="loading" v-loading="loading" class="orders-loading-container orders-loading-container--completion" >
            </div>
            <div v-else>
                <button type="button" class="button-primary home-view--place-order" name="button" @click="checkPaymentDetails()">Place Order</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import NoSSR from 'vue-no-ssr';
import numeral from 'numeral';
import payment_store from '../../../../payment/_store';
import order_store from '../../../_store';

export default {
    name:'order-options',
    components:{
        'no-ssr': NoSSR,

    },
    data () {
        return {
            // pickerOptions1: {
            //   shortcuts: [{
            //     text: 'Today',
            //     onClick(picker) {
            //       picker.$emit('pick', new Date());
            //     }
            //   }, {
            //     text: 'Yesterday',
            //     onClick(picker) {
            //       const date = new Date();
            //       date.setTime(date.getTime() - 3600 * 1000 * 24);
            //       picker.$emit('pick', date);
            //     }
            //   }, {
            //     text: 'A week ago',
            //     onClick(picker) {
            //       const date = new Date();
            //       date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            //       picker.$emit('pick', date);
            //     }
            //   }]
            // },
            schedule_time: this.moment(),
            order_notes: '',
            payment_method:'',
            loading:false,
            cash_status : false,
            card_token : '',
            customer_token : '',
            payment_type : "prepay"
        }
    },
    computed :{
        ...mapGetters({
          get_active_order_option : '$_orders/$_home/get_active_order_option',
          getRunningBalance : 'getRunningBalance',
          get_price_request_object : '$_orders/$_home/get_price_request_object',
          get_active_package_class : '$_orders/$_home/get_active_package_class',
          get_active_vendor_name : '$_orders/$_home/get_active_vendor_name',
          get_order_path : '$_orders/$_home/get_order_path',
          get_pickup_filled : '$_orders/$_home/get_pickup_filled',
          get_payment_method : '$_orders/$_home/get_payment_method',
          get_order_notes : '$_orders/$_home/get_order_notes',
          get_schedule_time : '$_orders/$_home/get_schedule_time',

        }),
        active_price_tier_data: function (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers.find(
                    pack => pack.tier_group === this.get_active_package_class
                )
            }
            return "";
        },
        active_vendor_price_data: function (){
            return this.active_price_tier_data.price_tiers.find(
                vendor => vendor.vendor_name === this.get_active_vendor_name
            )

        },
        order_cost:function(){
            if('cost' in this.active_vendor_price_data){
                return this.active_vendor_price_data.cost-this.active_vendor_price_data.discountAmount;
            }
            return 0;
        },
        allowCash(){
            return (this.get_price_request_object.payment_option == 2 || this.getRB() <= 0);
        },

    },
    methods:{
        ...mapMutations({
          set_active_order_option : '$_orders/$_home/set_active_order_option',
          setPickupFilled: '$_orders/$_home/set_pickup_filled',
          setPaymentMethod: '$_orders/$_home/set_payment_method',
          setScheduleTime: '$_orders/$_home/set_schedule_time',
          setOrderNotes: '$_orders/$_home/set_order_notes',
          unsetMap : '$_orders/unsetMap'
        }),
        ...mapActions({
            requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
            requestRunningBalanceFromAPI: '$_payment/requestRunningBalance',
        }),
        do_set_active_order_option(name){
            (this.get_active_order_option != name) ? this.set_active_order_option(name)  : this.set_active_order_option('');

        },
        get_current_active_order_option_class(name){
            return{
                'sendy-blue' : name == this.get_active_order_option
            }
        },
        getRB(){
            return numeral(this.getRunningBalance).format('0,0');
        },
        checkAllowPrePaid(){
            if(this.get_price_request_object.payment_option == 1){
                // if(this.active_vendor_price_data.cost )
                if(this.getRB() < 0){
                    // if(Math.abs(this.order_cost) <= Math.abs(this.getRB()) )
                    return true;
                }
                return false;
            }
            return true;
        },
        checkPaymentDetails(){
            if(this.get_active_vendor_name == ''){
                this.doNotification('2','Select a vehicle type', "The vehicle type not been set, please set and try again.");
                return false;
            }
            if(this.payment_method == ''){
                if(this.checkAllowPrePaid() == true){
                    this.handlePostPaidPayments();
                }
                else{
                    this.doNotification('2','Choose a payment method', "Please select a payment method and try again.");
                    return false;
                }
            }
            else{
                this.saveInfoToStore();
                if(this.payment_method == 1){
                    this.handleMpesaPayments();
                }
                else if(this.payment_method == 2){
                    this.handleCardPayments();
                }
                else if( this.payment_method == 5){
                    this.handlePromoCodePayments();
                }
            }
            return true;
        },
        handleMpesaPayments(){
            console.log('taking you to mpesa');
            this.$router.push({ name: "mpesa_payment" });
        },
        handlePromoCodePayments(){
            console.log('taking you to promo');
            this.$router.push({ name: "promo_payment" });
        },
        handleCardPayments(){
            console.log('taking you to card');
             this.$router.push({ name: "card_payment" });
        },
        handleCashPayments(){
            console.log('allowed cash payment')
            // if(this.getRB() <= 0){
                this.doCompleteOrder();
            // }
        },
        handlePostPaidPayments(){
            console.log('allowed post pay payment')
            this.payment_type = 'postpay';
            this.doCompleteOrder();
        },
        doCompleteOrder(){
            let payload = {
              "values" : this.getCompleteOrderObject(),
              "app":"PRIVATE_API",
              "endpoint":"pay"
            };
            this.loading = true;
            this.requestOrderCompletion(payload).then(response => {
                this.loading = false;
               console.log(response);

               if(response.status == true){
                   this.setPickupFilled(false);
                   let order_no = this.get_price_request_object.order_no;
                   this.$router.push({ name: 'tracking', params: { order_no: order_no }})
                   // this.$store.unregisterModule(['$_orders','$_home']);


               } else {
                   this.doNotification(2,"Order completion failed", "Price request failed. Please try again")
                  console.warn('order completion failed');

               }

            }, error => {
                console.error("Check Internet Connection")
                console.log(error);
                this.doNotification(3,"Order completyion failed", "Order completion failed. Please check your internet connection and try again.");
                this.loading = false;
            });
        },
        getCompleteOrderObject(){
            let acc = {};
            let session = this.$store.getters.getSession;
            if('default' in session){
                acc = session[session.default];
            }
            let payload = {
              "note": this.order_notes,
              "trans_no": this.get_price_request_object.order_no,
              "user_email": acc.user_email ,
              "user_phone": acc.user_phone,
              "no_charge_status": false,
              "insurance_amount": 10,
              "cash_status": this.cash_status,
              "note_status": (typeof this.order_notes == 'undefined') ? false : this.order_notes.length > 0 ? true:false,
              "last_digit": "none",
              "insurance_id": 1,
              "platform": "corporate",
              "card_token": this.card_token,
              "customer_token": this.customer_token,
              "insurance_status": true,
              "close_rider_id": 0,
              "amount": this.active_vendor_price_data.cost,
              "schedule_status": false,
              "destination_paid_status": false,
              "delivery_points": this.get_order_path.length-1,
              "sendy_coupon": "0",
              "payment_mode": this.payment_method,
              "schedule_time": this.moment(this.schedule_time,'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss'),
              "tier_tag": this.active_vendor_price_data.tier_tag,
              "cop_id": 'cop_id' in acc ? acc.cop_id : 0,
              "carrier_type": 2,
              "isreturn": false,
              "vendor_type": this.active_vendor_price_data.vendor_id,
              "rider_phone": this.get_price_request_object.order_no,
              "type": this.payment_type
          };
          payload = {"values":payload};
          return payload;
        },
        doNotification(level,title, message){
            this.$store.commit('setNotificationStatus', true);
            let notification = {"title":title, "level":level, "message":message};
            this.$store.commit('setNotification', notification);
        },
        saveInfoToStore(){
            // save locations, notes & payment option
            this.setScheduleTime(this.schedule_time);
            this.setPaymentMethod(this.payment_method);
            this.setOrderNotes(this.order_notes);

        },
        retrieveFromStore(){
            this.schedule_time = this.get_schedule_time;
            this.payment_method = this.get_payment_method;
            this.order_notes = this.get_order_notes;
        },
        refreshRunningBalance(){
            let session = this.$store.getters.getSession;

            let running_balance_payload = {
              values: {
                cop_id: 'cop_id' in session[session.default] ? session[session.default]["cop_id"] : 0,
                user_phone: session[session.default]["user_phone"]
              }
            };

            let payload = {
              values: running_balance_payload,
              app: "PRIVATE_API",
              endpoint: "running_balance"
            };
            this.requestRunningBalanceFromAPI(payload).then(
                response => {
                  if (response.length > 0) {
                    response = response[0];
                  }
                  if (response.status == 200) {
                    console.log("commit running balance to the global store");
                    this.$store.commit(
                      "setRunningBalance",
                      response.data.running_balance
                    );
                  }
                  console.log(response);
                  //commit  to the global store here
                },
                error => {
                  console.log('error  in store dispatch',error);
                }
              );
        },
        initializeOrderPlacement(){
            if(this.get_schedule_time != ''){
                console.log('old session *')
                this.retrieveFromStore();
            }
            else{
                this.unsetMap();
                console.log('new session *')
            }
        }
    },
    created(){
        this.$store.registerModule('$_payment', payment_store);
        this.$store.registerModule('$_orders', order_store);
        this.initializeOrderPlacement();
        this.refreshRunningBalance();
    }
}
</script>

<style lang="css">
.home-view-actions--note{
    margin-top: 15px;
}
.home-view-actions--items:hover{
    color: #1782c5;
}
.home-view-notes-wrapper--item,.home-view-notes-wrapper--item__option-div,.home-view-notes-wrapper--item__option-svg, .home-view-notes-wrapper--item__option{
    display: flex;
}
.home-view-notes-wrapper--item__option-div{
    padding-left: 29px;
    color: #555555ba;
}
.home-view-notes-wrapper--item__row{
  align-items: center;
justify-content: space-between;
margin-bottom: 8px;
margin-top: -11px;
font-size: 13px;
padding-left: 29px;
}
.home-view-notes-wrapper--item{

}
.home-view-notes-wrapper--item__option{
    flex: 4;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
}
.home-view-notes-wrapper--item__value{
    flex: 1;
    display: flex;
    align-self: flex-end;
    flex-direction: row-reverse;
    justify-content: center;
    padding-right: 40px;
}
.home-view-notes-wrapper--item__balance{
  margin-bottom: 14px;
  font-size: 14px;
}
.home-view--seperator__mini{
  margin-left: 30px !important;
  margin-right: 30px !important;
  border-top: 1px solid #66666614 !important;
}
.home-view-notes-wrapper--item__option-svg{
    margin-right: 10px;
}
.home-view-actions__element-date{
    width: 100% !important;
}
.el-date-picker{
    left: 48px;
}
.home-view-notes-wrapper--item__value .el-radio__label{
    display: none !important;
}


</style>
