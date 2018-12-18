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
import { mapActions, mapGetters } from "vuex";
import SessionMxn from "../../../mixins/session_mixin.js";

export default {
  mixins: [SessionMxn],
  data() {
    return {
      cop_name: "",
      phone: "",
      message: ""
    };
  },
  methods: {
    ...mapActions({
      requestSignUpSegmentation: "$_auth/requestSignUpSegmentation"
    }),
    ...mapGetters({
      Password: "$_auth/requestPassword",
      Email: "$_auth/requestEmail",
      Phone: "$_auth/requestPhone",
      Name: "$_auth/requestName"
    }),
    peer_set: function() {
      let values = {};
      values.name = this.Name();
      values.phone = this.Phone();
      values.email = this.Email();
      values.password = this.Password();
      values.type = "peer";
      console.log(values);
      let full_payload = {
        values: values,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "sign_up_submit"
      };

      let that = this;
      this.requestSignUpSegmentation(full_payload).then(
        response => {
          console.log(response);
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status == true) {
            console.log("Peer Account Created");
            console.log(response);

            let session_data = response.data;
            let json_session = JSON.stringify(session_data);
            this.setSession(json_session);
             if('default' in session_data){
                  let acc = session_data[session_data.default];

                  mixpanel.alias(acc.user_email);

                  mixpanel.people.set_once({
                      "$email":acc.user_email ,
                      "$phone": acc.user_phone ,
                      "Account Type": acc.default == 'peer'? 'Personal' : 'Business' ,
                      "$name": acc.user_name,
                      "$created": new Date(),
                      "Client Type" : "Web Platform",
                      "Business Name": acc.default == 'biz' ? acc.cop_name : '',
                  });

                  //login identify
                  mixpanel.identify(acc.user_email);

                  // track login
                  mixpanel.track("New Account Created", {
                      "Account Type": acc.default == 'peer'? 'Personal' : 'Business',
                      "Last Login":new Date(),
                      "Client Type" : "Web Platform",
                      "Business Name": acc.default == 'biz' ? acc.cop_name : '',
                      "$email":acc.user_email ,
                      "$phone": acc.user_phone ,
                      "$name": acc.user_name,
                  });
              }
            this.$store.commit("setSession", session_data);
            this.$router.push("/orders");
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
      if (this.cop_name != "") {
        let values = {};
        values.cop_name = this.cop_name;
        values.name = this.Name();
        values.phone = this.Phone();
        values.email = this.Email();
        values.password = this.Password();
        values.type = "biz";
        let full_payload = {
          values: values,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "sign_up_submit"
        };

        let that = this;

        this.requestSignUpSegmentation(full_payload).then(
          response => {
            console.log(response);
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status == true) {
              let session_data = response.data;
              console.log("session_data", session_data);
              let json_session = JSON.stringify(session_data);
              this.setSession(json_session);
              this.$store.commit("setSession", session_data);
              this.$router.push("/orders");
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
      } else {
        this.message = "Provide Business Name";
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
  font-family: "Rubik", sans-serif;
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

.btn-sign-up-check {
  /* bottom: 5px;
  position:absolute;
  left: 2px;
  width: 50px;
  font-size: 13px !important;
  border: #fff; */
  width: 28%;
  border-width: 0px !important;
}
.style-sign-btn {
  color: black !important;
  background-color: #ffffff !important;
  border: 1px solid #ffffff !important;
}
</style>
