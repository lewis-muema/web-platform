<template lang="html">
  <div class="infobar--outer">
    <div class="infobar--content infobar--content-padded">
      <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
        <img class="rimg" :src="'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/' + 'placeholder'">
      </div>
      <div class="infobar--content infobar--item infobar--driver infobar--item-bordered" >
        <div class="" v-if="1==1">
          <div class="">
            Nameandno
          </div>
          <div class="">
            vehicle
          </div>
        </div>
        <div class="" v-else>
          <div class="">

          </div>
          <div class="">

          </div>
        </div>
        <div class="">
          <a class="" href="https://sendyit.com/terms" target="_blank">Sendy Terms and Conditions</a>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--order infobar--item-bordered">
        <div class="">
          Order Number:
        </div>
        <div class="">
          Cost: KES
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--locations infobar--item-bordered">
        <div class="infobar--content infobar--item infobar--item-start">
          <div class="">
            <img class="carets" src="https://apptest.sendyit.com/biz/style3/comp/maroon_button.png" alt="Pickup" align="center"> <span class="">	Pickup:</span>
          </div>
          <div class="">
            <img class="carets" src="https://apptest.sendyit.com/biz/style3/comp/blue_button.png" alt="Drop Off" align="center"> <span class=""> Destination:</span>
          </div>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--status infobar--item-bordered">
        <div class="">
          Status:
        </div>
        <div class="">
          <span class="" v-if = "1==1">
            Estimated Arrival: <span class=""></span>
          </span>
          <span class="" v-else>
            Estimated Delivery: <span class=""></span>
          </span>
        </div>
      </div>
      <div class="infobar--content infobar--item infobar--actions">
        <div>
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
</template>

<script>
export default {
  name: 'info-window'
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
.infobar--actions-text
{
  font-size: 10px;
  font-weight: bold;
  padding-top: 4px;
}
.carets
{
  width: 10px;
  margin-right: 4px;
}
</style>
