<template lang="html">
  <div id="log_in" class="log-item" >

 <div id="sign-up-v2-container" class="sign-inner">

  <div class="sign-text">
    Sign up for Sendy
  </div>

  <!-- <div class="sign-button" onclick="" id="sign-in-v2-logging-in-1">
  <img class="sign-buttom__img" src="https://apptest.sendyit.com/biz/image/facebook_logo_white.png" > Continue with Facebook</span>
  </div>
  <div class="sign-text">
     or
  </div> -->

  <p class="sign-up-error">
    {{message}}
  </p>

  <div>

    <div class="sign-holder dimen">
      <input class="input-control sign-up-form" type="text" name="name" v-model="name" placeholder="Your Name" value="">
    </div>

    <div class="sign-holder dimen">
      <input class="input-control sign-up-form" v-validate="'required|email'"  type="email" name="email" v-model="email" placeholder="Your Email" value="">
      <br>
      <span class="sign-up-email-error">{{ errors.first('email') }}</span>
    </div>


    <div class="sign-holder dimen">
      <vue-tel-input class="input-control sign-up-form" v-model="phone" name="phone" value="" @onBlur="validate_phone" v-validate="'required|check_phone'" data-vv-validate-on="blur"
               :preferredCountries="['ke', 'ug', 'tz']">
      </vue-tel-input>
      <span v-show="errors.has('phone')" class="sign-up-phone-error">{{ errors.first('phone') }}</span>
    </div>
    <div class="sign-holder dimen" id="outer_u_pass">
  <span >
        <input class="input-control sign-up-form" type="password" name="password" v-model="password" placeholder="Password">
  </span
    </div>

    <div class="sign-holder" style="text-align:center;">
      <input  type="checkbox" name="u_terms" v-model="u_terms" class="hiddeny">
      <span class="sign-holder__smaller">
          By creating a Sendy account you’re agreeing to the <a class=" sign-holder__grey" href="https://sendyit.com/terms/show">terms and conditions</a>
      </span>
    </div>
    <div class="sign-holder">
      <input class="button-primary signup-submit" type="submit" name="sign_up_text" aria-invalid="false" v-model="sign_up_text" id="signup" v-on:click="sign_up" v-bind:disabled="!this.is_valid">
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
import {mapMutations,mapActions} from 'vuex'

export default {
  name: "SignUp",
  data() {
    return {
      name: "",
      phone: "",
      email: "",
      password: "",
      u_terms:"",
      sign_up_text:"Sign Up",
      message:""
    };
  },
  methods: {
    validate_phone(){
      this.$validator.validate();
    },
    ...mapMutations(
      {
        setPassword:'$_auth/setPassword',
        setPhone:'$_auth/setPhone',
        setEmail:'$_auth/setEmail',
        setName:'$_auth/setName'
      }
    ),
    ...mapActions({
       requestSignUpCheck :'$_auth/requestSignUpCheck',
   }),
   sign_up: function() {
     let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
     let phone_valid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
     let email_valid = true
     for (var i = 0; i < this.errors.items.length; i++) {
       if (this.errors.items[i].field == 'email') {
         email_valid = false
         break
       }
     }
      // console.log(email_valid);
      if (phone_valid == true && email_valid == true) {

        if(this.u_terms == true) {

          let values = {};
          values.phone = this.phone;
          values.email = this.email;
          let full_payload = {
            values: values,
            vm: this,
            app: "NODE_PRIVATE_API",
            endpoint: "sign_up_check"
          };
          this.requestSignUpCheck(full_payload).then(
            response => {
              console.log(response);
              if (response.length > 0) {
                response = response[0];
              }
              if (response.status == true) {
                console.log(response);
                this.setName(this.name);
                this.setEmail(this.email);
                this.setPhone(this.phone);
                this.setPassword(this.password);
                this.$router.push("/auth/sign_up_verification");
              } else {

                this.message = response.data.reason;
                console.warn("Sign Up Failed");
              }
            },
            error => {
              console.error("Check Internet Connection");
              console.log(error);
            }
          );
        }
        else {
               this.message = 'Agree to Terms and Conditions';
               console.log("Agree Terms and Condition")
        }

      }
        else{
              this.message = 'Provide valid Email ';
        }

   }
  },
  computed : {
    is_valid : function() {
      return this.name != '' && this.email != '' && this.phone !=''&& this.password != '' && this.u_terms !='';
    },
  },

}
</script>

<style lang="css">

@import '../../../../node_modules/vue-tel-input/dist/vue-tel-input.css';

#sign-up-v2-container > div:nth-child(3) > div:nth-child(3) > div > div > ul {
    z-index: 9;
    width: 320px;
    margin-top: 9px;
    margin-left: -15px;
}

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
.sign-up-error{
  color: #e08445;
  font-family: 'Rubik', sans-serif;
}
.sign-up-email-error{
 margin-right: 45%;
 font-size: 13px;
 font-family: 'Rubik', sans-serif;
 color: #e08445;
}
.sign-up-phone-error{
 margin-right: 42%;
 font-size: 13px;
 font-family: 'Rubik', sans-serif;
 color: #e08445;
}
.signup-submit{
  width: 110% !important;
}
</style>
