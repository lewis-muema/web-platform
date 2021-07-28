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
            <!-- Reset Password -->

            <div
              v-if="reset_stage === 1"
              class="freight-signup-outer"
            >
              <div class="">
                <i
                  class="el-icon-back"
                  @click="redirectToLogin"
                />
              </div>
              <p class="freight-sign-up-header">
                Don’t Worry
              </p>
              <p class="freight-sign-up-description">
                You’ll be back in no time. Just provide your email and we will do the rest
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Email</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="email"
                      v-validate="'required|email'"
                      class="input-control freight-auth-input"
                      placeholder="Enter your email address"
                      autocomplete="on"
                      type="email"
                      name="email"
                    >
                    <p
                      v-if="email !== ''"
                      class="freight-error-msg"
                    >
                      {{ errors.first('email') }}
                    </p>
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Continue"
                    @click="passwordReset(1)"
                  >
                </div>

                <p
                  class="freight-login-redirect"
                  @click="redirectToLogin"
                >
                  I know my password, let me login instead
                </p>
              </div>
            </div>

            <!-- Email Notification -->

            <div
              v-if="reset_stage === 2"
              class="freight-signup-outer"
            >
              <div class="">
                <i
                  class="el-icon-back"
                  @click="oneStepBack(1)"
                />
              </div>

              <p class="freight-sign-up-header">
                Good News!
              </p>
              <p class="freight-sign-up-description">
                Your account is still intact and we have sent an email to {{ email }} for you to
                recover your password
              </p>
              <p class="freight-sign-up-description">
                Please check your email
              </p>
              <div class="">
                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Okay , Got it"
                    @click="openNewTab"
                  >
                </div>

                <p
                  class="freight-login-redirect"
                  @click="passwordReset(2)"
                >
                  Resend the link
                </p>
              </div>
            </div>

            <!-- Reset Error -->

            <div
              v-if="reset_stage === 3"
              class="freight-signup-outer"
            >
              <div class="">
                <i
                  class="el-icon-back"
                  @click="oneStepBack(1)"
                />
              </div>
              <p class="freight-sign-up-header">
                Oops!
              </p>
              <p class="freight-sign-up-description">
                Looks like there was an issue trying to send the password reset link to your email
              </p>
              <p class="freight-sign-up-description">
                Is this email accurate?
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Email</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="email"
                      v-validate="'required|email'"
                      <input
                      class="input-control freight-auth-input"
                      placeholder="Enter your email address"
                      autocomplete="on"
                      type="email"
                      name="email"
                    >
                    <p
                      v-if="email !== ''"
                      class="freight-data-error"
                    >
                      {{ errors.first('email') }}
                    </p>
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Try Again"
                    @click="passwordReset(1)"
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
      email: '',
      reset_stage: 1,
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  watch: {},

  created() {},
  mounted() {},
  methods: {
    ...mapActions({
      freightForgotPassword: '$_freightAuth/freightSignUp',
    }),

    ...mapMutations({}),
    redirectToLogin() {
      this.$router.push('/freight/login');
    },
    openNewTab() {
      window.open();
    },
    oneStepBack(val) {
      this.reset_stage = val;
    },
    passwordReset(val) {
      if (this.email === '') {
        this.doNotification(
          2,
          'Password Reset Error',
          'Kindly provide a valid email address to proceed',
        );
      } else {
        let emailValid = true;
        for (let i = 0; i < this.errors.items.length; i++) {
          if (this.errors.items[i].field === 'email') {
            emailValid = false;
            break;
          }
        }
        if (emailValid) {
          const payload = {
            email: this.email,
          };
          const fullPayload = {
            values: payload,
            app: 'ADONIS_PRIVATE_API',
            endpoint: 'freight/forgot-password',
          };
          this.freightForgotPassword(fullPayload)
            .then((response) => {
              if (response.status) {
                this.reset_stage = 2;
                if (val === 2) {
                  this.doNotification(2, 'Password Reset', 'New password reset link has been sent');
                }
              } else {
                this.reset_stage = 3;
                this.doNotification(2, 'Password Reset Error', response.message);
              }
            })
            .catch((error) => {
              this.reset_stage = 3;
              this.doNotification(2, 'Password Reset Error', error.response.data[0].message);
            });
        } else {
          this.doNotification(
            2,
            'Password Reset Error',
            'Kindly provide a valid email address to proceed',
          );
        }
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
