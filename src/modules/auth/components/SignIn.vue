<template lang="html">
  <div id="log_in" class="log-item" >

      <div class="sign-inner">

          <div class="sign-top">
            Log in to Sendy
          </div>


          <!-- <div class="sign-in-button" @click="" id="sign-in-v2-logging-in-1">
          <img  class="sign-buttom__img"src="https://apptest.sendyit.com/biz/image/facebook_logo_white.png" > Continue with Facebook</span>
          </div>
          <div class="sign-text">
             or
          </div> -->

          <p class="sign-in-error">
            {{message}}
          </p>

          <div v-on:keyup.enter="sign_in">


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
              <input class="button-primary sign-btn-color" type="submit" name="login_text" v-model="login_text" v-on:click="sign_in" >
            </div>
            <div class=" sign-holder sign-forgot-pass sign-smaller">
              <router-link class="sign-holder__link" to="/auth/forgot_password">Forgot password?</router-link>
            </div>
            <div class="sign-holder sign-sign-up sign-smaller">
              Don't have an Account? <router-link class="sign-holder__link" to="/auth/sign_up" >Sign Up</router-link>
            </div>
          </div>
      </div>
  </div>

</template>

<script>
import SessionMxn from "../../../mixins/session_mixin.js";
import { mapActions } from "vuex";
export default {
  name: "SignIn",
  mixins: [SessionMxn],

  data() {
    return {
      email: "",
      password: "",
      message: "",
      login_text: "Login",
      session_cookie: null
    };
  },
  methods: {
    ...mapActions({
      authSignIn: "$_auth/requestSignIn"
    }),
    sign_in: function() {
      if (this.email != "" && this.password != "") {
        this.login_text = "Logging in ...";
        //erase any existing session
        this.deleteSession();

        let params = {
          email: this.email,
          password: this.password
        };
        let full_payload = {
          values: params,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "sign_in/"
        };
        let that = this;

        this.authSignIn(full_payload).then(
          response => {
            console.log(response);
            //check when response is dual
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status == true) {
              //set session
              //commit everything to the store
              //redirect to orders
              let session_data = response.data;
              let json_session = JSON.stringify(session_data);
              this.setSession(json_session);
              this.$store.commit("setSession", session_data);
              this.$router.push("/orders");
            } else {
              //failed to login
              //show some sort of error
              this.login_text = "Login";
              this.message = response.data.reason;
              this.doNotification(
                2,
                "Login failed",
                "Login failed. Please try again"
              );
              console.warn("login failed");
            }
          },
          error => {
            this.login_text = "Login";
            this.message = "Check Internet Connection";
            console.error("Check Internet Connection");
            console.log(error);
          }
        );
      } else {
        this.message = "Provide all values";
      }
    },
    doNotification(level, title, message) {
      let notification = { title: title, level: level, message: message };
      this.$store.commit("setNotification", notification);
      this.$store.commit("setNotificationStatus", true);
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
.sign-in-error {
  color: #e08445;
  font-family: "Rubik", sans-serif;
}
.sign-btn-color {
  border-width: 0px !important;
}
</style>
