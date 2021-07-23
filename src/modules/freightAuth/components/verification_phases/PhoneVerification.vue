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
              <div class="congratulations_img">
                <img
                  src="https://images.sendyit.com/web_platform/freight/verification-email-sent.png"
                  class="freight-img-logo"
                >
              </div>
              <p class="freight-sign-up-header">
                Check Your Email
              </p>
              <p class="freight-sign-up-description">
                We’ve sent a link to fatmamoha@gmail.com Please click the link to proceed
              </p>
              <div class="verification-retry-options">
                <p class="verification-retry-options-label">
                  Change email address
                </p>
                <p class="verification-retry-options-label">
                  Resend the link
                </p>
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
