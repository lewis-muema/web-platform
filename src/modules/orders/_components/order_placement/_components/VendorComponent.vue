<template lang="html">
  <div class="vendorview--inner">
    <div class="">
      <div class="vendorview--title">
        What size load do you want delivered?
      </div>
      <div class="vendorview--size-selector">
        <div class="vendorview--size-option active" v-for="n in 3">
          <img src="https://cdn3.iconfinder.com/data/icons/box-and-shipping-supplies-icons/456/Box_Crate_With_Contents-512.png" alt="" class="vendorview--size-img">
          <div class="">Small</div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="vendor--option" v-for="n in 3">
        <div class="">
          <img src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX30644467.jpg" alt="" class="vendor--option-icon">
        </div>
        <div class="">
          3 Tonne Truck
        </div>
        <div class="">
          1234 <span>KES</span>
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
  padding: 20px 0px;
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
  cursor: pointer;
}
.vendor--option
{
  display: flex;
  margin: 10px 0px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 20px;
  cursor: pointer;
  justify-content: space-between;
  transition: border .5s ease-in-out;
  cursor: pointer;
}
.vendor--option-icon
{
  width: 40px;
  height: 20px;
}
.vendor--option:hover, .vendor--option-active
{
  transition: border .5s ease-in-out;
  border: 3px solid #1782c5;
}
.vendorview--size-option.active
{
  transform: scale(1.4,1.4);
  color: #1782c5;
}
</style>
