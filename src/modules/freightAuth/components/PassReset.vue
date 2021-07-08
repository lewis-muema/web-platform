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
                <i class="el-icon-back" />
              </div>
              <p class="freight-sign-up-header">
                Don’t Worry
              </p>
              <p class="freight-sign-up-description">
                You’ll be back in no time. Just provide your email or phone number and we will do
                the rest
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Email or phone number</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter your email or phone number"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Continue"
                    @click="verifyPhone"
                  >
                </div>

                <p class="freight-login-redirect">
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
                <i class="el-icon-back" />
              </div>

              <p class="freight-sign-up-header">
                Good News!
              </p>
              <p class="freight-sign-up-description">
                Your account is still intact and we have sent an email to f*******a@gmail.com for
                you to recover your password
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
                    @click="verifyPhone"
                  >
                </div>

                <p class="freight-login-redirect">
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
                <i class="el-icon-back" />
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
                  <label class="freight-input-label">Email or phone number</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter your email or phone number"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Try Again"
                    @click="verifyPhone"
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
      input: '',
      reset_stage: 3,
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
    ...mapActions({}),

    ...mapMutations({}),
    verifyPhone() {},
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
