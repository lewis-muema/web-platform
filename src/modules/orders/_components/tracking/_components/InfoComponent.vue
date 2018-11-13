<template lang="html">
  <div class="infobar--outer">
    <div class="infobar--content">
      <div class="infobar--photo">
        <img class="rimg" :src="'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/' + placeholder">
      </div>
      <div class="infobar--driver">

      </div>
      <div class="infobar--order">

      </div>
      <div class="infobar--locations">

      </div>
      <div class="infobar--status">

      </div>
      <div class="infobar--actions">
        <div>
          <div>
            <a href="#"  class="" ><img class="" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/free_delivery.png"></a>
          </div>
          <div>
            Free delivery
          </div>
        </div>
        <div>
          <div>
            <a href="#"><img class="tracking-action-img" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/share_delivery.png"></a>
          </div>
          <div>
            Share Status
          </div>
        </div>
        <div>
          <div>
             <a href="#"><img class="tracking-action-img" src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/tracking/cancel_order.png"></a>
          </div>
          <div>
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
  flex: 1;
  padding: 15px 0;
}
.infobar--actions
{
  flex-direction: row;
  padding: 0 1rem;
  text-transform: uppercase;
}
.infobar--actions img
{
  display: block;
  text-align: center;
  width: 52px;
  height: 52px;
  margin: 0 auto;
}
</style>
