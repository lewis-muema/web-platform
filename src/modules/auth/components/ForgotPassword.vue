<template lang="html">
  <div id="forgot_pass"  class="log-item hiddenyy" >
    <div class="sign-inner">

        <div class="sign-top">
         Forgot your password?
        </div>
        <div class="reset-link-details" v-if="this.option == true">
         You have a pending password change request sent to your email awaiting your confirmation <a class="reset-pass-link" v-on:click="resend_link"> Resend?</a>
        </div>

        <p class="reset-link-details">
          {{message}}
        </p>

        <div>
          <div class="sign-holder">
          <span id="pass_change_info"></span>
          </div>
          <div class="sign-holder dimen">
            <input class="input-control forgot-form" type="text" v-validate="'required|email'"  name="email"  v-model="email" placeholder="Enter Email">
            <br>
            <span class="sign-up-email-error">{{ errors.first('email') }}</span>
          </div>

          <div class="" v-if="this.two_accnts == true">

            <span class="forgot-paswword-moreinfo">Looks like you have two accounts with us. Select one.</span>

             <div style="margin-top: 3%;">
            <el-radio v-model="radio" label="1">Business</el-radio>
            <el-radio v-model="radio" label="2">Peer</el-radio>
           </div>

          </div>

          <div class="sign-holder">
            <input class="button-primary" type="submit" value="Reset Password" v-on:click="request_pass" >
          </div>
          <div class=" sign-holder ">
            <router-link class="sign-holder__link" to="/auth/sign_in">Sign In</router-link>
          </div>

        </div>
    </div>
</div>
</template>

      <script>
      import {mapActions} from 'vuex'
      export default {
        data() {
          return {
            email: '',
            radio: '',
            two_accnts: false,
            option: false,
            nonce:'',
            message:''
          }
        },

        methods:{
           ...mapActions({
              requestForgotPassword :'$_auth/requestForgotPassword',
          }),
          resend_link:function() {
            console.log('Reset Password request');
            this.request_pass();


          },
          request_pass: function ()
          {
             console.log("Check check");
            let payload = {};

             // Check for one account
            if (this.two_accnts == false) {

              // If password reset request does not exist
              if (this.option == false) {

                let email = this.email;

                payload = {
                  email: email
                };

              }

              // If password reset request exist
              else if (this.option == true) {

                let email = this.email;
                let nonce = this.nonce;
                let resend = true;

                payload = {
                  email: email,
                  nonce: nonce,
                  resend: resend
                };
              }

            }

            // Check for two accounts
            else if (this.two_accnts == true) {
              let email = this.email;
              let nonce = this.nonce;
              let type = this.radio;

              payload = {
                email: email,
                nonce: nonce,
                type: type
              };

            }

            let full_payload = {
              values: payload,
              vm: this,
              app: "NODE_PRIVATE_API",
              endpoint: "forgot_pass"
            };

            this.requestForgotPassword(full_payload).then(
              response => {
              console.log(response);
              //check when response is dual
              if (response.length > 0) {
                response = response[0];
                }
                if (response.status == true) {

                   this.option = false ;
                   this.message = "Password change reset link has been sent to your email";
                   //Reset link set to user email.
                }
                else if (response.status == "stall") {
                  // Activate select account option
                   this.two_accnts = true ;
                   this.nonce = response.nonce;
                  //update nonce data

                }
               else if (response.status == false) {
                 //Account does not exist
                 console.log('Account does not exist');
                 this.message = "Account does not exist.Please sign-up to create a sendy account";

               }
               else if (response.status == "exists") {
                 //Existing password reset option
                 this.nonce = response.nonce;
                 this.option = true ;

               }
               else {

                  //Invalid request
                  console.log('Invalid Request');
               }

            }, error => {
                console.error("Check Internet Connection")
                console.log(error);
            });
          },
      },
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
.forgot-paswword-moreinfo{
    font-family: "Rubik", sans-serif;
    font-size: 14px;
}
.reset-pass-link{
  color: #1782c5;
  text-decoration: none;
}
.reset-link-details{
  margin: 1em;
  display: block;
  text-align: center;
  font-size: 13px;
  color: #e08445;
  font-family: "Rubik", sans-serif;
}
</style>
