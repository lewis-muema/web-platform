<template lang="html">
  <div class="log_cont">
    <div
      id="change_con"
      class="change_cont"
    >
      <div
        id="forgot_pass"
        class="log-item "
      >
        <p>&nbsp;</p>
        <p class="reset-pass-text">
          Enter new password
        </p>
        <p
          id="pass_change_info"
          class="reset-pass-inner-text"
        />
        <p class="sign-up-error">
          {{ message }}
        </p>
        <div class="reset-pass-cntxt">
          <div class="reset-form">
            <table class="reset-pass-new-pass">
              <tr>
                <td align="center">
                  <input
                    v-model="new_password"
                    class="form__input form__longyy"
                    placeholder="New Password"
                    type="password"
                    name="new_password"
                  >
                </td>
              </tr>
              <tr>
                <td align="center">
                  <input
                    v-model="confirm_password"
                    class="form__input form__longyy"
                    placeholder="Confirm New Password"
                    type="password"
                    name="confirm password"
                  >
                </td>
              </tr>

              <tr>
                <td align="center">
                  <input
                    type="submit"
                    class="btn btn-primary reset-pass-input"
                    value="Change Password"
                    :disabled="!this.is_valid"
                    @click="reset_pass"
                  >
                </td>
              </tr>
            </table>
          </div>
        </div>
        <p>&nbsp;</p>
        <p />
        <p>&nbsp;</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin.js';

export default {
  mixins: [SessionMxn],
  data() {
    return {
      message: '',
      new_password: '',
      confirm_password: '',
    };
  },
  mounted() {
    this.check_content();
  },
  methods: {
    ...mapActions({
      requestResetPassword: '$_auth/requestResetPassword',
      requestCheckToken: '$_auth/requestCheckToken',
    }),
    check_content() {
      const token = this.$route.params.content;

      const values = {};
      values.token = token;
      const full_payload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'forgot_token',
      };
      this.requestCheckToken(full_payload).then(
        (response) => {
          // console.log(response);
          if (response.length > 0) {
            response = response[0];
          }
          // code 001 -token user_id
          // code 002 -token does
          if (response.status) {
            // console.log(response);
            // console.log("Valid Token");
          } else {
            // console.warn("Invalid Token");
            this.doNotification(
              2,
              'Invalid Link',
              'Invalid Password Reset Link. Redirected to Login Page',
            );
            this.$router.push('/auth');
          }
        },
        (error) => {
          this.message = 'Check Internet Connection';
        },
      );
    },
    reset_pass() {
      if (this.new_password !== this.confirm_password) {
        this.doNotification(2, 'Password Failed', 'Password does not match. Please try again');
      } else {
        const payload = {};
        payload.password = this.new_password;
        payload.token = this.$route.params.content;

        const full_payload = {
          values: payload,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_pass',
        };
        const that = this;
        this.requestResetPassword(full_payload).then(
          (response) => {
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status) {
              const session_data = response.data;
              const json_session = JSON.stringify(session_data);
              this.setSession(json_session);
              this.$store.commit('setSession', session_data);
              this.$router.push('/orders');
            } else {
              this.doNotification(
                2,
                'Password Reset Failed',
                'Password Reset failed. Please try again',
              );
              // this.$router.push("/auth");
            }
          },
          (error) => {
            this.message = 'Login failed';
          },
        );
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.$store.commit('setNotification', notification);
      this.$store.commit('setNotificationStatus', true);
    },
  },
  computed: {
    is_valid() {
      return this.confirm_password !== '' && this.new_password !== '';
    },
  },
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
.reset-pass-new-pass{
  width:100%;
  border:0px;
  cellspacing :0px;
  cellpadding :0px;
}
.reset-pass-inner-text{
  color:#F90;
  height:20px;
}
.reset-pass-text{
  font-size:17px;
}
.reset-pass-cntxt{
  margin:0px auto;
}
.reset-pass-input{
  font-size:14px;
  width:310px;
  margin-top:10px;
}
</style>
