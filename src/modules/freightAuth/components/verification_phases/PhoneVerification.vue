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
            <div class="freight-signup-outer">
              <p class="freight-sign-up-header">
                Verify Phone Number
              </p>
              <p class="freight-sign-up-description">
                Please enter the verification code we have sent to
                <span class="validate-freight-phone">{{ phone }}</span>
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Verfication code</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="code"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter Code"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="verification-retry-options">
                  <p class="verification-retry-options-label">
                    Change Phone Number
                  </p>
                  <p class="verification-retry-options-label">
                    Receive a call instead
                  </p>
                </div>

                <div class="">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Verify Phone Number"
                    @click="verifyPhone"
                  >
                </div>

                <!-- <p class="freight-login-redirect">
                  Already have an account? Login
                </p> -->
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
import SessionMxn from '../../../../mixins/session_mixin';
import NotificationMxn from '../../../../mixins/notification_mixin';
import MixpanelMixin from '../../../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../../../mixins/validation_mixin';

export default {
  name: 'PhoneVerification',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: true,
      code: '',
      phone: '+254700536660',
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
@import "../../../../../src/assets/styles/freight_auth.css";
</style>
