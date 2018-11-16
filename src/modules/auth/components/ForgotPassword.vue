<template lang="html">
  <div id="forgot_pass"  class="log-item hiddenyy" >
    <div class="sign-inner">

        <div class="sign-top">
         Forgot your password?
        </div>
        <div>
          <div class="sign-holder">
          <span id="pass_change_info"></span>
          <!-- <div id="sms_send" class="hidden">
            Click <a id="send_text">here</a> to send reset instructions via sms
          </div> -->
          </div>
          <div class="sign-holder dimen">
            <input class="input-control forgot-form" type="text" name="credentials" id="forgot_cred" placeholder="Email or Phone Number">
          </div>
           <!-- <div id="extra_email_f" class="hidden">
              <div  class="sign-up-v2-holder ">
	         	<span>Looks like you have two accounts with us. Select one.</span>
	         </div>
	         <div class="sign-up-v2-holder forgot-radio-left">
	         	<input type="radio" id="extra_email_1"     name="who"   value="biz" /> Business
	         </div>
	         <div class="sign-up-v2-holder forgot-radio-right">
	         	<input type="radio" id="extra_email_2"     name="who"  value="pers" /> Personal
	         </div>
          </div> -->
          <div class="sign-holder">
            <input class="btn-submit" type="submit" value="Reset Password" id="reset" @click="" >
          </div>
          <div class=" sign-holder ">
            <router-link class="sign-holder__link" to="/auth/sign_in">Sign In</router-link>
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
.sign-top{
font-size: 1.3rem;
line-height: 1.7em;
font-weight: 500;
text-align: center;
color: #666;
}
.sign-holder{
margin: 1em;
display: block;
}
.sign-holder input:not([type="checkbox"]) {
 width: 100%;
}
.sign-holder .sign-holder__input {
 -webkit-box-shadow: none;
 -moz-box-shadow: none;
 box-shadow: none;
 height: 30px;
}
.sign-holder input[type="submit"] {
 background-color: #1782c5;
 color: #fff;
 letter-spacing: 1.1px;
 font-weight: inherit;
 padding: 6px;
 height: 42px;
 border: 1px solid #1782c5;
 text-transform: uppercase;
 font-size: medium;
}
.dimen{
width: 83%;
}
.sign-holder__link{
color: #1782c5;
text-decoration:none;
}
.forgot-form{
  height:42px!important;
  width: 110%!important;
}
</style>
