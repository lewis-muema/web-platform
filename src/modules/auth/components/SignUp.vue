<template lang="html">
  <div id="log_in" class="log-item" >

 <div id="sign-up-v2-container" class="sign-inner">

  <div class="sign-text">
    Sign up for Sendy
  </div>

  <div class="sign-button" onclick="" id="sign-in-v2-logging-in-1">
  <img class="sign-buttom__img" src="https://apptest.sendyit.com/biz/image/facebook_logo_white.png" > Continue with Facebook</span>
  </div>
  <div class="sign-text">
     or
  </div>

  <div>

    <div class="sign-holder dimen">
      <input class="input-control sign-up-form" type="text" name="contact1" id="u_contact1" placeholder="Your Name" value="">
    </div>

    <div class="sign-holder dimen">
      <input class="input-control sign-up-form" type="email" name="u_email" id="email" placeholder="Your Email" value="">
    </div>
    <div class="sign-holder dimen">
      <input class="input-control sign-up-form" type="tel" placeholder="Phone Number" name="u_phone" id="phone_num" value="">
    </div>
    <div class="sign-holder dimen" id="outer_u_pass">
  <span >
        <input class="input-control sign-up-form" type="password" name="u_pass" id="u_pass" placeholder="Password">
  </span>
    </div>

    <div class="sign-holder" style="text-align:center;">
      <input  type="checkbox" checked name="u_terms" id="u_terms" class="hiddeny">
      <span class="sign-holder__smaller">
          By creating a Sendy account you’re agreeing to the <a class=" sign-holder__grey" href="https://sendyit.com/terms/show">terms and conditions</a>
      </span>
    </div>
    <div class="sign-holder">
      <input class="button-primary" type="submit" value="Sign Up" id="signup" onclick="" >
    </div>

    <div class=" sign-holder sign-forgot-pass sign-smaller">
     Do you already have an account? <router-link class="sign-holder__link" to="/auth/sign_in">Login</router-link>
    </div>
    <div class=" sign-holder sign-forgot-pass sign-smaller driver-sign-up">
      Want to drive for Sendy? <a class="sign-holder__link2" href="https://partner.sendyit.com/onboarding_portal/">Click here</a>
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
.log-item{
  text-align: center;
  border: 0px solid #ccc;
  margin: 5px;
}
.sign-inner{
 max-width: 22rem;
 border: 1px solid #D8DFE6;
 border-radius: 4px;
 margin: 2rem auto;
 padding: 2rem;
 font-family: "Helvetica Nueu", "Helvetica", "Arial", "sans-serif";
}
.sign-text{
 font-size: 1.3rem;
 line-height: 1.7em;
 font-weight: 500;
 text-align: center;
 color: #666;
 padding-top: 5px;
 padding-bottom: 5px;
 font-size: large;
 margin-bottom: 10px;
}
.sign-button{
 width: 91.9%;
 margin: 1em;
 background-color: #30487b;
 color: #fff;
 padding-top: 10px;
 padding-bottom: 10px;
 font-size: initial;
 letter-spacing: 1.1px;
 border-radius: 5px;
 text-align: center;
 cursor: pointer;
}
.sign-holder{
 margin: 1em;
 display: block;
}
 .sign-holder input:not([type="checkbox"]) {
   width: 100%;
}
.sign-holder .form-control{
   -webkit-box-shadow: none;
   -moz-box-shadow: none;
   box-shadow: none;
   height: 30px;
}
.sign-smaller {
   font-size: 14px;
   color: #999999;
}
.sign-forgot-pass, .sign-sign-up {
   text-align: center;
}
.sign-buttom__img{
 vertical-align: middle;
 width:14px;
 padding-bottom: 3px;
 margin-right: 10px;
}
.sign-holder__link{
 color: #1782c5;
 text-decoration: none;
}
.sign-holder__link2{
 color: #555454;
 text-decoration: none;
}
.dimen{
  width: 83%;
}
.sign-holder__grey{
  color: #555454;
}
.sign-holder__smaller {
    font-size: 13px;
    color: #999999;
}
.sign-up-form{
  height:42px!important;
  width: 110%!important;
}
</style>
