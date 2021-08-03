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
                {{ $t('freightDetailsUpdate.all_done') }}, {{ userName }}
              </p>
              <p class="freight-sign-up-header progress-description">
                {{ $t('freightDetailsUpdate.getting_ready') }}
              </p>
              <div class="">
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">{{
                      $t('freightDetailsUpdate.setting_your_business')
                    }}</span></i>
                </div>
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">{{
                      $t('freightDetailsUpdate.verify_details')
                    }}</span></i>
                </div>
                <div class="freight-auth-padding freight-input-label final-setup-progress">
                  <i class="el-icon-success progress-check">
                    <span class="progress-label">{{
                      $t('freightDetailsUpdate.customization')
                    }}</span></i>
                </div>
              </div>

              <p class="progress-status-label">
                {{ $t('freightDetailsUpdate.almost_there') }}{{ smooth_rate }}%
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
      updateCrmData: false,
      smooth_rate: 0,
      userName: '',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
      getVerificationStage: '$_freight/getVerificationStage',
    }),
  },
  watch: {},

  created() {},
  mounted() {
    const session = this.$store.getters.getSession;

    if (this.getVerificationStage === 'success') {
      this.userName = session[session.default].user_name;
      this.updateCrmData = true;
      this.displayProgressRate();
    } else {
      this.$router.push('/freight/transporters');
    }
  },
  methods: {
    ...mapActions({}),

    ...mapMutations({
      setVerificationStep: '$_freight/setVerificationStep',
      setVerificationStage: '$_freight/setVerificationStage',
    }),
    displayProgressRate() {
      const percentage = 82;
      let current = this.smooth_rate;
      const interval = setInterval(() => {
        if (current === percentage) {
          clearInterval(interval);
          setTimeout(() => {
            this.updateCrmData = false;
            this.setVerificationStep(0);
            this.setVerificationStage('');
            this.$router.push('/freight/transporters');
          }, 800);
        }
        this.smooth_rate = current++;
      }, 50);
    },
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
