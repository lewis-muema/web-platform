<template lang="html">
  <div id="log_in" class="log-item" >

      <div class="sign-inner">

          <div class="sign-top">
            Log in to Sendy
          </div>


          <div class="sign-in-button" @click="" id="sign-in-v2-logging-in-1">
          <img  class="sign-buttom__img"src="https://apptest.sendyit.com/biz/image/facebook_logo_white.png" > Continue with Facebook</span>
          </div>
          <div class="sign-text">
             or
          </div>

          <div>


            <div class="sign-holder dimen">
            	<span id="log_in_warn" class="sign-holder__error" >   </span>
            </div>
            <div class="sign-holder dimen">
              <input class="input-control sign-form" type="text" name="email" v-model="email" placeholder="Email or Phone Number" autocomplete="on">
            </div>

            <div class="sign-holder dimen">
              <input class="input-control sign-form" type="password" name="password" v-model="password" placeholder="Password">
            </div>

            <div class="sign-holder">
              <input class="button-primary" type="submit" value="Log in" id="login" v-on:click="sign_in" >
            </div>
            <div class=" sign-holder sign-forgot-pass sign-smaller">
              <router-link class="sign-holder__link" to="/auth/forgot_password">Forgot password?</router-link>
            </div>
            <div class="sign-holder sign-sign-up sign-smaller">
              Don't have an Account? <router-link class="sign-holder__link" to="/auth/sign_up">Sign Up</router-link>
            </div>
          </div>
      </div>
  </div>

</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    ...mapActions({
      requestSignIn: "$_auth/requestSignIn"
    }),
    eraseCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    setCookie: function(value) {
      let json_string_value = JSON.stringify(value);
      let expires = "";
      let days = 4;
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();

      document.cookie =
        "_sessionSnack" +
        "=" +
        (json_string_value || "") +
        expires +
        "; path=/";
    },
    sign_in: function() {
      //erase cookie on login just incase
      
      this.eraseCookie('_sessionSnack');

      let values = {};
      values.email = this.email;
      values.password = this.password;
      let full_payload = {
        values: values,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "sign_in/"
      };
      this.requestSignIn(full_payload).then(
        response => {
          console.log(response);
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status == true) {
            //set cookie
            //commit everything to the store
            //redirect to orders
            let session_data = response.data;
            console.log("session_data", session_data);

            this.setCookie(session_data);
            this.$store.commit("setSession", session_data);
            this.$router.push("/orders");
          } else {
            //failed to login
            //show some sort of error
            console.warn("login failed");
          }
        },
        error => {
          console.error("Check Internet Connection");
          console.log(error);
        }
      );
    }
  }
};
</script>

<style lang="css">
.log-item {
  text-align: center;
  border: 0px solid #ccc;
  margin: 5px;
}
.sign-inner {
  max-width: 22rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Helvetica Nueu", "Helvetica", "Arial", "sans-serif";
}
.sign-top {
  font-size: 1.3rem;
  line-height: 1.7em;
  font-weight: 500;
  text-align: center;
  color: #666;
}
.sign-in-button {
  width: 90%;
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
.sign-text {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: large;
  margin-bottom: 10px;
  text-align: center;
  color: #666;
}
.sign-holder {
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
.sign-smaller {
  font-size: 14px;
  color: #999999;
}
.sign-forgot-pass,
.sign-in-sign-up {
  text-align: center;
}
.sign-buttom__img {
  vertical-align: middle;
  width: 14px;
  padding-bottom: 3px;
  margin-right: 10px;
}
.sign-holder__link {
  color: #1782c5;
  text-decoration: none;
}
.dimen {
  width: 83%;
}
.sign-holder__pointer {
  cursor: pointer;
}
.sign-form {
  height: 42px !important;
  width: 110% !important;
}
</style>
