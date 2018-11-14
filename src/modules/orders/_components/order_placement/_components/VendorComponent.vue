<template lang="html">
  <div class="vendorview--inner">
    <div class="">
      <div class="vendorview--title">
        What size load do you want delivered?
      </div>
      <div class="vendorview--size-selector">
        <div class="vendorview--size-option">
          <img src="https://cdn3.iconfinder.com/data/icons/box-and-shipping-supplies-icons/456/Box_Crate_With_Contents-512.png" alt="" class="vendorview--size-img">
          <div class="">Small</div>
        </div>
        <div class="vendorview--size-option">
          <img src="https://cdn3.iconfinder.com/data/icons/box-and-shipping-supplies-icons/456/Box_Crate_With_Contents-512.png" alt="" class="vendorview--size-img">
          <div class="">Medium</div>
        </div>
        <div class="vendorview--size-option">
          <img src="https://cdn3.iconfinder.com/data/icons/box-and-shipping-supplies-icons/456/Box_Crate_With_Contents-512.png" alt="" class="vendorview--size-img">
          <div class="">Large</div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="" v-for="n in 3">
        <div class="">
          Vendor Img
        </div>
        <div class="">
          Vendor Desc
        </div>
        <div class="">
          Amount
        </div>
        <div class="">
          Info
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
.vendorview--inner
{
  padding: 20px;
}
.vendorview--title
{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;
}
.vendorview--size-selector
{
  display: flex;
  justify-content: space-between;
}
.vendorview--size-img
{
  width: 40px;
}
.vendorview--size-option
{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
