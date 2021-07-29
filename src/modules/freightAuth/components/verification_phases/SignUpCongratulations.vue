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
              <div v-if="!login_acc">
                <p class="freight-sign-up-header">
                  Verifying account information ...
                </p>
                <div class="verify-freight-info-loader " />
              </div>
              <div v-else>
                <div class="congratulations_img">
                  <img
                    src="https://images.sendyit.com/web_platform/freight/freight-final-setup.png"
                    class="freight-img-logo"
                  >
                </div>
                <p class="freight-sign-up-header">
                  Congratulations {{ cop_name }} !
                </p>
                <p class="freight-sign-up-description">
                  We are excited to have you. Next, tell us more about
                  <span class="validate-freight-phone"> {{ user_name }}</span>for us to customize your experience
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
      cop_name: '',
      user_name: '',
      login_acc: false,
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
    this.login_acc = false;
    this.checkTokenValidity();
  },
  methods: {
    ...mapActions({
      freightVerifyEmail: '$_freightAuth/resendInvitationLink',
    }),

    ...mapMutations({}),
    checkTokenValidity() {
      const token = this.$route.params.content;
      const values = {};
      values.token = token;
      const fullPayload = {
        values,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/verify-email',
      };
      this.freightVerifyEmail(fullPayload)
        .then((response) => {
          if (Object.prototype.hasOwnProperty.call(response, 'status')) {
            this.$router.push('/freight/login');
            this.doNotification(2, 'Email Verification Error', response.message);
          } else {
            let partsOfToken = '';
            if (Array.isArray(response)) {
              const res = response[1];
              localStorage.setItem('jwtToken', res);
              localStorage.setItem('jwtToken', res.access_token);
              localStorage.setItem('refreshToken', res.refresh_token);
              partsOfToken = res.access_token.toString().split('.');
            } else {
              localStorage.setItem('jwtToken', response);
              localStorage.setItem('jwtToken', response.access_token);
              localStorage.setItem('refreshToken', response.refresh_token);
              partsOfToken = response.access_token.split('.');
            }
            const middleString = partsOfToken[1];
            const data = atob(middleString);
            const { payload } = JSON.parse(data);

            const sessionData = payload;
            this.cop_name = sessionData[sessionData.default].cop_name;
            this.user_name = sessionData[sessionData.default].user_name;
            this.login_acc = true;

            const locale = sessionData[sessionData.default].preferred_language === null
              ? 'en'
              : sessionData[sessionData.default].preferred_language;
            const countryCode = sessionData[sessionData.default].country_code === null
              ? 'KE'
              : sessionData[sessionData.default].country_code;
            localStorage.setItem('countryCode', countryCode);
            this.$i18n.locale = locale;
            const acceptLanguageHeader = `${locale}-${countryCode}`;
            localStorage.setItem('language', acceptLanguageHeader);
            const jsonSession = JSON.stringify(sessionData);
            this.setSession(jsonSession);
            this.$store.commit('setSession', sessionData);
            localStorage.removeItem('verificationEmail');
            this.doNotification(
              1,
              'Email verification successful',
              'You will be automatically signed in ',
            );
            setTimeout(() => {
              this.$router.push('/freight/transporters');
            }, 5000);
          }
        })
        .catch((error) => {
          this.$router.push('/freight/sign_up');
          this.doNotification(2, 'Email Verification Error', error.response.data.message);
        });
    },
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
.verify-freight-info-loader ,
.verify-freight-info-loader :after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.verify-freight-info-loader  {
  margin: 60px auto;
  font-size: 8px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid #2c82c5;
  border-right: 1.1em solid #f3f3f3;
  border-bottom: 1.1em solid #f3f3f3;
  border-left: 1.1em solid #f3f3f3;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
