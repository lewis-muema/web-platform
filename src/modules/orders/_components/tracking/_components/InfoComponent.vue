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
              {{this.tracking_data.rider.rider_name}}
            </div>
            <div class="">
              {{this.tracking_data.rider.vehicle_name}} {{this.tracking_data.rider.number_plate}}
            </div>
            <div class="">
              {{this.tracking_data.rider.number_plate}}
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
              Estimated Arrival: <span class=""> {{this.tracking_data.eta}} </span>
            </span>
            <span class="" v-else>
              Estimated Delivery: <span class=""> {{this.tracking_data.etd}} </span>
            </span>
          </div>
        </div>
        <div class="infobar--content infobar--item infobar--actions">
          <div @click="place()">
            <div class="infobar--actions-icon">
              <i class="el-icon-sold-out"></i>
            </div>
            <div class="infobar--actions-text">
              Free delivery
            </div>
          </div>
          <div>
            <div class="infobar--actions-icon">
              <i class="el-icon-share"></i>
            </div>
            <div class="infobar--actions-text">
              Share Status
            </div>
          </div>
          <div>
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
      order_number: ''
    }
  },
  methods: {
    place: function () {
      this.$router.push('/orders')
    }
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/get_tracking_data',
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
    var that = this
    this.$store.dispatch('$_orders/$_tracking/get_tracking_data', {"order_no": this.$route.params.order_no})
    .then(response => {
      that.loading = false
    })
  },
  created () {
    this.order_number = this.$route.params.order_no;
  },
  watch: {
    '$route.params.order_no': function(from, to) {
      this.order_number = from
      this.loading = true
      var that = this
      this.$store.dispatch('$_orders/$_tracking/get_tracking_data', {"order_no": from})
      .then(response => {
        that.loading = false
      })
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
}
.infobar--actions img
{
  display: block;
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
.infobar--actions div:hover{

cursor: pointer;
color:#1782C5;

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
</style>
