<template lang="html">
    <div class="">
        <div class="home-view--seperator">
        </div>
        <div class="home-view-actions">
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('payment')" @click="do_set_active_order_option('payment')">
                <font-awesome-icon icon="dollar-sign" size="xs" class="home-view-actions--items__img" width="10px"  />
                <span class="home-view-actions--items__span">Choose Payment</span>
            </div>
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('note')" @click="do_set_active_order_option('note')">
                <font-awesome-icon icon="pen" size="xs" class="home-view-actions--items__img" width="10px"  />
                <span class="home-view-actions--items__span">Add Note</span>
            </div>
            <div class="home-view-actions--items" :class="get_current_active_order_option_class('schedule')" @click="do_set_active_order_option('schedule')">
                <font-awesome-icon icon="clock" size="xs" class="home-view-actions--items__img" width="10px"  />
                <span class="home-view-actions--items__span">Schedule</span>
            </div>
        </div>
        <div class="home-view--seperator">
        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'payment'">
            <div class="">

            </div>
            <div class="home-view-notes-wrapper">
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__balance">
                    Your balance is Ksh 2,000.
                </div>


                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <font-awesome-icon icon="dollar-sign" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" />
                        <div class="home-view-notes-wrapper--item__option-div">
                            Payment on delivery
                        </div>
                    </div>
                    <div class="home-view-notes-wrapper--item__value">
                        <input type="checkbox" name="" value="">
                    </div>
                </div>
                <div class="home-view--seperator home-view--seperator__mini">
                </div>
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <font-awesome-icon icon="mobile-alt" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" />
                        <div class="home-view-notes-wrapper--item__option-div">
                            Mpesa
                        </div>
                    </div>
                    <div class="home-view-notes-wrapper--item__value">
                        <input type="checkbox" name="" value="">
                    </div>
                </div>
                <div class="home-view--seperator home-view--seperator__mini">
                </div>
                <div class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row" >
                    <div class="home-view-notes-wrapper--item__option">
                        <font-awesome-icon icon="star" size="xs" class="home-view-notes-wrapper--item__option-svg" width="10px" />
                        <div class="home-view-notes-wrapper--item__option-div">
                            Enter a promo code
                        </div>
                    </div>
                    <div class="home-view-notes-wrapper--item__value">
                        <input type="checkbox" name="" value="">
                    </div>
                </div>
                <div class="home-view--seperator">
                </div>
            </div>
            <div class="">

            </div>

        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'note'">
            <div class="">

            </div>
            <div class="">
                <textarea name="name" rows="5" class="textarea-control"></textarea>
            </div>
            <div class="">

            </div>
        </div>
        <div class="home-view-actions--note" v-if="get_active_order_option == 'schedule'">
            <div class="">

            </div>
            <div class="">
                 <!-- <date-picker v-model="schedule_time" type="datetime" lang="en" format="MM-DD-YYYY [at] HH:mm" :time-picker-options="{ start: '05:00', step: '01:00', end: '21:00' }" confirm></date-picker> -->
            </div>
            <div class="">

            </div>
        </div>
        <div class="home-view-place-order">
            <div class="">
                <button type="button" class="button-primary home-view--place-order" name="button">Place Order</button>
            </div>
        </div>
    </div>
</template>

<script>
// import DatePicker from 'vue2-datepicker'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name:'order-options',
    components:{
        // DatePicker
    },
    data () {
        return {
            schedule_time:'',
            shortcuts: [
            {
              text: 'Today',
              onClick: () => {
                this.time3 = [ new Date(), new Date() ]
              }
            }
          ],
          timePickerOptions:{
            start: '00:00',
            step: '00:30',
            end: '23:30'
          }
        }
    },
    computed :{
        ...mapGetters({
          get_active_order_option : '$_orders/$_home/get_active_order_option',

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
    }
}
</script>

<style lang="css">
.home-view-actions--note{
    margin-top: 20px;
}
.home-view-actions--items:hover{
    color: #1782c5;
}
.home-view-notes-wrapper--item,.home-view-notes-wrapper--item__option-div,.home-view-notes-wrapper--item__option-svg, .home-view-notes-wrapper--item__option{
    display: flex;
}
.class="home-view-notes-wrapper--item__option-div"{
    padding-left: 10px;
}
.home-view-notes-wrapper--item__row{
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
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
}
.home-view-notes-wrapper--item__balance{
    margin-bottom: 20px;
}
.home-view--seperator__mini{
    margin-left: unset !important;
    margin-right: unset !important;
}
.home-view-notes-wrapper--item__option-svg{
    margin-right: 10px;
}


</style>
