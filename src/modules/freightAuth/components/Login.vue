<template lang="html">
  <div class="freight-login-container">
    <div class="freight-login-inner">
      <div class="freight-login-contents">
        <div class="freight-classic-display">
          <div class="">
            <div>
              <img
                src="https://images.sendyit.com/partner_portal/images/login-page-banner.svg"
                class="freight-login-banner"
              >
            </div>
          </div>
        </div>
        <div class="freight-login-card freight-login-details">
          <p class="freight-sign-up-header">
            Welcome Back!
          </p>
          <p class="freight-sign-up-description freight-login-sub">
            Please login to continue
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

            <div class="freight-auth-padding">
              <label class="freight-input-label">Password</label>
              <div class="freight-auth-padding">
                <input
                  v-model="password"
                  class="input-control freight-auth-input"
                  type="password"
                  placeholder="Enter your password"
                  autocomplete="on"
                >
              </div>
            </div>

            <p class="freight-login-reset">
              Forgot Password?
            </p>

            <div class="reset-freight-pass-outer">
              <input
                class="button-primary freight-auth-button"
                type="submit"
                value="Login"
                @click="login"
              >
            </div>

            <p class="freight-login-redirect login-redirect-margin">
              Don’t have a Sendy Freight account? Get Started
            </p>
          </div>
        </div>
      </div>
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
  name: 'Login',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      input: '',
      password: '',
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('signUpDetails.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
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
    login() {},
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
