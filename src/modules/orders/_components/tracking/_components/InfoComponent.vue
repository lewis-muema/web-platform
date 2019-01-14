<template lang="html">
  <transition name="fade" mode="out-in">
    <div class="infobar--outer" v-if="this.loading == false">
      <div class="infobar--content infobar--content-padded">
        <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
          <img class="rimg" :src="this.tracking_data.rider.rider_photo">
        </div>
        <div class="infobar--content infobar--item infobar--driver infobar--item-bordered" >
          <div class="infobar--driver-details" v-if="this.tracking_data.confirm_status > 0">
            <div class="">
              {{this.tracking_data.rider.rider_name}} - {{this.tracking_data.rider.rider_phone}}
            </div>
            <div class="">
              {{this.tracking_data.rider.vehicle_name}} - {{this.tracking_data.rider.number_plate}}
            </div>
          </div>
          <div class="infobar--driver-details" v-else>
            <div class="">
              {{this.tracking_data.description_head}}
            </div>
            <div class="">
              {{this.tracking_data.marketing_message}}
            </div>
          </div>
        </div>
        <div class="infobar--content infobar--item infobar--order infobar--item-bordered">
          <div class="">
            <div class="">
               KES {{this.tracking_data.amount}}
            </div>
          </div>
          <div class="">
            <div class="">
               {{this.tracking_data.order_no}}
            </div>
          </div>
        </div>

        <div class="infobar--content infobar--item infobar--status infobar--item-bordered">
          <div class="">
             {{getStatus}}
          </div>
          <div class="">
            <span class="" v-if = "this.tracking_data.delivery_status < 2">
              A Rider will pick and deliver your order by <span class=""> {{moment(this.tracking_data.date_time).format("h:mm a")}} </span>
            </span>
            <!-- <span class="" v-else>
              Estimated Delivery: <span class=""> {{this.tracking_data.etd}} </span>
            </span> -->
          </div>
        </div>
        <div class="infobar--content infobar--item infobar--actions" v-if="this.$route.name != 'tracking_external'">
          <transition name="fade" mode="out-in">
            <div class="infobar--action-slide" v-if="this.cancel_popup">
              <div class="">
                <div class="">
                  Cancel this order?
                </div>
                <div class="">
                  You can place another one at any time.
                </div>
              </div>
              <div class="">
                <el-radio-group v-model="cancel_reason" class="" @input="cancel_change">
                  <el-radio :label="4">I placed the wrong locations</el-radio>
                  <el-radio :label="5">My order is not ready</el-radio>
                  <el-radio :label="7">No driver has been allocated</el-radio>
                  <el-radio :label="8">I placed this order twice</el-radio>
                </el-radio-group>
              </div>
              <div class="action--slide-desc">
                <button type="button" name="button" class="action--slide-button" @click="cancel_order()">Yes</button>
                <button type="button" name="button" class="action--slide-button" @click="cancel_toggle()">No</button>
              </div>
              <div class="actions--caret"></div>
            </div>
          </transition>
          <div v-if="false">
            <div class="infobar--actions-icon">
              <i class="el-icon-sold-out"></i>
            </div>
            <div class="infobar--actions-text">
              Free delivery
            </div>
          </div>
          <div v-if="false">
            <div class="infobar--actions-icon">
              <i class="el-icon-share"></i>
            </div>
            <div class="infobar--actions-text">
              Share Status
            </div>
          </div>
          <div @click="cancel_toggle()" v-if="!(this.tracking_data.delivery_status > 1)" class="infobar--actions-hover">
            <div class="infobar--actions-icon">
               <i class="el-icon-circle-close-outline"></i>
            </div>
            <div class="infobar--actions-text">
              Cancel Order
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'info-window',
  data: function() {
    return {
      loading: true,
      order_number: '',
      cancel_popup: 0,
      cancel_reason: -1,
      cancel_desc: ''
    }
  },
  methods: {
    cancel_change: function(reason) {
      switch (reason) {
        case 4:{
          this.cancel_desc = 'I placed the wrong locations'
          break;
        }
        case 5:{
          this.cancel_desc = 'My order is not ready'
          break;
        }
        case 7:{
          this.cancel_desc = 'No driver has been allocated'
          break;
        }
        case 8:{
          this.cancel_desc = 'I placed this order twice'
          break;
        }
      }
    },
    poll: function (from) {
      var that = this
      this.$store.dispatch('$_orders/$_tracking/get_tracking_data', {"order_no": from})
      .then(response => {
        if (response) {
          if (this.tracking_data.delivery_status == 3) {
            that.doNotification("1","Order delivered","Your order has been delivered.");
            if (that.$route.name != 'tracking_external') {
              that.$router.push('/orders/rating/'+ from);
            }
            else {
              that.$router.push('/external/rating/'+ from);
            }
          }
          else {
            if (this.tracking_data.main_status == 2) {
              that.doNotification("2","Order cancelled","Your order has been cancelled.");
              that.place()
            }
            else {
              if (this.get_tracked_order == from) {
                setTimeout(function() {
                  that.poll(from)
                }, 15000);
              }
            }
          }
        }
        else {
          that.place()
        }
        that.loading = false
      })
    },
    cancel_toggle: function () {
      if (this.cancel_popup == 1) {
        this.cancel_popup = 0
      }
      else {
        this.cancel_popup = 1
      }
    },
    place: function () {
      if (that.$route.name != 'tracking_external') {
        this.$router.push('/orders')
      }
      else {
        this.$router.push('/')
      }
    },
    doNotification(level, title, message) {
      this.$store.commit("setNotificationStatus", true);
      let notification = {title: title, level: level, message: message};
      this.$store.commit("setNotification", notification);
    },
    cancel_order: function () {
      var payload = {
        "order_no": this.tracking_data.order_no,
        "cancel_reason_id" : this.cancel_reason,
        "reason_description" : this.cancel_desc,
        "client_type" : this.$store.getters.getSession.default
      }
      var that = this
      this.$store.dispatch('$_orders/$_tracking/cancel_order', payload)
      .then(response => {
        if (response.status == true) {
          that.doNotification("1","Order cancelled","Order cancelled successfully.");
          that.cancel_toggle();
          this.$store.dispatch('$_orders/fetch_ongoing_orders')
          that.place();
        }
        else {
          var payload = {
            "order_no": that.$route.params.order_no,
            "cancel_reason_id" : 4,
            "reason_description" : 'I placed the wrong locations',
            "client_type" : that.$store.getters.getSession.default
          }
          this.$store.dispatch('$_orders/$_tracking/cancel_order', payload)
          .then(response => {
            if (response.status == true) {
              that.doNotification("1","Order cancelled","Order cancelled successfully.");
              that.cancel_toggle();
              this.$store.dispatch('$_orders/fetch_ongoing_orders')
              that.place();
            }
            else {
              that.doNotification("3","Order cancellation failed","Could not cancel the order. Please contact Customer Care at 0709779779.");
            }
          });
        }
      })
    },
    date_format: function( date ) {
      var from_now = this.moment( date ).fromNow();

      return this.moment( date ).calendar( null, {
          lastWeek: 'MMM-D hh:mm a',
          sameDay:  '[Today] hh:mm a',
          nextDay:  '[Tomorrow] hh:mm a',
          nextWeek: 'ddd',
          sameElse: function () {
              return "MMM D, hh:mm a";
          }
      });
    },
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/get_tracking_data',
      tracked_order: '$_orders/$_tracking/get_tracked_order'
    }),
    getStatus: function() {
      if (this.loading == false) {
        switch(this.tracking_data.delivery_status) {
            case 3:
            {
              return 'Delivered'
              break;
            }
            case 2:
            {
              return 'In Transit'
              break;
            }
            default:
            {
              switch (this.tracking_data.confirm_status) {
                case 1:
                {
                  return 'Confirmed'
                  break;
                }
                default:
                {
                  return 'Pending'
                  break;
                }
              }
            }
        }
      }
      else {
        return "";
      }
    },
  },
  mounted() {
    this.loading = true
    this.$store.commit('$_orders/$_tracking/set_tracked_order', this.$route.params.order_no)
    var that = this
    this.poll(this.$route.params.order_no)
  },
  created () {
    this.order_number = this.$route.params.order_no;
  },
  watch: {
    '$route.params.order_no': function(from, to) {
      this.order_number = from
      this.loading = true
      this.$store.commit('$_orders/$_tracking/set_tracked_order', from)
      var that = this
      this.poll(from)
    }
  }
}
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
</style>
