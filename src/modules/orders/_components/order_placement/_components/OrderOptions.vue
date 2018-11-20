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
                          Your balance is Ksh {{getRB()}}.
                        </div>
                    </div>

                </div>
                <div class="home-view--seperator home-view--seperator__mini"></div>

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

export default {
    name:'order-options',
    components:{
        'no-ssr': NoSSR,

    },
    data () {
        return {
            pickerOptions1: {
              shortcuts: [{
                text: 'Today',
                onClick(picker) {
                  picker.$emit('pick', new Date());
                }
              }, {
                text: 'Yesterday',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24);
                  picker.$emit('pick', date);
                }
              }, {
                text: 'A week ago',
                onClick(picker) {
                  const date = new Date();
                  date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                  picker.$emit('pick', date);
                }
              }]
            },
            schedule_time: this.moment(),
            order_notes: '',
            payment_method:'',
            loading:false,
            cash_status : false,
            card_token : '',
            customer_token : '',
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

        }),
        active_price_tier_data: function (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers[this.get_active_package_class];
            }
            return "";
        },
        active_vendor_price_data: function (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers[this.get_active_package_class].find(
                    vendor => vendor.vendor_name === this.get_active_vendor_name
                );
            }
            return {};
        },
        order_cost:function(){
            if('cost' in this.active_vendor_price_data){
                return this.active_vendor_price_data.cost-this.active_vendor_price_data.discountAmount;
            }
            return 0;
        }

    },
    methods:{
        ...mapMutations({
          set_active_order_option : '$_orders/$_home/set_active_order_option',
          setPickupFilled: '$_orders/$_home/set_pickup_filled',
        }),
        ...mapActions({
            requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
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
        checkPaymentDetails(){
            if(this.get_price_request_object.payment_option == 1){
                if(this.payment_method == ''){
                    this.doNotification('2','Payment method', "The payment method has not been set, please set and try again.");
                }
                else{
                    if(this.payment_method == 1){
                        this.handleMpesaPayments();
                    }
                    else if(this.payment_method == 2){
                        this.handleCardPayments();
                    }
                    else if( this.payment_method == 3){
                        this.handleCashPayments();
                    }
                    else if( this.payment_method == 5){
                        this.handlePromoCodePayments();
                    }
                }
            }
            else{
                this.handlePostPaidPayments();
            }
        },
        handleMpesaPayments(){
            this.saveInfoToStore();
        },
        handlePromoCodePayments(){
            this.saveInfoToStore();
        },
        handleCashPayments(){
            if(this.getRunningBalance <= 0){
                this.doCompleteOrder();
            }
        },
        handleCardPayments(){
            this.saveInfoToStore();
        },
        handlePostPaidPayments(){
            this.doCompleteOrder();
        },
        doCompleteOrder(){
            let payload = {
              "values" : this.getCompleteOrderObject(),
              "vm":this,
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
                   this.$store.unregisterModule(['$_orders','$_home']);
                   this.$router.push({ name: 'tracking', params: { order_no: order_no }})


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
            else{
                acc.user_email = 'faithshop@gmail.com';
                acc.client_mode = 0;
                acc.cop_id = 0;
                acc.name = 'Missing session';
                acc.phone = '0778987789';
                acc.user_phone = '0778987789';
            }
            let payload = {
              "note": this.order_notes,
              "trans_no": this.get_price_request_object.order_no,
              "user_email": acc.user_email ,
              "user_phone": acc.user_phone,
              "no_charge_status": false,
              "insurance_amount": 10,
              "cash_status": this.cash_status,
              "note_status": this.order_notes.length > 0 ? true : false,
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
              "payment_mode": 0,
              "schedule_time": this.moment(this.schedule_time,'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss'),
              "tier_tag": this.active_vendor_price_data.tier_tag,
              "cop_id": 'cop_id' in acc ? acc.cop_id : 0,
              "carrier_type": 2,
              "isreturn": false,
              "vendor_type": this.active_vendor_price_data.vendor_id,
              "rider_phone": this.get_price_request_object.order_no,
              "type": "postpaid"
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

        },
        refreshRunningBalance(){
            this.$store.dispatch("$_payment/requestRunningBalance", payload).then(
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
                  console.log(error);
                }
              );
        }
    },
    created(){
        this.$store.registerModule('$_payment', payment_store);
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
