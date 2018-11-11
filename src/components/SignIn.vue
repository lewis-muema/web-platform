<template lang="html">
  <div id="log_in" class="log_item" >

      <div class="sign-up-v2-outer">

          <div class="sign-up-v2-for-sendy">
            Log in to Sendy
          </div>


          <div class="sign-up-v2-fb-button" @click="" id="sign-in-v2-logging-in-1">
          <img src="https://apptest.sendyit.com/biz/image/facebook_logo_white.png" > Continue with Facebook</span>
          </div>
          <div class="sign-up-v2-or">
             or
          </div>

          <div>


            <div class="sign-up-v2-holder dimen">
            	<span id="log_in_warn" class="error" >   </span>
            </div>
            <div class="sign-up-v2-holder dimen">
              <input class="form-control" type="text" name="logins" id="logins" placeholder="Email or Phone Number" autocomplete="on">
            </div>

            <div class="sign-up-v2-holder dimen">
              <input class="form-control" type="password" name="password" id="password" placeholder="Password">
            </div>

            <div class="sign-up-v2-holder">
              <input class="form-control" type="submit" value="Log in" id="login" @click="">
            </div>
            <div class=" sign-up-v2-holder sign-in-forgot-pass sign-in-smaller">
              <a class="sign-up-link" @click="">Forgot password?</a>
            </div>
            <div class="sign-up-v2-holder sign-in-sign-up sign-in-smaller">
              Don't have an Account? <a class="sign-up-link" @click="">Sign Up</a>
            </div>
          </div>
      </div>
  </div>

</template>

<script>
export default {
    name: 'SignIn'
}
</script>

<style lang="css">
.log_item{
text-align: center;
border: 0px solid #ccc;
margin: 5px;
}
.sign-up-v2-outer{
max-width: 22rem;
border: 1px solid #D8DFE6;
border-radius: 4px;
margin: 2rem auto;
padding: 2rem;
font-family: "Helvetica Nueu", "Helvetica", "Arial", "sans-serif";
}
.sign-up-v2-for-sendy{
font-size: 1.3rem;
line-height: 1.7em;
font-weight: 500;
text-align: center;
color: #666;
}
.sign-up-v2-fb-button{
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
.sign-up-v2-or{
padding-top: 5px;
padding-bottom: 5px;
font-size: large;
margin-bottom: 10px;
text-align: center;
color: #666;
}
.sign-up-v2-holder{
margin: 1em;
display: block;
}
.form-control {
 display: block;
 width: 100%;
 height: 34px;
 padding: 6px 12px;
 font-size: 14px;
 line-height: 1.42857143;
 color: #555;
 background-color: #fff;
 background-image: none;
 border: 1px solid #ccc;
 border-radius: 4px;
 -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
 box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
 -webkit-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
 transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
.sign-up-v2-holder input:not([type="checkbox"]) {
 width: 100%;
}
.sign-up-v2-holder .form-control {
 -webkit-box-shadow: none;
 -moz-box-shadow: none;
 box-shadow: none;
 height: 30px;
}
.sign-up-v2-holder input[type="submit"] {
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
.sign-in-smaller {
 font-size: 14px;
 color: #999999;
}
.sign-in-forgot-pass, .sign-in-sign-up {
 text-align: center;
}
.sign-up-v2-fb-button img {
 width: 14px;
 padding-bottom: 3px;
 margin-right: 10px;
}
img {
 vertical-align: middle;
}
.forgot-pass-link{
color: #1782c5;
}
.sign-up-link{
color: #1782c5;
}
.dimen{
width: 83%;
}
</style>
