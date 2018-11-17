<template lang="html">
    <div class="header">
        <div class="header--item">
            <div class="header--item__left">
                <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" alt="logo" class="logo">
            </div>
        </div>
        <div class="header--item__right">
            <nav>
               <ul>
                   <li class="nav--menu-inactive"><a>Helpline: 0709 779 779</a></li>
                   <li class="nav--menu-inactive"><a>Hi Faith</a></li>
                   <li class="nav--menu-dropdown-wrap">
                        <el-dropdown class="nav--menu-dropdown-title">
                        <span>Menu</span>
                        <el-dropdown-menu slot="dropdown" class="nav--menu-dropdown-list">
                            <el-dropdown-item><router-link  to="/orders">New Delivery</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/payment">Payment</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/transactions/order_history">Order History</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/free_deliveries">Free Deliveries</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/payment/promo">Promotions</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/admin">Admin Settings</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/analytics">Analytics</router-link></el-dropdown-item>
                            <el-dropdown-item><router-link  to="/user/profile/personal_information">Profile</router-link></el-dropdown-item>
                            <el-dropdown-item class="last-child"><router-link to="/auth/logout">Log Out</router-link></el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                </li>
               </ul>
              </nav>
        </div>
    </div>

</template>

<script>
export default {
    name : 'main-header'
}
</script>

<style lang="css">
    @import '../../assets/styles/internal_header.css';
</style>
