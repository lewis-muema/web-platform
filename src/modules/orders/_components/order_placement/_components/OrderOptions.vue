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
                            <el-radio v-model="payment_method_1" label="Payment on delivery"></el-radio>
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
                            <el-radio v-model="payment_method_2" label="M-Pesa"></el-radio>
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
                            <el-radio v-model="payment_method_3" label="Redeem promo code"></el-radio>
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
            <div class="">
                <button type="button" class="button-primary home-view--place-order" name="button" @click="placeOrder()">Place Order</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import NoSSR from 'vue-no-ssr';
import numeral from 'numeral';

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
            schedule_time: '',
            order_notes: '',
            payment_method:''
        }
    },
    computed :{
        ...mapGetters({
          get_active_order_option : '$_orders/$_home/get_active_order_option',
          getRunningBalance : '$_orders/$_home/get_active_order_option',

        }),

    },
    methods:{
        ...mapMutations({
          set_active_order_option : '$_orders/$_home/set_active_order_option',
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
        placeOrder(){

        },
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
