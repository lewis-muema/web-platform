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
                {{ $t('freightAuth.check_email') }}
              </p>
              <p class="freight-sign-up-description">
                {{ $t('freightAuth.link_sent_to_email', { email: email }) }}
              </p>
              <div class="verification-retry-options">
                <p class="verification-retry-options-label">
                  <!-- Change email address -->
                </p>
                <p
                  class="verification-retry-options-label"
                  @click="resendLink"
                >
                  {{ $t('freightAuth.check_email') }}
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
  name: 'EmailVerification',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: false,
      email: '',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
      getVerificationEmail: '$_freightAuth/getVerificationEmail',
    }),
  },
  watch: {},

  created() {},
  mounted() {
    const verificationEmail = localStorage.getItem('verificationEmail');

    setTimeout(() => {
      this.email = '';

      if (typeof verificationEmail === 'string') {
        this.email = verificationEmail;
      }

      if (this.email === '' || verificationEmail === null) {
        this.$router.push('/freight/sign_up');
      } else {
        this.updateCrmData = true;
      }
    }, 800);
  },
  methods: {
    ...mapActions({
      resendInvitationLink: '$_freightAuth/resendInvitationLink',
    }),

    ...mapMutations({}),
    resendLink() {
      const verificationEmail = localStorage.getItem('verificationEmail');
      this.email = '';

      if (typeof verificationEmail === 'string') {
        this.email = verificationEmail;
      }

      if (this.email !== '' || verificationEmail !== null) {
        const values = {};
        values.email = this.email;
        const fullPayload = {
          values,
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'freight/verification-link',
        };
        this.resendInvitationLink(fullPayload)
          .then((response) => {
            if (response.status) {
              this.doNotification(
                1,
                this.$t('freightAuth.email_verification'),
                this.$t('freightAuth.email_verification_sent'),
              );
            } else {
              this.doNotification(
                2,
                this.$t('freightAuth.email_verification_error'),
                response.message,
              );
            }
          })
          .catch((error) => {
            this.doNotification(
              2,
              this.$t('freightAuth.email_verification_error'),
              error.response.data.message,
            );
            this.$router.push('/freight/sign_up');
            this.updateCrmData = false;
          });
      } else {
        this.$router.push('/freight/sign_up');
        this.updateCrmData = false;
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
@import "../../../../../src/assets/styles/freight_auth.css";
</style>
