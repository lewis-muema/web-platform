<template lang="html">
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
            {{this.tracking_data.rider.vehicle_name}}
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
        <div class="infobar--terms">
          <a class="" href="https://sendyit.com/terms" target="_blank">Sendy Terms and Conditions</a>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--order infobar--item-bordered">
        <div class="">
          Order Number : {{this.tracking_data.order_no}}
        </div>
        <div class="">
          Cost : KES {{this.tracking_data.amount}}
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--locations infobar--item-bordered">
        <div class="infobar--content infobar--item infobar--item-start">
          <div class="">
            <img class="carets" src="https://apptest.sendyit.com/biz/style3/comp/maroon_button.png" alt="Pickup" align="center"> <span class="">	Pickup : {{this.tracking_data.path[0].name}}</span>
          </div>
          <div class="">
            <img class="carets" src="https://apptest.sendyit.com/biz/style3/comp/blue_button.png" alt="Drop Off" align="center"> <span class=""> Destination : {{this.tracking_data.path[this.tracking_data.path.length - 1].name}}</span>
          </div>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--status infobar--item-bordered">
        <div class="">
          Status: {{getStatus}}
        </div>
        <div class="">
          <span class="" v-if = "this.tracking_data.delivery_status < 2">
            Estimated Arrival: <span class=""></span>
          </span>
          <span class="" v-else>
            Estimated Delivery: <span class=""></span>
          </span>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--actions">
        <div @click="place()">
          <div>
            <a href="#"  class="" ><img class="" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/free_delivery.png"></a>
          </div>
          <div class="infobar--actions-text">
            Free delivery
          </div>
        </div>
        <div>
          <div>
            <a href="#"><img class="" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/share_delivery.png"></a>
          </div>
          <div class="infobar--actions-text">
            Share Status
          </div>
        </div>
        <div>
          <div>
             <a href="#"><img class="" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/cancel_order.png"></a>
          </div>
          <div class="infobar--actions-text">
            Cancel Order
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="" v-else>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'info-window',
  data: function() {
    return {
      loading: true,
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
    this.$store.dispatch('$_orders/$_tracking/get_tracking_data')
    .then(response => {
      that.loading = false
    })
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
  color: #1782c5;
  font-size: 13px;
  min-height: 90px;
  box-shadow: 5px 5px 10px 1px rgba(184, 184, 196, 0.36);
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
  width: 52px;
}
.infobar--driver-details
{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  flex: 4;
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
  text-transform: uppercase;
  justify-content: space-around;
}
.infobar--actions img
{
  display: block;
  text-align: center;
  width: 52px;
  height: 52px;
  margin: 0 auto;
}
.infobar--terms
{
  display: flex;
  flex: 1;
}
.infobar--actions-text
{
  font-size: 10px;
  font-weight: 400;
  padding-top: 4px;
}
.carets
{
  width: 10px;
  margin-right: 4px;
}
</style>
