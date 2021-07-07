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
                  src="https://images.sendyit.com/web_platform/freight/freight-final-setup.png"
                  class="freight-img-logo"
                >
              </div>
              <p class="freight-sign-up-header">
                Congratulations Fatma !
              </p>
              <p class="freight-sign-up-description">
                We are excited to have you. Next, tell us more about
                <span class="validate-freight-phone"> Amini Movers Limited </span>for us to
                customize your experience
              </p>
              <div class="">
                <div class="">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Let's go"
                    @click="loginUser"
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
  name: 'SignUpCongratulations',
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
    loginUser() {},
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
