<template lang="html">
  <div class="">
    <div class="paytitle">
      Top up your sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon">
        <img src="https://cdn0.iconfinder.com/data/icons/shopping-and-ecommerce-1/38/Shopping_icons_1_Converted-09-512.png" alt="">
      </div>
      <div class="payinfo--balance">
        Balance <span class="payinfo--balance-el">250</span>Ksh
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'account-balance'
}
</script>

<style lang="css">
.payinfo
{
  display: flex;
}
.paytitle
{
  display: flex;
  flex: 2;
  align-items: center;
}
.payinfo
{
  display: flex;
  justify-content: space-between;
  flex: 1;
}
.payinfo--icon
{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.payinfo--icon img
{
  width: 25px;
}
.payinfo--balance
{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
}
.payinfo--balance-el
{
  padding: 0px 5px;
}
</style>
