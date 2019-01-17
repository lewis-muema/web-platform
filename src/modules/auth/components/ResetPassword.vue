<template lang="html">
  <div class="log_cont">

<!-- <div align="center" style="margin-bottom:0px;"><img src="https://app.sendyit.com/biz/image/logo.png" height="60px;"  style="margin-bottom:10px;" />  </div> -->
<div class="change_cont" id="change_con">

  <div class="log-item " id="forgot_pass" >

<p>&nbsp;</p>
  <p style="font-size:17px;"> Enter new password </p>
  <p style="color:#F90; height:20px;" id="pass_change_info"></p>
  <p class="sign-up-error">
    {{message}}
  </p>
  <div style=" margin:0px auto; ">
  <div class="reset-form">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">

  <tr>
    <td align="center">
    <input class="form__input form__longyy"  placeholder="New Password" type="password" v-model="new_password" name="new_password" /></td>
  </tr>
  <tr>
    <td align="center">
    <input class="form__input form__longyy"  placeholder="Confirm New Password" type="password" v-model="confirm_password"  name="confirm password" />
    </td>
  </tr>

  <tr>
    <td align="center"><input type="submit" class="btn btn-primary" style="font-size:14px;  width:310px; margin-top:10px;" value="Change Password" v-on:click="reset_pass" v-bind:disabled="!this.is_valid" /></td>
  </tr>
</table>

</div>
  </div>
  <p>&nbsp;</p>
<p> </p>
<p>&nbsp;</p>
</div>

</div>

</div>

</template>

<script>
import { mapActions } from "vuex";
import SessionMxn from "../../../mixins/session_mixin.js";

export default {
  mixins: [SessionMxn],
  data() {
    return {
      message: "",
      new_password: "",
      confirm_password: ""
    };
  },
  mounted() {
    this.check_content();
  },
  methods: {
    ...mapActions({
      requestResetPassword: "$_auth/requestResetPassword",
      requestCheckToken: "$_auth/requestCheckToken"
    }),
    check_content: function() {
      let token = this.$route.params.content;

      let values = {};
      values.token = token;
      let full_payload = {
        values: values,
        vm: this,
        app: "NODE_PRIVATE_API",
        endpoint: "forgot_token"
      };
      this.requestCheckToken(full_payload).then(
        response => {
          // console.log(response);
          if (response.length > 0) {
            response = response[0];
          }
          //code 001 -token user_id
          // code 002 -token does
          if (response.status == true) {
            // console.log(response);
            // console.log("Valid Token");
          } else {
            // console.warn("Invalid Token");
            this.doNotification(
              2,
              "Invalid Link",
              "Invalid Password Reset Link. Redirected to Login Page"
            );
            this.$router.push("/auth");
          }
        },
        error => {
          console.error("Check Internet Connection");
          console.log(error);
        }
      );
    },
    reset_pass: function() {
      if (this.new_password !== this.confirm_password) {
        console.log("Password does not match!");
        this.doNotification(
          2,
          "Password Failed",
          "Password does not match. Please try again"
        );
      } else {
        let payload = {};
        payload.password = this.new_password;
        payload.token = this.$route.params.content;

        let full_payload = {
          values: payload,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "update_pass"
        };
        var that = this;
        this.requestResetPassword(full_payload).then(
          response => {
            if (response.length > 0) {
              response = response[0];
            }
            console.log("Update Password", response);
            if (response.status == true) {
              let session_data = response.data;
              let json_session = JSON.stringify(session_data);
              this.setSession(json_session);
              this.$store.commit("setSession", session_data);
              this.$router.push("/orders");
            } else {
              console.warn("Password Fail");
              this.doNotification(
                2,
                "Password Reset Failed",
                "Password Reset failed. Please try again"
              );
              // this.$router.push("/auth");
            }
          },
          error => {
            console.error("Check Internet Connection");
            this.message = "Login failed";
            console.log(error);
          }
        );
      }
    },
    doNotification(level, title, message) {
      let notification = { title: title, level: level, message: message };
      this.$store.commit("setNotification", notification);
      this.$store.commit("setNotificationStatus", true);
    }
  },
  computed: {
    is_valid: function() {
      return this.confirm_password != "" && this.new_password != "";
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
.form__longyy {
  max-width: 300px !important;
  margin-top: 5px !important;
  margin-bottom: 15px !important;
  margin-left: 0px;
  width: 300px;
  height: 30px;
  font-size: 13px;
  margin-right: 27%;
}
.form__input {
  padding: 5px;
  display: block;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn {
  display: inline-block;
  padding: 10px 30px;
  margin-bottom: 0;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}
.btn-primary {
  color: #fff;
  background-color: #1782c5;
  border-color: #357ebd;
  margin-right: 27%;
}
.form__input:focus {
  border-color: #1782c5;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.reset-form {
  margin-left: 23%;
}
</style>
