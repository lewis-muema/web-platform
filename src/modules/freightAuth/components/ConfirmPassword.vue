<template lang="html">
  <div class="">
    <div
      id="orders_container"
      class="box"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="freight-signup-dialog">
          <el-dialog
            :visible.sync="updateCrmData"
            width="30%"
            class="freightAuthDialog"
            :modal-append-to-body="false"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
          >
            <!-- Confirm Password -->

            <div class="freight-signup-outer">
              <div class="">
                <i
                  class="el-icon-back"
                  @click="redirectToLogin"
                />
              </div>
              <p class="freight-sign-up-header">
                Welcome Back {{ user_name }}
              </p>
              <p class="freight-sign-up-description">
                Please set your new password
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">New password</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="password"
                      class="input-control freight-auth-input"
                      placeholder="Enter your new password"
                      autocomplete="on"
                      type="password"
                      :class="!pass_validation && password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_pass"
                    >
                    <p
                      v-if="!pass_validation && password !== ''"
                      class="freight-data-error"
                    >
                      {{ pass_msg }}
                    </p>
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Confirm Password</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="confirm_password"
                      class="input-control freight-auth-input"
                      placeholder="Re-enter your password"
                      autocomplete="on"
                      type="password"
                      :class="!pass_confirm_validation && confirm_password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_confirm_pass"
                    >
                    <p
                      v-if="!pass_confirm_validation && confirm_password !== ''"
                      class="freight-data-error"
                    >
                      {{ confirm_pass_msg }}
                    </p>
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Confirm"
                    @click="updatePassword"
                  >
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../../mixins/validation_mixin';

export default {
  name: 'PhoneVerification',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: true,
      password: '',
      confirm_password: '',
      user_name: '',
      pass_validation: false,
      pass_msg: '',
      pass_confirm_validation: false,
      confirm_pass_msg: '',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  watch: {},

  created() {},
  mounted() {
    this.checkContent();
  },
  methods: {
    ...mapActions({
      freightForgotPassword: '$_freightAuth/freightSignUp',
      requestResetPassword: '$_auth/requestResetPassword',
      requestCheckToken: '$_auth/requestCheckToken',
    }),

    ...mapMutations({}),
    checkContent() {
      const token = this.$route.params.content;

      const payload = {};
      payload.token = token;
      const fullPayload = {
        values: payload,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/validate-token',
      };
      this.requestCheckToken(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status) {
            // console.log(response);
            // console.log("Valid Token");
          } else {
            this.doNotification(
              2,
              this.$t('resetPassword.invalid_link'),
              this.$t('resetPassword.invalid_reset_link'),
            );
            this.$router.push('/freight/login');
          }
        },
        (error) => {
          this.$router.push('/freight/login');
          this.message = this.$t('resetPassword.reset_password_failed');
        },
      );
    },
    redirectToLogin() {
      this.$router.push('/freight/login');
    },
    validate_pass() {
      const patt = new RegExp('^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9@#$%^&+=]*$');
      const res = patt.test(this.password);
      if (!res) {
        this.pass_msg = this.$t('signUpDetails.password_error');
        this.pass_validation = false;
      } else {
        this.pass_msg = '';
        this.pass_validation = true;
      }
    },
    validate_confirm_pass() {
      if (this.password === this.confirm_password) {
        this.confirm_pass_msg = '';
        this.pass_confirm_validation = true;
      } else {
        this.confirm_pass_msg = 'Please ensure that this matches the password you entered earlier';
        this.pass_confirm_validation = false;
      }
    },
    updatePassword() {
      if (this.pass_validation && this.pass_confirm_validation) {
        const payload = {
          password: this.password,
          token: this.$route.params.content,
        };
        const fullPayload = {
          values: payload,
          vm: this,
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'auth/reset-password',
        };
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
                this.$router.push('/freight/login');
              }, 4000);
            } else {
              this.doNotification(
                2,
                this.$t('resetPassword.password_reset_failed'),
                this.$t('resetPassword.password_reset_failed_text'),
              );
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
            this.$router.push('/freight/login');
          });
      } else {
        this.doNotification(2, 'Password Reset Error', 'Kindly provide all values');
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../src/assets/styles/freight_auth.css";
</style>
