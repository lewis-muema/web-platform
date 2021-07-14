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
          {{ $t('resetPassword.new_password') }}
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
                    :placeholder="$t('resetPassword.new_pass')"
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
                    :placeholder="$t('resetPassword.confirm_new_password')"
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
                    :value="$t('resetPassword.change_password')"
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
import {
  mapActions,
} from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      message: '',
      new_password: '',
      confirm_password: '',
    };
  },
  computed: {
    is_valid() {
      return this.confirm_password !== '' && this.new_password !== '';
    },
  },
  mounted() {
    this.check_content();
  },
  methods: {
    ...mapActions({
      requestResetPassword: '$_auth/requestResetPassword',
      requestCheckToken: '$_auth/requestCheckToken',
      authNewSignIn: '$_auth/requestSignIn',
    }),
    check_content() {
      const token = this.$route.params.content;

      const values = {};
      values.token = token;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'forgot_token',
      };
      this.requestCheckToken(fullPayload).then(
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
              this.$t('resetPassword.invalid_link'),
              this.$t('resetPassword.invalid_reset_link'),
            );
            this.$router.push('/auth');
          }
        },
        (error) => {
          this.message = this.$t('resetPassword.reset_password_failed');
        },
      );
    },
    reset_pass() {
      if (this.new_password !== this.confirm_password) {
        this.doNotification(2, this.$t('resetPassword.password_failed'), this.$t('resetPassword.password_not_match'));
      } else {
        const payload = {};
        payload.password = this.new_password;
        payload.token = this.$route.params.content;

        const fullPayload = {
          values: payload,
          vm: this,
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'auth/reset-password',
        };
        const that = this;
        this.requestResetPassword(fullPayload)
          .then((response) => {
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status) {
              this.doNotification(
                1,
                this.$t('resetPassword.password_reset_successful'),
                this.$t('resetPassword.password_reset_successful_text'),
              );
              setTimeout(() => {
                this.$router.push('/auth');
              }, 4000);
            } else {
              this.doNotification(
                2,
                this.$t('resetPassword.password_reset_failed'),
                this.$t('resetPassword.password_reset_failed_text'),
              );
              // this.$router.push("/auth");
            }
          })
          .catch((err) => {
            const e = {
              ...err,
            };
            this.doNotification(
              2,
              this.$t('resetPassword.password_reset_failed'),
              e.response.data.message,
            );
          });
      }
    },
    handleNewSession(email, pass) {
      this.deleteSession();
      const params = {
        email,
        password: pass,
      };
      const fullPayload = {
        values: params,
        app: 'NODE_PRIVATE_API',
        endpoint: 'sign_in',
      };
      this.authNewSignIn(fullPayload).then(
        (response) => {
          if (Object.prototype.hasOwnProperty.call(response, 'status')) {
            const errorResponse = response.data;
            if (errorResponse.code === 1) {
              this.doNotification(2, this.$t('resetPassword.login_attempt_failed'), '');
            } else {
              this.doNotification(2, this.$t('resetPassword.login_attempt_failed'), this.$t('resetPassword.account_deactivated'));
            }
          } else {
            try {
              if (response) {
                const refreshToken = response.refresh_token;
                const accessToken = response.access_token;
                // eslint-disable-next-line max-len
                // TODO change from using local storage as session trust store. malicious js will read the data
                localStorage.setItem('jwtToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                const partsOfToken = accessToken.split('.');
                const middleString = partsOfToken[1];
                const data = atob(middleString);
                const {
                  payload,
                } = JSON.parse(data);

                // set session
                // commit everything to the store
                // redirect to orders

                const sessionData = payload;
                const jsonSession = JSON.stringify(sessionData);
                this.setSession(jsonSession);
                this.$store.commit('setSession', sessionData);
                let analyticsEnv = '';
                try {
                  analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
                } catch (er) {
                  // ...
                }
                if ('default' in sessionData && analyticsEnv === 'production') {
                  const acc = sessionData[sessionData.default];

                  mixpanel.people.set_once({
                    $email: acc.user_email,
                    $phone: acc.user_phone,
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    $name: acc.user_name,
                    'Client Type': 'Web Platform',
                  });

                  // login identify
                  mixpanel.identify(acc.user_email);

                  // track login
                  mixpanel.track('User Login', {
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    'Last Login': new Date(),
                    'Client Type': 'Web Platform',
                  });
                }
                this.doNotification(
                  1,
                  this.$t('resetPassword.password_reset_successful'),
                  this.$t('resetPassword.password_reset_successful_text'),
                );
                setTimeout(() => {
                  this.$router.push('/orders');
                }, 5000);
              }
            } catch (error) {
              // @todo Log the error (central logging)
            }
          }
        },
        (error) => {
          this.doNotification(2, this.$t('resetPassword.login_failed'), this.$t('resetPassword.login_failed_text'));
        },
      );
    },
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
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
  background-color: #1782C5;
  border-color: #357ebd;
  margin-right: 27%;
}
.form__input:focus {
  border-color: #1782C5;
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
