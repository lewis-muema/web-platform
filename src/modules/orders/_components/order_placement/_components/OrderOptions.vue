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

                <span v-if="allowCash == true">
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

                </span>
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <!-- <font-awesome-icon icon="mobile-alt" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                        <div class="home-view-notes-wrapper--item__option-div">

                          <div class="home-view-notes-wrapper--item__link" @click="takeMeToAddNewCard()">  +  &nbsp;&nbsp; Add New card </div>
                        </div>
                    </div>
                    <div class="home-view-notes-wrapper--item__value">
                        <!-- <input type="checkbox" name="" value=""> -->

                    </div>
                </div>
                <div class="" v-if="Array.isArray(get_saved_cards) && get_saved_cards.length > 0">
                    <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" v-for="card in get_saved_cards">
                        <div class="home-view-notes-wrapper--item__option">
                            <!-- <font-awesome-icon icon="mobile-alt" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" /> -->
                            <div class="home-view-notes-wrapper--item__option-div" >
                                <el-radio v-model="payment_method" :label="getCardValue(card.last4)"> **** **** **** {{card.last4}} </el-radio>
                            </div>
                        </div>

                        <div class="home-view-notes-wrapper--item__value">
                            <!-- <input type="checkbox" name="" value=""> -->

                        </div>
                    </div>

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
            <div v-if="!loading && payment_state == 0">
                <button type="button" class="button-primary home-view--place-order" name="button" @click="checkPaymentDetails()">Place Order</button>
            </div>
            <div class="home-view-place-order--mpesa-cancel" v-if="loading && payment_state == 1">
                <button type="button" class="button-primary home-view--place-order" name="button" @click="cancelMpesaPaymentRequest()">Cancel Payment</button>
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
// import * from '../js/MpesaActions'
export default {
    name:'order-options',
    components:{
        'no-ssr': NoSSR,

    },
    data () {
        return {
            schedule_time: this.moment(),
            order_notes: '',
            payment_method:'',
            loading:false,
            cash_status : false,
            card_token : '',
            customer_token : '',
            payment_type : "prepay",
            payment_state : 0,// 0- initial 1- loading 2- success 3- cancelled
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
          get_saved_cards : '$_orders/$_home/get_saved_cards',
          get_stripe_user_id : '$_orders/$_home/get_stripe_user_id',

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
          unsetMap : '$_orders/unsetMap',
        }),
        ...mapActions({
            requestOrderCompletion: '$_orders/$_home/requestOrderCompletion',
            requestRunningBalanceFromAPI: '$_payment/requestRunningBalance',
            requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
            requestCardPaymentAction: '$_payment/requestCardPayment',
            completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
            terminateMpesaPaymentRequest: '$_payment/terminateMpesaPaymentRequest',
            requestSavedCards: '$_orders/$_home/requestSavedCards',
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
                if(this.getRunningBalance <= 0){
                    return true;
                }
                return false;
            }
            return true;
        },
        checkPaymentDetails(){
            if(this.get_active_vendor_name == ''){
                console.log('The vehicle type not been set');
                this.doNotification('2','Select a vehicle type', "The vehicle type not been set, please set and try again.");
                return false;
            }
            if(this.payment_method == '' || this.payment_method == 3){
                if(this.checkAllowPrePaid() == true){
                    console.log('might allow pre paid');
                    this.handlePostPaidPayments();
                }
                else{
                    console.log('notification : Choose a payment method');
                    this.doNotification('2','Choose a payment method', "Please select a payment method and try again.");
                    return false;
                }
            }
            else{
                this.saveInfoToStore();
                if(this.payment_method == 1){
                    this.handleMpesaPayments();
                }

                else if( this.payment_method == 5){
                    this.handlePromoCodePayments();
                }
                else if(this.payment_method.startsWith('2_') ){
                    console.log('sliced',this.payment_method.slice(2));
                    let card =  this.get_saved_cards.find(
                        card_details => card_details.last4 === this.payment_method.slice(2)
                    )
                    this.handleCardPayments(card);
                }
                else{
                    console.log('not handled payment method', this.payment_method);
                }
            }
            return true;
        },
        handleMpesaPayments(){
            console.log('attempting mpesa');
            this.requestMpesaPayment();

        },
        handlePromoCodePayments(){
            console.log('taking you to promo');
            this.$router.push({ name: "promo_payment" });
        },
        handleCashPayments(){
            console.log('allowed cash payment')
            // if(this.getRB() <= 0){
                this.doCompleteOrder();
            // }
        },
        takeMeToAddNewCard(){
            this.$router.push({ name: "card_payment",query:{action:"add"} });
        },
        handlePostPaidPayments(){
            console.log('allowed post pay payment')
            this.payment_type = 'postpay';
            this.doCompleteOrder();
        },
        doCompleteOrder(){
            console.log('in doCompleteOrder');
            let payload = {
              "values" : this.getCompleteOrderObject(),
              "app":"PRIVATE_API",
              "endpoint":"pay"
            };
            this.loading = true;
            this.requestOrderCompletion(payload).then(response => {
                this.loading = false;
               console.log(response);
               if (response.length > 0) {
                 response = response[0];
               }

               if(response.status == true){
                   this.setPickupFilled(false);
                   let order_no = this.get_price_request_object.order_no;
                   // let to_location = (window.location.origin + '/orders/track/'+ order_no);
                   // console.log('to_location',to_location);
                   // window.location.href = to_location;
                   this.$router.push({ name: 'tracking', params: { order_no: order_no }})
                   // this.$store.unregisterModule(['$_orders','$_home']);
                   // this.$store.unregisterModule(['$_orders']);


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
              "payment_mode": this.payment_method.startsWith('2')? 2 : this.payment_method == '' ? 0: this.payment_method,
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
        },
        getCardValue(last4digits){
            return '2_'+last4digits;
        },



        /* start mpesa */

        requestMpesaPayment() {
          console.log("requesting mpesa payment");
          let session = this.$store.getters.getSession;
          let referenceNumber = "SENDY";
          let cop_id = 0;
          let user_id = 0;
          let user_email = "";
          let user_phone = "";
          if (session.default == "biz") {
            referenceNumber += session.biz.cop_id;
            cop_id = session.biz.cop_id;
            user_id = session.biz.user_id;
            user_email = session.biz.user_email;
            user_phone = session.biz.user_phone;
          } else {
            referenceNumber = session.peer.user_phone;
            user_id = session.peer.user_id;
            user_email = session.peer.user_email;
            user_phone = session.peer.user_phone;
          }

          let mpesa_payload = {
            amount: this.order_cost,
            // amount: 10,
            sourceMobile: user_phone,
            referenceNumber: referenceNumber,
            user_id: user_id,
            cop_id: cop_id,
            phone: user_phone,
            email: user_email
          };

          console.log(mpesa_payload);

          let full_payload = {
            values: mpesa_payload,
            app: "NODE_PRIVATE_API",
            endpoint: "initiate_mpesa"
          };

          console.log(mpesa_payload);

          this.payment_state = 1;
          this.loading = true;

          this.requestMpesaPaymentAction(full_payload).then(
            response => {
              if (response.length > 0) {
                  response = response[0];
              }
              console.log(response);
              if (response.status == 200) {
                this.requestMpesaPaymentPoll();
              }
              else{
                  this.doNotification('2','Payment failed', "Could not reach mpesa, please try again.");
                  this.payment_state = 0;
                  this.loading = false;
                  console.log('mpesa payment failed 0');
              }

            },
            error => {
              this.doNotification('2','Payment failed', "Could not reach mpesa, please try again.");
              this.payment_state = 0;
              this.loading = false;
              console.log('mpesa payment failed 1');
            }
          );
        },

        requestMpesaPaymentPoll() {
          console.log("mpesa payment poll initiated");
          let session = this.$store.getters.getSession;
          let cop_id = 0;
          if (session.default == "biz") {
            cop_id = session.biz.cop_id;
          }
          let old_rb = this.$store.getters.getRunningBalance;
          let requested_amount = this.order_cost;

          let running_balance_payload = {
            values: {
              cop_id: cop_id,
              user_phone: session[session.default]["user_phone"]
            }
          };

          let payload = {
            values: running_balance_payload,
            app: "PRIVATE_API",
            endpoint: "running_balance"
          };

          let poll_limit = 6; //10secs * 6  = 60sec = 1min
          //poll the dispatch
          for (let poll_count = 0; poll_count < poll_limit; poll_count++) {
            //wait 10 seconds
             let that = this;
             (function (poll_count) {
              setTimeout(function () {
                let res = that.checkRunningBalance(old_rb, payload);
                console.log('poll count', poll_count);
                if(res){
                  poll_count = poll_limit;
                  that.payment_state = 0;
                  that.loading = false;
                  that.doNotification('1','Payment successful', "M-Pesa payment was successful.");
                  that.doCompleteOrder();
                  return true;
                }
                if(poll_count == 5){
                    that.doNotification('2','Payment failed', "Please select your preferred payment method and try again.");
                    that.payment_state = 0;
                    that.loading = false;
                    console.log('after for loop')
                }
              }, 10000*poll_count);
            })(poll_count);

          }


        },

        checkRunningBalance(old_rb, payload) {
          this.requestRunningBalanceFromAPI(payload).then(
            response => {
              console.log(response);
              if (response.length > 0) {
                response = response[0];
              }
              if (response.status == 200) {
                //check if rb has changed
                let new_rb = response.data.running_balance;
                console.log(old_rb);
                console.log(new_rb);

                if (new_rb < old_rb) {
                  //running balance updated
                  //terminate poll
                  //update global running balance
                  this.completeMpesaPaymentRequest({});
                  this.$store.commit(
                    "setRunningBalance",
                    response.data.running_balance
                  );
                  return true;
                }
              }
              //commit  to the global store here
              return false;
            },
            error => {
              console.log(error);
              return false;
            }
          );
        },

        cancelMpesaPaymentRequest() {
            this.payment_state = 0;
            this.loading = 0;
            this.doNotification('2','M-Pesa Payment cancelled', "M-Pesa payment has been cancelled, please try again.");
            return;
        },

        /* End mpesa */


        /* start card */

        getUserCards() {
            console.log("requesting mpesa payment");
            let session = this.$store.getters.getSession;
            let cop_id = 0;
            let user_id = 0;
            if (session.default == "biz") {
              cop_id = session.biz.cop_id;
              user_id = session.biz.user_id;
            } else {
              cop_id = 0;
              user_id = session.peer.user_id;
            }

            let card_payload = {
              user_id: "0",
              cop_id: "1083",
              // user_id: user_id,
              // cop_id: cop_id,
            };

            console.log(card_payload);

            let full_payload = {
              values: card_payload,
              app: "PRIVATE_API",
              endpoint: "get_card"
            };

          this.requestSavedCards(full_payload).then(
            response => {
              console.log(response);
              if (response.length > 0) {
                response = response[0];
              }
              if (response.status == 200) {

              }

            },
            error => {
              console.log(error);
              return false;
            }
          );
        },

        handleCardPayments(card) {

          let card_payload = {
            amount: 10,
            // amount: this.order_cost,
            last4: card.last4,
            stripe_user_id: this.get_stripe_user_id
          };

          let full_payload = {
            values: card_payload,
            app: "PRIVATE_API",
            endpoint: "charge_customer_card"
          };
          this.$store.dispatch("$_payment/requestCardPayment", full_payload).then(
            response => {
              console.log(response);
              if (response.length > 0) {
                response = response[0];
              }
              let that = this;

              if (response.data.status == false) {
                  this.doNotification('2','Card Payment Failed', "Card payment failed, please try again.");
                  this.payment_state = 0;
                  this.loading = 0;

              } else {

                let card_trans_id = response.data.values.card_trans_id;
                this.completeCardPayment(card_trans_id);
                //complete payment here
              }
            },
            error => {
              console.log(error);
              this.doNotification('2','Card Payment Failed', "Card payment failed, please try again.");
              this.payment_state = 0;
              this.loading = 0;
            }
          );
        },
        completeCardPayment(card_trans_id) {
          let session = this.$store.getters.getSession;
          let user_id = 0;
          let cop_id = 0;
          let user_name = "";
          let user_email = "";
          let user_phone = "";

          if (session.default == "biz") {
            cop_id = session.biz.cop_id;
            user_id = session.biz.user_id;
            user_name = session.biz.user_name;
            user_email = session.biz.user_email;
            user_phone = session.biz.user_phone;
          } else {
            cop_id = session.peer.cop_id;
            user_id = session.peer.user_id;
            user_name = session.peer.user_name;
            user_email = session.peer.user_email;
            user_phone = session.peer.user_phone;
          }

          let payload = {
            amount: this.order_cost,
            // amount: 100,
            pay_method: 2,
            ref_no: "VISA-" + Math.round(+new Date() / 1000),
            client_id: cop_id,
            account_no: "SENDY" + cop_id,
            phone: user_phone,
            email: user_email,
            name: user_name,
            bill_Ref_Number: user_phone,
            card_trans_id: card_trans_id
          };

          let full_payload = {
            values: payload,
            app: "PRIVATE_API",
            endpoint: "payment"
          };

          this.$store.dispatch("$_payment/completeCardPayment", full_payload).then(
            response => {
              console.log(response);
              if (response.length > 0) {
                response = response[0];
              }
              let self = this;
              if (response.data.status == true) {
                //this will request the new running balance and update the store

                this.doNotification('1','Successful Payment', "Card payment has been completed successfully.");

                let payload = {
                  values: running_balance_payload,
                  app: "PRIVATE_API",
                  endpoint: "running_balance"
                };

                this.$store
                  .dispatch("$_payment/requestRunningBalance", payload)
                  .then(response => {
                    console.log("running balance response", response);
                    this.payment_state = 0;
                    this.loading = 0;
                    self.doCompleteOrder();
                  });
              } else {
                  this.payment_state = 0;
                  this.loading = 0;
                this.doNotification('3','Card Payment Failed', "Card payment failed to complete.");

              }
            },
            error => {
              console.log(error);
              this.doNotification('3','Card Payment Failed', "Card payment failed to complete.");
              this.payment_state = 0;
              this.loading = 0;
            }
          );
        },
        /* end card */
    },
    created(){
        // console.log('store breaking ',this.$store.state)
        //if (!this.$store.state['$_payment']) {
            this.$store.registerModule('$_payment', payment_store);
        //}
        // if (!this.$store.state['$_orders']) {
            this.$store.registerModule('$_orders', order_store);
        // }
        this.initializeOrderPlacement();
        this.refreshRunningBalance();
        this.getUserCards();
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

.home-view-notes-wrapper--item__link:hover{
color:#1782C5;
cursor: pointer;

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
.home-view-place-order--mpesa-cancel{
    margin-top: 20px;
}


</style>
