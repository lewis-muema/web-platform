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
                   <li><a>Helpline: 0709 779 779</a></li>
                   <li><a>Hi Faith</a></li>
                   <li class="nav--menu-dropdown">
                       <a>Menu</a>
                       <ul>
                           <li><router-link class="" to="/orders">New Delivery</router-link></li>
                           <li><router-link class="" to="/payment">Payment</router-link></li>
                           <li><router-link class="" to="/transactions/order_history">Order History</router-link></li>
                           <li><router-link class="" to="/free_deliveries">Free Deliveries</router-link></li>
                           <li><router-link class="" to="/payment/promo">Promotions</router-link></li>
                           <li><router-link class="" to="/admin">Admin Settings</router-link></li>
                           <li><router-link class="" to="/analytics">Analytics</router-link></li>
                           <li><router-link class="" to="/profile">Profile</router-link></li>
                           <li><router-link class="" to="/auth/logout">Log Out</router-link></li>
                       </ul>
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
.header{
    top: 0px;
    color: #fff;
    background-color: #1782C5;
    z-index: 999;
    outline: none;
    /* box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); */
    width: 100%;
    margin: 0px auto;
    height: 68px;
    display: flex;
}
.header--item{
    display: flex;
    flex: 1;
}
.header--item__left, .header--item__right{
    display: flex;
}
.header--item__left{

}
.header--item__right{
    margin-right: 5em;
}
.logo{
    height: 50px;
    display: inline-flex;
    align-self: center;
    margin-left: 5em;
}

nav ul ul {
	display: none;
}

nav ul li:hover > ul {
	display: block;
}

nav ul {
	list-style: none;
    margin: unset;
}
nav ul:after {
	content: ""; clear: both; display: block;
}

nav ul li {
	float: left;
}
nav ul li:hover {
	background: #144e64;
}
nav ul li:hover ul{
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);

    font-size: 14px;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
}
nav ul li:hover a {
	color: #fff;
}

nav ul li a {
	display: block; padding: 25px 40px;
	color: #fff; text-decoration: none;
}

nav ul ul {
	background: #fff;
    border-radius: 0px;
    padding: 0;
	position: absolute;
    z-index: 100;
}
nav ul ul li {
	float: none;
    position: relative;
}
nav ul ul li:last-child{
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
}
nav ul ul li a {
	padding: 6px 30px;
    cursor: pointer;
    color: #555 !important;
}
nav ul ul li a:hover {
	background: #1782c5;
    color: #fff !important;
}

nav ul ul ul {
	position: absolute; left: 100%; top:0;
}
nav ul li .router-link-active{
    border-bottom: unset;
    cursor: auto;
    font-weight: 400;
    color: #144e64 !important;

}
.header__menuitem--active{
    font-weight: normal;
    color:#1782c5;
    cursor: auto;
}
.nav--menu-dropdown {
    float: right;
    width: 160px;
}
</style>
