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
              <p class="freight-sign-up-header all-done-header">
                All Done, Fatma!
              </p>
              <p class="freight-sign-up-header progress-description">
                Now getting you ready to move cargo...
              </p>
              <div class="">
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">Setting up your business account</span></i>
                </div>
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">Sending your details for verification</span></i>
                </div>
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">Customizing your Sendy Freight experience</span></i>
                </div>
              </div>

              <p class="progress-status-label">
                Almost there... {{ smooth_rate }}%
              </p>
              <el-progress
                :text-inside="false"
                :stroke-width="5"
                :percentage="smooth_rate"
                status="warning"
              />
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../mixins/validation_mixin';

export default {
  name: 'PhoneVerification',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: true,
      smooth_rate: 0,
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
    this.displayProgressRate();
  },
  methods: {
    ...mapActions({}),

    ...mapMutations({}),
    displayProgressRate() {
      const percentage = 82;
      let current = this.smooth_rate;
      const interval = setInterval(() => {
        if (current === percentage) {
          clearInterval(interval);
        }
        this.smooth_rate = current++;
      }, 15);
    },
    verifyPhone() {},
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../src/assets/styles/freight_auth.css";
</style>
