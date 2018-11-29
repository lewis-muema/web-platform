<template lang="html">
  <div id="log_in" class="sign-up-verification" >

      <div class="sign-up-verification-inner">

          <div class="sign-up-verification-top">
            Do you work for a Business?
          </div>

          <div class="sign-up-verification-text">
          We'd like to offer you the best experience possible. <br> We'll create a dedicated account for you.
          </div>

          <p class="sign-up-error">
            {{message}}
          </p>

          <div>

            <div class="sign-up-verification-holder dimen-sign-up2">
            	<span id="log_in_warn" class="sign-up-verification-holder__error" >   </span>
            </div>
            <div class="sign-up-verification-holder dimen-sign-up2">
              <input class="input-control sign-form" type="text" name="cop_name" v-model="cop_name" placeholder="Business name" autocomplete="on">
            </div>

            <div class="sign-up-verification-holder" style="display:flex;justify-content: space-between;">
              <input class="button-primary btn-sign-up-check style-sign-btn" type="submit" value="No"  v-on:click="peer_set" >

              <input class="button-primary btn-sign-up-check" type="submit" value="Done"  v-on:click="cop_set"  >
            </div>

          </div>
      </div>
  </div>

</template>

<script>
import { mapActions,mapGetters } from "vuex";
export default {
  data() {
    return {
      cop_name: "",
      phone:"",
      message:""
    };
  },
  methods: {
    ...mapActions({
      requestPeerSignUp: "$_auth/requestPeerSignUp",
      requestCopSignUp: "$_auth/requestCopSignUp"
    }),
    getCookie: function() {
      var nameEQ = "_sessionSnack" + "=";
      var ca = document.cookie.split(";");
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
        }
        this.session_cookie = c.substring(nameEQ.length, c.length);
        return c.substring(nameEQ.length, c.length);
      }
      this.session_cookie = null;
      return null;
    },
    setCookie: function(value) {
      console.log("setting cookie", value);
      return new Promise((resolve, reject) => {
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

        //do a while to check if the cookie has been set
        //resolve when set
        this.getCookie();
        console.log("session_cookie", this.session_cookie);

        while (this.session_cookie == null) {
          console.log("cookie is still", this.session_cookie);
          setTimeout(this.getCookie, 1000);
        }
        resolve(true);
      });
    },
    ...mapGetters({
       Password :'$_auth/requestPassword',
       Email :'$_auth/requestEmail',
       Phone :'$_auth/requestPhone',
       Name :'$_auth/requestName'
   }),
    peer_set: function() {
      let values = {};
      values.name = this.Name();
      values.phone = this.Phone();
      values.email = this.Email();
      values.password = this.Password();
      values.type='peer';
      console.log(values);
      let full_payload = {
        values: values,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "sign_up_submit"
      };

      let that = this;
      this.requestPeerSignUp(full_payload).then(
        response => {
          console.log(response);
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status == true) {
             console.log("Peer Account Created")
             console.log(response);

             let session_data = response.data;

             that.setCookie(session_data).then(res => {
               console.log("sessionSnack Now", this.getCookie());

               that.$store.commit("setSession", session_data);
             console.log("session_data", session_data);
             //this.setCookie(session_data);
             this.$store.commit("setSession", session_data);
             //this.$ls.set('_sessionLocalSnack', session_data);

            this.$router.push("/orders");
            });
          } else {
            //failed to login
            //show some sort of error
            console.log(response);
            console.warn("Sign Up Verification failed");
          }
        },
        error => {
          console.error("Check Internet Connection");
          console.log(error);
        }
      );
    },
    cop_set: function() {
      if (this.cop_name != '') {

        let values = {};
        values.cop_name = this.cop_name;
        values.name = this.Name();
        values.phone = this.Phone();
        values.email = this.Email();
        values.password =this.Password();
        values.type = 'biz';
        let full_payload = {
          values: values,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "sign_up_submit"
        };

        let that = this;

        this.requestCopSignUp(full_payload).then(
          response => {
            console.log(response);
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status == true) {

              let session_data = response.data;
              console.log("session_data", session_data);

              //this.setCookie(session_data);
              that.setCookie(session_data).then(res => {
                console.log("sessionSnack Now", this.getCookie());
              this.$store.commit("setSession", session_data);
              //this.$ls.set('_sessionLocalSnack', session_data);
              console.log("Cop account created");
              console.log(response);
              this.$router.push("/orders");
              });
            } else {
              //failed to login
              //show some sort of error
              console.log(response);
              console.warn("Sign Up failed");
            }
          },
          error => {
            console.error("Check Internet Connection");
            console.log(error);
          }
        );

      }

      else{

        this.message = "Provide Business Name"
      }

    }
  }
};
</script>

<style lang="css">
.sign-up-verification {
  text-align: center;
  border: 0px solid #ccc;
  margin: 5px;
}
.sign-up-verification-inner {
  max-width: 27rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Rubik', sans-serif;
  margin-top: 7%;
}
.sign-up-verification-top {
  font-size: 1.3rem;
  line-height: 2.7em;
  font-weight: 400;
  text-align: center;
  color: #666;
}

.sign-up-verification-text {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: medium;
  margin-bottom: 10px;
  text-align: center;
  color: #666;
}
.sign-up-verification-holder {
  margin: 1em;
  display: block;
}

.sign-up-verification-holder .sign-up-verification-holder__input {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  height: 30px;
}

.dimen-sign-up2 {
  width: 83%;
}

.btn-sign-up-check{
  /* bottom: 5px;
  position:absolute;
  left: 2px;
  width: 50px;
  font-size: 13px !important;
  border: #fff; */
  width:28%;
}
.style-sign-btn{
  color: black !important;
  background-color: #ffffff !important;
  border: 1px solid #ffffff !important;
}
</style>
